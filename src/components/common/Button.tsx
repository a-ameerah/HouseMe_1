import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warn' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-button select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'min-h-[40px] px-3 py-2 text-sm gap-1.5',
    md: 'min-h-[48px] px-5 py-3 text-base gap-2',
    lg: 'min-h-[56px] px-6 py-4 text-base font-bold gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-brand-700 hover:bg-brand-600 text-white focus-visible:ring-brand-700 disabled:bg-ink-500/40 disabled:text-white',
    secondary:
      'bg-surface hover:bg-brand-50 text-ink-900 border border-line focus-visible:ring-brand-700 ',
    ghost:
      'bg-transparent hover:bg-brand-50 text-ink-700 hover:text-ink-900 focus-visible:ring-brand-700 ',
    danger:
      'bg-danger text-white hover:opacity-90 focus-visible:ring-danger disabled:opacity-50',
    warn:
      'bg-amber-50 text-amber-900 border border-warn/30 hover:bg-amber-50/80 focus-visible:ring-warn',
    amber:
      'bg-amber-50 text-amber-900 border border-amber-500/30 hover:bg-amber-50 focus-visible:ring-warn',
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'secondary',
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-brand-700 text-white hover:bg-brand-600',
    secondary: 'bg-surface text-ink-700 hover:text-ink-900 border border-line hover:bg-brand-50',
    ghost: 'bg-transparent text-ink-700 hover:bg-brand-50 hover:text-ink-900',
    dark: 'bg-ink-900/80 hover:bg-ink-900 text-white',
    glass: 'bg-black/40 text-white backdrop-blur-md border border-white/10',
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`min-h-[48px] min-w-[48px] rounded-full inline-flex items-center justify-center transition-colors  ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
