import React from 'react';

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 lg:gap-6 items-stretch ${className}`}
    {...props}
  >
    {children}
  </div>
);
