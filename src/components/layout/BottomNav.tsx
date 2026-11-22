import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Search, Bookmark, Calendar, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const BottomNav: React.FC = () => {
  const { savedListingIds, bookings } = useStore();

  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'paid_held' || b.status === 'completed_awaiting'
  ).length;

  const navItems = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/search', label: 'Search', icon: Search },
    {
      to: '/saved',
      label: 'Saved',
      icon: Bookmark,
      badge: savedListingIds.length > 0 ? savedListingIds.length : undefined,
    },
    {
      to: '/viewings',
      label: 'Viewings',
      icon: Calendar,
      badge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
    },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line min-h-[64px] flex items-center justify-around px-2 sm:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-16 py-2 select-none transition-colors duration-200 ${
                isActive ? 'text-brand-700' : 'text-ink-700 hover:text-ink-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative mb-0.5">
                  <div
                    className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-brand-100' : ''
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${isActive ? 'stroke-[2.5] text-brand-700' : 'stroke-2'}`}
                    />
                  </div>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[12px] font-semibold ${
                    isActive ? 'text-brand-700' : 'text-ink-700'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
