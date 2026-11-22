import {
  Agent,
  Booking,
  BookingStatus,
  Dealbreaker,
  Listing,
  Review,
  ReviewRatings,
  User,
} from '../data/types';

/**
 * Format any number into Nigerian Naira currency: ₦1,200,000
 * Never uses decimals unless cents are provided, rounded cleanly.
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount)) return '₦0';
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

/**
 * 1. Viewing Fee and Platform Cut
 * Viewing fee: ₦4,000. Platform cut: 15% (₦600). Agent net: 85% (₦3,400).
 */
export function fee(feeAmount: number = 4000, platformCutPercent: number = 15) {
  const gross = Math.max(0, feeAmount);
  const platformCut = Math.round((gross * platformCutPercent) / 100);
  const agentNet = gross - platformCut;
  return {
    gross,
    platformCutPercent,
    platformCut,
    agentNet,
  };
}

/**
 * 2. Booking State Transitions
 * Strict allowed transitions:
 * requested -> confirmed -> paid_held -> arrived -> completed_awaiting -> released
 * completed_awaiting -> disputed -> refunded or released
 */
export function canTransitionBooking(
  current: BookingStatus,
  next: BookingStatus
): boolean {
  const allowed: Record<BookingStatus, BookingStatus[]> = {
    requested: ['confirmed', 'cancelled'],
    confirmed: ['paid_held', 'cancelled'],
    paid_held: ['arrived', 'cancelled', 'no_show'],
    arrived: ['completed_awaiting', 'disputed'],
    completed_awaiting: ['released', 'disputed'],
    released: [],
    disputed: ['refunded', 'released'],
    refunded: [],
    no_show: ['refunded'],
    cancelled: ['refunded'],
  };
  return allowed[current]?.includes(next) ?? false;
}

/**
 * Check if a booking in completed_awaiting is ready for auto-release
 * (silence for >= 24 hours).
 */
export function shouldAutoReleaseBooking(booking: Booking, now = new Date()): boolean {
  if (booking.status !== 'completed_awaiting') return false;
  if (!booking.releaseAt) return false;
  return new Date(booking.releaseAt).getTime() <= now.getTime();
}

/**
 * 3. Agent Accuracy Score
 * Matched viewings out of completed viewings.
 * matched = 1, partly = 0.5.
 * If completed < 5: "New agent".
 * Otherwise: "Matched in X of Y".
 */
export function accuracyScore(agent: Pick<Agent, 'matchedViewings' | 'completedViewings'>) {
  const { matchedViewings, completedViewings } = agent;
  if (completedViewings < 5) {
    return {
      score: null,
      isNew: true,
      label: 'New agent',
      sublabel: `${completedViewings} viewing${completedViewings === 1 ? '' : 's'} done`,
      matched: matchedViewings,
      total: completedViewings,
      percentage: null,
    };
  }
  const percentage = Math.round((matchedViewings / completedViewings) * 100);
  return {
    score: percentage,
    isNew: false,
    label: `Matched in ${matchedViewings} of ${completedViewings}`,
    sublabel: `${percentage}% accuracy score`,
    matched: matchedViewings,
    total: completedViewings,
    percentage,
  };
}

/**
 * 4. Listing Completeness
 * Share of key fields in 'provided'. Weighted higher for costs, power, water, road, flooding, and media.
 * Below 70%, the listing cannot be boosted.
 */
