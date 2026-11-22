import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Agent,
  AuditLog,
  Booking,
  BookingOutcome,
  Listing,
  Neighbourhood,
  Property,
  Question,
  Report,
  Review,
  Role,
  User,
} from '../data/types';
import {
  demoAdminUser,
  demoAgentUser,
  demoHunter,
  initialAgents,
  initialAuditLogs,
  initialBookings,
  initialListings,
  initialNeighbourhoods,
  initialProperties,
  initialQuestions,
  initialReports,
  initialReviews,
} from '../data/seed';
import { completeness } from '../lib';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
}

// BroadcastChannel for cross-tab sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('houseme_sync_channel')
  : null;

interface HouseMeState {
  // Auth state
  isAuthenticated: boolean;
  role: Role;
  currentUser: User;
  isGuest: boolean;
  setRole: (role: Role) => void;
  login: (phone: string, role?: Role) => boolean;
  signupHunter: (phone: string, firstName: string, prefs?: Partial<User>) => void;
  signupAgent: (agentData: Partial<Agent> & { phone: string; name: string }) => Agent;
  logout: () => void;
  demoApproveAgent: (userId: string) => void;

  updateUserPreferences: (prefs: Partial<User>) => void;
  onboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;

  // Demo Tools drawer
  demoToolsOpen: boolean;
  setDemoToolsOpen: (open: boolean) => void;

  // Cross-device export/import
  exportDemoState: () => string;
  importDemoState: (dataString: string) => boolean;

  // Data collections
  listings: Listing[];
  agents: Agent[];
  properties: Property[];
  neighbourhoods: Neighbourhood[];
  reviews: Review[];
  questions: Question[];
  bookings: Booking[];
  reports: Report[];
  auditLogs: AuditLog[];

  // Hunter interactions
  savedListingIds: string[];
  shortlistNotes: Record<string, string>;
  compareListingIds: string[];
  recentlyViewedIds: string[];
  dataSaver: boolean;
  dataUsedKb: number;
  isOffline: boolean;

  // UI state
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Actions: Hunter
  toggleSave: (listingId: string) => void;
  setShortlistNote: (listingId: string, note: string) => void;
  toggleCompare: (listingId: string) => void;
  clearCompare: () => void;
  recordView: (listingId: string) => void;
  toggleDataSaver: () => void;
  toggleOffline: () => void;
  incrementDataUsage: (kb: number) => void;

  // Actions: Bookings & Escrow
  createBooking: (listingId: string, slotAt: string, feeAmount?: number) => Booking;
  enterArrivalCode: (bookingId: string, code: string) => { success: boolean; message: string };
  simulateArrival: (bookingId: string) => void;
  fastForward24Hours: (bookingId: string) => void;
  submitPostViewingSurvey: (
    bookingId: string,
    result: {
      matched: 'Yes' | 'Partly' | 'No';
      differedChips: string[];
      skippedOtherViewings: boolean;
    }
  ) => void;
  disputeBooking: (bookingId: string, reason: string, notes?: string) => void;

  // Actions: Reviews & Q&A
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'reportCount' | 'status'>) => void;
  upvoteReview: (reviewId: string) => void;
  reportContent: (targetType: Report['targetType'], targetId: string, reason: string, notes?: string) => void;
  addQuestion: (targetType: 'house' | 'area', targetId: string, text: string) => void;
  addAnswer: (questionId: string, text: string, authorRole: 'agent' | 'resident' | 'hunter') => void;

  // Actions: Agent
  createListing: (data: Partial<Listing> & { address: string; neighbourhoodId: string }) => Listing;
  confirmListingAvailability: (listingId: string) => void;
  boostListing: (listingId: string) => void;
  withdrawAgentWallet: (amount: number) => void;

  // Actions: Admin
  approveAgent: (userId: string) => void;
  rejectAgent: (userId: string, reason: string) => void;
  requestAgentInfo: (userId: string) => void;
  moderateListing: (listingId: string, action: 'approve' | 'request_changes' | 'reject') => void;
  resolveDispute: (bookingId: string, outcome: 'refund_hunter' | 'release_agent') => void;

  // Global reset for testing
  resetAllData: () => void;
}

