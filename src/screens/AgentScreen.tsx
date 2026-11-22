import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Flag,
  MessageSquare,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Send,
  Lock,
  Building2,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { Avatar } from '../components/common/Avatar';
import { TrustChip } from '../components/common/TrustChip';
import { Card } from '../components/common/Card';
import { Button, IconButton } from '../components/common/Button';
import { PriceTag } from '../components/common/PriceTag';
import { Modal } from '../components/common/Modal';
import { BottomSheet } from '../components/common/BottomSheet';
import { useStore } from '../store/useStore';
import { accuracyScore, formatNaira } from '../lib';
import { EmptyState } from '../components/common/EmptyState';

export const AgentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { agents, listings, addToast, reportContent, currentUser } = useStore();
  const fromHouseId = searchParams.get('house');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState([
    { sender: 'agent', text: 'Hello! Thanks for your enquiry. How can I assist your house search?' },
  ]);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const agent = agents.find((a) => a.userId === id);
  const pinnedHouse = listings.find((l) => l.id === fromHouseId);

  // Agent's other listings
  const portfolio = listings.filter((l) => l.agentId === id && l.id !== fromHouseId);

  if (!agent) {
    return (
      <div className="p-8 text-center text-ink-900">
        <h2 className="text-lg font-bold">Agent profile not found</h2>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Back to Feed
        </Button>
      </div>
    );
  }

  const acc = accuracyScore(agent);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Warning if message contains suspected bank details or account numbers (Trust & Safety rule)
    const hasNumbers = /\d{10}/.test(chatMessage);
    if (hasNumbers) {
      addToast(
        'Warning: We never ask you to pay anyone outside HouseMe. All booking fees are held in protected escrow.',
        'warning'
      );
    }

    setMessagesList((prev) => [
      ...prev,
      { sender: 'hunter', text: chatMessage.trim() },
    ]);
    setChatMessage('');

    setTimeout(() => {
      setMessagesList((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Thank you! The flat is available. You can book an inspection slot through HouseMe to hold your viewing safely.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Top Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-ink-900" />}
            label="Back"
            variant="ghost"
            onClick={() => navigate(-1)}
          />

          <div className="flex items-center gap-1.5">
            <IconButton
              icon={<Share2 className="w-5 h-5 text-ink-700" />}
              label="Share"
              variant="ghost"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                addToast('Agent profile link copied!', 'success');
              }}
            />
            <IconButton
              icon={<Flag className="w-5 h-5 text-ink-700" />}
              label="Report"
              variant="ghost"
              onClick={() => setReportModalOpen(true)}
            />
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex items-start gap-4">
          <Avatar name={agent.name} verified={agent.status === 'approved'} size="xl" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-ink-900 truncate">{agent.name}</h1>
            <span className="text-xs font-bold text-brand-700 capitalize block mt-0.5">
              {agent.accountType.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <TrustChip source="Verified uploader" size="sm" />
              <TrustChip source="Authority checked" size="sm" />
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-100">
            <span className="text-[10px] font-bold text-ink-700 uppercase tracking-wider block">
              Listing Accuracy
            </span>
            <span className="text-sm font-extrabold text-brand-900 block mt-0.5">
              {acc.label}
            </span>
            {acc.sublabel && (
              <span className="text-[10px] text-brand-700 font-semibold">{acc.sublabel}</span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-100">
            <span className="text-[10px] font-bold text-ink-700 uppercase tracking-wider block">
              Response Time
            </span>
            <span className="text-sm font-extrabold text-brand-900 block mt-0.5">
              ~{agent.responseTimeMins} mins
            </span>
            <span className="text-[10px] text-brand-700 font-semibold">Fast Mainland Dispatch</span>
          </div>
        </div>

        {/* Areas & Bio */}
        <div className="mt-4 pt-3 border-t border-line text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-ink-700">
            <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
            <span>Covers: <strong className="text-ink-900">{agent.areas.join(', ')}</strong></span>
          </div>
          <p className="text-ink-700 leading-relaxed text-[11px]">{agent.bio}</p>
        </div>

        {/* Message Agent CTA Button */}
        <Button
          variant="primary"
          className="w-full mt-4"
          icon={<MessageSquare className="w-4 h-4" />}
          onClick={() => setChatOpen(true)}
        >
          Message {agent.name}
        </Button>
      </div>

      {/* Body: "You were viewing" pinned card */}
      <div className="px-0 py-0 space-y-5">
        {pinnedHouse && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                You were viewing
              </span>
            </div>

            <Card padding="none" interactive onClick={() => navigate(`/house/${pinnedHouse.id}`)}>
              <div className="flex h-28 overflow-hidden rounded-card">
                <div className="w-32 bg-brand-50 shrink-0">
                  <HouseImage
                    houseId={pinnedHouse.id}
                    sceneType="exterior"
                    alt={pinnedHouse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-ink-900 line-clamp-1">
                      {pinnedHouse.title}
                    </span>
                    <p className="text-[11px] text-ink-700 line-clamp-1 mt-0.5">
                      {pinnedHouse.caption}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm font-extrabold text-brand-900">
                      {formatNaira(pinnedHouse.rentYearly)}/yr
                    </span>
                    <span className="text-xs font-bold text-brand-700 flex items-center">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Portfolio Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-ink-900">
              Agent's Other Listings ({portfolio.length})
            </h2>
            <span className="text-[11px] text-ink-700">Published & Active</span>
          </div>

          {portfolio.length === 0 ? (
            <Card padding="md" className="h-full">
              <EmptyState
                icon={<Building2 className="w-10 h-10" />}
                title="No other listings"
                description="This agent has no other published houses right now."
                iconSize={40}
                paddingClassName="py-6"
              />
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/house/${item.id}`)}
                  className="bg-surface rounded-card border border-line shadow-card overflow-hidden cursor-pointer hover:shadow-float transition-all active:scale-98"
                >
                  <div className="w-full h-28 bg-brand-50">
                    <HouseImage
                      houseId={item.id}
                      sceneType="exterior"
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-extrabold text-ink-900 truncate">
                      {formatNaira(item.rentYearly)}/yr
                    </div>
                    <div className="text-[11px] text-ink-700 line-clamp-1 mt-0.5">
                      {item.bedrooms === 0 ? 'Studio' : `${item.bedrooms} Bed`} • {item.title}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-brand-700 font-bold">
                        {item.completenessScore}% Complete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* In-app Message Bottom Sheet */}
      <BottomSheet
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        title={`Chat with ${agent.name}`}
        maxHeight="max-h-[85vh]"
      >
        <div className="flex flex-col h-[400px]">
          {/* Trust Reassurance Banner */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5 shrink-0 mb-3">
            <Lock className="w-3.5 h-3.5 text-amber-900 shrink-0" />
            <span>
              We never ask you to pay anyone outside HouseMe. Booking fees are held safely in escrow.
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {messagesList.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'hunter' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'hunter'
                      ? 'bg-brand-700 text-white rounded-br-none'
                      : 'bg-brand-50 text-ink-900 border border-brand-100 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto py-2 shrink-0">
            {['Still available?', 'Is light steady?', 'Can I inspect tomorrow?'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setChatMessage(q)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-brand-50 text-brand-900 border border-brand-100 whitespace-nowrap hover:bg-brand-100"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-line shrink-0">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-line bg-surface text-ink-900 focus:outline-none focus:border-brand-600"
            />
            <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
              Send
            </Button>
          </form>
        </div>
      </BottomSheet>

      {/* Report Agent Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Agent"
      >
        <div className="space-y-3 text-xs">
          <p className="text-ink-700">
            Reports are investigated by HouseMe compliance. Select a reason:
          </p>
          <div className="space-y-1.5">
            {[
              'Agent requested direct cash/bank transfer outside app',
              'Agent was unpunctual or failed to show up',
              'Agent misrepresented property features or photos',
            ].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  reportContent('agent', agent.userId, r);
                  setReportModalOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl border border-line hover:bg-red-50 hover:border-red-200 transition-colors font-semibold"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