export function completeness(listing: Listing): {
  score: number;
  canBoost: boolean;
  missingKeyFields: string[];
} {
  let totalWeight = 0;
  let earnedWeight = 0;
  const missing: string[] = [];

  // Costs weights (weight 20 total)
  const costFields = [
    { key: 'agencyFee', label: 'Agency fee', weight: 4 },
    { key: 'legalFee', label: 'Legal fee', weight: 4 },
    { key: 'cautionDeposit', label: 'Caution deposit', weight: 4 },
    { key: 'serviceCharge', label: 'Service charge', weight: 4 },
    { key: 'estateDues', label: 'Estate dues', weight: 4 },
  ];
  for (const c of costFields) {
    totalWeight += c.weight;
    if (listing.costs && (listing.costs as any)[c.key] !== undefined) {
      earnedWeight += c.weight;
    } else {
      missing.push(c.label);
    }
  }

  // Feature weights (weight 60 total)
  const features = listing.features;
  const featureChecks = [
    { key: 'electricity', label: 'Electricity hours', weight: 10 },
    { key: 'prepaidMeter', label: 'Prepaid meter', weight: 6 },
    { key: 'backupPower', label: 'Backup generator', weight: 6 },
    { key: 'waterSource', label: 'Water source', weight: 8 },
    { key: 'waterReliability', label: 'Water reliability', weight: 8 },
    { key: 'roadCondition', label: 'Road condition', weight: 8 },
    { key: 'floodingHistory', label: 'Flooding history', weight: 8 },
    { key: 'security', label: 'Security arrangement', weight: 6 },
  ];

  for (const f of featureChecks) {
    totalWeight += f.weight;
    const item = (features as any)?.[f.key];
    if (item && item.status === 'provided') {
      earnedWeight += f.weight;
    } else {
      missing.push(f.label);
    }
  }

  // Media weight (weight 20)
  totalWeight += 20;
  const sceneCount = listing.media?.scenes?.length || 0;
  if (sceneCount >= 4) {
    earnedWeight += 20;
  } else if (sceneCount >= 1) {
    earnedWeight += 10;
    missing.push('Detailed room tour scenes');
  } else {
    missing.push('Room tour scenes');
  }

  const score = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
  return {
    score,
    canBoost: score >= 70,
    missingKeyFields: missing,
  };
}

/**
 * 5. MatchBar Logic
 * Compares listing against user dealbreakers.
 * Dealbreakers:
 * - 'steady_power': electricity provided and >= 16 hrs or backup power provided
 * - 'no_flooding': floodingHistory provided and says 'no flooding' or similar
 * - 'tarred_road': roadCondition provided and says 'paved' / 'tarred'
 * - 'prepaid_meter': prepaidMeter is true
 * - 'water_supply': waterReliability provided and says 24/7 or continuous
 * - 'gated_security': security provided and says gated / security guards
 */
