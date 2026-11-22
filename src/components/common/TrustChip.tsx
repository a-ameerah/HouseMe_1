import React, { useState } from 'react';
import { ShieldCheck, UserCheck, FileCheck, Users, HelpCircle, Eye } from 'lucide-react';
import { TrustSource } from '../../data/types';

interface TrustChipProps {
  source: TrustSource;
  showTooltip?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const TrustChip: React.FC<TrustChipProps> = ({
  source,
  showTooltip = true,
  className = '',
  size = 'md',
}) => {
  const [open, setOpen] = useState(false);

  const config: Record<
    TrustSource,
    {
      icon: React.ReactNode;
      explanation: string;
    }
  > = {
    'Verified uploader': {
      icon: <UserCheck className="w-4 h-4 text-brand-700" />,
      explanation: 'Identity and selfie matched against government NIN or passport record.',
    },
    'Authority checked': {
      icon: <FileCheck className="w-4 h-4 text-brand-700" />,
      explanation: 'Landlord power of attorney or title document verified by HouseMe legal review.',
    },
    'Agent-provided': {
      icon: <ShieldCheck className="w-4 h-4 text-ink-700" />,
      explanation: 'Supplied directly by the listing agent. Not yet independently resident audited.',
    },
    'Resident-reported': {
      icon: <Users className="w-4 h-4 text-brand-700" />,
      explanation: 'Reported directly by confirmed residents who live or lived in this property.',
    },
    'Multiple reports': {
      icon: <Users className="w-4 h-4 text-brand-700" />,
      explanation: 'Consistently corroborated by 3 or more independent resident reviews.',
    },
    'Platform-checked': {
      icon: <Eye className="w-4 h-4 text-brand-700" />,
      explanation: 'Physically inspected on-site by a HouseMe field officer.',
    },
  };

  const item = config[source] || config['Agent-provided'];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-brand-100 text-ink-900 text-sm font-medium transition-colors hover:border-brand-700 ${className}`}
      >
        <span>{item.icon}</span>
        <span className="whitespace-nowrap">{source}</span>
        {showTooltip && <HelpCircle className="w-3.5 h-3.5 text-ink-700" />}
      </button>

      {open && showTooltip && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-0 mb-2 w-64 rounded-card bg-ink-900 p-3 text-sm text-white shadow-modal pointer-events-none"
        >
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <span>{source}</span>
          </div>
          <p className="text-sm text-white leading-normal">{item.explanation}</p>
        </div>
      )}
    </div>
  );
};
