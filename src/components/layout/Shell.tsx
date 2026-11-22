import React, { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  WifiOff,
  ShieldCheck,
  UserCheck,
  Briefcase,
  RotateCcw,
  ChevronUp,
  Download,
  Upload,
  CheckCircle,
  Search,
  Bookmark,
  Calendar,
  User,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { BottomNav } from './BottomNav';
import { PageContainer } from './PageContainer';
import { ToastContainer } from '../common/ToastContainer';
import { useStore } from '../../store/useStore';
import { Role } from '../../data/types';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const {
    role,
    setRole,
    isOffline,
    resetAllData,
    currentUser,
    exportDemoState,
    importDemoState,
    demoApproveAgent,
    agents,
    addToast,
  } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [importStr, setImportStr] = useState('');

  // Wide layouts: Agent Dashboard and Admin are desktop-first, no hunter nav
  const isAgentDash =
    location.pathname.startsWith('/agent-dashboard');
  const isAdmin =
    location.pathname.startsWith('/admin');
  const isWide = isAgentDash || isAdmin;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'agent') {
      navigate('/agent-dashboard');
    } else if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    setDemoOpen(false);
  };

  const handleExport = () => {
    const str = exportDemoState();
    navigator.clipboard.writeText(str).then(() => {
      addToast('Demo state copied to clipboard.', 'success');
    }).catch(() => {
      addToast('Export: ' + str.slice(0, 60) + '...', 'info');
    });
  };

  const handleImport = () => {
    if (!importStr.trim()) return;
    const ok = importDemoState(importStr.trim());
    if (ok) {
      addToast('Demo state imported. Reloading...', 'success');
      setTimeout(() => window.location.reload(), 800);
    } else {
      addToast('Invalid import string. Please try again.', 'error');
    }
  };

  const pendingAgent = agents.find(
    (a) => a.status === 'in_review' || a.status === 'submitted' || a.status === 'needs_info'
  );

  // Hunter top bar items (desktop/tablet)
  const hunterNavLinks = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/viewings', label: 'Viewings', icon: Calendar },
  ];

  const agentNavLinks = [
    { to: '/agent-dashboard', label: 'Dashboard', icon: Briefcase },
  ];

  const adminNavLinks = [
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  const desktopLinks =
    role === 'agent'
      ? agentNavLinks
      : role === 'admin'
        ? adminNavLinks
        : hunterNavLinks;

  return (
    <div className="min-h-screen bg-bg text-ink-900 font-sans antialiased">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="w-full bg-ink-900 text-white px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 z-50">
          <WifiOff className="w-4 h-4 text-amber-900 shrink-0" />
          <span>You are offline. Showing saved houses and cached records.</span>
        </div>
      )}

      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white border-b border-line">
        <div className="sm:hidden h-full">
          <PageContainer className="h-full !py-0 !px-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(role === 'agent' ? '/agent-dashboard' : role === 'admin' ? '/admin' : '/')}
              className="flex items-center gap-2 font-black text-lg text-brand-700"
            >
              <span className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white text-sm">H</span>
              <span>HouseMe</span>
            </button>
            <NavLink to="/profile" className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700">
              <User className="w-4 h-4" />
            </NavLink>
          </PageContainer>
        </div>
        <div className="hidden sm:block h-full">
          <div className="relative h-full w-full px-6 lg:px-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(role === 'agent' ? '/agent-dashboard' : role === 'admin' ? '/admin' : '/')}
              className="flex items-center gap-2 font-black text-xl text-brand-700 shrink-0"
            >
              <span className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white text-sm">H</span>
              <span>HouseMe</span>
            </button>
            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full flex items-center gap-1">
              {desktopLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:text-ink-900 hover:bg-brand-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:text-ink-900 hover:bg-brand-50'
                }`
              }
            >
              <User className="w-4 h-4" />
              <span>{currentUser.displayName?.split(' ')[0] || 'Profile'}</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={
          isWide
            ? 'w-full min-h-screen'
            : 'w-full min-h-screen pb-16 sm:pb-0'
        }
      >
        {location.pathname === '/' ? (
          children
        ) : (
          <PageContainer className="!py-4 sm:!py-6 lg:!py-8 !space-y-0">
            {children}
          </PageContainer>
        )}
      </main>

      {/* Mobile Bottom Nav (Hunter only, hidden sm+) */}
      {!isWide && <BottomNav />}

      {/* Demo Tools Drawer: fixed bottom-right corner */}
      <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 flex flex-col items-end gap-2">
        {/* Expanded drawer */}
        {demoOpen && (
          <div className="bg-ink-900 text-white rounded-2xl shadow-xl border border-white/10 p-5 w-72 text-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand-200 mb-4">
              Demo Tools
            </p>

            {/* Role switcher */}
            <div className="mb-4">
              <p className="text-xs text-ink-700 font-semibold mb-2">Switch role</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('hunter')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'hunter'
                      ? 'bg-brand-700 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Hunter
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('agent')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'agent'
                      ? 'bg-brand-700 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'admin'
                      ? 'bg-brand-700 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>
            </div>

            {/* Approve pending agent */}
            {pendingAgent && (
              <div className="mb-4 p-3 rounded-xl bg-white/10 border border-white/10">
                <p className="text-xs text-ink-700 font-semibold mb-1.5">Pending agent</p>
                <p className="text-sm font-bold text-white mb-2">{pendingAgent.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    demoApproveAgent(pendingAgent.userId);
                    addToast(`${pendingAgent.name} approved as agent.`, 'success');
                  }}
                  className="w-full py-2 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve agent
                </button>
              </div>
            )}

            {/* Export */}
            <div className="mb-3">
              <button
                type="button"
                onClick={handleExport}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export demo state
              </button>
            </div>

            {/* Import */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Paste export string..."
                value={importStr}
                onChange={(e) => setImportStr(e.target.value)}
                className="w-full bg-white/10 border border-white/10 text-white placeholder-ink-400 rounded-lg px-3 py-2 text-xs font-medium mb-2 outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleImport}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Import demo state
              </button>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={() => {
                resetAllData();
                addToast('All data reset to seed.', 'info');
              }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-ink-700 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all seed data
            </button>
          </div>
        )}

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setDemoOpen((v) => !v)}
          title="Demo Tools"
          className="w-12 h-12 rounded-full bg-ink-900 text-white shadow-xl flex items-center justify-center hover:bg-ink-700 transition-colors border border-white/10"
        >
          {demoOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
