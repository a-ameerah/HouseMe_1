import React from 'react';

interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  sticky?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  sticky = false,
}) => {
  return (
    <div
      className={`no-scrollbar flex items-center gap-6 overflow-x-auto px-4 bg-surface border-b border-line ${
        sticky ? 'sticky top-0 z-30' : ''
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 text-[15px] font-semibold whitespace-nowrap transition-colors select-none min-h-[48px] border-b-2 -mb-px ${
              isActive
                ? 'border-brand-700 text-brand-700 font-bold'
                : 'border-transparent text-ink-700 hover:text-ink-900 hover:border-line'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-brand-100 text-brand-700' : 'bg-line text-ink-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