export function matchLine(listing: Listing, dealbreakers: Dealbreaker[]) {
  if (!dealbreakers || dealbreakers.length === 0) {
    return {
      total: 0,
      met: 0,
      unmet: 0,
      unknown: 0,
      summary: 'No dealbreakers set',
      details: [],
    };
  }

  const details: Array<{
    dealbreaker: Dealbreaker;
    label: string;
    status: 'met' | 'unmet' | 'unknown';
    detail: string;
  }> = [];

  for (const db of dealbreakers) {
    switch (db) {
      case 'steady_power': {
        const item = listing.features.electricity;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'Steady power',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (
          item.status === 'provided' &&
          (String(item.value).includes('18') ||
            String(item.value).includes('20') ||
            String(item.value).includes('24') ||
            listing.features.backupPower.status === 'provided')
        ) {
          details.push({
            dealbreaker: db,
            label: 'Steady power',
            status: 'met',
            detail: String(item.value),
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'Steady power',
            status: 'unmet',
            detail: item.value ? String(item.value) : 'Irregular supply',
          });
        }
        break;
      }
      case 'no_flooding': {
        const item = listing.features.floodingHistory;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'No flooding',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (
          item.status === 'provided' &&
          (String(item.value).toLowerCase().includes('no') ||
            String(item.value).toLowerCase().includes('dry') ||
            String(item.value).toLowerCase().includes('never'))
        ) {
          details.push({
            dealbreaker: db,
            label: 'No flooding',
            status: 'met',
            detail: String(item.value),
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'No flooding',
            status: 'unmet',
            detail: String(item.value),
          });
        }
        break;
      }
      case 'tarred_road': {
        const item = listing.features.roadCondition;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'Tarred road',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (
          item.status === 'provided' &&
          (String(item.value).toLowerCase().includes('paved') ||
            String(item.value).toLowerCase().includes('tarred') ||
            String(item.value).toLowerCase().includes('interlocked'))
        ) {
          details.push({
            dealbreaker: db,
            label: 'Tarred road',
            status: 'met',
            detail: String(item.value),
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'Tarred road',
            status: 'unmet',
            detail: String(item.value),
          });
        }
        break;
      }
      case 'prepaid_meter': {
        const item = listing.features.prepaidMeter;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'Prepaid meter',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (item.status === 'provided' && item.value === true) {
          details.push({
            dealbreaker: db,
            label: 'Prepaid meter',
            status: 'met',
            detail: 'Separate prepaid meter installed',
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'Prepaid meter',
            status: 'unmet',
            detail: 'Shared or estimated billing',
          });
        }
        break;
      }
      case 'water_supply': {
        const item = listing.features.waterReliability;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'Reliable water',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (
          item.status === 'provided' &&
          (String(item.value).toLowerCase().includes('24/7') ||
            String(item.value).toLowerCase().includes('continuous') ||
            String(item.value).toLowerCase().includes('daily') ||
            String(item.value).toLowerCase().includes('treated'))
        ) {
          details.push({
            dealbreaker: db,
            label: 'Reliable water',
            status: 'met',
            detail: String(item.value),
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'Reliable water',
            status: 'unmet',
            detail: String(item.value),
          });
        }
        break;
      }
      case 'gated_security': {
        const item = listing.features.security;
        if (item.status === 'not_provided') {
          details.push({
            dealbreaker: db,
            label: 'Gated security',
            status: 'unknown',
            detail: 'Not provided',
          });
        } else if (
          item.status === 'provided' &&
          (String(item.value).toLowerCase().includes('gated') ||
            String(item.value).toLowerCase().includes('guard') ||
            String(item.value).toLowerCase().includes('uniform'))
        ) {
          details.push({
            dealbreaker: db,
            label: 'Gated security',
            status: 'met',
            detail: String(item.value),
          });
        } else {
          details.push({
            dealbreaker: db,
            label: 'Gated security',
            status: 'unmet',
            detail: String(item.value),
          });
        }
        break;
      }
    }
  }

  const met = details.filter((d) => d.status === 'met').length;
  const unmet = details.filter((d) => d.status === 'unmet').length;
  const unknown = details.filter((d) => d.status === 'unknown').length;
  const total = details.length;

  let summary = `Meets ${met} of ${total}`;
  if (unknown > 0) {
    summary += `, ${unknown} unknown`;
  }

  return {
    total,
    met,
    unmet,
    unknown,
    summary,
    details,
  };
}

/**
 * 6. Move-in Cost Calculator
 * Sum of known cost lines, with a flag for any unknown.
 */
export function moveInCost(listing: Listing) {
  const costs = listing.costs || {};
  let total = listing.rentYearly;
  let hasUnknowns = false;

  const lines: Array<{
    id: string;
    label: string;
    amount?: number;
    isProvided: boolean;
    isAskable: boolean;
  }> = [
    {
      id: 'rent',
      label: 'Yearly Rent',
      amount: listing.rentYearly,
      isProvided: true,
      isAskable: false,
    },
  ];

  const checkFields: Array<{
    id: string;
    key: keyof typeof costs;
    label: string;
  }> = [
    { id: 'agency', key: 'agencyFee', label: 'Agency Fee (10%)' },
    { id: 'legal', key: 'legalFee', label: 'Legal Agreement Fee (10%)' },
    { id: 'caution', key: 'cautionDeposit', label: 'Caution Deposit' },
    { id: 'service', key: 'serviceCharge', label: 'Service Charge' },
    { id: 'estate', key: 'estateDues', label: 'Estate Dues' },
  ];

  for (const item of checkFields) {
    const val = costs[item.key];
    if (typeof val === 'number') {
      total += val;
      lines.push({
        id: item.id,
        label: item.label,
        amount: val,
        isProvided: true,
        isAskable: false,
      });
    } else {
      hasUnknowns = true;
      lines.push({
        id: item.id,
        label: item.label,
        amount: undefined,
        isProvided: false,
        isAskable: true,
      });
    }
  }

  return {
    total,
    hasUnknowns,
    lines,
  };
}

