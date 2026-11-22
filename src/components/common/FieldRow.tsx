import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TrustChip } from './TrustChip';
import { FeatureItem } from '../../data/types';

interface FieldRowProps {
  label: string;
  item?: FeatureItem<any>;
  fallbackValue?: string | number | boolean;
  onAskAgent?: () => void;
  className?: string;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  label,
  item,
  fallbackValue,
  onAskAgent,
  className = '',
}) => {
  const isProvided =
    item && item.status === 'provided'
      ? true
      : fallbackValue !== undefined && fallbackValue !== null;

  let displayValue: string = '';

  if (item && item.status === 'provided') {
    if (typeof item.value === 'boolean') {
      displayValue = item.value ? 'Yes' : 'No';
    } else {
      displayValue = String(item.value);
    }
  } else if (fallbackValue !== undefined && fallbackValue !== null) {
    if (typeof fallbackValue === 'boolean') {
      displayValue = fallbackValue ? 'Yes' : 'No';
    } else {
      displayValue = String(fallbackValue);
    }
  }

  return (
    <div
      className={`flex items-start justify-between py-3 border-b border-line last:border-b-0 gap-3 ${className}`}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        {isProvided ? (
          <span className="text-base font-semibold text-ink-900 mt-0.5 break-words">
            {displayValue}
          </span>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-[#FFE0A3]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Not provided</span>
            </span>
            {onAskAgent && (
              <button
                type="button"
                onClick={onAskAgent}
                className="text-xs font-semibold underline text-brand-700 hover:text-brand-700"
              >
                Ask agent
              </button>
            )}
          </div>
        )}
      </div>

      {isProvided && item?.source && (
        <div className="shrink-0 mt-0.5">
          <TrustChip source={item.source} size="sm" />
        </div>
      )}
    </div>
  );
};
