import React from 'react';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import { RatingLevel } from '../../data/types';

interface RatingChipsProps {
  value: RatingLevel;
  onChange: (level: RatingLevel) => void;
  label?: string;
  className?: string;
}

export const RatingChips: React.FC<RatingChipsProps> = ({
  value,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-line last:border-b-0 gap-2 ${className}`}>
      {label && <span className="text-sm font-semibold text-ink-900">{label}</span>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(value === 'good' ? 'skipped' : 'good')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[48px] ${
            value === 'good'
              ? 'bg-brand-700 text-white'
              : 'bg-surface border border-line text-ink-700 hover:bg-brand-50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Good</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(value === 'okay' ? 'skipped' : 'okay')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[48px] ${
            value === 'okay'
              ? 'bg-[#FFF4DE] text-amber-900 border border-[#FFE0A3] font-bold'
              : 'bg-surface border border-line text-ink-700 hover:bg-brand-50'
          }`}
        >
          <Minus className="w-4 h-4" />
          <span>Okay</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(value === 'bad' ? 'skipped' : 'bad')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[48px] ${
            value === 'bad'
              ? 'bg-[#FDECEA] text-red-900 border border-[#F8B4B4] font-bold'
              : 'bg-surface border border-line text-ink-700 hover:bg-brand-50'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>Bad</span>
        </button>
      </div>
    </div>
  );
};
