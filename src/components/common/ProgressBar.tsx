import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: 'green' | 'amber' | 'blue';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = false,
  color = 'green',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colorClasses = {
    green: 'bg-brand-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1 text-ink-700">
          {label && <span>{label}</span>}
          {showPercent && <span>{clamped}%</span>}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-line overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
