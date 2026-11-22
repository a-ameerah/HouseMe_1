// Data models for HouseMe
// Strict types following Section 5 of specification

export type Role = 'hunter' | 'agent' | 'admin';

export type Dealbreaker =
  | 'steady_power'
  | 'no_flooding'
  | 'tarred_road'
  | 'prepaid_meter'
  | 'water_supply'
  | 'gated_security';

export interface User {
  id: string;
  role: Role;
  displayName: string;
  phone: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  bedrooms: number[];
  dealbreakers: Dealbreaker[];
  dataSaver: boolean;
}

export type AgentAccountType = 'independent_agent' | 'agency' | 'owner' | 'caretaker';

export type AgentStatus =
  | 'registered'
  | 'submitted'
  | 'in_review'
  | 'needs_info'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface Agent {
  userId: string;
  name: string; // e.g. "Mr Tunde Adebayo"
  accountType: AgentAccountType;
  businessName?: string;
  photoSeed: string;
  areas: string[];
  bio: string;
  status: AgentStatus;
  responseTimeMins: number;
  completedViewings: number;
  matchedViewings: number;
  phone: string;
  verificationDocs?: {
    phoneVerified: boolean;
    idMatch: boolean;
    selfieMatch: boolean;
    authorityDocUploaded: boolean;
    ownerConfirmed: boolean;
  };
  createdAt: string;
}

export interface Property {
  id: string;
  neighbourhoodId: string;
  approximatePoint: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
  address: string; // Private, revealed only after viewing is booked
  landmarks: string[];
  transportNotes: string;
}

export type AuthorityBasis =
  | 'owner_listing'
  | 'owner_authorised_agent'
  | 'agency_inventory'
  | 'owner_authorised_caretaker';

export type Exclusivity = 'exclusive' | 'open';

export type ListingStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'published'
  | 'changes_requested'
  | 'rejected'
  | 'stale'
  | 'rented'
  | 'removed';

export type FeatureValueStatus = 'provided' | 'not_provided' | 'not_applicable';

export type TrustSource =
  | 'Verified uploader'
  | 'Authority checked'
  | 'Agent-provided'
  | 'Resident-reported'
  | 'Multiple reports'
  | 'Platform-checked';

export interface FeatureItem<T = string | boolean | number> {
  status: FeatureValueStatus;
  value?: T;
  source: TrustSource;
  lastConfirmed: string; // ISO date string
}

export interface ListingCosts {
  agencyFee?: number;
  legalFee?: number;
  cautionDeposit?: number;
  serviceCharge?: number;
  estateDues?: number;
  other?: number;
  notes?: string;
}

export interface ListingFeatures {
  electricity: FeatureItem<string>; // e.g. "18-20 hrs daily"
  prepaidMeter: FeatureItem<boolean>;
  backupPower: FeatureItem<string>; // e.g. "Central generator 7pm-7am"
  waterSource: FeatureItem<string>; // e.g. "Borehole with treatment plant"
  waterReliability: FeatureItem<string>; // e.g. "Continuous 24/7"
  roadCondition: FeatureItem<string>; // e.g. "Paved, good drainage"
  drainage: FeatureItem<string>;
  floodingHistory: FeatureItem<string>; // e.g. "No flooding on street"
  security: FeatureItem<string>; // e.g. "Gated estate, 24/7 uniform guards"
  wasteDisposal: FeatureItem<string>;
  parking: FeatureItem<string>; // e.g. "1 dedicated car slot"
  fencing: FeatureItem<boolean>;
  internet: FeatureItem<string>;
  kitchen: FeatureItem<string>; // e.g. "Cabinet fitted"
  ceiling: FeatureItem<string>; // e.g. "POP ceiling"
  boysQuarters: FeatureItem<boolean>;
  petsAllowed: FeatureItem<boolean>;
}

export interface ListingMedia {
  videoSceneId: string;
  scenes: {
    id: string;
    label: string; // e.g. "Front Exterior", "Living Room", "Kitchen", "Master Bedroom", "Street & Drainage"
    type: 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'road' | 'meter' | 'water';
  }[];
  photos: string[];
}

export interface Listing {
  id: string;
  propertyId: string;
  agentId: string;
  authorityBasis: AuthorityBasis;
  exclusivity: Exclusivity;
  status: ListingStatus;
  title: string;
  caption: string; // max 120 chars
  description: string;
  type: 'self_contain' | 'mini_flat' | '1_bed' | '2_bed' | '3_bed' | 'duplex';
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  rentYearly: number;
  costs: ListingCosts;
  features: ListingFeatures;
  media: ListingMedia;
  availableFrom: string;
  updatedAt: string;
  completenessScore: number;
  isBoosted?: boolean;
}

export interface Neighbourhood {
  id: string;
  name: string;
  city: string;
  summary: string;
  centrePoint: {
    lat: number;
    lng: number;
  };
  transportNotes: string;
  powerAverage: string;
  roadQuality: string;
  floodRisk: string;
}

export type RatingLevel = 'good' | 'okay' | 'bad' | 'skipped';

export interface ReviewRatings {
  power: RatingLevel;
  water: RatingLevel;
  road: RatingLevel;
  flooding: RatingLevel;
  noise: RatingLevel;
  security: RatingLevel;
  management: RatingLevel;
}

export type ReviewLabel = 'viewed_via_app' | 'lives_here' | 'knows_area';

export interface Review {
  id: string;
  targetType: 'house' | 'area';
  targetId: string; // listingId or neighbourhoodId
  userId: string;
  authorName: string; // first name or "Anonymous resident", no full names in public reviews
  labels: ReviewLabel[];
  ratings: ReviewRatings;
  text: string;
  createdAt: string;
  status: 'published' | 'hidden' | 'flagged';
  agentReply?: {
    agentName: string;
    text: string;
    createdAt: string;
  };
  helpfulCount: number;
  reportCount: number;
}

export interface Question {
  id: string;
  targetType: 'house' | 'area';
  targetId: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
  answers: {
    id: string;
    userId: string;
    authorName: string;
    authorRole: 'agent' | 'resident' | 'hunter';
    text: string;
    createdAt: string;
  }[];
}

export type BookingStatus =
  | 'requested'
  | 'confirmed'
  | 'paid_held'
  | 'arrived'
  | 'completed_awaiting'
  | 'released'
  | 'disputed'
  | 'refunded'
  | 'no_show'
  | 'cancelled';

export type BookingOutcome = 'matched' | 'partly' | 'not_matched' | 'unset';

export interface Booking {
  id: string;
  listingId: string;
  hunterId: string;
  hunterName: string;
  agentId: string;
  slotAt: string; // ISO datetime
  feeAmount: number; // ₦4,000
  platformCutPercent: number; // 15
  status: BookingStatus;
  arrivalCode: string; // 4 digits
  heldAt?: string;
  arrivedAt?: string;
  releaseAt?: string; // 24 hours after arrival
  attributionLockUntil: string; // 14 days
  outcome: BookingOutcome;
  surveyResult?: {
    matched: 'Yes' | 'Partly' | 'No';
    differedChips: string[];
    skippedOtherViewings: boolean;
    submittedAt: string;
  };
  disputeReason?: string;
  disputeNotes?: string;
}

export interface Report {
  id: string;
  targetType: 'listing' | 'agent' | 'review' | 'chat';
  targetId: string;
  reporterId: string;
  reason: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  outcome?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  before?: string;
  after?: string;
  at: string;
}

export interface ViewingSlot {
  id: string;
  agentId: string;
  startTime: string; // ISO
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  isGroup: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId?: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
  hasBankDetailsWarning?: boolean;
}
