import React from 'react';
import { Lock, MapPin, Navigation } from 'lucide-react';

interface MapPlaceholderProps {
  neighbourhoodName: string;
  approximatePoint?: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
  landmarks?: string[];
  transportNotes?: string;
  className?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  neighbourhoodName,
  approximatePoint,
  landmarks = [],
  transportNotes,
  className = '',
}) => {
  return (
    <div className={`rounded-card overflow-hidden border border-line bg-surface shadow-card ${className}`}>
      {/* Stylized SVG Map */}
      <div className="relative w-full h-48 bg-[#E5F2EB] overflow-hidden">
        <svg
          viewBox="0 0 500 240"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid and street grid lines */}
          <g stroke="#CBDDD3" strokeWidth="2">
            <line x1="0" y1="40" x2="500" y2="40" />
            <line x1="0" y1="120" x2="500" y2="120" strokeWidth="4" stroke="#B8D3C3" />
            <line x1="0" y1="180" x2="500" y2="180" />
            <line x1="80" y1="0" x2="80" y2="240" />
            <line x1="220" y1="0" x2="220" y2="240" strokeWidth="4" stroke="#B8D3C3" />
            <line x1="380" y1="0" x2="380" y2="240" />
            {/* Diagonal artery */}
            <line x1="40" y1="240" x2="360" y2="0" strokeWidth="3" stroke="#CADFD2" />
          </g>

          {/* Green blocks (simulated estate grounds) */}
          <rect x="95" y="55" width="110" height="50" rx="4" fill="#D3EBDC" />
          <rect x="235" y="135" width="130" height="70" rx="4" fill="#D3EBDC" />
          <rect x="235" y="55" width="130" height="50" rx="4" fill="#DDF3E8" />

          {/* Approximate Area Circle (Pulsing Radius, Not exact pin) */}
          <circle cx="250" cy="120" r="55" fill="#14A66F" fillOpacity="0.2" stroke="#0B6B4B" strokeWidth="2" strokeDasharray="6,4" />
          <circle cx="250" cy="120" r="14" fill="#0B6B4B" fillOpacity="0.3" />
          <circle cx="250" cy="120" r="6" fill="#073B2A" />
        </svg>

        {/* Floating Privacy Glass Pill */}
        <div className="absolute top-3 left-3 right-3 bg-ink-900/85 backdrop-blur-md rounded-xl p-2.5 text-white shadow-float flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-500/20 text-white flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <p className="text-[11px] font-medium leading-tight">
            Exact address is shared after you book a viewing.
          </p>
        </div>

        {/* Radius badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-line text-[11px] font-semibold text-ink-900 shadow-sm flex items-center gap-1.5">
          <Navigation className="w-3 h-3 text-brand-700" />
          <span>Approximate area in {neighbourhoodName} (~300m circle)</span>
        </div>
      </div>

      {/* Landmarks & Transport Section */}
      <div className="p-4 space-y-3 bg-surface">
        {landmarks.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-700" />
              <span>Nearby Landmarks</span>
            </div>
            <ul className="text-xs text-ink-700 space-y-1 pl-5 list-disc">
              {landmarks.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        {transportNotes && (
          <div className="pt-2 border-t border-line text-xs">
            <span className="font-bold text-ink-900 block mb-0.5">Commute & Transport</span>
            <p className="text-ink-700 text-[11px] leading-relaxed">{transportNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
