import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Briefcase,
  Sliders,
  Wifi,
  DollarSign,
  Globe,
  Bell,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Toggle } from '../components/common/Toggle';
import { useStore } from '../store/useStore';
import { Role } from '../data/types';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    currentUser,
    dataSaver,
    toggleDataSaver,
    dataUsedKb,
    resetAllData,
    addToast,
  } = useStore();

  const [language, setLanguage] = useState<'en' | 'pcm' | 'yo'>('en');
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);

  const handleRoleSelect = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'agent') navigate('/agent-dashboard');
    else if (newRole === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-4">
        <h1 className="text-xl font-extrabold text-ink-900">Profile & Settings</h1>
        <p className="text-xs text-ink-700 mt-0.5">
          Logged in as <strong className="text-ink-900">{currentUser.displayName}</strong> ({currentUser.phone})
        </p>
      </div>

      <div className="px-0 py-0 space-y-4">
        {/* Demo Mode Role Switcher */}
        <Card padding="md" className="h-full">
          <span className="text-xs font-bold text-ink-900 block mb-1">
            Demo Mode Role Switcher
          </span>
          <p className="text-[11px] text-ink-700 mb-3">
            Switch between user roles to test each perspective for the class presentation.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hunter', label: 'Hunter', sub: 'Ada', icon: User },
              { id: 'agent', label: 'Agent', sub: 'Mr Tunde', icon: Briefcase },
              { id: 'admin', label: 'Admin', sub: 'Operations', icon: Shield },
            ].map((r) => {
              const Icon = r.icon;
              const isSel = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id as Role)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSel
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-brand-50 text-ink-900 border-brand-100 hover:border-brand-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold leading-tight">{r.label}</span>
                  <span className={`text-[10px] ${isSel ? 'text-white' : 'text-ink-700'}`}>
                    {r.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Data Saver Mode & Indicator */}
        <Card padding="md" className="h-full">
          <Toggle
            checked={dataSaver}
            onChange={toggleDataSaver}
            label="Data-Saver Mode"
            description="Prioritizes posters over video autoplay to minimize mobile data usage."
          />
          <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-xs text-ink-700">
            <span>Simulated session data:</span>
            <span className="font-mono font-bold text-brand-900">
              ~{Math.round(dataUsedKb)} KB used
            </span>
          </div>
        </Card>

        {/* Essential Trust, Safety & Monetization Links */}
        <Card padding="none" className="h-full">
          <div className="divide-y divide-line">
            <button
              type="button"
              onClick={() => navigate('/monetization')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-brand-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-brand-700" />
                <div>
                  <span className="text-xs font-bold text-ink-900 block">
                    How HouseMe Makes Money
                  </span>
                  <span className="text-[11px] text-ink-700">
                    Unit economics & revenue model breakdown
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-700" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/safety')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-brand-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-brand-700" />
                <div>
                  <span className="text-xs font-bold text-ink-900 block">Safety Centre</span>
                  <span className="text-[11px] text-ink-700">
                    Escrow protection, verified badges & guidelines
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-700" />
            </button>
          </div>
        </Card>

        {/* Language Placeholder */}
        <Card padding="md" className="h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-brand-700" />
              Language / Èdè
            </span>
          </div>
          <div className="flex gap-1.5">
            {[
              { id: 'en', label: 'English' },
              { id: 'pcm', label: 'Pidgin (Coming)' },
              { id: 'yo', label: 'Yorùbá (Coming)' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id as any)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  language === lang.id
                    ? 'bg-brand-700 text-white border-brand-700'
                    : 'bg-surface text-ink-700 border-line'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications Preference */}
        <Card padding="md" className="space-y-2">
          <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5 mb-1">
            <Bell className="w-4 h-4 text-brand-700" />
            Notification Channels
          </span>

          <label className="flex items-center justify-between text-xs text-ink-900 cursor-pointer py-1">
            <span>In-App Escrow Alerts</span>
            <input
              type="checkbox"
              checked={notifInApp}
              onChange={(e) => setNotifInApp(e.target.checked)}
              className="accent-brand-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-ink-900 cursor-pointer py-1">
            <span>SMS Arrival Codes</span>
            <input
              type="checkbox"
              checked={notifSMS}
              onChange={(e) => setNotifSMS(e.target.checked)}
              className="accent-brand-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-ink-900 cursor-pointer py-1">
            <span>WhatsApp Viewing Updates</span>
            <input
              type="checkbox"
              checked={notifWhatsApp}
              onChange={(e) => setNotifWhatsApp(e.target.checked)}
              className="accent-brand-600 w-4 h-4"
            />
          </label>
        </Card>

        {/* Reset Demo State Button */}
        <Button
          variant="secondary"
          className="w-full"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={resetAllData}
        >
          Reset All Prototype Data to Defaults
        </Button>
      </div>
    </div>
  );
};
