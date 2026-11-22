import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Share2,
  MessageCircle,
  PhoneCall,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Copy,
  MessageSquare,
  Home,
  Wifi,
  MapPin,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { TrustChip } from '../components/common/TrustChip';
import { PriceTag } from '../components/common/PriceTag';
import { BottomSheet } from '../components/common/BottomSheet';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { LoginModal } from '../components/auth/LoginModal';
import { useStore } from '../store/useStore';
import { feedRank, freshness, formatNaira } from '../lib';
import { Listing } from '../data/types';

export const DiscoverScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    listings,
    agents,
    currentUser,
    savedListingIds,
    recentlyViewedIds,
    toggleSave,
    dataSaver,
    toggleDataSaver,
    recordView,
    addToast,
    reviews,
  } = useStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!dataSaver);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('all');
  const [shareListing, setShareListing] = useState<Listing | null>(null);
  const [whyModalListing, setWhyModalListing] = useState<{ listing: Listing; reasons: string[] } | null>(null);
  const [loginAction, setLoginAction] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Map agents accuracy for ranking
  const agentAccuracyMap: Record<string, number> = {};
  agents.forEach((a) => {
    if (a.completedViewings > 0) {
      agentAccuracyMap[a.userId] = Math.round((a.matchedViewings / a.completedViewings) * 100);
    }
  });

  // Apply feedRank pure function
  const rankedItems = feedRank(
    listings,
    currentUser,
    savedListingIds,
    recentlyViewedIds,
    agentAccuracyMap
  );

  // Filter listings based on top quick filter chips
  const filteredListings = rankedItems.filter(({ listing }) => {
    if (selectedQuickFilter === 'under_1m') return listing.rentYearly <= 1000000;
    if (selectedQuickFilter === '1_bed') return listing.bedrooms === 1;
    if (selectedQuickFilter === '2_bed') return listing.bedrooms === 2;
    if (selectedQuickFilter === 'steady_power') {
      const elec = listing.features.electricity;
      return elec.status === 'provided' && (String(elec.value).includes('18') || String(elec.value).includes('20') || String(elec.value).includes('24'));
    }
    return true;
  });

  const currentItem = filteredListings[activeIndex];
  const currentListing = currentItem?.listing;

  // Record view on current active listing
  useEffect(() => {
    if (currentListing) {
      recordView(currentListing.id);
      setActiveSceneIdx(0);
    }
  }, [currentListing?.id]);

  // Simulated video scene progression: cycles through scenes every 3.5 seconds when playing
  useEffect(() => {
    if (!isPlaying || !currentListing || dataSaver) return;

    const scenesCount = currentListing.media?.scenes?.length || 4;
    const interval = setInterval(() => {
      setActiveSceneIdx((prev) => (prev + 1) % scenesCount);
    }, 3600);

    return () => clearInterval(interval);
  }, [isPlaying, currentListing?.id, dataSaver]);

  // Listen to scroll snap changes
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const itemHeight = target.clientHeight;
    const newIndex = Math.round(target.scrollTop / itemHeight);
    if (newIndex !== activeIndex && newIndex < filteredListings.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleShareWhatsApp = (l: Listing) => {
    const url = window.location.origin + '/#/house/' + l.id;
    const text = encodeURIComponent(
      `Check out this verified rental on HouseMe: ${l.title} in Lagos (${formatNaira(l.rentYearly)}/yr). What do you think? ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    addToast('Opening WhatsApp to share', 'success');
    setShareListing(null);
  };

  const handleCopyLink = (l: Listing) => {
    const url = window.location.origin + '/#/house/' + l.id;
    navigator.clipboard?.writeText(url);
    addToast('House link copied to clipboard!', 'success');
    setShareListing(null);
  };

  const currentAgent = agents.find((a) => a.userId === currentListing?.agentId);
  const listingReviews = reviews.filter((r) => r.targetId === currentListing?.id && r.status !== 'hidden');

  return (
    <div className="relative w-full h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] bg-ink-900 flex flex-col overflow-hidden select-none">
      {/* Top Bar with HouseMe Logo, Filter Chips, Data-Saver Toggle */}
      <header className="absolute top-0 left-0 right-0 z-30 flex flex-col pt-3 pb-2 px-3 bg-gradient-to-b from-ink-900/90 via-ink-900/50 to-transparent">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm">
              <Home className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">HouseMe</span>
          </div>

          {/* Data Saver Mode Pill */}
          <button
            type="button"
            onClick={toggleDataSaver}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all ${
              dataSaver
                ? 'bg-amber-500 text-ink-900 shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>{dataSaver ? 'Data Saver: ON' : 'Data Saver'}</span>
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'under_1m', label: 'Under ₦1m' },
            { id: '1_bed', label: '1 Bed' },
            { id: '2_bed', label: '2 Bed' },
            { id: 'steady_power', label: 'Has Steady Power' },
          ].map((chip) => {
            const isSel = selectedQuickFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setSelectedQuickFilter(chip.id);
                  setActiveIndex(0);
                  containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-brand-500 text-ink-900 font-bold shadow-sm'
                    : 'bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Vertical Snap-Scroll Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar relative"
      >
        {filteredListings.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-ink-900">
            <Sparkles className="w-12 h-12 text-brand-700 mb-3" />
            <h3 className="text-lg font-bold">You have seen all matches</h3>
            <p className="text-xs text-white mt-1 mb-5 max-w-xs leading-relaxed">
              No more listings matching your current filter. Try widening your budget or clearing filters.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedQuickFilter('all');
                containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Show All Houses
            </Button>
          </div>
        ) : (
          filteredListings.map(({ listing, reasons, isSponsored }, idx) => {
            const isActive = idx === activeIndex;
            const scenes = listing.media?.scenes || [
              { id: 's1', label: 'Front Exterior', type: 'exterior' },
              { id: 's2', label: 'Living Room', type: 'living' },
              { id: 's3', label: 'Kitchen', type: 'kitchen' },
              { id: 's4', label: 'Bedroom', type: 'bedroom' },
              { id: 's5', label: 'Road & Drainage', type: 'road' },
            ];

            const currentScene = scenes[isActive ? activeSceneIdx : 0] || scenes[0];
            const isSaved = savedListingIds.includes(listing.id);
            const fresh = freshness(listing);

            return (
              <div
                key={listing.id}
                className="w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden bg-ink-900"
              >
                {/* Simulated Ken Burns Video Scene Background */}
                <div
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <div
                    className={`w-full h-full`}
                  >
                    <HouseImage
                      houseId={listing.id}
                      sceneType={currentScene.type}
                      sceneIndex={isActive ? activeSceneIdx : 0}
                      alt={`${listing.title} - ${currentScene.label}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Gradient Scrim for readable text on any scene */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/30 to-black/20 pointer-events-none" />

                  {/* Pause / Play Indicator Center Overlay */}
                  {dataSaver && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-14 h-14 rounded-full bg-brand-700/90 text-white flex items-center justify-center shadow-float backdrop-blur-sm">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Thin Scene Progress Bar */}
                  {isActive && (
                    <div className="absolute top-24 left-3 right-3 flex gap-1 z-20">
                      {scenes.map((_, sIdx) => (
                        <div
                          key={sIdx}
                          className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
                        >
                          <div
                            className={`h-full bg-brand-500 transition-all duration-300 ${
                              sIdx < activeSceneIdx
                                ? 'w-full'
                                : sIdx === activeSceneIdx && isPlaying
                                ? 'w-full animate-pulse'
                                : 'w-0'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Scene Caption Overlay */}
                  <div className="absolute top-28 left-4 z-20 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span>{currentScene.label}</span>
                  </div>
                </div>

                {/* Right Action Rail (Exactly 4 Actions with Text Labels) */}
                <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-3 text-white">
                  {/* 1. Save */}
                  <button
                    type="button"
                    onClick={() => toggleSave(listing.id)}
                    className="flex flex-col items-center group active:scale-90 transition-transform"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-float backdrop-blur-md transition-colors ${
                        isSaved ? 'bg-brand-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                    </div>
                    <span className="text-[11px] font-bold mt-1 tracking-tight">
                      {isSaved ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  {/* 2. Share */}
                  <button
                    type="button"
                    onClick={() => setShareListing(listing)}
                    className="flex flex-col items-center group active:scale-90 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center shadow-float backdrop-blur-md text-white">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold mt-1 tracking-tight">Share</span>
                  </button>

                  {/* 3. Reviews with count */}
                  <button
                    type="button"
                    onClick={() => navigate(`/house/${listing.id}?tab=reviews`)}
                    className="flex flex-col items-center group active:scale-90 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center shadow-float backdrop-blur-md text-white relative">
                      <MessageCircle className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-ink-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                        {listingReviews.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold mt-1 tracking-tight">Reviews</span>
                  </button>

                  {/* 4. Contact */}
                  <button
                    type="button"
                    onClick={() => navigate(`/agent/${listing.agentId}?house=${listing.id}`)}
                    className="flex flex-col items-center group active:scale-90 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center shadow-float backdrop-blur-md text-white">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold mt-1 tracking-tight">Contact</span>
                  </button>
                </div>

                {/* Bottom-Left Information Overlay */}
                <div className="absolute left-4 right-20 bottom-20 z-20 text-white flex flex-col gap-1.5 pointer-events-none">
                  {/* Badges: Sponsored, Freshness */}
                  <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
                    {isSponsored && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500 text-ink-900 shadow-sm">
                        Sponsored
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white">
                      {fresh.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWhyModalListing({ listing, reasons })}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 hover:bg-black/60 text-white flex items-center gap-1 border border-white/10"
                    >
                      <Info className="w-2.5 h-2.5" />
                      <span>Why you see this</span>
                    </button>
                  </div>

                  {/* Price Tag & Bedrooms */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-white">
                      {formatNaira(listing.rentYearly)}
                    </span>
                    <span className="text-xs text-white font-semibold">/year</span>
                    <span className="text-xs font-bold text-white bg-brand-900/80 px-2 py-0.5 rounded-full border border-brand-500/30">
                      {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bed`}
                    </span>
                  </div>

                  {/* Title & Neighbourhood Location */}
                  <div
                    onClick={() => navigate(`/agent/${listing.agentId}?house=${listing.id}`)}
                    className="pointer-events-auto cursor-pointer group"
                  >
                    <h2 className="text-sm font-bold text-white group-hover:text-white transition-colors line-clamp-1">
                      {listing.title}
                    </h2>
                    <p className="text-xs text-white flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-brand-700 shrink-0" />
                      <span>{listing.caption}</span>
                    </p>
                  </div>

                  {/* Trust Chips Row */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5 pointer-events-auto">
                    <TrustChip source="Verified uploader" size="sm" />
                    <TrustChip source="Authority checked" size="sm" />
                  </div>
                </div>

                {/* Prominent "Full details" pill above bottom navigation */}
                <div className="absolute bottom-4 left-4 right-4 z-30">
                  <button
                    type="button"
                    onClick={() => navigate(`/house/${listing.id}`)}
                    className="w-full py-3 px-4 rounded-full bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs shadow-float backdrop-blur-md flex items-center justify-between transition-transform active:scale-98"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>View Full Property Record & Costs</span>
                    </span>
                    <div className="flex items-center gap-0.5 text-white font-semibold">
                      <span>Full details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Share Bottom Sheet */}
      <BottomSheet
        isOpen={Boolean(shareListing)}
        onClose={() => setShareListing(null)}
        title="Share this house"
      >
        {shareListing && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs">
              <span className="font-bold text-ink-900 block">{shareListing.title}</span>
              <span className="text-ink-700 font-semibold">
                {formatNaira(shareListing.rentYearly)}/year • {shareListing.caption}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <Button
                variant="primary"
                className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => handleShareWhatsApp(shareListing)}
              >
                Share on WhatsApp
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={<Copy className="w-4 h-4" />}
                onClick={() => handleCopyLink(shareListing)}
              >
                Copy Link
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-ink-900"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => handleShareWhatsApp(shareListing)}
              >
                Send to a friend to ask what they think
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* "Why you see this" Modal */}
      <Modal
        isOpen={Boolean(whyModalListing)}
        onClose={() => setWhyModalListing(null)}
        title="Why you are seeing this house"
      >
        {whyModalListing && (
          <div className="space-y-4">
            <p className="text-xs text-ink-700">
              HouseMe ranks houses using transparent match signals, not secret bidding wars.
            </p>

            <div className="space-y-2">
              {whyModalListing.reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900 font-semibold"
                >
                  <Check className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setWhyModalListing(null)}
            >
              Understood
            </Button>
          </div>
        )}
      </Modal>

      {/* Login modal trigger */}
      <LoginModal
        isOpen={Boolean(loginAction)}
        onClose={() => setLoginAction(null)}
      />
    </div>
  );
};
