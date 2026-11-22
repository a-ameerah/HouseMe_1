import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Zap, Droplet, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SVGScene } from '../components/SVGScenes';
import { Card } from '../components/common/Card';
import { IconButton } from '../components/common/Button';
import { ReviewCard } from '../components/common/ReviewCard';
import { useStore } from '../store/useStore';
import { reviewSummary, formatNaira } from '../lib';

export const NeighbourhoodScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { neighbourhoods, listings, reviews } = useStore();

  const area = neighbourhoods.find((n) => n.id === id) || neighbourhoods[0];
  const areaListings = listings.filter((l) => l.propertyId.includes(area.id) || l.title.toLowerCase().includes(area.name.toLowerCase()));
  const areaReviews = reviews.filter((r) => r.targetType === 'area' && r.targetId === area.id);

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-3">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-ink-900" />}
            label="Back"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            Neighbourhood Guide
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-ink-900 leading-tight">{area.name}</h1>
            <span className="text-xs text-ink-700 font-semibold">{area.city}, Nigeria</span>
          </div>
        </div>

        <p className="text-xs text-ink-700 leading-relaxed mt-3">{area.summary}</p>
      </div>

      {/* Outdated Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-900 shrink-0" />
        <span>Info older than 12 months may be outdated. All metrics reflect recent tenant reports.</span>
      </div>

      <div className="px-0 py-0 space-y-4">
        {/* Core Infrastructure Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <Card padding="sm">
            <div className="flex items-center gap-1 text-[11px] font-bold text-brand-900 mb-1">
              <Zap className="w-3.5 h-3.5 text-brand-700" />
              <span>Power Supply</span>
            </div>
            <p className="text-xs font-bold text-ink-900">{area.powerAverage}</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-1 text-[11px] font-bold text-brand-900 mb-1">
              <Navigation className="w-3.5 h-3.5 text-brand-700" />
              <span>Road & Flood</span>
            </div>
            <p className="text-xs font-bold text-ink-900">{area.floodRisk}</p>
          </Card>
        </div>

        {/* Available Houses in this Area */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink-900">Houses in {area.name} ({areaListings.length})</h2>
          </div>

          <div className="space-y-2.5">
            {areaListings.map((h) => (
              <Card
                key={h.id}
                padding="none"
                interactive
                onClick={() => navigate(`/house/${h.id}`)}
              >
                <div className="flex h-24 overflow-hidden rounded-card">
                  <div className="w-28 bg-ink-900 shrink-0">
                    <SVGScene type="exterior" seed={h.id} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink-900 line-clamp-1">{h.title}</span>
                      <span className="text-[11px] text-ink-700 block line-clamp-1">{h.caption}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xs font-extrabold text-brand-900">{formatNaira(h.rentYearly)}/yr</span>
                      <span className="text-[10px] font-bold text-brand-700">View details</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Area Reviews */}
        <div>
          <h2 className="text-sm font-bold text-ink-900 mb-3">Resident Reviews for {area.name}</h2>
          <div className="space-y-3">
            {areaReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
