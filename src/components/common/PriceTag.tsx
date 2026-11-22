import React from 'react';
import { formatNaira } from '../../lib';

interface PriceTagProps {
  yearlyRent: number;
  moveInCost?: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
  showMoveInChip?: boolean;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  yearlyRent,
  moveInCost,
  period = '/yr',
  size = 'md',
  showMoveInChip = true,
  className = '',
}) => {
  const fontSizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-black tracking-tight',
    lg: 'text-3xl font-black tracking-tight',
  }[size];

  return (
    <div className={`flex items-baseline flex-wrap gap-x-2.5 gap-y-1.5 ${className}`}>
      <div className="flex items-baseline text-ink-900">
        <span className={fontSizes}>{formatNaira(yearlyRent)}</span>
        <span className="text-sm text-ink-700 font-medium ml-1">{period}</span>
      </div>

      {showMoveInChip && moveInCost !== undefined && (
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
          <span>Move-in: {formatNaira(moveInCost)}</span>
        </div>
      )}
    </div>
  );
};
