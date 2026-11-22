import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  Wallet,
  Calendar,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  Bookmark,
  Send,
  Upload,
  Zap,
  ArrowRight,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { BottomSheet } from '../components/common/BottomSheet';
import { ProgressBar } from '../components/common/ProgressBar';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { useStore } from '../store/useStore';
import { formatNaira, accuracyScore, completeness } from '../lib';
import { Listing } from '../data/types';
import { EmptyState } from '../components/common/EmptyState';
import { OTPInput } from '../components/common/OTPInput';

export const AgentDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    agents,
    listings,
    bookings,
    enterArrivalCode,
    confirmListingAvailability,
    boostListing,
    withdrawAgentWallet,
    createListing,
    addToast,
    setRole,
  } = useStore();

  const [activeSection, setActiveSection] = useState<
    'home' | 'money' | 'enquiries' | 'listings' | 'create' | 'plans'
  >('home');

  // Arrival code input in Agent Dashboard
  const [arrivalCodeInput, setArrivalCodeInput] = useState('');
  const [selectedBookingForCode, setSelectedBookingForCode] = useState<string>('');

  // Listing creation wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [newTitle, setNewTitle] = useState('Renovated 2 Bed Flat in Sabo');
  const [newCaption, setNewCaption] = useState('₦1.5m/yr, 2 bed, Yaba. POP ceiling, clean borehole, steady light.');
  const [newDescription, setNewDescription] = useState('Modern finished flat in a serene close with good power and dedicated parking.');
  const [newAddress, setNewAddress] = useState('18 Commercial Avenue, Sabo, Yaba, Lagos'); // matches duplicate for demo!
  const [newNeighbourhood, setNewNeighbourhood] = useState('yaba');
  const [newRent, setNewRent] = useState(1500000);
  const [newAgency, setNewAgency] = useState(150000);
  const [newLegal, setNewLegal] = useState(150000);
  const [newCaution, setNewCaution] = useState(100000);
  const [newService, setNewService] = useState(120000);
  const [newElectricityHours, setNewElectricityHours] = useState('18 to 20 hours daily');
  const [newPrepaidMeter, setNewPrepaidMeter] = useState(true);
  const [newWaterSource, setNewWaterSource] = useState('Treated borehole');
  const [newRoadCondition, setNewRoadCondition] = useState('Tarred road');
  const [newFloodingHistory, setNewFloodingHistory] = useState('No flooding');
  const [newAuthority, setNewAuthority] = useState<'owner_listing' | 'owner_authorised_agent' | 'agency_inventory' | 'owner_authorised_caretaker'>('owner_authorised_agent');
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);

  const agentUser = agents.find((a) => a.userId === currentUser.id) || agents[0];
  const agentListings = listings.filter((l) => l.agentId === agentUser.userId);
  const agentBookings = bookings.filter((b) => b.agentId === agentUser.userId);

  const acc = accuracyScore(agentUser);

  // Financial calculations
  const pendingReleaseAmount = agentBookings
    .filter((b) => b.status === 'completed_awaiting' || b.status === 'paid_held')
    .reduce((sum, b) => sum + (b.feeAmount * 0.85), 0);

  const totalPaidOut = agentBookings
    .filter((b) => b.status === 'released')
    .reduce((sum, b) => sum + (b.feeAmount * 0.85), 0) + 68000;
  const availableAmount: number = 54400;

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arrivalCodeInput.trim()) return;

    const targetBooking = selectedBookingForCode
      ? agentBookings.find((b) => b.id === selectedBookingForCode)
      : agentBookings.find((b) => b.status === 'paid_held');

    if (!targetBooking) {
      addToast('No active viewing awaiting arrival code', 'error');
      return;
    }

    const res = enterArrivalCode(targetBooking.id, arrivalCodeInput.trim());
    if (res.success) {
      setArrivalCodeInput('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleFinalizeListing = () => {
    setIsSubmittingListing(true);
    setTimeout(() => {
      setIsSubmittingListing(false);
      createListing({
        title: newTitle,
        caption: newCaption,
        description: newDescription,
        address: newAddress,
        neighbourhoodId: newNeighbourhood,
        rentYearly: newRent,
        bedrooms: 2,
        bathrooms: 2,
        toilets: 2,
        authorityBasis: newAuthority,
        costs: {
          agencyFee: newAgency,
          legalFee: newLegal,
          cautionDeposit: newCaution,
          serviceCharge: newService,
        },
        features: {
          electricity: { status: 'provided', value: newElectricityHours, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          prepaidMeter: { status: 'provided', value: newPrepaidMeter, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          backupPower: { status: 'not_provided', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          waterSource: { status: 'provided', value: newWaterSource, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          waterReliability: { status: 'provided', value: '24/7 continuous', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          roadCondition: { status: 'provided', value: newRoadCondition, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          drainage: { status: 'provided', value: 'Concrete side drains', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          floodingHistory: { status: 'provided', value: newFloodingHistory, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          security: { status: 'provided', value: 'Gated compound with guard', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          wasteDisposal: { status: 'provided', value: 'LAWMA weekly', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          parking: { status: 'provided', value: '1 car parking slot', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          fencing: { status: 'provided', value: true, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          internet: { status: 'not_provided', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          kitchen: { status: 'provided', value: 'Cabinet fitted', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          ceiling: { status: 'provided', value: 'POP ceiling', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          boysQuarters: { status: 'not_applicable', source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
          petsAllowed: { status: 'provided', value: false, source: 'Agent-provided', lastConfirmed: new Date().toISOString() },
        },
      });

      setActiveSection('listings');
      setWizardStep(1);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-bg text-ink-900 pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-line px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-ink-900 flex items-center gap-1.5">
              <span>{agentUser.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-900 uppercase">
                {agentUser.accountType.replace('_', ' ')}
              </span>
            </h1>
            <span className="text-xs text-ink-700">
              Agent Portal • {agentUser.areas.join(' & ')}
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-brand-50 p-1 rounded-2xl border border-brand-100">
          {[
            { id: 'home', label: 'Overview' },
            { id: 'money', label: 'Escrow Wallet' },
            { id: 'enquiries', label: 'Enquiries & Codes' },
            { id: 'listings', label: 'My Listings' },
            { id: 'create', label: '+ New Listing' },
            { id: 'plans', label: 'Plans & Boost' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === sec.id
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Return to Hunter View */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setRole('hunter');
            navigate('/');
          }}
        >
          View as Hunter
        </Button>
      </header>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex overflow-x-auto no-scrollbar gap-1.5 p-3 bg-white border-b border-line">
        {[
          { id: 'home', label: 'Overview' },
          { id: 'money', label: 'Wallet' },
          { id: 'enquiries', label: 'Codes & Chat' },
          { id: 'listings', label: 'Listings' },
          { id: 'create', label: '+ New' },
          { id: 'plans', label: 'Plans' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? 'bg-brand-700 text-white'
                : 'bg-brand-50 text-ink-700'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* SECTION 1: HOME OVERVIEW */}
        {activeSection === 'home' && (
          <div className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card padding="md" className="h-full">
                <span className="text-[11px] font-bold text-ink-700 uppercase">Enquiries Today</span>
                <div className="text-2xl font-extrabold text-ink-900 mt-1">8</div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  +3 since morning
                </span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-[11px] font-bold text-ink-700 uppercase">Upcoming Viewings</span>
                <div className="text-2xl font-extrabold text-ink-900 mt-1">
                  {agentBookings.filter((b) => b.status === 'paid_held').length || 2}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  Fee secured in escrow
                </span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-[11px] font-bold text-ink-700 uppercase">Pending Release</span>
                <div className="text-2xl font-extrabold text-amber-900 mt-1">
                  {formatNaira(pendingReleaseAmount)}
                </div>
                <span className="text-[11px] text-ink-700 font-semibold mt-1 block">
                  Releases after 24h window
                </span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-[11px] font-bold text-ink-700 uppercase">Accuracy Score</span>
                <div className="text-2xl font-extrabold text-brand-900 mt-1">
                  {acc.percentage ? `${acc.percentage}%` : 'New'}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  {acc.label}
                </span>
              </Card>
            </div>

            {/* Quick Arrival Code Input Banner */}
            <Card padding="md" className="border-brand-500 bg-brand-50/60">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-700" />
                    <span>Hunter Arrival Verification</span>
                  </h3>
                  <p className="text-xs text-ink-700 mt-0.5">
                    Enter the 4-digit code shown by the hunter on-site to start inspection and activate escrow countdown.
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    maxLength={4}
                    value={arrivalCodeInput}
                    onChange={(e) => setArrivalCodeInput(e.target.value)}
                    placeholder="4-digit code"
                    className="w-32 px-3 py-2 text-center font-mono font-bold text-base rounded-xl border border-brand-300 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Verify Code
                  </Button>
                </form>
              </div>
            </Card>

            {/* Earnings 8-Week SVG Chart */}
            <Card padding="md" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-ink-900">Weekly Inspection Fee Payouts</h3>
                  <span className="text-xs text-ink-700">8-week verified payout history (Net of 15% platform cut)</span>
                </div>
                <span className="text-sm font-extrabold text-brand-900">{formatNaira(totalPaidOut)}</span>
              </div>

              <div className="w-full h-44 flex items-end justify-between gap-2 pt-4 px-2">
                {[14000, 21000, 17500, 28000, 24500, 31500, 28000, 38500].map((amt, idx) => {
                  const heightPercent = Math.round((amt / 40000) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-ink-700 hidden sm:inline">
                        ₦{(amt / 1000).toFixed(0)}k
                      </span>
                      <div
                        className="w-full max-w-[40px] bg-brand-600 rounded-t-lg transition-all hover:bg-brand-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-semibold text-ink-700">W{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 2: ESCROW WALLET */}
        {activeSection === 'money' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <Card padding="md" className="h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-ink-500">Available</span>
                    <span className="text-2xl font-bold text-ink-900">{formatNaira(availableAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-ink-500">Pending release</span>
                    <span className="text-2xl font-bold text-ink-900">{pendingReleaseAmount ? formatNaira(pendingReleaseAmount) : '₦0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-ink-500">Paid out</span>
                    <span className="text-2xl font-bold text-ink-900">{totalPaidOut ? formatNaira(totalPaidOut) : '₦0'}</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 w-full"
                  disabled={availableAmount === 0}
                  onClick={() => withdrawAgentWallet(availableAmount)}
                >
                  Withdraw to Bank Account
                </Button>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-xs text-ink-700 font-semibold block">Pending Release (In 24h Escrow)</span>
                <div className="text-2xl font-extrabold text-amber-900 mt-1">
                  {formatNaira(pendingReleaseAmount)}
                </div>
                <span className="text-[11px] text-ink-700 mt-1 block">Auto-releases if no dispute filed</span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-xs text-ink-700 font-semibold block">Total Historical Payouts</span>
                <div className="text-2xl font-extrabold text-brand-900 mt-1">
                  {formatNaira(totalPaidOut)}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">85% net of all viewings</span>
              </Card>
            </div>

            {/* Viewings Escrow Breakdown Table */}
            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-3">Viewing Fee Escrow Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-brand-50 border-b border-line text-ink-900">
                      <th className="p-2.5 font-bold">Booking ID</th>
                      <th className="p-2.5 font-bold">Hunter</th>
                      <th className="p-2.5 font-bold">Gross Fee</th>
                      <th className="p-2.5 font-bold">HouseMe Cut (15%)</th>
                      <th className="p-2.5 font-bold">Agent Net (85%)</th>
                      <th className="p-2.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {agentBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="p-2.5 font-mono font-bold text-ink-900">{b.id}</td>
                        <td className="p-2.5">{b.hunterName}</td>
                        <td className="p-2.5 font-bold">{formatNaira(b.feeAmount)}</td>
                        <td className="p-2.5 text-ink-700">₦600</td>
                        <td className="p-2.5 font-extrabold text-brand-900">₦3,400</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'released'
                              ? 'bg-emerald-100 text-brand-700'
                              : 'bg-amber-50 text-amber-900'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 3: ENQUIRIES & CHAT */}
        {activeSection === 'enquiries' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-2">Live Enquiries Inbox</h3>
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Ada (Hunter)',
                    house: '2 Bed Flat in Sabo',
                    msg: 'Good afternoon, is the prepaid meter dedicated to this flat alone?',
                    time: '12m ago',
                  },
                  {
                    name: 'Segun O.',
                    house: 'Upgraded 2 Bed Bode Thomas',
                    msg: 'Can we inspect tomorrow around 2pm?',
                    time: '1h ago',
                  },
                ].map((chat, idx) => (
                  <div key={idx} className="p-3 rounded-2xl border border-line bg-surface hover:bg-brand-50/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-900">{chat.name}</span>
                      <span className="text-[10px] text-ink-700">{chat.time}</span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-700 block mt-0.5">{chat.house}</span>
                    <p className="text-xs text-ink-700 mt-1 line-clamp-2">"{chat.msg}"</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="md" className="h-full">
              <h3 className="text-sm font-bold text-ink-900 mb-2">Active Arrival Codes Awaiting Verification</h3>
              {agentBookings.filter((b) => b.status === 'paid_held').length === 0 ? (
                <EmptyState
                  icon={<KeyRound className="w-10 h-10" />}
                  title="No arrivals waiting"
                  description="When a hunter books a viewing, you can verify their 4-digit code here."
                  iconSize={40}
                  paddingClassName="p-8"
                  titleClassName="text-[17px] font-[650] text-ink-900"
                  descriptionClassName="text-[15px] text-ink-500"
                />
              ) : (
                <div className="space-y-3">
                  {agentBookings.filter((b) => b.status === 'paid_held').map((booking) => {
                    const listing = listings.find((item) => item.id === booking.listingId);
                    const slot = new Date(booking.slotAt);
                    const slotText = Number.isNaN(slot.getTime())
                      ? 'Time to be confirmed'
                      : slot.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                    return (
                      <div key={booking.id} className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
                        <div className="text-xs">
                          <span className="font-bold text-ink-900">{booking.hunterName.split(' ')[0]}</span>
                          <span className="text-ink-700"> · {listing?.title || 'Scheduled Viewing'}</span>
                        </div>
                        <div className="text-[11px] text-ink-700">{slotText}</div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => enterArrivalCode(booking.id, booking.arrivalCode)}
                        >
                          Verify
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              <form onSubmit={handleVerifyCode} className="mt-4 space-y-3">
                <OTPInput
                  length={4}
                  value={arrivalCodeInput}
                  onChange={setArrivalCodeInput}
                />
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Verify code
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* SECTION 4: MY LISTINGS */}
        {activeSection === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-ink-900">Your Active Property Inventory</h2>
                <span className="text-xs text-ink-700">Keep listings confirmed within 14 days to avoid stale warning badge</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setActiveSection('create')}
              >
                Create Listing
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentListings.map((item) => (
                <Card key={item.id} padding="md" className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-24 h-24 bg-brand-50 rounded-xl overflow-hidden shrink-0">
                      <HouseImage houseId={item.id} sceneType="exterior" alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-ink-900 line-clamp-1">{item.title}</span>
                      <span className="text-xs font-extrabold text-brand-900 block mt-0.5">
                        {formatNaira(item.rentYearly)}/yr
                      </span>
                      <div className="mt-2">
                        <ProgressBar value={item.completenessScore} label="Completeness" showPercent />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />}
                      onClick={() => confirmListingAvailability(item.id)}
                    >
                      Confirm Still Available
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={item.completenessScore < 70 || item.isBoosted}
                      onClick={() => boostListing(item.id)}
                    >
                      {item.isBoosted ? 'Boosted' : 'Boost (₦2,000/wk)'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: CREATE LISTING 6-STEP WIZARD */}
        {activeSection === 'create' && (
          <Card padding="lg" className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                  Step {wizardStep} of 6
                </span>
                <h2 className="text-lg font-extrabold text-ink-900 mt-0.5">
                  {wizardStep === 1 && '1. Basic Information'}
                  {wizardStep === 2 && '2. Costs & Agreement Fees'}
                  {wizardStep === 3 && '3. Power, Water & Road'}
                  {wizardStep === 4 && '4. Media & In-App Shot List'}
                  {wizardStep === 5 && '5. Authority & Landlord Mandate'}
                  {wizardStep === 6 && '6. Review & Publish'}
                </h2>
              </div>
            </div>

            {/* STEP 1: BASICS */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Listing Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Short Caption (max 120 chars)</label>
                  <input
                    type="text"
                    maxLength={120}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Full Property Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                  {newAddress.toLowerCase().includes('18 commercial') && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />
                      <span>Duplicate Address Detected: A similar property is already registered. You can list as an open secondary agent.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Neighbourhood</label>
                    <select
                      value={newNeighbourhood}
                      onChange={(e) => setNewNeighbourhood(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                    >
                      <option value="yaba">Yaba</option>
                      <option value="surulere">Surulere</option>
                      <option value="ikeja">Ikeja</option>
                      <option value="lekki-1">Lekki Phase 1</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Yearly Rent (₦)</label>
                    <input
                      type="number"
                      value={newRent}
                      onChange={(e) => setNewRent(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface font-bold"
                    />
                  </div>
                </div>

                <Button variant="primary" className="w-full" onClick={() => setWizardStep(2)}>
                  Continue to Costs
                </Button>
              </div>
            )}

            {/* STEP 2: COSTS */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Agency Fee (₦)</label>
                    <input
                      type="number"
                      value={newAgency}
                      onChange={(e) => setNewAgency(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Legal Fee (₦)</label>
                    <input
                      type="number"
                      value={newLegal}
                      onChange={(e) => setNewLegal(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Caution Deposit (₦)</label>
                    <input
                      type="number"
                      value={newCaution}
                      onChange={(e) => setNewCaution(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-900 block mb-1">Service Charge (₦)</label>
                    <input
                      type="number"
                      value={newService}
                      onChange={(e) => setNewService(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWizardStep(1)}>Back</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setWizardStep(3)}>Continue to Power & Water</Button>
                </div>
              </div>
            )}

            {/* STEP 3: POWER, WATER & ROAD */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Electricity Supply Hours</label>
                  <input
                    type="text"
                    value={newElectricityHours}
                    onChange={(e) => setNewElectricityHours(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Water Source</label>
                  <input
                    type="text"
                    value={newWaterSource}
                    onChange={(e) => setNewWaterSource(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Road Condition</label>
                  <input
                    type="text"
                    value={newRoadCondition}
                    onChange={(e) => setNewRoadCondition(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-900 block mb-1">Flooding History</label>
                  <input
                    type="text"
                    value={newFloodingHistory}
                    onChange={(e) => setNewFloodingHistory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-line bg-surface"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWizardStep(2)}>Back</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setWizardStep(4)}>Continue to Media</Button>
                </div>
              </div>
            )}

            {/* STEP 4: MEDIA SHOT LIST */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-brand-50 border border-brand-100 text-xs">
                  <span className="font-bold text-brand-900 block mb-1">Required In-App Shot List (60s Tour):</span>
                  <ul className="text-ink-700 space-y-0.5 list-disc pl-4 text-[11px]">
                    <li>Outside compound gate & street drainage</li>
                    <li>Living room cross-ventilation</li>
                    <li>Kitchen sink & cabinetry</li>
                    <li>Bathrooms & water pressure test</li>
                    <li>Prepaid electric meter box</li>
                  </ul>
                </div>

                <div className="p-6 border-2 border-dashed border-brand-300 rounded-2xl text-center bg-brand-50/30">
                  <Upload className="w-8 h-8 text-brand-700 mx-auto mb-2" />
                  <span className="text-xs font-bold text-ink-900 block">Upload Room Tour Photos or Video</span>
                  <span className="text-[11px] text-ink-700 mt-1 block">Vector scene mockups will be generated automatically</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWizardStep(3)}>Back</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setWizardStep(5)}>Continue to Authority</Button>
                </div>
              </div>
            )}

            {/* STEP 5: AUTHORITY MANDATE */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-ink-900 block">Select Your Authority Basis</label>
                {[
                  { id: 'owner_authorised_agent', label: 'Owner-Authorised Agent (Written Mandate)' },
                  { id: 'owner_listing', label: 'Direct Landlord / Property Owner' },
                  { id: 'owner_authorised_caretaker', label: 'Caretaker with Landlord Confirmation' },
                  { id: 'agency_inventory', label: 'Registered Agency Inventory' },
                ].map((auth) => (
                  <label
                    key={auth.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      newAuthority === auth.id
                        ? 'bg-brand-50 border-brand-600 text-brand-900'
                        : 'bg-surface border-line text-ink-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="authority"
                      checked={newAuthority === auth.id}
                      onChange={() => setNewAuthority(auth.id as any)}
                      className="accent-brand-600"
                    />
                    <span>{auth.label}</span>
                  </label>
                ))}

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWizardStep(4)}>Back</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setWizardStep(6)}>Review & Submit</Button>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & SUBMIT */}
            {wizardStep === 6 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-700">Calculated Completeness</span>
                    <span className="text-sm font-extrabold text-brand-900">88% Complete</span>
                  </div>
                  <span className="text-xs font-bold text-ink-900 block">{newTitle}</span>
                  <span className="text-sm font-extrabold text-brand-900">{formatNaira(newRent)}/year</span>
                  <p className="text-xs text-ink-700">{newCaption}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWizardStep(5)}>Back</Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    loading={isSubmittingListing}
                    onClick={handleFinalizeListing}
                  >
                    Publish to HouseMe Feed
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* SECTION 6: PLANS & BOOST */}
        {activeSection === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="md" className="h-full">
              <span className="text-xs font-bold text-ink-700 uppercase">Free Plan</span>
              <div className="text-2xl font-extrabold text-ink-900 mt-1">₦0</div>
              <ul className="text-xs text-ink-700 space-y-2 my-4 list-disc pl-4">
                <li>Up to 3 active listings</li>
                <li>Standard mainland search</li>
                <li>Single inspection slots</li>
              </ul>
              <Button variant="secondary" size="sm" className="w-full" disabled>
                Current Plan
              </Button>
            </Card>

            <Card padding="md" className="border-brand-600 bg-brand-50/50 shadow-float relative">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-700 text-white">
                POPULAR
              </div>
              <span className="text-xs font-bold text-brand-900 uppercase">Pro Tier</span>
              <div className="text-2xl font-extrabold text-brand-900 mt-1">₦10,000 / month</div>
              <ul className="text-xs text-ink-700 space-y-2 my-4 list-disc pl-4">
                <li>Unlimited active listings</li>
                <li>Group viewing slots (up to 10 hunters)</li>
                <li>Quick reply templates & analytics</li>
                <li>Priority verified audit queue</li>
              </ul>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => addToast('Subscribed to Pro Tier for ₦10,000/mo!', 'success')}
              >
                Upgrade to Pro
              </Button>
            </Card>

            <Card padding="md" className="h-full">
              <span className="text-xs font-bold text-ink-700 uppercase">Sponsored Boost</span>
              <div className="text-2xl font-extrabold text-ink-900 mt-1">₦2,000 / week</div>
              <ul className="text-xs text-ink-700 space-y-2 my-4 list-disc pl-4">
                <li>Pinned top of Discover feed</li>
                <li>Requires 70%+ completeness</li>
                <li>Transparently tagged "Sponsored"</li>
              </ul>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => addToast('Listing boosted!', 'success')}
              >
                Boost a Listing
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
