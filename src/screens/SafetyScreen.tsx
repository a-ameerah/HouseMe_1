import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, PhoneCall } from 'lucide-react';
import { Card } from '../components/common/Card';
import { IconButton } from '../components/common/Button';

export const SafetyScreen: React.FC = () => {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-extrabold text-ink-900">Safety & Trust Centre</h1>
            <p className="text-xs text-ink-700">How HouseMe protects Nigerian house hunters</p>
          </div>
        </div>
      </div>

      <div className="px-0 py-0 space-y-4">
        <Card padding="md" className="space-y-2 border-brand-500 bg-brand-50/50">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-brand-700" />
            <span>Escrow Fee Protection</span>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">
            Your ₦4,000 viewing fee is held safely by HouseMe. The agent only receives payout after your viewing is completed and you have had 24 hours to report any mismatch.
          </p>
        </Card>

        <Card padding="md" className="space-y-2">
          <div className="flex items-center gap-2 text-ink-900 font-bold text-sm">
            <Eye className="w-4 h-4 text-brand-700" />
            <span>Private Property Addresses</span>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">
            Exact building numbers and agent private contact lines are never shown publicly to prevent unauthorized visits or harassment. Private addresses are revealed only after a booking is confirmed.
          </p>
        </Card>

        <Card padding="md" className="space-y-2">
          <div className="flex items-center gap-2 text-ink-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-900" />
            <span>Never Pay Outside the App</span>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">
            If an agent asks you to transfer caution fees, inspection fees, or rent directly into a personal bank account before legal agreements are finalized, report them immediately.
          </p>
        </Card>

        <Card padding="md" className="space-y-2">
          <div className="flex items-center gap-2 text-ink-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-brand-700" />
            <span>Daylight Inspection Rule</span>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">
            We recommend viewing properties between 9:00 AM and 5:00 PM. Always inform a trusted friend or family member of your inspection itinerary.
          </p>
        </Card>
      </div>
    </div>
  );
};