/**
 * 7. Review Summary
 * Only reports from the last 12 months count toward the summary.
 * Minimum 3 reports before showing a score, older ones tagged "may be outdated".
 */
export function reviewSummary(
  reviews: Review[],
  topic: keyof ReviewRatings,
  now = new Date()
) {
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  let good = 0;
  let okay = 0;
  let bad = 0;
  let totalRecent = 0;
  let totalHistorical = 0;

  for (const rev of reviews) {
    if (rev.status === 'hidden') continue;
    const rating = rev.ratings[topic];
    if (!rating || rating === 'skipped') continue;

    totalHistorical++;
    const isRecent = new Date(rev.createdAt).getTime() >= twelveMonthsAgo.getTime();
    if (isRecent) {
      totalRecent++;
      if (rating === 'good') good++;
      else if (rating === 'okay') okay++;
      else if (rating === 'bad') bad++;
    }
  }

  const topicLabels: Record<keyof ReviewRatings, string> = {
    power: 'Power',
    water: 'Water',
    road: 'Road',
    flooding: 'Flooding',
    noise: 'Noise level',
    security: 'Security',
    management: 'Management',
  };

  const label = topicLabels[topic];

  if (totalRecent < 3) {
    return {
      topic,
      label,
      good,
      okay,
      bad,
      totalRecent,
      totalHistorical,
      hasEnoughReports: false,
      summaryText: 'Not enough reports yet',
    };
  }

  let sentiment = 'reliable';
  if (bad > good && bad > okay) {
    sentiment = 'challenging';
  } else if (okay >= good) {
    sentiment = 'fair';
  }

  const summaryText = `${label}: ${good} of ${totalRecent} reports say ${sentiment} (last 12 months).`;

  return {
    topic,
    label,
    good,
    okay,
    bad,
    totalRecent,
    totalHistorical,
    hasEnoughReports: true,
    summaryText,
  };
}

/**
 * Check if a single review is older than 12 months
 */
export function isReviewOutdated(reviewDate: string, now = new Date()): boolean {
  const date = new Date(reviewDate);
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 365;
}

/**
 * 8. Attribution Lock
 * A hunter who books a viewing with an agent is locked to that agent for that house for 14 days.
 * If another agent is contacted for the same house in that window, show the other agent a notice.
 */
export function checkAttributionLock(
  bookings: Booking[],
  hunterId: string,
  listingId: string,
  targetAgentId: string,
  now = new Date()
) {
  const activeLock = bookings.find((b) => {
    if (b.hunterId !== hunterId || b.listingId !== listingId) return false;
    if (b.status === 'cancelled' || b.status === 'refunded') return false;
    const lockExpiry = new Date(b.attributionLockUntil).getTime();
    return lockExpiry > now.getTime();
  });

  if (activeLock && activeLock.agentId !== targetAgentId) {
    return {
      isLocked: true,
      lockedAgentId: activeLock.agentId,
      expiresAt: activeLock.attributionLockUntil,
      message:
        'This hunter is already working with another agent for this property under a 14-day attribution protection.',
    };
  }

  return {
    isLocked: false,
    lockedAgentId: null,
    expiresAt: null,
    message: null,
  };
}

/**
 * 9. Feed Ranking Algorithm
 * Pure function: city match, budget fit, bedroom match, freshness, availability,
 * saved/viewed signals, boost (always labelled "Sponsored"), and accuracy score tie-breaker.
 */
