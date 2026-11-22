import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => (
  <header className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-left ${className}`}>
    <div className="min-w-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">{title}</h1>
      {subtitle && <div className="mt-1 text-sm text-ink-700">{subtitle}</div>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
  </header>
);
