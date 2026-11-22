import React, { useState } from 'react';
import { ShieldCheck, Video, Wallet, ArrowRight, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { useStore } from '../../store/useStore';
import { Dealbreaker } from '../../data/types';
import { formatNaira } from '../../lib';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { updateUserPreferences, setOnboardingDone } = useStore();
  const [slide, setSlide] = useState(0);

  // Preference state
  const [budgetMax, setBudgetMax] = useState(1800000);
  const [selectedBeds, setSelectedBeds] = useState<number[]>([1, 2]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<Dealbreaker[]>([
    'steady_power',
    'no_flooding',
    'tarred_road',
  ]);

  const cards = [
    {
      title: 'Know before you go',
      subtitle:
        'Watch honest short video walkthroughs and view complete neighbourhood records (power, water, road, flooding) before spending money to view.',
      icon: <Video className="w-8 h-8 text-brand-700" />,
      tag: 'Honest Video Walkthroughs',
    },
    {
      title: 'Trust labels you can bank on',
      subtitle:
        'Every single fact says who provided it: Verified uploader, Authority checked, or Resident-reported. Missing facts are always labelled "Not provided", never hidden.',
      icon: <ShieldCheck className="w-8 h-8 text-brand-700" />,
      tag: 'Zero Fake Listings',
    },
    {
      title: 'Pay after viewing protection',
      subtitle:
        'Your ₦4,000 viewing fee is held safely in escrow. The agent is only paid after your viewing. If the house was falsely listed, you get a full refund.',
      icon: <Wallet className="w-8 h-8 text-brand-700" />,
      tag: 'Protected Escrow',
    },
  ];

  const toggleBed = (bed: number) => {
    setSelectedBeds((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed]
    );
  };

  const toggleDealbreaker = (db: Dealbreaker) => {
    setSelectedDealbreakers((prev) =>
      prev.includes(db) ? prev.filter((d) => d !== db) : [...prev, db]
    );
  };

  const handleFinish = () => {
    updateUserPreferences({
      budgetMax,
      bedrooms: selectedBeds,
      dealbreakers: selectedDealbreakers,
    });
    setOnboardingDone(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/70 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-surface rounded-[24px] shadow-float overflow-hidden flex flex-col p-6 border border-line">
        {slide < 3 ? (
          <div>
            {/* Top Tag & Skip */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                {cards[slide].tag}
              </span>
              <button
                type="button"
                onClick={handleFinish}
                className="text-xs font-semibold text-ink-700 hover:text-ink-900"
              >
                Skip for now
              </button>
            </div>

            {/* Icon Scene */}
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5 shadow-sm">
              {cards[slide].icon}
            </div>

            <h2 className="text-xl font-extrabold text-ink-900 mb-2 leading-tight">
              {cards[slide].title}
            </h2>
            <p className="text-xs text-ink-700 leading-relaxed min-h-[60px]">
              {cards[slide].subtitle}
            </p>

            {/* Dots */}
            <div className="flex items-center gap-1.5 my-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    slide === i ? 'w-6 bg-brand-600' : 'w-2 bg-line'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setSlide(slide + 1)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                Step 4 of 4
              </span>
              <h2 className="text-lg font-extrabold text-ink-900 mt-1">
                Your House-Hunting Goals
              </h2>
              <p className="text-xs text-ink-700">
                Tell us your target budget and must-haves. We personalize your feed.
              </p>
            </div>

            {/* Budget Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-ink-700">Maximum yearly budget</span>
                <span className="text-brand-900 font-extrabold text-sm">
                  {formatNaira(budgetMax)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={100000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Bedrooms selector */}
            <div>
              <label className="text-xs font-bold text-ink-900 block mb-1.5">
                Bedrooms interested in
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((b) => {
                  const label = b === 0 ? 'Studio' : `${b} Bed`;
                  const isSel = selectedBeds.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBed(b)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        isSel
                          ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                          : 'bg-surface text-ink-700 border-line hover:border-brand-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dealbreakers Chips */}
            <div>
              <label className="text-xs font-bold text-ink-900 block mb-1.5">
                Dealbreakers (We verify these on every house)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'steady_power', label: 'Steady Power' },
                  { id: 'no_flooding', label: 'No Flooding' },
                  { id: 'tarred_road', label: 'Tarred Road' },
                  { id: 'prepaid_meter', label: 'Prepaid Meter' },
                ].map((item) => {
                  const isSel = selectedDealbreakers.includes(item.id as Dealbreaker);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleDealbreaker(item.id as Dealbreaker)}
                      className={`flex items-center justify-between p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                        isSel
                          ? 'bg-brand-50 text-brand-900 border-brand-500 shadow-sm'
                          : 'bg-surface text-ink-700 border-line'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-brand-700" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button variant="primary" className="w-full mt-2" onClick={handleFinish}>
              Start Exploring Houses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
