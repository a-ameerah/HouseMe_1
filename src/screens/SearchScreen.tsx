import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  SlidersHorizontal,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { BottomSheet } from '../components/common/BottomSheet';
import { TrustChip } from '../components/common/TrustChip';
import { useStore } from '../store/useStore';
import { formatNaira, accuracyScore } from '../lib';
import { Listing } from '../data/types';
import { ResponsiveGrid } from '../components/layout/ResponsiveGrid';
import { EmptyState } from '../components/common/EmptyState';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { listings, agents, recentlyViewedIds, currentUser } = useStore();

  const [query, setQuery] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Filters state
  const [budgetMax, setBudgetMax] = useState(3000000);
  const [selectedBeds, setSelectedBeds] = useState<number | 'all'>('all');
  const [filterSteadyPower, setFilterSteadyPower] = useState(false);
  const [filterTarredRoad, setFilterTarredRoad] = useState(false);
  const [filterNoFlooding, setFilterNoFlooding] = useState(false);
  const [filterCompleteOnly, setFilterCompleteOnly] = useState(false); // completeness > 80%
  const [filterVerifiedAgent, setFilterVerifiedAgent] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'latest' | 'price_asc' | 'accuracy'>('match');

  // Recently viewed listings
  const recentListings = listings.filter((l) => recentlyViewedIds.includes(l.id));

  // Apply search & filtering
  const filtered = listings.filter((l) => {
    // Keyword match
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchText = (l.title + ' ' + l.caption + ' ' + l.description).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Budget
    if (l.rentYearly > budgetMax) return false;

    // Bedrooms
    if (selectedBeds !== 'all' && l.bedrooms !== selectedBeds) return false;

    // Dealbreaker filters
    if (filterSteadyPower) {
      const elec = l.features.electricity;
      if (elec.status !== 'provided' || (!String(elec.value).includes('18') && !String(elec.value).includes('20') && !String(elec.value).includes('24'))) {
        return false;
      }
    }

    if (filterTarredRoad) {
      const road = l.features.roadCondition;
      if (road.status !== 'provided') return false;
    }

    if (filterNoFlooding) {
      const flood = l.features.floodingHistory;
      if (flood.status !== 'provided' || String(flood.value).toLowerCase().includes('yes')) return false;
    }

    if (filterCompleteOnly && l.completenessScore < 80) return false;

    if (filterVerifiedAgent) {
      const ag = agents.find((a) => a.userId === l.agentId);
      if (!ag || ag.status !== 'approved') return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'price_asc') return a.rentYearly - b.rentYearly;
    if (sortBy === 'latest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === 'accuracy') {
      const agA = agents.find((ag) => ag.userId === a.agentId)?.matchedViewings || 0;
      const agB = agents.find((ag) => ag.userId === b.agentId)?.matchedViewings || 0;
      return agB - agA;
    }
    return b.completenessScore - a.completenessScore;
  });

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-line px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-brand-50 border border-brand-100 rounded-2xl px-3 py-2 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20">
            <SearchIcon className="w-4 h-4 text-ink-700 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Yaba, Surulere, Ikeja, Lekki..."
              className="w-full text-xs font-semibold bg-transparent focus:outline-none text-ink-900 placeholder:text-ink-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="p-2.5 rounded-2xl bg-brand-700 text-white hover:bg-brand-600 shadow-sm transition-transform active:scale-95"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Area Shortcuts */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pt-2.5">
          {['All Lagos', 'Yaba', 'Surulere', 'Ikeja', 'Lekki Phase 1'].map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setQuery(area === 'All Lagos' ? '' : area)}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-surface border border-line text-ink-700 hover:text-ink-900 hover:border-brand-500 whitespace-nowrap"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className="px-0 py-0 space-y-4">
        {/* Recently Viewed Strip */}
        {recentListings.length > 0 && !query && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Recently Viewed
              </span>
            </div>

            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
              {recentListings.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/house/${r.id}`)}
                  className="w-40 bg-surface rounded-card border border-line p-2 shrink-0 shadow-card cursor-pointer hover:shadow-float active:scale-95 transition-all"
                >
                  <div className="w-full h-20 bg-brand-50 rounded-lg overflow-hidden mb-1.5">
                    <HouseImage houseId={r.id} sceneType="exterior" alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-bold text-ink-900 truncate">{r.title}</div>
                  <div className="text-[10px] font-extrabold text-brand-900 mt-0.5">
                    {formatNaira(r.rentYearly)}/yr
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-ink-900">
            {filtered.length} verified {filtered.length === 1 ? 'house' : 'houses'} found
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-semibold bg-surface border border-line rounded-lg px-2 py-1 text-ink-900 focus:outline-none focus:border-brand-600"
          >
            <option value="match">Best match</option>
            <option value="latest">Latest updated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="accuracy">Agent accuracy</option>
          </select>
        </div>

        {/* Results List Cards */}
        <ResponsiveGrid>
          {filtered.length === 0 ? (
            <Card padding="lg" className="sm:col-span-2 lg:col-span-3 2xl:col-span-4">
              <EmptyState
                icon={<SearchIcon className="w-10 h-10" />}
                title="No houses match"
                description="Try widening your budget or clearing a filter to see more verified houses."
                actionLabel="Clear filters"
                onAction={() => {
                  setQuery('');
                  setBudgetMax(3000000);
                  setSelectedBeds('all');
                  setFilterSteadyPower(false);
                  setFilterTarredRoad(false);
                  setFilterNoFlooding(false);
                  setFilterCompleteOnly(false);
                  setFilterVerifiedAgent(false);
                }}
                iconSize={40}
                paddingClassName="py-8"
              />
            </Card>
          ) : filtered.map((item) => {
            const agent = agents.find((a) => a.userId === item.agentId);
            const acc = agent ? accuracyScore(agent) : null;

            return (
              <Card
                key={item.id}
                padding="none"
                className="h-full"
                interactive
                onClick={() => navigate(`/house/${item.id}`)}
              >
                <div className="flex flex-col h-full">
                  {/* Image Scene */}
                  <div className="relative w-full aspect-[4/3] bg-brand-50 overflow-hidden rounded-t-card shrink-0">
                    <HouseImage
                      houseId={item.id}
                      sceneType="exterior"
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <TrustChip source="Verified uploader" size="sm" />
                      {item.isBoosted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500 text-ink-900">
                          Sponsored
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-extrabold">
                      {formatNaira(item.rentYearly)}/year
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2 flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-ink-900 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-ink-700 line-clamp-1 mt-0.5">{item.caption}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-line text-xs">
                      <div className="flex items-center gap-1.5 text-brand-900 font-bold">
                        <span>{item.bedrooms === 0 ? 'Studio' : `${item.bedrooms} Bed`}</span>
                        <span>•</span>
                        <span>{item.completenessScore}% Complete</span>
                      </div>

                      {acc && (
                        <span className="text-[11px] font-semibold text-ink-700">
                          Agent: <strong className="text-brand-700">{acc.label}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </ResponsiveGrid>
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filter Verified Houses"
      >
        <div className="space-y-4">
          {/* Budget */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-ink-700">Max Yearly Rent</span>
              <span className="text-brand-900 text-sm font-extrabold">{formatNaira(budgetMax)}</span>
            </div>
            <input
              type="range"
              min={400000}
              max={5000000}
              step={100000}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-xs font-bold text-ink-900 block mb-1.5">Bedrooms</label>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'Any' },
                { id: 0, label: 'Studio' },
                { id: 1, label: '1 Bed' },
                { id: 2, label: '2 Bed' },
                { id: 3, label: '3 Bed' },
              ].map((opt) => (
                <button
                  key={String(opt.id)}
                  type="button"
                  onClick={() => setSelectedBeds(opt.id as any)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedBeds === opt.id
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-surface text-ink-700 border-line'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox criteria */}
          <div className="space-y-2 pt-2 border-t border-line">
            {[
              {
                label: 'Steady Power (18+ hours daily)',
                checked: filterSteadyPower,
                set: setFilterSteadyPower,
              },
              {
                label: 'Tarred or Paved Road',
                checked: filterTarredRoad,
                set: setFilterTarredRoad,
              },
              {
                label: 'No Flooding Reports',
                checked: filterNoFlooding,
                set: setFilterNoFlooding,
              },
              {
                label: 'Complete Listings Only (>80% complete)',
                checked: filterCompleteOnly,
                set: setFilterCompleteOnly,
              },
              {
                label: 'Verified Agent Only',
                checked: filterVerifiedAgent,
                set: setFilterVerifiedAgent,
              },
            ].map((f, i) => (
              <label
                key={i}
                className="flex items-center justify-between text-xs font-semibold text-ink-900 cursor-pointer p-2 rounded-xl hover:bg-brand-50"
              >
                <span>{f.label}</span>
                <input
                  type="checkbox"
                  checked={f.checked}
                  onChange={(e) => f.set(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded"
                />
              </label>
            ))}
          </div>

          <Button
            variant="primary"
            className="w-full mt-2"
            onClick={() => setFilterSheetOpen(false)}
          >
            Apply Filters ({filtered.length} matches)
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
