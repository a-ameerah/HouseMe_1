import React, { useState } from 'react';
import { Check, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { matchLine } from '../../lib';
import { Dealbreaker, Listing } from '../../data/types';

interface MatchBarProps {
  listing: Listing;
  dealbreakers: Dealbreaker[];
  className?: string;
}

export const MatchBar: React.FC<MatchBarProps> = ({
  listing,
  dealbreakers,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const matchResult = matchLine(listing, dealbreakers);

  if (!dealbreakers || dealbreakers.length === 0) {
    return null;
  }

  const { total, met, unmet, unknown, summary, details } = matchResult;

  return (
    <div className={`rounded-xl border border-line bg-surface p-4 shadow-sm ${className}`}>
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left select-none min-h-[44px]"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink-900">Your Dealbreakers</span>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
              {summary}
            </span>
          </div>
          <p className="text-xs text-ink-700 mt-0.5">
            Tap to view breakdown against your requirements
          </p>
        </div>
        <div className="p-1.5 text-ink-700 hover:text-ink-900">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Segmented Visual Bar */}
      <div className="flex items-center gap-1 w-full h-2 rounded-full overflow-hidden my-3 bg-line">
        {details.map((d, i) => {
          let color = 'bg-brand-600';
          if (d.status === 'unmet') color = 'bg-danger';
          if (d.status === 'unknown') color = 'bg-warn';

          return (
            <div
              key={i}
              className={`h-full flex-1 first:rounded-l-full last:rounded-r-full ${color}`}
            />
          );
        })}
      </div>

      {/* Expanded Breakdown */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-line space-y-2.5">
          {details.map((d, i) => {
            return (
              <div
                key={i}
                className="flex items-center justify-between py-1 text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {d.status === 'met' && (
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {d.status === 'unmet' && (
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-900 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {d.status === 'unknown' && (
                    <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                  <span className="font-semibold text-ink-900">{d.label}</span>
                </div>

                <div className="text-right text-xs truncate max-w-[180px]">
                  {d.status === 'unknown' ? (
                    <span className="text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded">Not provided</span>
                  ) : (
                    <span className="text-ink-700 font-medium">{d.detail}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
