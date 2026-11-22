import { describe, it, expect } from 'vitest';
import {
  fee,
  canTransitionBooking,
  accuracyScore,
  completeness,
  matchLine,
  moveInCost,
  reviewSummary,
  checkAttributionLock,
  freshness,
  revenueModel,
  formatNaira,
} from '../index';
import { Listing, Review } from '../../data/types';

describe('formatNaira', () => {
  it('formats Naira currency correctly with commas', () => {
    expect(formatNaira(1200000)).toBe('₦1,200,000');
    expect(formatNaira(4000)).toBe('₦4,000');
    expect(formatNaira(0)).toBe('₦0');
  });
});

describe('fee calculation', () => {
  it('calculates 15% platform cut and 85% agent net correctly', () => {
    const res = fee(4000, 15);
    expect(res.gross).toBe(4000);
    expect(res.platformCut).toBe(600);
    expect(res.agentNet).toBe(3400);
  });
});

describe('booking transitions', () => {
  it('validates allowed booking status flow', () => {
    expect(canTransitionBooking('requested', 'confirmed')).toBe(true);
    expect(canTransitionBooking('confirmed', 'paid_held')).toBe(true);
    expect(canTransitionBooking('paid_held', 'arrived')).toBe(true);
    expect(canTransitionBooking('arrived', 'completed_awaiting')).toBe(true);
    expect(canTransitionBooking('completed_awaiting', 'released')).toBe(true);
    expect(canTransitionBooking('completed_awaiting', 'disputed')).toBe(true);
    expect(canTransitionBooking('disputed', 'refunded')).toBe(true);
  });

  it('rejects illegal status jumping', () => {
    expect(canTransitionBooking('requested', 'released')).toBe(false);
    expect(canTransitionBooking('released', 'disputed')).toBe(false);
  });
});

describe('accuracyScore', () => {
  it('labels agents with under 5 viewings as New agent', () => {
    const res = accuracyScore({ matchedViewings: 2, completedViewings: 3 });
    expect(res.isNew).toBe(true);
    expect(res.label).toBe('New agent');
  });

  it('calculates accuracy percentage for established agents', () => {
    const res = accuracyScore({ matchedViewings: 18, completedViewings: 20 });
    expect(res.isNew).toBe(false);
    expect(res.percentage).toBe(90);
    expect(res.label).toBe('Matched in 18 of 20');
  });
});