export const useStore = create<HouseMeState>()(
  persist(
    (set, get) => {
      // Setup cross-tab sync listener
      if (syncChannel) {
        syncChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_STATE') {
            const raw = localStorage.getItem('houseme-storage-v2');
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed?.state) {
                  set({
                    ...parsed.state,
                    toasts: get().toasts, // Keep local ephemeral toasts
                  });
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        };
      }

      const broadcastSync = () => {
        try {
          syncChannel?.postMessage({ type: 'SYNC_STATE', timestamp: Date.now() });
        } catch (e) {
          // Ignore
        }
      };

      return {
        // Default state
        isAuthenticated: true,
        isGuest: false,
        role: 'hunter',
        currentUser: demoHunter,
        onboardingDone: true,
        demoToolsOpen: false,

        setDemoToolsOpen: (open: boolean) => set({ demoToolsOpen: open }),

        listings: initialListings,
        agents: initialAgents,
        properties: initialProperties,
        neighbourhoods: initialNeighbourhoods,
        reviews: initialReviews,
        questions: initialQuestions,
        bookings: initialBookings,
        reports: initialReports,
        auditLogs: initialAuditLogs,

        savedListingIds: ['list-yaba-2bed'],
        shortlistNotes: {
          'list-yaba-2bed': 'Quiet street in Sabo with reliable power. Want to check the water pressure.',
        },
        compareListingIds: [],
        recentlyViewedIds: ['list-yaba-2bed'],
        dataSaver: false,
        dataUsedKb: 342,
        isOffline: false,
        toasts: [],

        setRole: (role: Role) => {
          let user = demoHunter;
          if (role === 'agent') user = demoAgentUser;
          if (role === 'admin') user = demoAdminUser;
          set({ role, currentUser: user, isAuthenticated: true, isGuest: false });
          get().addToast(`Active role: ${role.toUpperCase()}`, 'info');
          broadcastSync();
        },

        login: (phone: string, role = 'hunter') => {
          let user = { ...demoHunter, phone };
          if (role === 'agent') user = { ...demoAgentUser, phone };
          if (role === 'admin') user = { ...demoAdminUser, phone };

          set({
            isAuthenticated: true,
            isGuest: false,
            role,
            currentUser: user,
          });
          get().addToast(`Logged in successfully as ${user.displayName}`, 'success');
          broadcastSync();
          return true;
        },

        signupHunter: (phone, firstName, prefs) => {
          const user: User = {
            id: 'hunter-' + Math.random().toString(36).substring(2, 8),
            role: 'hunter',
            displayName: firstName,
            phone,
            city: prefs?.city || 'Lagos',
            budgetMin: prefs?.budgetMin || 500000,
            budgetMax: prefs?.budgetMax || 2500000,
            bedrooms: prefs?.bedrooms || [1, 2],
            dealbreakers: prefs?.dealbreakers || ['steady_power', 'no_flooding'],
            dataSaver: false,
          };
          set({
            isAuthenticated: true,
            isGuest: false,
            role: 'hunter',
            currentUser: user,
            onboardingDone: true,
          });
          get().addToast(`Welcome to HouseMe, ${firstName}!`, 'success');
          broadcastSync();
        },

        signupAgent: (agentData) => {
          const userId = 'user-agent-' + Math.random().toString(36).substring(2, 8);
          const newAgent: Agent = {
            userId,
            name: agentData.name.startsWith('Mr ') || agentData.name.startsWith('Mrs ') ? agentData.name : `Mr ${agentData.name}`,
            accountType: agentData.accountType || 'independent_agent',
            businessName: agentData.businessName,
            photoSeed: 'new_agent',
            areas: agentData.areas || ['Yaba', 'Ikeja'],
            bio: agentData.bio || 'Professional property specialist.',
            status: 'in_review',
            responseTimeMins: 15,
            completedViewings: 0,
            matchedViewings: 0,
            phone: agentData.phone,
            verificationDocs: {
              phoneVerified: true,
              idMatch: true,
              selfieMatch: true,
              authorityDocUploaded: true,
              ownerConfirmed: false,
            },
            createdAt: new Date().toISOString(),
          };

          const user: User = {
            id: userId,
            role: 'agent',
            displayName: newAgent.name,
            phone: newAgent.phone,
            city: 'Lagos',
            budgetMin: 0,
            budgetMax: 10000000,
            bedrooms: [],
            dealbreakers: [],
            dataSaver: false,
          };

          set((state) => ({
            agents: [newAgent, ...state.agents],
            role: 'agent',
            currentUser: user,
            isAuthenticated: true,
            isGuest: false,
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 8),
                actor: newAgent.name,
                action: 'Agent Applied for Verification',
                target: `${newAgent.name} (${newAgent.accountType})`,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));

          get().addToast('Application submitted. Status is under review.', 'info');
          broadcastSync();
          return newAgent;
        },

        demoApproveAgent: (userId: string) => {
          set((state) => ({
            agents: state.agents.map((a) =>
              a.userId === userId ? { ...a, status: 'approved' as const } : a
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 8),
                actor: 'Demo Fast-Track',
                action: 'Agent Approved Instantly',
                target: userId,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));
          get().addToast('Agent approved for demo testing! Publishing unlocked.', 'success');
          broadcastSync();
        },

        logout: () => {
          set({
            isAuthenticated: false,
            isGuest: true,
            role: 'hunter',
            currentUser: {
              ...demoHunter,
              displayName: 'Guest Hunter',
              id: 'guest',
            },
          });
          get().addToast('Logged out. Browsing as Guest.', 'info');
          broadcastSync();
        },

        exportDemoState: () => {
          const state = {
            bookings: get().bookings,
            listings: get().listings,
            agents: get().agents,
            reviews: get().reviews,
            auditLogs: get().auditLogs,
          };
          return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
        },

        importDemoState: (dataString: string) => {
          try {
            const json = decodeURIComponent(escape(atob(dataString.trim())));
            const parsed = JSON.parse(json);
            if (parsed.bookings && parsed.listings) {
              set({
                bookings: parsed.bookings,
                listings: parsed.listings,
                agents: parsed.agents || get().agents,
                reviews: parsed.reviews || get().reviews,
                auditLogs: parsed.auditLogs || get().auditLogs,
              });
              get().addToast('Demo state successfully imported from other device!', 'success');
              broadcastSync();
              return true;
            }
          } catch (e) {
            get().addToast('Invalid import code. Please copy correctly.', 'error');
          }
          return false;
        },

        updateUserPreferences: (prefs) => {
          set((state) => ({
            currentUser: { ...state.currentUser, ...prefs },
          }));
          get().addToast('Preferences updated', 'success');
          broadcastSync();
        },

        setOnboardingDone: (done: boolean) => set({ onboardingDone: done }),

        addToast: (message: string, type = 'info') => {
          const id = 'toast-' + Math.random().toString(36).substring(2, 9);
          set((state) => ({
            toasts: [...state.toasts.slice(-2), { id, message, type }],
          }));
          setTimeout(() => {
            get().removeToast(id);
          }, 3600);
        },

        removeToast: (id: string) => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        },

        toggleSave: (listingId: string) => {
          if (get().isGuest) {
            get().addToast('Please log in to save houses to your shortlist', 'info');
            return;
          }
          const isSaved = get().savedListingIds.includes(listingId);
          if (isSaved) {
            set((state) => ({
              savedListingIds: state.savedListingIds.filter((id) => id !== listingId),
            }));
            get().addToast('Removed from saved houses', 'info');
          } else {
            set((state) => ({
              savedListingIds: [...state.savedListingIds, listingId],
            }));
            get().addToast('House saved to your shortlist', 'success');
          }
          broadcastSync();
        },

        setShortlistNote: (listingId: string, note: string) => {
          set((state) => ({
            shortlistNotes: { ...state.shortlistNotes, [listingId]: note },
          }));
          broadcastSync();
        },

        toggleCompare: (listingId: string) => {
          const current = get().compareListingIds;
          if (current.includes(listingId)) {
            set({ compareListingIds: current.filter((id) => id !== listingId) });
          } else {
            if (current.length >= 3) {
              get().addToast('You can compare at most 3 houses at once', 'warning');
              return;
            }
            set({ compareListingIds: [...current, listingId] });
            get().addToast('Added to house comparison', 'success');
          }
        },

        clearCompare: () => set({ compareListingIds: [] }),

        recordView: (listingId: string) => {
          const current = get().recentlyViewedIds;
          const filtered = current.filter((id) => id !== listingId);
          set({ recentlyViewedIds: [listingId, ...filtered].slice(0, 10) });
          get().incrementDataUsage(get().dataSaver ? 40 : 180);
        },

        toggleDataSaver: () => {
          set((state) => ({ dataSaver: !state.dataSaver }));
          get().addToast(
            get().dataSaver ? 'Data-saver enabled: posters first' : 'Data-saver disabled: video autoplay on',
            'info'
          );
        },

        toggleOffline: () => {
          set((state) => ({ isOffline: !state.isOffline }));
          get().addToast(get().isOffline ? 'App is in offline mode' : 'Back online', 'info');
        },

        incrementDataUsage: (kb: number) => {
          set((state) => ({ dataUsedKb: state.dataUsedKb + kb }));
        },

        // Booking flow
        createBooking: (listingId: string, slotAt: string, feeAmount = 4000) => {
          const listing = get().listings.find((l) => l.id === listingId);
          const hunter = get().currentUser;
          const now = new Date();
          const code = Math.floor(1000 + Math.random() * 9000).toString();
          const lockUntil = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

          const newBooking: Booking = {
            id: 'book-' + Math.random().toString(36).substring(2, 9),
            listingId,
            hunterId: hunter.id,
            hunterName: hunter.displayName,
            agentId: listing?.agentId || 'user-agent-tunde',
            slotAt,
            feeAmount,
            platformCutPercent: 15,
            status: 'paid_held',
            arrivalCode: code,
            heldAt: now.toISOString(),
            attributionLockUntil: lockUntil,
            outcome: 'unset',
          };

          set((state) => ({
            bookings: [newBooking, ...state.bookings],
          }));

          get().addToast('₦4,000 held safely in escrow. Booking confirmed!', 'success');
          broadcastSync();
          return newBooking;
        },

        enterArrivalCode: (bookingId: string, code: string) => {
          const booking = get().bookings.find((b) => b.id === bookingId);
          if (!booking) {
            return { success: false, message: 'Booking not found' };
          }
          if (booking.arrivalCode !== code.trim()) {
            return { success: false, message: 'Invalid arrival code. Check with the hunter.' };
          }

          const now = new Date();
          const releaseAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    status: 'completed_awaiting',
                    arrivedAt: now.toISOString(),
                    releaseAt,
                  }
                : b
            ),
          }));

          get().addToast('Arrival verified! 24-hour escrow inspection period started.', 'success');
          broadcastSync();
          return { success: true, message: 'Arrival verified successfully.' };
        },

        simulateArrival: (bookingId: string) => {
          const booking = get().bookings.find((b) => b.id === bookingId);
          if (!booking) return;
          get().enterArrivalCode(bookingId, booking.arrivalCode);
        },

        fastForward24Hours: (bookingId: string) => {
          const booking = get().bookings.find((b) => b.id === bookingId);
          if (!booking) return;

          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    status: 'released',
                  }
                : b
            ),
            agents: state.agents.map((a) =>
              a.userId === booking.agentId
                ? {
                    ...a,
                    completedViewings: a.completedViewings + 1,
                    matchedViewings:
                      booking.outcome === 'matched'
                        ? a.matchedViewings + 1
                        : booking.outcome === 'partly'
                        ? a.matchedViewings + 0.5
                        : a.matchedViewings,
                  }
                : a
            ),
          }));

          get().addToast('24h elapsed with no dispute: ₦3,400 released to agent wallet!', 'success');
          broadcastSync();
        },

        submitPostViewingSurvey: (bookingId, result) => {
          const outcome: BookingOutcome =
            result.matched === 'Yes'
              ? 'matched'
              : result.matched === 'Partly'
              ? 'partly'
              : 'not_matched';

          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    outcome,
                    surveyResult: {
                      ...result,
                      submittedAt: new Date().toISOString(),
                    },
                  }
                : b
            ),
          }));

          get().addToast('Survey submitted! Thank you for protecting the community.', 'success');
          broadcastSync();
        },

        disputeBooking: (bookingId, reason, notes) => {
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    status: 'disputed',
                    disputeReason: reason,
                    disputeNotes: notes,
                  }
                : b
            ),
            reports: [
              ...state.reports,
              {
                id: 'rep-' + Math.random().toString(36).substring(2, 9),
                targetType: 'listing',
                targetId: bookingId,
                reporterId: get().currentUser.id,
                reason,
                notes,
                createdAt: new Date().toISOString(),
                status: 'pending',
              },
            ],
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: get().currentUser.displayName,
                action: 'Dispute Filed',
                target: `Booking ${bookingId} (${reason})`,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));

          get().addToast('Dispute opened. Payment held until HouseMe Admin review.', 'warning');
          broadcastSync();
        },

        // Reviews & Q&A
        addReview: (reviewData) => {
          const newReview: Review = {
            ...reviewData,
            id: 'rev-' + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            status: 'published',
            helpfulCount: 0,
            reportCount: 0,
          };

          set((state) => ({
            reviews: [newReview, ...state.reviews],
          }));

          get().addToast('Your review has been published. Thank you!', 'success');
          broadcastSync();
        },

        upvoteReview: (reviewId: string) => {
          set((state) => ({
            reviews: state.reviews.map((r) =>
              r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
            ),
          }));
          get().addToast('Marked review as helpful', 'success');
          broadcastSync();
        },

        reportContent: (targetType, targetId, reason, notes) => {
          const reportId = 'rep-' + Math.random().toString(36).substring(2, 9);
          set((state) => ({
            reports: [
              {
                id: reportId,
                targetType,
                targetId,
                reporterId: state.currentUser.id,
                reason,
                notes,
                createdAt: new Date().toISOString(),
                status: 'pending',
              },
              ...state.reports,
            ],
            reviews: state.reviews.map((r) =>
              r.id === targetId ? { ...r, status: 'hidden' as const } : r
            ),
          }));

          get().addToast('Report submitted for admin review. Content hidden.', 'info');
          broadcastSync();
        },

        addQuestion: (targetType, targetId, text) => {
          const newQuestion: Question = {
            id: 'q-' + Math.random().toString(36).substring(2, 9),
            targetType,
            targetId,
            userId: get().currentUser.id,
            authorName: get().currentUser.displayName,
            text,
            createdAt: new Date().toISOString(),
            answers: [],
          };

          set((state) => ({
            questions: [newQuestion, ...state.questions],
          }));

          get().addToast('Question posted. Residents and agents will be notified.', 'success');
          broadcastSync();
        },

        addAnswer: (questionId, text, authorRole) => {
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    answers: [
                      ...q.answers,
                      {
                        id: 'ans-' + Math.random().toString(36).substring(2, 9),
                        userId: state.currentUser.id,
                        authorName: state.currentUser.displayName,
                        authorRole,
                        text,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : q
            ),
          }));

          get().addToast('Your answer has been submitted', 'success');
          broadcastSync();
        },

        // Agent actions
        createListing: (data) => {
          const agent = get().currentUser;
          const propId = 'prop-' + Math.random().toString(36).substring(2, 9);
          const listId = 'list-' + Math.random().toString(36).substring(2, 9);

          const existingProp = get().properties.find(
            (p) => p.address.toLowerCase().trim() === data.address.toLowerCase().trim()
          );

          const newProp: Property = existingProp || {
            id: propId,
            neighbourhoodId: data.neighbourhoodId,
            approximatePoint: { lat: 6.51, lng: 3.37, radiusMeters: 300 },
            address: data.address,
            landmarks: ['Near main avenue'],
            transportNotes: 'Easy transit access.',
          };

          const newListing: Listing = {
            id: listId,
            propertyId: newProp.id,
            agentId: agent.id,
            authorityBasis: data.authorityBasis || 'owner_authorised_agent',
            exclusivity: data.exclusivity || 'exclusive',
            status: 'published',
            title: data.title || 'Newly Listed Apartment',
            caption: data.caption || 'Verified apartment on HouseMe.',
            description: data.description || 'Spacious and verified living space.',
            type: data.type || '2_bed',
            bedrooms: data.bedrooms ?? 2,
            bathrooms: data.bathrooms ?? 2,
            toilets: data.toilets ?? 2,
            rentYearly: data.rentYearly ?? 1200000,
            costs: data.costs || {},
            features: data.features as any,
            media: data.media || {
              videoSceneId: 'scene-custom',
              scenes: [
                { id: 's1', label: 'Exterior', type: 'exterior' },
                { id: 's2', label: 'Living Room', type: 'living' },
                { id: 's3', label: 'Bedroom', type: 'bedroom' },
              ],
              photos: (data.media as any)?.photos || [],
            },
            availableFrom: data.availableFrom || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
            completenessScore: 85,
          };

          newListing.completenessScore = completeness(newListing).score;

          set((state) => ({
            properties: existingProp ? state.properties : [newProp, ...state.properties],
            listings: [newListing, ...state.listings],
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: agent.displayName,
                action: 'New Listing Published',
                target: newListing.title,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));

          get().addToast('New listing published successfully!', 'success');
          broadcastSync();
          return newListing;
        },

        confirmListingAvailability: (listingId: string) => {
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === listingId ? { ...l, updatedAt: new Date().toISOString(), status: 'published' } : l
            ),
          }));
          get().addToast('Listing marked as currently available. Freshness confirmed!', 'success');
          broadcastSync();
        },

        boostListing: (listingId: string) => {
          const listing = get().listings.find((l) => l.id === listingId);
          if (!listing) return;
          if (listing.completenessScore < 70) {
            get().addToast('Listings must have at least 70% completeness to be boosted', 'error');
            return;
          }

          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === listingId ? { ...l, isBoosted: true } : l
            ),
          }));
          get().addToast('Listing boosted for ₦2,000/week! Now pinned as Sponsored.', 'success');
          broadcastSync();
        },

        withdrawAgentWallet: (amount: number) => {
          get().addToast(`₦${amount.toLocaleString()} withdrawal initiated to linked bank account.`, 'success');
        },

        // Admin actions
        approveAgent: (userId: string) => {
          set((state) => ({
            agents: state.agents.map((a) =>
              a.userId === userId ? { ...a, status: 'approved' as const } : a
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: state.currentUser.displayName,
                action: 'Agent Approved',
                target: userId,
                before: 'in_review',
                after: 'approved',
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));
          get().addToast('Agent application approved and verified.', 'success');
          broadcastSync();
        },

        rejectAgent: (userId: string, reason: string) => {
          set((state) => ({
            agents: state.agents.map((a) =>
              a.userId === userId ? { ...a, status: 'rejected' as const } : a
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: state.currentUser.displayName,
                action: 'Agent Rejected',
                target: `${userId} (${reason})`,
                before: 'in_review',
                after: 'rejected',
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));
          get().addToast(`Agent application rejected: ${reason}`, 'info');
          broadcastSync();
        },

        requestAgentInfo: (userId: string) => {
          set((state) => ({
            agents: state.agents.map((a) =>
              a.userId === userId ? { ...a, status: 'needs_info' as const } : a
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: state.currentUser.displayName,
                action: 'Requested More Info',
                target: userId,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));
          get().addToast('Sent information request notification to agent.', 'info');
          broadcastSync();
        },

        moderateListing: (listingId, action) => {
          const newStatus =
            action === 'approve'
              ? 'published'
              : action === 'request_changes'
              ? 'changes_requested'
              : 'rejected';

          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === listingId ? { ...l, status: newStatus as any } : l
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: state.currentUser.displayName,
                action: `Listing Moderation: ${action}`,
                target: listingId,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));

          get().addToast(`Listing status updated to ${newStatus}`, 'info');
          broadcastSync();
        },

        resolveDispute: (bookingId, outcome) => {
          const nextStatus = outcome === 'refund_hunter' ? 'refunded' : 'released';
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId ? { ...b, status: nextStatus as any } : b
            ),
            auditLogs: [
              {
                id: 'log-' + Math.random().toString(36).substring(2, 9),
                actor: state.currentUser.displayName,
                action: `Dispute Resolved: ${outcome}`,
                target: bookingId,
                at: new Date().toISOString(),
              },
              ...state.auditLogs,
            ],
          }));

          get().addToast(`Dispute resolved. Booking is now ${nextStatus}.`, 'success');
          broadcastSync();
        },

        resetAllData: () => {
          set({
            listings: initialListings,
            agents: initialAgents,
            properties: initialProperties,
            neighbourhoods: initialNeighbourhoods,
            reviews: initialReviews,
            questions: initialQuestions,
            bookings: initialBookings,
            reports: initialReports,
            auditLogs: initialAuditLogs,
            savedListingIds: ['list-yaba-2bed'],
            shortlistNotes: {
              'list-yaba-2bed': 'Quiet street in Sabo with reliable power. Want to check the water pressure.',
            },
            compareListingIds: [],
            recentlyViewedIds: ['list-yaba-2bed'],
            role: 'hunter',
            currentUser: demoHunter,
            isAuthenticated: true,
            isGuest: false,
          });
          get().addToast('Demo data restored to initial state', 'success');
          broadcastSync();
        },
      };
    },
    {
      name: 'houseme-storage-v2',
    }
  )
);
