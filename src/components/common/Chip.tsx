import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[48px] px-4 py-2 text-sm font-semibold rounded-full select-none inline-flex items-center gap-2 border transition-colors ${
        active
          ? 'bg-brand-700 text-white border-brand-700'
          : 'bg-surface text-ink-700 hover:text-ink-900 border-line hover:border-brand-600'
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};
