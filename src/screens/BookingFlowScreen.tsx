import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  CreditCard,
  Building,
  Hash,
  Share2,
  CheckCircle2,
  Lock,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { Stepper } from '../components/common/Stepper';
import { Button, IconButton } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { useStore } from '../store/useStore';
import { formatNaira } from '../lib';

export const BookingFlowScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, agents, properties, createBooking, addToast, currentUser } = useStore();

  const [step, setStep] = useState(0); // 0: Slot, 1: Review Fee, 2: Fake Pay, 3: Confirmed
  const [selectedSlot, setSelectedSlot] = useState<string>('tomorrow-10am');
  const [payMethod, setPayMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const listing = listings.find((l) => l.id === id);
  const agent = agents.find((a) => a.userId === listing?.agentId);
  const property = properties.find((p) => p.id === listing?.propertyId);

  if (!listing || !agent) {
    return (
      <div className="p-6 text-center text-ink-900">
        <h2 className="text-lg font-bold">Listing not found</h2>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const stepsList = [
    { title: 'Slot' },
    { title: 'Fee' },
    { title: 'Payment' },
    { title: 'Confirmed' },
  ];

  // Simulated available viewing slots
  const slots = [
    {
      id: 'tomorrow-10am',
      date: 'Tomorrow, 10:00 AM',
      type: 'Single viewing',
      spots: '1-on-1 private slot',
    },
    {
      id: 'tomorrow-2pm',
      date: 'Tomorrow, 2:00 PM',
      type: 'Group viewing',
      spots: '6 of 10 spots left',
    },
    {
      id: 'sat-11am',
      date: 'Saturday, 11:00 AM',
      type: 'Weekend viewing',
      spots: '4 spots left',
    },
  ];

  const handleShareViewingDetails = () => {
    const text = encodeURIComponent(
      `Viewing Safety Note: I am viewing an apartment with ${agent.name} (${agent.accountType}) tomorrow at ${property?.landmarks[0] || 'Lagos'}. Booking fee is held in escrow on HouseMe.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    addToast('Opening WhatsApp to share viewing safety details', 'success');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const booking = createBooking(listing.id, new Date().toISOString(), 4000);
      setConfirmedBooking(booking);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-ink-900" />}
            label="Back"
            variant="ghost"
            onClick={() => (step > 0 && step < 3 ? setStep(step - 1) : navigate(-1))}
          />
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            Protected Viewing Booking
          </span>
          <div className="w-9" />
        </div>

        <Stepper steps={stepsList} currentStep={step} />
      </div>

      <div className="px-0 py-0 space-y-4">
        {/* STEP 1: CHOOSE A SLOT */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-ink-900">Choose an Inspection Slot</h2>
              <p className="text-xs text-ink-700">
                Select an open slot with {agent.name}.
              </p>
            </div>

            <div className="space-y-2.5">
              {slots.map((s) => {
                const isSel = selectedSlot === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSlot(s.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSel
                        ? 'bg-brand-50 border-brand-600 shadow-sm'
                        : 'bg-surface border-line hover:border-brand-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-700" />
                        <span className="text-xs font-bold text-ink-900">{s.date}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-900">
                        {s.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-700 mt-1 pl-6">{s.spots}</div>
                  </div>
                );
              })}
            </div>

            {/* Escrow note */}
            <div className="p-3 rounded-2xl bg-brand-50 border border-brand-100 text-xs text-brand-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Your payment is held safely.</strong> The agent is paid only after your viewing is completed.
              </p>
            </div>

            <Button variant="primary" className="w-full mt-4" onClick={() => setStep(1)}>
              Continue to Fee Breakdown
            </Button>
          </div>
        )}

        {/* STEP 2: REVIEW FEE & SAFETY */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-ink-900">Review Viewing Fee</h2>
              <p className="text-xs text-ink-700">
                Standard platform viewing escrow fee.
              </p>
            </div>

            <Card padding="md" className="h-full">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-bold text-ink-900">Standard Viewing Escrow Fee</span>
                <span className="text-xl font-extrabold text-brand-900">₦4,000</span>
              </div>

              <div className="py-2.5 text-xs text-ink-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Agent Payout (Post-inspection)</span>
                  <span className="font-semibold text-ink-900">₦3,400 (85%)</span>
                </div>
                <div className="flex justify-between">
                  <span>HouseMe Platform Cut</span>
                  <span className="font-semibold text-ink-900">₦600 (15%)</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-line text-[11px] text-ink-700 leading-relaxed bg-brand-50 p-2.5 rounded-xl">
                <strong>How it works:</strong> Money is held until you arrive and show your 4-digit code. After viewing, you have 24 hours to confirm or report mismatch. Silence after 24 hours auto-releases to agent.
              </div>
            </Card>

            {/* Safety Guidance Card */}
            <Card padding="md" className="border-amber-500/20 bg-amber-500/5">
              <h3 className="text-xs font-bold text-ink-900 flex items-center gap-1.5 mb-2">
                <Shield className="w-4 h-4 text-amber-900" />
                <span>Viewing Safety Guidelines</span>
              </h3>
              <ul className="text-[11px] text-ink-700 space-y-1 list-disc pl-4">
                <li>Always meet in daylight between 9am and 5pm.</li>
                <li>Bring a friend or family member along.</li>
                <li><strong>Never pay any cash, rent, or deposit outside HouseMe.</strong></li>
              </ul>

              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-3 bg-white"
                icon={<Share2 className="w-3.5 h-3.5" />}
                onClick={handleShareViewingDetails}
              >
                Share viewing details with a trusted contact
              </Button>
            </Card>

            <Button variant="primary" className="w-full mt-2" onClick={() => setStep(2)}>
              Proceed to Simulated Payment
            </Button>
          </div>
        )}

        {/* STEP 3: FAKE PAY */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-ink-900">Hold ₦4,000 in Escrow</h2>
              <p className="text-xs text-ink-700">
                Select your payment method. This is a simulated prototype transaction.
              </p>
            </div>

            <SegmentedControl
              options={[
                { id: 'card', label: 'Debit Card' },
                { id: 'transfer', label: 'Bank Transfer' },
                { id: 'ussd', label: 'USSD' },
              ]}
              value={payMethod}
              onChange={(val) => setPayMethod(val as any)}
            />

            {payMethod === 'card' && (
              <div className="space-y-3 bg-surface p-4 rounded-card border border-line">
                <div>
                  <label className="text-[11px] font-bold text-ink-900 block mb-1">Card Number</label>
                  <input
                    type="text"
                    disabled
                    value="5399 •••• •••• 4821"
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-line bg-brand-50/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-ink-900 block mb-1">Expiry</label>
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-line bg-brand-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-ink-900 block mb-1">CVV</label>
                    <input
                      type="text"
                      disabled
                      value="392"
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-line bg-brand-50/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'transfer' && (
              <div className="p-4 rounded-card border border-line bg-surface text-xs space-y-2">
                <span className="text-ink-700 font-semibold block">Simulated Virtual Bank Account:</span>
                <div className="p-2.5 rounded-xl bg-brand-50 font-mono text-sm font-bold text-brand-900">
                  Wema Bank • 0129384756 • HouseMe Escrow
                </div>
                <span className="text-[11px] text-ink-700">Funds are detected automatically.</span>
              </div>
            )}

            {payMethod === 'ussd' && (
              <div className="p-4 rounded-card border border-line bg-surface text-xs text-center space-y-1">
                <span className="text-ink-700 font-semibold block">Dial on your phone:</span>
                <div className="p-2.5 rounded-xl bg-brand-50 font-mono text-base font-extrabold text-brand-900">
                  *737*4*4000*0129#
                </div>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              loading={isProcessing}
              onClick={handleProcessPayment}
            >
              Authorize ₦4,000 Escrow Hold
            </Button>
          </div>
        )}

        {/* STEP 4: CONFIRMED */}
        {step === 3 && confirmedBooking && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-ink-900">Viewing Booked & Secured!</h2>
              <p className="text-xs text-ink-700 mt-1">
                ₦4,000 is safely held in escrow. The agent receives payout only after your inspection.
              </p>
            </div>

            {/* Arrival Code Card */}
            <Card padding="md" className="border-brand-500 bg-brand-50 text-center">
              <span className="text-xs font-bold text-brand-900 uppercase tracking-wider block">
                Your 4-Digit Arrival Code
              </span>
              <div className="text-4xl font-extrabold font-mono tracking-widest text-brand-900 my-2">
                {confirmedBooking.arrivalCode}
              </div>
              <p className="text-[11px] text-ink-700">
                Show this code to {agent.name} when you arrive at the house to initiate your 24-hour inspection window.
              </p>
            </Card>

            {/* Exact Address Revealed Pre-inspection */}
            {property && (
              <Card padding="md" className="text-left space-y-1.5">
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">
                  Private Address Revealed
                </span>
                <div className="text-sm font-bold text-ink-900">{property.address}</div>
                <div className="text-xs text-ink-700">{property.landmarks.join(', ')}</div>
              </Card>
            )}

            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => navigate('/viewings')}
              >
                Track in Viewings Tab
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
