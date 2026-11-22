import React from 'react';

interface Option {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center p-1 bg-brand-50 border border-line rounded-lg gap-1 select-none min-h-[48px] ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors min-h-[40px] ${
              isSelected
                ? 'bg-surface text-ink-900 shadow-sm border border-line/60'
                : 'text-ink-700 hover:text-ink-900'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
