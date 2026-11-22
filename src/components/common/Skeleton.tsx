import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'w-full h-4',
  rounded = 'md',
}) => {
  const roundedClass = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-card',
    full: 'rounded-full',
  }[rounded];

  return <div className={`skeleton-shimmer ${roundedClass} ${className}`} />;
};