describe('completeness and boost eligibility', () => {
  const mockListing = {
    rentYearly: 1200000,
    costs: {
      agencyFee: 120000,
      legalFee: 120000,
      cautionDeposit: 100000,
      serviceCharge: 150000,
      estateDues: 20000,
    },
    features: {
      electricity: { status: 'provided', value: '18 hrs', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      prepaidMeter: { status: 'provided', value: true, source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      backupPower: { status: 'provided', value: 'Generator', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      waterSource: { status: 'provided', value: 'Borehole', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      waterReliability: { status: 'provided', value: 'Continuous', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      roadCondition: { status: 'provided', value: 'Paved', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      floodingHistory: { status: 'provided', value: 'No flooding', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
      security: { status: 'provided', value: 'Gated', source: 'Agent-provided', lastConfirmed: '2026-11-20' },
    },
    media: {
      videoSceneId: 'v1',
      scenes: [
        { id: 's1', label: 'Exterior', type: 'exterior' },
        { id: 's2', label: 'Living', type: 'living' },
        { id: 's3', label: 'Kitchen', type: 'kitchen' },
        { id: 's4', label: 'Bedroom', type: 'bedroom' },
      ],
      photos: [],
    },
  } as unknown as Listing;

  it('rates complete listing high and allows boost', () => {
    const res = completeness(mockListing);
    expect(res.score).toBeGreaterThanOrEqual(70);
    expect(res.canBoost).toBe(true);
  });

  it('prevents boosting when key features are missing', () => {
    const incompleteListing = {
      ...mockListing,
      costs: {},
      features: {
        electricity: { status: 'not_provided' },
        prepaidMeter: { status: 'not_provided' },
      },
      media: { scenes: [] },
    } as unknown as Listing;
    const res = completeness(incompleteListing);
    expect(res.score).toBeLessThan(70);
    expect(res.canBoost).toBe(false);
  });
});

describe('matchLine', () => {
  const listing = {
    features: {
      electricity: { status: 'provided', value: '20 hrs daily' },
      floodingHistory: { status: 'provided', value: 'No flooding on street' },
      roadCondition: { status: 'not_provided' },
      prepaidMeter: { status: 'provided', value: true },
      waterReliability: { status: 'provided', value: 'Continuous 24/7' },
      security: { status: 'provided', value: 'Gated estate with guards' },
    },
  } as unknown as Listing;

  it('evaluates met, unmet, and unknown dealbreakers accurately', () => {
    const result = matchLine(listing, ['steady_power', 'no_flooding', 'tarred_road']);
    expect(result.met).toBe(2);
    expect(result.unknown).toBe(1);
    expect(result.unmet).toBe(0);
    expect(result.summary).toBe('Meets 2 of 3, 1 unknown');
  });
});

describe('moveInCost', () => {
  it('sums provided costs and flags unknowns', () => {
    const listing = {
      rentYearly: 1000000,
      costs: {
        agencyFee: 100000,
        legalFee: 100000,
        // cautionDeposit not provided
      },
    } as unknown as Listing;

    const res = moveInCost(listing);
    expect(res.total).toBe(1200000);
    expect(res.hasUnknowns).toBe(true);
  });
});

describe('reviewSummary', () => {
  const now = new Date('2026-11-22T12:00:00Z');
  const reviews: Review[] = [
    {
      id: 'r1',
      targetType: 'house',
      targetId: 'l1',
      userId: 'u1',
      authorName: 'Ada',
      labels: ['lives_here'],
      ratings: { power: 'good', water: 'good', road: 'good', flooding: 'good', noise: 'good', security: 'good', management: 'good' },
      text: 'Great light here.',
      createdAt: '2026-10-01T00:00:00Z',
      status: 'published',
      helpfulCount: 2,
      reportCount: 0,
    },
    {
      id: 'r2',
      targetType: 'house',
      targetId: 'l1',
      userId: 'u2',
      authorName: 'Chidi',
      labels: ['knows_area'],
      ratings: { power: 'good', water: 'good', road: 'good', flooding: 'good', noise: 'good', security: 'good', management: 'good' },
      text: 'Power is very stable.',
      createdAt: '2026-09-01T00:00:00Z',
      status: 'published',
      helpfulCount: 1,
      reportCount: 0,
    },
    {
      id: 'r3',
      targetType: 'house',
      targetId: 'l1',
      userId: 'u3',
      authorName: 'Emeka',
      labels: ['lives_here'],
      ratings: { power: 'good', water: 'good', road: 'good', flooding: 'good', noise: 'good', security: 'good', management: 'good' },
      text: 'Steady electricity.',
      createdAt: '2026-08-01T00:00:00Z',
      status: 'published',
      helpfulCount: 3,
      reportCount: 0,
    },
  ];

  it('summarizes reviews when there are at least 3 reports in last 12 months', () => {
    const res = reviewSummary(reviews, 'power', now);
    expect(res.hasEnoughReports).toBe(true);
    expect(res.good).toBe(3);
    expect(res.summaryText).toContain('3 of 3 reports say reliable');
  });

  it('returns not enough reports if fewer than 3 reviews exist', () => {
    const res = reviewSummary(reviews.slice(0, 2), 'power', now);
    expect(res.hasEnoughReports).toBe(false);
    expect(res.summaryText).toBe('Not enough reports yet');
  });
});

describe('checkAttributionLock', () => {
  const now = new Date('2026-11-22T12:00:00Z');
  const bookings = [
    {
      id: 'b1',
      listingId: 'list-1',
      hunterId: 'hunter-1',
      agentId: 'agent-1',
      attributionLockUntil: '2026-11-30T12:00:00Z',
      status: 'paid_held',
    },
  ] as any;

  it('detects active lock when hunter contacts a different agent', () => {
    const res = checkAttributionLock(bookings, 'hunter-1', 'list-1', 'agent-2', now);
    expect(res.isLocked).toBe(true);
    expect(res.lockedAgentId).toBe('agent-1');
  });

  it('allows same agent or expired lock', () => {
    const resSameAgent = checkAttributionLock(bookings, 'hunter-1', 'list-1', 'agent-1', now);
    expect(resSameAgent.isLocked).toBe(false);

    const pastDate = new Date('2026-12-10T12:00:00Z');
    const resExpired = checkAttributionLock(bookings, 'hunter-1', 'list-1', 'agent-2', pastDate);
    expect(resExpired.isLocked).toBe(false);
  });
});

describe('freshness', () => {
  const now = new Date('2026-11-22T12:00:00Z');

  it('marks listing over 14 days old as stale', () => {
    const staleListing = {
      updatedAt: '2026-11-01T12:00:00Z', // 21 days ago
    } as Listing;
    const res = freshness(staleListing, now);
    expect(res.isStale).toBe(true);
    expect(res.warning).toBe('May be unavailable, ask the agent.');
  });

  it('recognizes fresh listings', () => {
    const freshListing = {
      updatedAt: '2026-11-20T12:00:00Z', // 2 days ago
    } as Listing;
    const res = freshness(freshListing, now);
    expect(res.isStale).toBe(false);
    expect(res.warning).toBeNull();
  });
});

describe('revenueModel', () => {
  it('computes gross revenue, payment processing fee and net revenue', () => {
    const res = revenueModel({
      viewings: 1000, // 1000 * 600 = 600,000
      proSubscribers: 10, // 10 * 10,000 = 100,000
      boosts: 20, // 20 * 2,000 = 40,000
    });
    expect(res.grossRevenue).toBe(740000);
    expect(res.paymentProcessing).toBe(14800);
    expect(res.netRevenue).toBe(725200);
  });
});
