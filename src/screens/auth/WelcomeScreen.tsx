import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, ShieldCheck } from 'lucide-react';
import { heroImageManifest } from '../../data/imageManifest';
import { useStore } from '../../store/useStore';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useStore();

  const continueAsGuest = () => {
    setRole('hunter');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      {/* Hero Image */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-screen shrink-0 overflow-hidden bg-brand-100">
        <img
          src={heroImageManifest.welcomeHero}
          alt="A well-lit modern living room in a Lagos apartment"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Overlay gradient only at the bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-2xl font-black leading-tight mb-1">
            Know the house<br />before you visit.
          </p>
          <p className="text-sm font-medium text-white">
            Verified listings with real video walkthroughs. Only in Lagos.
          </p>
        </div>
      </div>

      {/* Content Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-lg mx-auto w-full lg:mx-0 lg:px-16 lg:max-w-none lg:justify-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-black text-lg">
            H
          </div>
          <span className="text-2xl font-black text-brand-700">HouseMe</span>
        </div>

        {/* Hunter section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-brand-700" />
            <h2 className="text-lg font-bold text-ink-900">I am looking for a house</h2>
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center transition-colors shadow-sm"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full min-h-[56px] bg-surface border-2 border-brand-700 text-brand-700 hover:bg-brand-50 rounded-xl text-base font-bold flex items-center justify-center transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full min-h-[48px] text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors underline"
            >
              Continue as guest
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-line" />
          <span className="text-sm text-ink-700 font-medium shrink-0">I list houses</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Agent section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-brand-700" />
            <h2 className="text-lg font-bold text-ink-900">I am a property agent</h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/agent-signup')}
              className="flex-1 min-h-[48px] bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100 rounded-xl text-sm font-bold flex items-center justify-center transition-colors"
            >
              Agent sign up
            </button>
            <button
              type="button"
              onClick={() => navigate('/login?role=agent')}
              className="flex-1 min-h-[48px] bg-surface border border-line text-ink-700 hover:bg-brand-50 rounded-xl text-sm font-bold flex items-center justify-center transition-colors"
            >
              Agent log in
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line pt-6">
          <button
            type="button"
            onClick={() => navigate('/login?role=admin')}
            className="flex items-center gap-2 text-xs text-ink-700 hover:text-ink-900 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
