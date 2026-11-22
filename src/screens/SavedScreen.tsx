import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Scale,
  Trash2,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  FileText,
  MapPin,
} from 'lucide-react';
import { HouseImage } from '../components/common/HouseImage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useStore } from '../store/useStore';
import { moveInCost, formatNaira, accuracyScore } from '../lib';
import { Listing } from '../data/types';

export const SavedScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    listings,
    agents,
    savedListingIds,
    toggleSave,
    shortlistNotes,
    setShortlistNote,
    compareListingIds,
    toggleCompare,
    clearCompare,
    addToast,
  } = useStore();

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));
  const compareListings = listings.filter((l) => compareListingIds.includes(l.id));

  const handleOpenNote = (id: string) => {
    setEditingNoteId(id);
    setTempNote(shortlistNotes[id] || '');
  };

  const handleSaveNote = () => {
    if (editingNoteId) {
      setShortlistNote(editingNoteId, tempNote.trim());
      setEditingNoteId(null);
      addToast('Shortlist note saved', 'success');
    }
  };

  const handleOpenCompare = () => {
    if (compareListingIds.length < 2) {
      addToast('Select at least 2 houses to compare', 'info');
      return;
    }
    setCompareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg pb-24 text-ink-900">
      {/* Header */}
      <div className="bg-surface border-b border-line px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-ink-900">Saved Shortlist</h1>
            <p className="text-xs text-ink-700 mt-0.5">
              {savedListings.length} {savedListings.length === 1 ? 'house' : 'houses'} saved
            </p>
          </div>

          {compareListingIds.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon={<Scale className="w-4 h-4" />}
              onClick={handleOpenCompare}
            >
              Compare ({compareListingIds.length})
            </Button>
          )}
        </div>
      </div>

      <div className="px-0 py-0 space-y-4">
        {savedListings.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mx-auto mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink-900">No houses saved yet</h3>
            <p className="text-xs text-ink-700 mt-1 mb-5">
              Tap the Save bookmark icon while browsing the Discover feed to shortlist houses for comparison.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/')}>
              Explore Houses
            </Button>
          </div>
        ) : (
          savedListings.map((listing) => {
            const isCompared = compareListingIds.includes(listing.id);
            const cost = moveInCost(listing);
            const note = shortlistNotes[listing.id];

            return (
              <Card key={listing.id} padding="none">
                <div className="flex flex-col">
                  {/* House Header */}
                  <div
                    onClick={() => navigate(`/house/${listing.id}`)}
                    className="flex h-28 overflow-hidden rounded-t-card cursor-pointer"
                  >
                    <div className="w-32 bg-brand-50 shrink-0">
                      <HouseImage
                        houseId={listing.id}
                        sceneType="exterior"
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-ink-900 line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-[11px] text-ink-700 line-clamp-1 mt-0.5">
                          {listing.caption}
                        </p>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-extrabold text-brand-900">
                          {formatNaira(listing.rentYearly)}/yr
                        </span>
                        <span className="text-[10px] font-semibold text-ink-700">
                          Move-in: {formatNaira(cost.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Note Section */}
                  <div className="px-3 py-2 bg-brand-50/50 border-t border-line text-xs flex items-center justify-between">
                    <div className="flex-1 truncate mr-2">
                      {note ? (
                        <span className="text-ink-700 italic text-[11px]">"{note}"</span>
                      ) : (
                        <span className="text-ink-700 text-[11px]">No notes added</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenNote(listing.id)}
                      className="text-[11px] font-bold text-brand-700 hover:underline shrink-0"
                    >
                      {note ? 'Edit note' : '+ Add note'}
                    </button>
                  </div>

                  {/* Actions footer */}
                  <div className="px-3 py-2 border-t border-line flex items-center justify-between bg-surface">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(listing.id)}
                        className="accent-brand-600 rounded"
                      />
                      <span>Select to compare</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => toggleSave(listing.id)}
                      className="text-ink-700 hover:text-red-900 p-1"
                      aria-label="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Note Edit Modal */}
      <Modal
        isOpen={Boolean(editingNoteId)}
        onClose={() => setEditingNoteId(null)}
        title="Shortlist Private Note"
      >
        <div className="space-y-3">
          <p className="text-xs text-ink-700">
            Write your personal reminders or questions for when you view this house:
          </p>
          <textarea
            rows={3}
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            placeholder="e.g. Check water pressure in master bath..."
            className="w-full text-xs p-3 rounded-xl border border-line bg-surface text-ink-900 focus:outline-none focus:border-brand-600"
          />
          <Button variant="primary" className="w-full" onClick={handleSaveNote}>
            Save Note
          </Button>
        </div>
      </Modal>

      {/* Side-by-Side Comparison Table Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Side-by-Side House Comparison"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          <p className="text-xs text-ink-700">
            Comparing verified features across your shortlisted houses:
          </p>

          <div className="overflow-x-auto border border-line rounded-xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-brand-50 border-b border-line">
                  <th className="p-2 font-bold text-ink-900">Feature</th>
                  {compareListings.map((c) => (
                    <th key={c.id} className="p-2 font-bold text-ink-900 max-w-[120px] truncate">
                      {c.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {/* Yearly Rent */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Yearly Rent</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 font-extrabold text-brand-900">
                      {formatNaira(c.rentYearly)}
                    </td>
                  ))}
                </tr>

                {/* Move-in Total */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Move-in Cost</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 font-bold text-ink-900">
                      {formatNaira(moveInCost(c).total)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Bedrooms</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 font-semibold text-ink-900">
                      {c.bedrooms === 0 ? 'Studio' : `${c.bedrooms} Bed`}
                    </td>
                  ))}
                </tr>

                {/* Power Hours */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Power</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 text-[11px] text-ink-900">
                      {c.features.electricity.status === 'provided'
                        ? String(c.features.electricity.value)
                        : 'Not provided'}
                    </td>
                  ))}
                </tr>

                {/* Prepaid Meter */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Prepaid Meter</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 text-xs">
                      {c.features.prepaidMeter.status === 'provided' && c.features.prepaidMeter.value ? (
                        <span className="text-brand-700 font-bold">Yes</span>
                      ) : (
                        <span className="text-amber-900 font-bold">Not provided</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Water Source */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Water Source</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 text-[11px] text-ink-900">
                      {c.features.waterSource.status === 'provided'
                        ? String(c.features.waterSource.value)
                        : 'Not provided'}
                    </td>
                  ))}
                </tr>

                {/* Road */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Road Quality</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 text-[11px] text-ink-900">
                      {c.features.roadCondition.status === 'provided'
                        ? String(c.features.roadCondition.value)
                        : 'Not provided'}
                    </td>
                  ))}
                </tr>

                {/* Flooding */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Flood History</td>
                  {compareListings.map((c) => (
                    <td key={c.id} className="p-2 text-[11px] text-ink-900">
                      {c.features.floodingHistory.status === 'provided'
                        ? String(c.features.floodingHistory.value)
                        : 'Not provided'}
                    </td>
                  ))}
                </tr>

                {/* Agent Accuracy */}
                <tr>
                  <td className="p-2 font-semibold text-ink-700">Agent Accuracy</td>
                  {compareListings.map((c) => {
                    const ag = agents.find((a) => a.userId === c.agentId);
                    const acc = ag ? accuracyScore(ag) : null;
                    return (
                      <td key={c.id} className="p-2 font-bold text-brand-700 text-[11px]">
                        {acc?.label || 'New Agent'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <Button variant="secondary" className="w-full" onClick={() => setCompareModalOpen(false)}>
            Close Comparison
          </Button>
        </div>
      </Modal>
    </div>
  );
};