export function feedRank(
  listings: Listing[],
  user: Partial<User>,
  savedIds: string[] = [],
  viewedIds: string[] = [],
  agentAccuracyMap: Record<string, number> = {}
): Array<{ listing: Listing; reasons: string[]; isSponsored: boolean; rankScore: number }> {
  const results = listings.map((listing) => {
    let score = 50;
    const reasons: string[] = [];
    const isSponsored = Boolean(listing.isBoosted);

    // City fit
    if (user.city && listing.title.toLowerCase().includes(user.city.toLowerCase())) {
      score += 20;
      reasons.push(`Located in ${user.city}`);
    }

    // Budget fit
    if (user.budgetMin !== undefined && user.budgetMax !== undefined) {
      if (listing.rentYearly >= user.budgetMin && listing.rentYearly <= user.budgetMax) {
        score += 25;
        reasons.push('Fits your budget target');
      } else if (listing.rentYearly > user.budgetMax) {
        score -= 20;
      }
    }

    // Bedroom fit
    if (user.bedrooms && user.bedrooms.includes(listing.bedrooms)) {
      score += 20;
      reasons.push(`${listing.bedrooms} bedroom match`);
    }

    // Agent accuracy score bonus
    const acc = agentAccuracyMap[listing.agentId];
    if (acc && acc >= 85) {
      score += 15;
      reasons.push(`Agent accuracy is high (${acc}%)`);
    }

    // Saved or recently viewed signals
    if (savedIds.includes(listing.id)) {
      score += 10;
      reasons.push('In your saved shortlist');
    }
    if (viewedIds.includes(listing.id)) {
      score -= 5; // gentle demotion to introduce freshness
    }

    // Sponsored boost
    if (isSponsored) {
      score += 30;
      reasons.push('Sponsored listing');
    }

    // Freshness check
    const daysOld =
      (Date.now() - new Date(listing.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld <= 3) {
      score += 10;
      reasons.push('Updated recently');
    }

    return {
      listing,
      reasons: reasons.slice(0, 3),
      isSponsored,
      rankScore: score,
    };
  });

  return results.sort((a, b) => b.rankScore - a.rankScore);
}

/**
 * 10. Freshness Logic
 * Stale after 14 days without confirmation, hidden from feed after 30 days.
 */
export function freshness(listing: Listing, now = new Date()) {
  const updatedDate = new Date(listing.updatedAt);
  const diffDays = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24);

  const isStale = diffDays > 14;
  const isHidden = diffDays > 30;

  let warning: string | null = null;
  if (isStale && !isHidden) {
    warning = 'May be unavailable, ask the agent.';
  } else if (isHidden) {
    warning = 'Listing is unverified for over 30 days and hidden from feed.';
  }

  return {
    diffDays: Math.floor(diffDays),
    isStale,
    isHidden,
    warning,
    label:
      diffDays < 1
        ? 'Updated today'
        : diffDays === 1
        ? 'Updated yesterday'
        : `Updated ${Math.floor(diffDays)} days ago`,
  };
}

/**
 * 11. Revenue Model
 * viewings * ₦600, Pro subscribers * ₦10,000, boosts * ₦2,000,
 * minus assumed payment processing of 2%.
 */
export function revenueModel(inputs: {
  viewings: number;
  proSubscribers: number;
  boosts: number;
}) {
  const viewingRevenue = inputs.viewings * 600;
  const subscriptionRevenue = inputs.proSubscribers * 10000;
  const boostRevenue = inputs.boosts * 2000;

  const grossRevenue = viewingRevenue + subscriptionRevenue + boostRevenue;
  const paymentProcessing = Math.round(grossRevenue * 0.02);
  const netRevenue = grossRevenue - paymentProcessing;

  return {
    inputs,
    viewingRevenue,
    subscriptionRevenue,
    boostRevenue,
    grossRevenue,
    paymentProcessing,
    netRevenue,
    assumptions: [
      '₦600 platform cut (15%) per completed ₦4,000 viewing fee',
      '₦10,000 monthly fee per Pro agent tier subscriber',
      '₦2,000 weekly fee per boosted listing (completeness >= 80% required)',
      '2% standard payment gateway processing deduction on gross volume',
    ],
  };
}
