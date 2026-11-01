import React, { useState } from 'react';
import { Send, Plus, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, Filter } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Deliverable, DeliverableStatus } from '../types';

export const DeliverablesView: React.FC = () => {
  const {
    campaigns,
    updateDeliverableStatus,
    addDeliverable,
    setActiveTab,
    setSelectedCampaignId,
  } = useWorkspace();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New deliverable form state
  const [delName, setDelName] = useState('');
  const [delCampaignId, setDelCampaignId] = useState(campaigns[0]?.id || 'camp-nova');
  const [delContentType, setDelContentType] = useState<'Reel' | 'Video' | 'Story' | 'Carousel' | 'Photo' | 'YouTube'>('Reel');
  const [delDueDate, setDelDueDate] = useState('10 Nov 2026');

  // Flatten all deliverables from campaigns
  const allDeliverables = campaigns.flatMap((c) => c.deliverables);

  const statuses: DeliverableStatus[] = [
    'Not started',
    'In progress',
    'Draft',
    'Submitted',
    'In review',
    'Revision required',
    'Approved',
    'Final',
  ];

  const filteredDeliverables = allDeliverables.filter((d) => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delName.trim()) return;

    const parentCamp = campaigns.find((c) => c.id === delCampaignId) || campaigns[0];

    addDeliverable({
      name: delName.trim(),
      campaignId: parentCamp.id,
      campaignName: parentCamp.name,
      brandName: parentCamp.brandName,
      contentType: delContentType,
      dueDate: delDueDate,
      status: 'Not started',
      revisionCount: 0,
    });

    setDelName('');
    setAddModalOpen(false);
  };

  const handleOpenCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
            DELIVERABLES
          </span>
          <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
            Production & delivery pipeline
          </h1>
          <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
            Track video exports, revisions and submission signoffs across all brand sponsor obligations.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#216F50] hover:bg-[#185A42] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-2xs transition-colors shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add deliverable</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['All', 'Revision required', 'Submitted', 'In progress', 'Draft', 'Approved', 'Final'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#216F50] text-white shadow-2xs'
                    : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deliverables..."
            className="w-full bg-white border border-[#E5E6E1] rounded-xl px-3 py-1.5 text-xs text-[#171A18] focus:outline-none focus:ring-1 focus:ring-[#216F50]"
          />
        </div>
      </div>

      {/* Deliverables List Card */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl shadow-2xs divide-y divide-[#E5E6E1] overflow-hidden">
        {filteredDeliverables.length === 0 ? (
          <div className="py-16 text-center text-[#68716D] text-sm">
            No deliverables match the selected filter.
          </div>
        ) : (
          filteredDeliverables.map((del) => (
            <div
              key={del.id}
              className="p-5 hover:bg-[#FAFAF8] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#171A18]">
                    {del.name}
                  </span>
                  <span className="bg-[#F1F1ED] text-[#68716D] font-semibold text-[10px] px-2 py-0.5 rounded-md uppercase">
                    {del.contentType}
                  </span>
                  {del.revisionCount > 0 && (
                    <span className="bg-[#FDF4EA] text-[#B45309] font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {del.revisionCount} revisions
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[#68716D] text-xs">
                  <button
                    onClick={() => handleOpenCampaign(del.campaignId)}
                    className="text-[#216F50] hover:underline font-medium flex items-center gap-0.5"
                  >
                    <span>{del.brandName}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <span>·</span>
                  <span>Due {del.dueDate}</span>
                </div>
              </div>

              {/* Status Selector & Campaign Button */}
              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <select
                  value={del.status}
                  onChange={(e) =>
                    updateDeliverableStatus(del.id, e.target.value as DeliverableStatus)
                  }
                  className={`border rounded-xl px-3 py-1.5 font-semibold text-xs shadow-2xs cursor-pointer ${
                    del.status === 'Approved' || del.status === 'Final'
                      ? 'bg-[#EBF5F0] text-[#216F50] border-[#D5EFE3]'
                      : del.status === 'Revision required'
                      ? 'bg-[#FDF4EA] text-[#B45309] border-[#FEE2CD]'
                      : 'bg-white text-[#171A18] border-[#E5E6E1]'
                  }`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleOpenCampaign(del.campaignId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] font-medium rounded-xl transition-colors shadow-2xs"
                >
                  <span>Open campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#68716D]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Deliverable Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDeliverable}
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up"
          >
            <h3 className="font-bold text-[#171A18] text-base">New Deliverable Item</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  value={delName}
                  onChange={(e) => setDelName(e.target.value)}
                  placeholder="e.g., Unboxing Reel (45s)"
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Assign to Campaign
                </label>
                <select
                  value={delCampaignId}
                  onChange={(e) => setDelCampaignId(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brandName} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Format
                  </label>
                  <select
                    value={delContentType}
                    onChange={(e: any) => setDelContentType(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                  >
                    <option value="Reel">Instagram Reel</option>
                    <option value="Video">Video Export</option>
                    <option value="Story">Story Bundle</option>
                    <option value="YouTube">YouTube Segment</option>
                    <option value="Carousel">Carousel Stills</option>
                    <option value="Photo">Brand Photos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    required
                    value={delDueDate}
                    onChange={(e) => setDelDueDate(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                Save Deliverable
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
