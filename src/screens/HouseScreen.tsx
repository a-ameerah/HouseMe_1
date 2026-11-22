import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Zap,
  Droplet,
  Shield,
  HelpCircle,
  Clock,
  Check,
  Send,
  Flag,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { Tabs } from '../components/common/Tabs';
import { MatchBar } from '../components/common/MatchBar';
import { TrustChip } from '../components/common/TrustChip';
import { FieldRow } from '../components/common/FieldRow';
import { PriceTag } from '../components/common/PriceTag';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { MapPlaceholder } from '../components/common/MapPlaceholder';
import { ReviewCard } from '../components/common/ReviewCard';
import { RatingChips } from '../components/common/RatingChips';
import { BottomSheet } from '../components/common/BottomSheet';
import { Modal } from '../components/common/Modal';
import { Avatar } from '../components/common/Avatar';
import { LoginModal } from '../components/auth/LoginModal';
import { EmptyState } from '../components/common/EmptyState';
import { useStore } from '../store/useStore';
import {
  moveInCost,
  freshness,
  reviewSummary,
  accuracyScore,
  formatNaira,
} from '../lib';
import { RatingLevel, ReviewLabel } from '../data/types';

export const HouseScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    listings,
    agents,
    properties,
    reviews,
    questions,
    currentUser,
    savedListingIds,
    toggleSave,
    addToast,
    addReview,
    addQuestion,
    addAnswer,
    reportContent,
    bookings,
  } = useStore();

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  // Review & Q&A states
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewLabel, setReviewLabel] = useState<ReviewLabel>('viewed_via_app');
  const [reviewRatings, setReviewRatings] = useState<Record<string, RatingLevel>>({
    power: 'good',
    water: 'good',
    road: 'good',
    flooding: 'good',
    noise: 'okay',
    security: 'good',
    management: 'good',
  });

  const [questionText, setQuestionText] = useState('');
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [reportModalData, setReportModalData] = useState<{ targetType: any; targetId: string } | null>(null);
  const [reportReason, setReportReason] = useState('Incorrect pricing or fee discrepancy');

  // Find listing, agent, and property
  const listing = listings.find((l) => l.id === id);
  const agent = agents.find((a) => a.userId === listing?.agentId);
  const property = properties.find((p) => p.id === listing?.propertyId);

  if (!listing) {
    return (
      <div className="p-6 text-center text-ink-900">
        <h2 className="text-lg font-bold">House not found</h2>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Back to Feed
        </Button>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);
  const fresh = freshness(listing);
  const costCalc = moveInCost(listing);
  const agentAcc = agent ? accuracyScore(agent) : null;

  const scenes = listing.media?.scenes || [
    { id: 's1', label: 'Exterior', type: 'exterior' },
    { id: 's2', label: 'Living Room', type: 'living' },
    { id: 's3', label: 'Kitchen', type: 'kitchen' },
    { id: 's4', label: 'Bedroom', type: 'bedroom' },
    { id: 's5', label: 'Road', type: 'road' },
  ];

  const houseReviews = reviews.filter((r) => r.targetId === listing.id && r.status !== 'hidden');
  const areaReviews = reviews.filter((r) => r.targetId === property?.neighbourhoodId && r.status !== 'hidden');
  const houseQuestions = questions.filter((q) => q.targetId === listing.id);

  // Check if current user has booked this house to lock "Viewed via app" label
  const hasBooked = bookings.some(
    (b) => b.listingId === listing.id && b.hunterId === currentUser.id
  );

  const tabsList = [
    { id: 'overview', label: 'Overview' },
    { id: 'costs', label: 'Costs' },
    { id: 'location', label: 'Location' },
    { id: 'power_water', label: 'Power & Water' },
    { id: 'reviews', label: 'Reviews', badge: houseReviews.length },
    { id: 'agent', label: 'Agent' },
  ];

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      addToast('Please enter your review text', 'error');
      return;
    }

    addReview({
      targetType: 'house',
      targetId: listing.id,
      userId: currentUser.id,
      authorName: currentUser.displayName,
      labels: hasBooked ? ['viewed_via_app'] : [reviewLabel],
      ratings: reviewRatings as any,
      text: reviewText.trim(),
    });

    setIsWriteReviewOpen(false);
    setReviewText('');
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    addQuestion('house', listing.id, questionText.trim());
    setQuestionText('');
  };

  const handlePostAnswer = (qId: string) => {
    const text = answerInputs[qId];
    if (!text || !text.trim()) return;
    addAnswer(qId, text.trim(), currentUser.role === 'agent' ? 'agent' : 'resident');
    setAnswerInputs((prev) => ({ ...prev, [qId]: '' }));
  };

  const handleSendReport = () => {
    if (!reportModalData) return;
    reportContent(reportModalData.targetType, reportModalData.targetId, reportReason);
    setReportModalData(null);
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      <div className="lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.8fr)] lg:items-start lg:gap-8">
      <div className="min-w-0">
      {/* Top Header Gallery with Back & Share */}
      <div className="relative w-full bg-ink-900 overflow-hidden">
        {/* Large main image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-[560px]">
          <HouseImage
            houseId={listing.id}
            sceneIndex={activeSceneIdx}
            alt={`${listing.title} - ${scenes[activeSceneIdx]?.label || 'Photo'}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Action Nav Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" />}
              label="Back"
              variant="glass"
              size="sm"
              onClick={() => navigate(-1)}
            />

            <div className="flex items-center gap-2">
              <IconButton
                icon={<Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />}
                label="Save"
                variant="glass"
                size="sm"
                onClick={() => toggleSave(listing.id)}
              />
              <IconButton
                icon={<Share2 className="w-5 h-5" />}
                label="Share"
                variant="glass"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  addToast('House link copied!', 'success');
                }}
              />
            </div>
          </div>

          {/* Scene label badge */}
          {scenes[activeSceneIdx] && (
            <div className="absolute bottom-3 left-4 z-20 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold text-white">
              {scenes[activeSceneIdx].label}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-1.5 px-4 py-2 bg-ink-900 overflow-x-auto no-scrollbar">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSceneIdx(idx)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                activeSceneIdx === idx ? 'border-brand-500' : 'border-transparent  '
              }`}
            >
              <HouseImage
                houseId={listing.id}
                sceneIndex={idx}
                alt={s.label}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 14-Day Freshness Alert Banner if Stale */}
      {fresh.isStale && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs font-semibold text-ink-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />
          <span>{fresh.warning}</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="px-0 pt-0 space-y-4">
        {/* Title, Price, Move-in Cost Chip */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <TrustChip source="Verified uploader" size="sm" />
            <TrustChip source="Authority checked" size="sm" />
            <span className="text-[11px] text-ink-700 font-semibold">{fresh.label}</span>
          </div>

          <h1 className="text-xl font-extrabold text-ink-900 leading-tight">
            {listing.title}
          </h1>

          <div className="mt-2 flex items-baseline justify-between flex-wrap gap-2">
            <PriceTag
              yearlyRent={listing.rentYearly}
              moveInCost={costCalc.total}
              size="lg"
            />
          </div>
        </div>

        {/* MatchBar against user dealbreakers */}
        <MatchBar
          listing={listing}
          dealbreakers={currentUser.dealbreakers}
        />

        {/* Sticky Tabs Navigation */}
        <Tabs
          tabs={tabsList}
          activeTab={activeTab}
          onChange={setActiveTab}
          sticky
          className="-mx-4"
        />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-2">Description</h3>
              <p className="text-xs text-ink-700 leading-relaxed">
                {listing.description}
              </p>
            </Card>

            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-2">Room Layout & Details</h3>
              <FieldRow label="Bedrooms" fallbackValue={listing.bedrooms === 0 ? 'Self Contain' : `${listing.bedrooms} Bedroom`} />
              <FieldRow label="Bathrooms" fallbackValue={listing.bathrooms} />
              <FieldRow label="Toilets" fallbackValue={listing.toilets} />
              <FieldRow label="Kitchen" item={listing.features.kitchen} />
              <FieldRow label="Ceiling Finish" item={listing.features.ceiling} />
              <FieldRow label="Boys Quarters (BQ)" item={listing.features.boysQuarters} />
              <FieldRow label="Pets Allowed" item={listing.features.petsAllowed} />
            </Card>

            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-2">Security & Estate Features</h3>
              <FieldRow label="Security Arrangement" item={listing.features.security} />
              <FieldRow label="Perimeter Fencing" item={listing.features.fencing} />
              <FieldRow label="Parking Allocation" item={listing.features.parking} />
              <FieldRow label="Waste Management" item={listing.features.wasteDisposal} />
              <FieldRow label="Internet Fiber Infrastructure" item={listing.features.internet} />
            </Card>
          </div>
        )}

        {/* TAB 2: COSTS & MOVE-IN CALCULATOR */}
        {activeTab === 'costs' && (
          <div className="space-y-4">
            <Card padding="md" className="h-full">
              <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
                <div>
                  <span className="text-xs font-semibold text-ink-700">Calculated Move-In Total</span>
                  <div className="text-2xl font-extrabold text-brand-900">
                    {formatNaira(costCalc.total)}
                  </div>
                </div>
                {costCalc.hasUnknowns && (
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-[10px] font-bold">
                      Some lines unconfirmed
                    </span>
                  </div>
                )}
              </div>

              {costCalc.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between py-2 border-b border-line last:border-b-0 text-xs"
                >
                  <span className="font-semibold text-ink-900">{line.label}</span>
                  {line.isProvided ? (
                    <span className="font-bold text-ink-900">{formatNaira(line.amount || 0)}</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-900 italic font-semibold">Not provided</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/agent/${listing.agentId}?house=${listing.id}`)}
                        className="text-[11px] font-bold text-brand-700 underline"
                      >
                        Ask agent
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {listing.costs.notes && (
                <p className="mt-3 text-[11px] text-ink-700 bg-brand-50 p-2.5 rounded-xl border border-brand-100">
                  {listing.costs.notes}
                </p>
              )}
            </Card>
          </div>
        )}

        {/* TAB 3: LOCATION */}
        {activeTab === 'location' && (
          <div className="space-y-4">
            <MapPlaceholder
              neighbourhoodName={property?.neighbourhoodId ? property.neighbourhoodId.toUpperCase() : 'Lagos'}
              approximatePoint={property?.approximatePoint}
              landmarks={property?.landmarks}
              transportNotes={property?.transportNotes}
            />

            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-1.5">Road & Drainage Condition</h3>
              <FieldRow label="Road Condition" item={listing.features.roadCondition} />
              <FieldRow label="Street Drainage" item={listing.features.drainage} />
              <FieldRow label="Flooding History" item={listing.features.floodingHistory} />
            </Card>
          </div>
        )}

        {/* TAB 4: POWER & WATER */}
        {activeTab === 'power_water' && (
          <div className="space-y-4">
            <Card padding="md" className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink-900">Power Supply & Metering</h3>
              </div>
              <FieldRow label="Electricity Daily Supply" item={listing.features.electricity} />
              <FieldRow label="Prepaid Electric Meter" item={listing.features.prepaidMeter} />
              <FieldRow label="Backup Generator / Inverter" item={listing.features.backupPower} />
            </Card>

            <Card padding="md" className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink-900">Water Supply & Purity</h3>
              </div>
              <FieldRow label="Water Source" item={listing.features.waterSource} />
              <FieldRow label="Supply Reliability" item={listing.features.waterReliability} />
            </Card>

            {/* Resident Summary for Power & Water */}
            <Card padding="md" className="bg-brand-50/70 border-brand-100">
              <h4 className="text-xs font-bold text-brand-900 mb-2">Verified Resident Consensus</h4>
              <p className="text-xs text-ink-700 leading-relaxed">
                {reviewSummary(houseReviews, 'power').summaryText}
              </p>
              <p className="text-xs text-ink-700 leading-relaxed mt-1">
                {reviewSummary(houseReviews, 'water').summaryText}
              </p>
            </Card>
          </div>
        )}

        {/* TAB 5: REVIEWS & Q&A */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Summary Bars */}
            <Card padding="md" className="h-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-ink-900">Resident Experience</h3>
                  <p className="text-[11px] text-ink-700">Reports from verified residents & viewers</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsWriteReviewOpen(true)}
                >
                  Write Review
                </Button>
              </div>

              <div className="space-y-2 pt-2 border-t border-line">
                {(['power', 'water', 'road', 'flooding', 'security'] as const).map((t) => {
                  const s = reviewSummary(houseReviews, t);
                  return (
                    <div key={t} className="flex items-center justify-between text-xs py-1 border-b border-line/40 last:border-b-0">
                      <span className="font-semibold text-ink-900 capitalize">{t}</span>
                      <span className={`text-[11px] font-semibold ${s.hasEnoughReports ? 'text-brand-700' : 'text-ink-700 italic'}`}>
                        {s.summaryText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Reviews List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink-900 px-1">Recent Reviews for this House ({houseReviews.length})</h4>
              {houseReviews.length === 0 ? (
                <Card padding="md" className="h-full">
                  <EmptyState
                    icon={<MessageSquare className="w-10 h-10" />}
                    title="No reviews yet"
                    description="Be the first to share your experience with this house."
                    iconSize={40}
                    paddingClassName="py-6"
                  />
                </Card>
              ) : (
                houseReviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    review={rev}
                    onHelpful={(rId) => useStore.getState().upvoteReview(rId)}
                    onReport={(rId) => setReportModalData({ targetType: 'review', targetId: rId })}
                  />
                ))
              )}
            </div>

            {/* Q&A Section */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-ink-900">Community Questions & Answers</h4>
                <span className="text-[11px] text-ink-700">{houseQuestions.length} questions</span>
              </div>

              {/* Ask Form */}
              <form onSubmit={handlePostQuestion} className="flex gap-2">
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question (e.g. How is light?)"
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-line bg-surface text-ink-900 focus:outline-none focus:border-brand-600"
                />
                <Button type="submit" variant="primary" size="sm">
                  Ask
                </Button>
              </form>

              {/* Questions Threads */}
              <div className="space-y-3 pt-2">
                {houseQuestions.map((q) => (
                  <div key={q.id} className="p-3 rounded-xl bg-brand-50/50 border border-line text-xs space-y-2">
                    <div className="font-bold text-ink-900">{q.text}</div>
                    <span className="text-[10px] text-ink-700 block">Asked by {q.authorName}</span>

                    {/* Answers */}
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="pl-3 border-l-2 border-brand-600 py-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-brand-900 text-[11px]">
                          <span>{ans.authorName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-700 uppercase">
                            {ans.authorRole}
                          </span>
                        </div>
                        <p className="text-ink-700 text-[11px] leading-relaxed">{ans.text}</p>
                      </div>
                    ))}

                    {/* Add reply */}
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={answerInputs[q.id] || ''}
                        onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                        placeholder="Reply to this question..."
                        className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-line bg-white text-ink-900 focus:outline-none focus:border-brand-600"
                      />
                      <IconButton
                        icon={<Send className="w-3.5 h-3.5" />}
                        label="Reply"
                        variant="primary"
                        size="sm"
                        onClick={() => handlePostAnswer(q.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: AGENT */}
        {activeTab === 'agent' && agent && (
          <div className="space-y-4">
            <Card padding="md" className="h-full">
              <div className="flex items-start gap-3">
                <Avatar name={agent.name} verified={agent.status === 'approved'} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-ink-900 truncate">{agent.name}</h3>
                  <span className="text-xs text-ink-700 font-semibold capitalize block">
                    {agent.accountType.replace('_', ' ')}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <TrustChip source="Verified uploader" size="sm" />
                    <TrustChip source="Authority checked" size="sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-line">
                <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100">
                  <span className="text-[10px] text-ink-700 font-bold block uppercase">Accuracy Score</span>
                  <span className="text-sm font-extrabold text-brand-900">
                    {agentAcc?.label || 'New Agent'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100">
                  <span className="text-[10px] text-ink-700 font-bold block uppercase">Response Time</span>
                  <span className="text-sm font-extrabold text-brand-900">
                    ~{agent.responseTimeMins} mins
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-700 leading-relaxed mb-4">{agent.bio}</p>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => navigate(`/agent/${agent.userId}?house=${listing.id}`)}
                >
                  View Full Portfolio
                </Button>
                <IconButton
                  icon={<Flag className="w-4 h-4 text-ink-700" />}
                  label="Report Agent"
                  variant="secondary"
                  onClick={() => setReportModalData({ targetType: 'agent', targetId: agent.userId })}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
      </div>

      <aside className="hidden lg:block lg:sticky lg:top-20">
        <Card padding="lg" className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <TrustChip source="Verified uploader" size="sm" />
            <TrustChip source="Authority checked" size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-ink-900">{listing.title}</h1>
            <p className="mt-1 text-sm text-ink-700">{listing.caption}</p>
          </div>
          <PriceTag yearlyRent={listing.rentYearly} moveInCost={costCalc.total} size="lg" />
          <MatchBar listing={listing} dealbreakers={currentUser.dealbreakers} />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => toggleSave(listing.id)}>
              <Bookmark className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/agent/${listing.agentId}?house=${listing.id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" /> Contact
            </Button>
          </div>
          <Button variant="primary" className="w-full" onClick={() => navigate(`/book/${listing.id}`)}>
            <Calendar className="mr-2 h-4 w-4" /> Book Viewing
          </Button>
        </Card>
      </aside>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line py-2.5 px-4 flex items-center gap-2 shadow-float lg:hidden">
        <IconButton
          icon={<Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand-700 text-brand-700' : ''}`} />}
          label="Save"
          variant="secondary"
          onClick={() => toggleSave(listing.id)}
        />

        <Button
          variant="secondary"
          className="flex-1"
          icon={<MessageSquare className="w-4 h-4" />}
          onClick={() => navigate(`/agent/${listing.agentId}?house=${listing.id}`)}
        >
          Message
        </Button>

        <Button
          variant="primary"
          className="flex-1 bg-brand-700 hover:bg-brand-600 shadow-sm"
          icon={<Calendar className="w-4 h-4" />}
          onClick={() => navigate(`/book/${listing.id}`)}
        >
          Book Viewing
        </Button>
      </div>

      {/* Write a Review Bottom Sheet */}
      <BottomSheet
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        title="Write a Community Review"
      >
        <form onSubmit={handlePostReview} className="space-y-4">
          <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-[11px] text-brand-900">
            <strong>Community rule:</strong> Describe the house and neighbourhood honestly. Do not name or accuse people.
          </div>

          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1">Your Relationship to Property</label>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'viewed_via_app', label: 'Viewed via App' },
                { id: 'lives_here', label: 'Lives Here' },
                { id: 'knows_area', label: 'Knows Area' },
              ].map((lbl) => (
                <button
                  key={lbl.id}
                  type="button"
                  disabled={hasBooked && lbl.id !== 'viewed_via_app'}
                  onClick={() => setReviewLabel(lbl.id as ReviewLabel)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                    reviewLabel === lbl.id
                      ? 'bg-brand-700 text-white border-transparent'
                      : 'bg-surface text-ink-700 border-line hover:border-brand-500'
                  }`}
                >
                  {lbl.label} {hasBooked && lbl.id === 'viewed_via_app' ? '(Verified)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-ink-900 block">Rate Key Criteria</label>
            {(['power', 'water', 'road', 'flooding', 'noise', 'security'] as const).map((crit) => (
              <RatingChips
                key={crit}
                label={crit.toUpperCase()}
                value={reviewRatings[crit]}
                onChange={(level) => setReviewRatings({ ...reviewRatings, [crit]: level })}
              />
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1">Detailed Feedback (max 400 chars)</label>
            <textarea
              maxLength={400}
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How is light, water, road, compound management?"
              className="w-full text-xs p-3 rounded-xl border border-line bg-surface text-ink-900 focus:outline-none focus:border-brand-600"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Publish Review
          </Button>
        </form>
      </BottomSheet>

      {/* Report Modal */}
      <Modal
        isOpen={Boolean(reportModalData)}
        onClose={() => setReportModalData(null)}
        title="Report Content to HouseMe"
      >
        <div className="space-y-3">
          <p className="text-xs text-ink-700">
            Help us protect the community. Select the primary reason for reporting this content:
          </p>
          <div className="space-y-2">
            {[
              'Incorrect pricing or fee discrepancy',
              'House does not match photos or video',
              'Suspicious agent behavior or offline payment request',
              'Offensive language or unverified claims',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 text-xs font-medium text-ink-900 cursor-pointer p-2 rounded-lg hover:bg-brand-50"
              >
                <input
                  type="radio"
                  name="reportReason"
                  checked={reportReason === reason}
                  onChange={() => setReportReason(reason)}
                  className="accent-brand-600"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <Button variant="danger" className="w-full" onClick={handleSendReport}>
            Submit Report
          </Button>
        </div>
      </Modal>
    </div>
  );
};
