import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  variant?: 'brand' | 'surface' | 'amber';
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  value,
  sublabel,
  icon,
  variant = 'surface',
}) => {
  const variantStyles = {
    brand: 'bg-brand-50 border-brand-100 text-brand-900',
    surface: 'bg-surface border-line text-ink-900',
    amber: 'bg-amber-500/10 border-amber-500/20 text-ink-900',
  }[variant];

  return (
    <div className={`p-3 rounded-2xl border shadow-card flex flex-col justify-between ${variantStyles}`}>
      <div className="flex items-center justify-between text-ink-700 text-[11px] font-medium mb-1">
        <span>{label}</span>
        {icon && <span className="text-brand-700">{icon}</span>}
      </div>
      <div className="text-base font-extrabold text-ink-900 tracking-tight">{value}</div>
      {sublabel && <div className="text-[10px] text-ink-700 mt-0.5">{sublabel}</div>}
    </div>
  );
};
