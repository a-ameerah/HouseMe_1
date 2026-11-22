import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FastForward,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  MessageSquare,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { BottomSheet } from '../components/common/BottomSheet';
import { useStore } from '../store/useStore';
import { Booking, BookingStatus } from '../data/types';
import { formatNaira } from '../lib';

export const ViewingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    bookings,
    listings,
    agents,
    properties,
    simulateArrival,
    fastForward24Hours,
    submitPostViewingSurvey,
    disputeBooking,
    currentUser,
    addToast,
  } = useStore();

  const [activeSurveyBooking, setActiveSurveyBooking] = useState<Booking | null>(null);
  const [surveyMatch, setSurveyMatch] = useState<'Yes' | 'Partly' | 'No'>('Yes');
  const [surveyDiffered, setSurveyDiffered] = useState<string[]>([]);
  const [surveySkipped, setSurveySkipped] = useState(true);

  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('House was not as listed');
  const [disputeNotes, setDisputeNotes] = useState('');

  // Tally of avoided viewings
  const avoidedCount = bookings.filter((b) => b.surveyResult?.skippedOtherViewings).length + 3;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'paid_held':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-brand-700 border border-blue-200">
            Payment Held in Escrow
          </span>
        );
      case 'completed_awaiting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-ink-900 border border-amber-600">
            Viewing Done • 24h Window Active
          </span>
        );
      case 'released':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-brand-700 border border-emerald-300">
            Fee Released to Agent
          </span>
        );
      case 'disputed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-900 border border-red-200">
            Disputed • Case in Admin Review
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-ink-700">
            Refunded to Hunter
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-900">
            {status}
          </span>
        );
    }
  };

  const handleToggleDifferedChip = (chip: string) => {
    setSurveyDiffered((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurveyBooking) return;

    submitPostViewingSurvey(activeSurveyBooking.id, {
      matched: surveyMatch,
      differedChips: surveyDiffered,
      skippedOtherViewings: surveySkipped,
    });

    setActiveSurveyBooking(null);
  };

  const handleOpenDispute = () => {
    if (!disputeBookingId) return;
    disputeBooking(disputeBookingId, disputeReason, disputeNotes);
    setDisputeBookingId(null);
    setDisputeNotes('');
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-4">
        <h1 className="text-xl font-extrabold text-ink-900">Your Viewings & Escrow</h1>
        <p className="text-xs text-ink-700 mt-0.5">
          All viewing payments are protected in escrow until 24 hours post-inspection.
        </p>

        {/* Avoided Viewings Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-brand-900 block">
                {avoidedCount} unnecessary viewings avoided!
              </span>
              <span className="text-[11px] text-ink-700">
                You saved ~₦35,000 in transit and wasted inspection fees.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-0 py-0 space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink-900">No viewings booked yet</h3>
            <p className="text-xs text-ink-700 mt-1 mb-5">
              Book a viewing on any listing. Your ₦4,000 fee is held safely until you inspect the property.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/')}>
              Browse Houses
            </Button>
          </div>
        ) : (
          bookings.map((booking) => {
            const listing = listings.find((l) => l.id === booking.listingId);
            const agent = agents.find((a) => a.userId === booking.agentId);
            const property = properties.find((p) => p.id === listing?.propertyId);

            return (
              <Card key={booking.id} padding="md" className="space-y-3">
                {/* Status Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {getStatusBadge(booking.status)}
                  <span className="text-[11px] font-bold text-ink-700">
                    Fee: {formatNaira(booking.feeAmount)}
                  </span>
                </div>

                {/* House Info */}
                <div>
                  <h3 className="text-sm font-bold text-ink-900">
                    {listing?.title || 'Scheduled Viewing'}
                  </h3>
                  <p className="text-xs text-ink-700">
                    Agent: <strong className="text-ink-900">{agent?.name}</strong> •{' '}
                    {property?.landmarks[0] || 'Lagos'}
                  </p>
                </div>

                {/* Arrival Code Card for Hunter */}
                {booking.status === 'paid_held' && (
                  <div className="p-3 rounded-2xl bg-brand-50 border border-brand-500/30 text-center">
                    <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider block">
                      Arrival Code for Agent
                    </span>
                    <div className="text-3xl font-extrabold font-mono text-brand-900 my-1 tracking-widest">
                      {booking.arrivalCode}
                    </div>
                    <span className="text-[10px] text-ink-700">
                      Show this 4-digit code to {agent?.name} when you meet at the property.
                    </span>

                    {/* Simulate Arrival Demo Trigger */}
                    <div className="mt-2.5 pt-2 border-t border-brand-200">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs bg-white text-brand-900 font-bold"
                        icon={<Play className="w-3.5 h-3.5" />}
                        onClick={() => {
                          simulateArrival(booking.id);
                          setActiveSurveyBooking(booking);
                        }}
                      >
                        Simulate Arrival (Enter Code: {booking.arrivalCode})
                      </Button>
                    </div>
                  </div>
                )}

                {/* 24-Hour Countdown & Post-Arrival Actions */}
                {booking.status === 'completed_awaiting' && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Clock className="w-4 h-4 text-amber-900" />
                        <span>24-Hour Escrow Window Active</span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-amber-900">
                        23h 48m left
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-700 leading-relaxed">
                      Viewing completed. If you do nothing, ₦3,400 is released to {agent?.name} automatically. Silence means release.
                    </p>

                    <div className="flex gap-2 pt-1">
                      {/* Fast-Forward 24 Hours Demo Trigger */}
                      <Button
                        variant="amber"
                        size="sm"
                        className="flex-1 text-xs"
                        icon={<FastForward className="w-3.5 h-3.5" />}
                        onClick={() => fastForward24Hours(booking.id)}
                      >
                        Fast-forward 24 hours
                      </Button>

                      {/* Problem Dispute */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-900 hover:bg-red-50"
                        onClick={() => setDisputeBookingId(booking.id)}
                      >
                        Report Problem
                      </Button>
                    </div>

                    {/* Post-Viewing Survey Prompt if not yet submitted */}
                    {!booking.surveyResult && (
                      <div className="pt-2 border-t border-amber-500/20">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs font-bold bg-white text-brand-900"
                          onClick={() => setActiveSurveyBooking(booking)}
                        >
                          Complete 20-second Listing Match Survey
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Released state */}
                {booking.status === 'released' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-brand-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-brand-700" />
                      <span>Viewing completed & ₦3,400 paid to agent.</span>
                    </div>
                  </div>
                )}

                {/* Disputed state */}
                {booking.status === 'disputed' && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-900" />
                      <span>Dispute Opened: {booking.disputeReason}</span>
                    </div>
                    <p className="text-[11px] text-red-900">
                      Payment is frozen. HouseMe admin is reviewing and will refund or resolve within 24 hours.
                    </p>
                  </div>
                )}

                {/* Survey Result Summary */}
                {booking.surveyResult && (
                  <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-brand-900">
                      <span>Listing Match Feedback</span>
                      <span className="text-[11px] text-brand-700 font-extrabold">
                        Matched: {booking.surveyResult.matched}
                      </span>
                    </div>
                    {booking.surveyResult.differedChips.length > 0 && (
                      <div className="text-[11px] text-ink-700">
                        Reported differences: {booking.surveyResult.differedChips.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* 20-Second Post-Viewing Survey Modal (7.10) */}
      <Modal
        isOpen={Boolean(activeSurveyBooking)}
        onClose={() => setActiveSurveyBooking(null)}
        title="Quick 20-Second Viewing Survey"
      >
        <form onSubmit={handleSubmitSurvey} className="space-y-4">
          <p className="text-xs text-ink-700">
            Your feedback directly calibrates the agent's accuracy score and protects other house hunters.
          </p>

          {/* Question 1: Match listing? */}
          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1.5">
              1. Did the house match the listing?
            </label>
            <div className="flex gap-2">
              {(['Yes', 'Partly', 'No'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSurveyMatch(opt)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    surveyMatch === opt
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-surface text-ink-700 border-line hover:border-brand-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: What was different? (if partly or no) */}
          {(surveyMatch === 'Partly' || surveyMatch === 'No') && (
            <div>
              <label className="text-xs font-bold text-ink-900 block mb-1.5">
                2. What was different from the listing?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Costs', 'Power', 'Water', 'Road', 'Rooms', 'Condition', 'Other'].map((chip) => {
                  const isSel = surveyDiffered.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleToggleDifferedChip(chip)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                        isSel
                          ? 'bg-amber-500 text-ink-900 border-amber-600 font-bold'
                          : 'bg-surface text-ink-700 border-line'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 3: Skipped other viewings? */}
          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1.5">
              3. Did HouseMe help you skip other viewings?
            </label>
            <div className="flex gap-2">
              {[
                { val: true, label: 'Yes, saved me trips' },
                { val: false, label: 'No' },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => setSurveySkipped(opt.val)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    surveySkipped === opt.val
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-surface text-ink-700 border-line'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2">
            Submit Feedback & Update Accuracy
          </Button>
        </form>
      </Modal>

      {/* Report a Problem (Dispute) Modal */}
      <Modal
        isOpen={Boolean(disputeBookingId)}
        onClose={() => setDisputeBookingId(null)}
        title="Report a Problem with Viewing"
      >
        <div className="space-y-3">
          <p className="text-xs text-ink-700">
            Refunds are provided for agent no-shows or clear listing mismatches, not for changing your mind.
          </p>

          <div className="space-y-2">
            {[
              'Agent did not show up',
              'House was not as listed',
              'Different house shown',
              'Hidden extra fees demanded on-site',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 text-xs font-semibold text-ink-900 cursor-pointer p-2 rounded-xl hover:bg-brand-50"
              >
                <input
                  type="radio"
                  name="disputeReason"
                  checked={disputeReason === reason}
                  onChange={() => setDisputeReason(reason)}
                  className="accent-brand-600"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1">
              Additional Details (optional)
            </label>
            <textarea
              rows={2}
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              placeholder="Explain what happened..."
              className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface text-ink-900 focus:outline-none focus:border-brand-600"
            />
          </div>

          <Button variant="danger" className="w-full" onClick={handleOpenDispute}>
            Open Escrow Dispute
          </Button>
        </div>
      </Modal>
    </div>
  );
};
