import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  UserCheck,
  FileCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { useStore } from '../store/useStore';
import { revenueModel, formatNaira } from '../lib';
import { EmptyState } from '../components/common/EmptyState';

export const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    agents,
    listings,
    bookings,
    reports,
    auditLogs,
    approveAgent,
    rejectAgent,
    requestAgentInfo,
    moderateListing,
    resolveDispute,
    setRole,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'listings' | 'disputes' | 'audit'>('overview');

  // Sensitivity toggle: 2,000 vs 1,000 viewings
  const [viewingVolume, setViewingVolume] = useState<2000 | 1000>(2000);
  const [auditQuery, setAuditQuery] = useState('');

  // Revenue projection calculation
  const rev = revenueModel({
    viewings: viewingVolume,
    proSubscribers: 28,
    boosts: 45,
  });

  const pendingAgents = agents.filter((a) => a.status === 'in_review' || a.status === 'needs_info');
  const disputedBookings = bookings.filter((b) => b.status === 'disputed');

  const filteredLogs = auditLogs.filter((log) => {
    if (!auditQuery.trim()) return true;
    const q = auditQuery.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-bg text-ink-900 pb-20">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-line px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ink-900 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-ink-900 flex items-center gap-2">
              <span>HouseMe Operations Center</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ink-900 text-white uppercase">
                Admin Console
              </span>
            </h1>
            <span className="text-xs text-ink-700">Lagos Pilot Oversight & Trust Compliance</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-brand-50 p-1 rounded-2xl border border-brand-100">
          {[
            { id: 'overview', label: 'Revenue Model' },
            { id: 'agents', label: `Agent Applications (${pendingAgents.length})` },
            { id: 'listings', label: 'Listing Moderation' },
            { id: 'disputes', label: `Disputes & Reports (${disputedBookings.length + reports.length})` },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setRole('hunter');
            navigate('/');
          }}
        >
          Exit Admin
        </Button>
      </header>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex overflow-x-auto no-scrollbar gap-1.5 p-3 bg-white border-b border-line">
        {[
          { id: 'overview', label: 'Revenue' },
          { id: 'agents', label: `Agents (${pendingAgents.length})` },
          { id: 'listings', label: 'Listings' },
          { id: 'disputes', label: 'Disputes' },
          { id: 'audit', label: 'Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-ink-900 text-white' : 'bg-brand-50 text-ink-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* SECTION 1: REVENUE OVERVIEW & SENSITIVITY TOGGLE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header with Sensitivity Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-line shadow-card">
              <div>
                <h2 className="text-base font-extrabold text-ink-900">Platform Revenue Projections</h2>
                <p className="text-xs text-ink-700">Simulate monthly unit economics under varying viewing volume scenarios.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-700">Monthly Viewings:</span>
                <div className="flex gap-1 bg-brand-50 p-1 rounded-xl border border-brand-100">
                  <button
                    type="button"
                    onClick={() => setViewingVolume(2000)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      viewingVolume === 2000
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-ink-700 hover:text-ink-900'
                    }`}
                  >
                    2,000 (Base Case)
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingVolume(1000)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      viewingVolume === 1000
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-ink-700 hover:text-ink-900'
                    }`}
                  >
                    1,000 (Conservative)
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card padding="md" className="h-full">
                <span className="text-xs font-bold text-ink-700 uppercase">Viewing Cut (15%)</span>
                <div className="text-2xl font-extrabold text-ink-900 mt-1">
                  {formatNaira(rev.viewingRevenue)}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  {viewingVolume.toLocaleString()} viewings × ₦600 cut
                </span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-xs font-bold text-ink-700 uppercase">Pro Subscriptions</span>
                <div className="text-2xl font-extrabold text-ink-900 mt-1">
                  {formatNaira(rev.subscriptionRevenue)}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  28 Pro agents × ₦10,000/mo
                </span>
              </Card>

              <Card padding="md" className="h-full">
                <span className="text-xs font-bold text-ink-700 uppercase">Listing Boosts</span>
                <div className="text-2xl font-extrabold text-ink-900 mt-1">
                  {formatNaira(rev.boostRevenue)}
                </div>
                <span className="text-[11px] text-brand-700 font-semibold mt-1 block">
                  45 boosted listings × ₦2,000/wk
                </span>
              </Card>

              <Card padding="md" className="bg-brand-900 text-white">
                <span className="text-xs text-white font-bold uppercase">Estimated Net Revenue</span>
                <div className="text-2xl font-extrabold mt-1 text-white">
                  {formatNaira(rev.netRevenue)}
                </div>
                <span className="text-[11px] text-white mt-1 block">
                  Gross {formatNaira(rev.grossRevenue)} minus 2% payment fee ({formatNaira(rev.paymentProcessing)})
                </span>
              </Card>
            </div>

            {/* Clear Assumptions Box (Required by Section 7.12) */}
            <Card padding="md" className="border-brand-200 bg-brand-50/50">
              <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">
                Documented Financial Assumptions
              </h3>
              <ul className="text-xs text-ink-700 space-y-1.5 list-disc pl-5">
                {rev.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* SECTION 2: AGENT APPLICATIONS QUEUE (Target Demo: Mr Chidi Eze) */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-ink-900">
              Agent Application Review Queue ({pendingAgents.length})
            </h2>

            {pendingAgents.length === 0 ? (
              <Card padding="lg" className="h-full">
                <EmptyState
                  icon={<UserCheck className="w-10 h-10" />}
                  title="No applications waiting"
                  description="All agent applications have been reviewed. New submissions will appear here."
                  iconSize={40}
                  paddingClassName="py-8"
                />
              </Card>
            ) : (
              pendingAgents.map((ag) => (
                <Card key={ag.userId} padding="md" className="space-y-4 border-l-4 border-l-brand-600">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-ink-900 flex items-center gap-2">
                        <span>{ag.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 uppercase">
                          {ag.status.replace('_', ' ')}
                        </span>
                      </h3>
                      <span className="text-xs text-ink-700">
                        {ag.accountType.replace('_', ' ')} • Phone: {ag.phone} • Focus: {ag.areas.join(', ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-700 leading-relaxed bg-brand-50/50 p-2.5 rounded-xl border border-line">
                    "{ag.bio}"
                  </p>

                  {/* Simulated Automated Check Indicators */}
                  <div>
                    <span className="text-[11px] font-bold text-ink-900 block mb-2">
                      Automated Verification Checks:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-brand-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                        <span>Phone Verified</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-brand-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                        <span>ID NIN Match</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-brand-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                        <span>Selfie Biometric</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-brand-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                        <span>Authority Mandate</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-900 shrink-0" />
                        <span>Owner Call Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Approve, Request Info, Reject */}
                  <div className="flex gap-2 pt-2 border-t border-line">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-brand-700 hover:bg-brand-600"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => approveAgent(ag.userId)}
                    >
                      Approve Agent
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<HelpCircle className="w-4 h-4" />}
                      onClick={() => requestAgentInfo(ag.userId)}
                    >
                      Request Info
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-900 hover:bg-red-50"
                      onClick={() => rejectAgent(ag.userId, 'Incomplete authority documentation')}
                    >
                      Reject
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* SECTION 3: LISTING MODERATION */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-ink-900">
              Listing Moderation Queue
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.slice(0, 4).map((l) => (
                <Card key={l.id} padding="md" className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-ink-900">{l.title}</h3>
                      <span className="text-[11px] text-ink-700 block">{l.caption}</span>
                    </div>
                    <span className="text-xs font-extrabold text-brand-900">
                      {formatNaira(l.rentYearly)}/yr
                    </span>
                  </div>

                  {/* Risk Flags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {l.rentYearly < 700000 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900">
                        Low Price Flag
                      </span>
                    )}
                    {l.completenessScore < 70 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-900">
                        Low Completeness ({l.completenessScore}%)
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-900">
                      Mandate Checked
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-line">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => moderateListing(l.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => moderateListing(l.id, 'request_changes')}
                    >
                      Request Changes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: DISPUTES & CONTENT REPORTS */}
        {activeTab === 'disputes' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-ink-900">
              Active Disputes & Content Reports ({disputedBookings.length + reports.length})
            </h2>

            {disputedBookings.length === 0 && reports.length === 0 ? (
              <Card padding="lg" className="h-full">
                <EmptyState
                  icon={<ShieldCheck className="w-10 h-10" />}
                  title="No disputes or reports"
                  description="There are no active escrow disputes or content reports to review."
                  iconSize={40}
                  paddingClassName="py-8"
                />
              </Card>
            ) : (
              disputedBookings.map((b) => (
                <Card key={b.id} padding="md" className="space-y-3 border-l-4 border-l-red-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900 uppercase">
                      Escrow Dispute: Booking {b.id}
                    </span>
                    <span className="text-xs font-bold text-ink-900">Held: {formatNaira(b.feeAmount)}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div>Reason: <strong className="text-ink-900">{b.disputeReason}</strong></div>
                    {b.disputeNotes && (
                      <p className="text-ink-700 bg-red-50/50 p-2 rounded-lg">"{b.disputeNotes}"</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-line">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-600"
                      onClick={() => resolveDispute(b.id, 'refund_hunter')}
                    >
                      Refund ₦4,000 to Hunter
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => resolveDispute(b.id, 'release_agent')}
                    >
                      Release ₦3,400 to Agent
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* SECTION 5: AUDIT LOG (Searchable) */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-ink-900">Platform Audit Trail</h2>
              <div className="w-64">
                <input
                  type="text"
                  value={auditQuery}
                  onChange={(e) => setAuditQuery(e.target.value)}
                  placeholder="Search actions or actors..."
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-line bg-surface"
                />
              </div>
            </div>

            <Card padding="none" className="h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-brand-50 border-b border-line text-ink-900">
                      <th className="p-3 font-bold">Timestamp</th>
                      <th className="p-3 font-bold">Actor</th>
                      <th className="p-3 font-bold">Action</th>
                      <th className="p-3 font-bold">Target</th>
                      <th className="p-3 font-bold">State Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="p-3 text-[11px] text-ink-700 font-mono whitespace-nowrap">
                          {new Date(log.at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-3 font-bold text-ink-900">{log.actor}</td>
                        <td className="p-3 font-semibold text-brand-700">{log.action}</td>
                        <td className="p-3 font-mono text-[11px]">{log.target}</td>
                        <td className="p-3 text-[11px] text-ink-700">
                          {log.before && log.after ? `${log.before} to ${log.after}` : 'Initial'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
