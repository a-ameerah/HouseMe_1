import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconSize?: number;
  titleClassName?: string;
  descriptionClassName?: string;
  paddingClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  iconSize = 64,
  titleClassName = 'text-lg font-bold text-ink-900',
  descriptionClassName = 'text-sm text-ink-700',
  paddingClassName = 'p-8',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${paddingClassName} text-center w-full mx-auto my-0 ${className}`}
    >
      <div
        className="rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 shadow-sm"
        style={{ width: iconSize, height: iconSize }}
      >
        {icon}
      </div>
      <h3 className={`${titleClassName} mb-2`}>{title}</h3>
      <p className={`${descriptionClassName} mb-6 leading-relaxed`}>{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
