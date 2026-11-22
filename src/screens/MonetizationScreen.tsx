import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calculator, Sparkles, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { IconButton } from '../components/common/Button';
import { formatNaira, revenueModel } from '../lib';

export const MonetizationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [viewings, setViewings] = useState(2000);
  const [proAgents, setProAgents] = useState(25);
  const [boosts, setBoosts] = useState(40);

  const model = revenueModel({
    viewings,
    proSubscribers: proAgents,
    boosts,
  });

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      <div className="bg-surface border-b border-line px-4 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-ink-900" />}
            label="Back"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-xl font-extrabold text-ink-900">How HouseMe Makes Money</h1>
            <p className="text-xs text-ink-700">Unit economics and sustainable business model</p>
          </div>
        </div>
      </div>

      <div className="px-0 py-0 space-y-4">
        {/* Three Revenue Streams Cards */}
        <div className="space-y-3">
          <Card padding="md" className="h-full">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-brand-700 uppercase">Stream 1: Viewing Escrow Cut</span>
              <span className="text-xs font-extrabold text-brand-900">15% Cut (₦600)</span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed">
              We take a 15% platform cut (₦600) from each completed ₦4,000 viewing fee. The agent receives ₦3,400 (85%) upon successful viewing.
            </p>
          </Card>

          <Card padding="md" className="h-full">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-brand-700 uppercase">Stream 2: Agent Pro Subscription</span>
              <span className="text-xs font-extrabold text-brand-900">₦10,000 / month</span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed">
              Active agencies and top independent agents subscribe to Pro for unlimited listing uploads, group inspection slots, and automated enquiries.
            </p>
          </Card>

          <Card padding="md" className="h-full">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-brand-700 uppercase">Stream 3: Sponsored Listing Boosts</span>
              <span className="text-xs font-extrabold text-brand-900">₦2,000 / week</span>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed">
              Agents can boost complete listings (requires at least 70% verified completeness) to appear as Sponsored cards at the top of the feed.
            </p>
          </Card>
        </div>

        {/* Interactive Unit Economics Calculator */}
        <Card padding="md" className="border-brand-500 bg-brand-50/50 space-y-4">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
            <Calculator className="w-4 h-4 text-brand-700" />
            <span>Monthly Unit Economics Simulator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Completed Viewings: {viewings.toLocaleString()}</span>
                <span>{formatNaira(model.viewingRevenue)}</span>
              </div>
              <input
                type="range"
                min={500}
                max={5000}
                step={100}
                value={viewings}
                onChange={(e) => setViewings(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pro Subscribers: {proAgents}</span>
                <span>{formatNaira(model.subscriptionRevenue)}</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={proAgents}
                onChange={(e) => setProAgents(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Weekly Boosts: {boosts}</span>
                <span>{formatNaira(model.boostRevenue)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={10}
                value={boosts}
                onChange={(e) => setBoosts(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-brand-200">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-ink-900">Net Monthly Platform Profit</span>
              <span className="text-xl font-extrabold text-brand-900">{formatNaira(model.netRevenue)}</span>
            </div>
            <span className="text-[10px] text-ink-700 block mt-0.5">
              Net of 2% payment processing gateway charges ({formatNaira(model.paymentProcessing)})
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
