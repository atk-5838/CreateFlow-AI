import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Mail,
  AlertCircle,
  Scissors,
  Check,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Campaign, CampaignStatus } from '../types';

export const CampaignsView: React.FC = () => {
  const {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    createCampaign,
    updateCampaignStatus,
    addRevision,
    resolveRevision,
    files,
    emails,
    setActiveTab,
    setSelectedEmailId,
  } = useWorkspace();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [revisionInput, setRevisionInput] = useState('');
  const [showAddRevisionBox, setShowAddRevisionBox] = useState(false);

  // New campaign form state
  const [newCampName, setNewCampName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newPayment, setNewPayment] = useState<number>(30000);
  const [newDeadline, setNewDeadline] = useState('20 Nov 2026');
  const [newDesc, setNewDesc] = useState('');

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Active'
        ? c.status !== 'Completed'
        : c.status === statusFilter;

    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.product.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim() || !newBrandName.trim()) return;

    createCampaign({
      name: newCampName.trim(),
      brandName: newBrandName.trim(),
      brandInitials: newBrandName.slice(0, 2).toUpperCase(),
      product: newProduct.trim() || 'Hero Product',
      description: newDesc.trim() || 'New creator collaboration campaign.',
      status: 'In production',
      agreedPayment: Number(newPayment) || 25000,
      paidAmount: 0,
      paymentStatus: 'Pending Invoice',
      startDate: '1 Nov 2026',
      deadline: newDeadline,
      requirements: ['1x 60s Reel with product feature spotlight'],
      tags: ['Sponsorship', 'Social Media'],
    });

    setCreateModalOpen(false);
    setNewCampName('');
    setNewBrandName('');
    setNewProduct('');
    setNewDesc('');
  };

  const handleAddRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionInput.trim() || !selectedCampaign) return;
    addRevision(selectedCampaign.id, revisionInput.trim());
    setRevisionInput('');
    setShowAddRevisionBox(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Campaign Details View (when one is selected) */}
      {selectedCampaign ? (
        <div className="space-y-6">
          {/* Back button and quick actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCampaignId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#68716D] hover:text-[#171A18] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to all campaigns</span>
            </button>

            <div className="flex items-center gap-2">
              <select
                value={selectedCampaign.status}
                onChange={(e) =>
                  updateCampaignStatus(selectedCampaign.id, e.target.value as CampaignStatus)
                }
                className="bg-white border border-[#E5E6E1] text-xs font-medium rounded-xl px-3 py-1.5 text-[#171A18]"
              >
                <option value="In production">In production</option>
                <option value="In revisions">In revisions</option>
                <option value="In review">In review</option>
                <option value="Contract Pending">Contract Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Campaign Header Card */}
          <div className="bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider">
                    {selectedCampaign.brandName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedCampaign.status === 'Completed'
                        ? 'bg-[#EBF5F0] text-[#216F50]'
                        : selectedCampaign.status === 'In revisions'
                        ? 'bg-[#FDF4EA] text-[#B45309]'
                        : 'bg-[#FEF9C3] text-[#A16207]'
                    }`}
                  >
                    {selectedCampaign.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-[#171A18] tracking-tight">
                  {selectedCampaign.name}
                </h1>
                <p className="text-xs text-[#68716D] mt-1 max-w-2xl leading-relaxed">
                  {selectedCampaign.description}
                </p>
              </div>

              {/* Agreed Payment & Payout Card */}
              <div className="bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl p-4 shrink-0 min-w-[200px]">
                <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block">
                  AGREED PAYMENT
                </span>
                <span className="text-xl font-bold text-[#171A18] block mt-0.5">
                  ₹{selectedCampaign.agreedPayment.toLocaleString()}
                </span>
                <div className="mt-2 text-xs flex items-center justify-between text-[#68716D]">
                  <span>Paid: ₹{selectedCampaign.paidAmount.toLocaleString()}</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedCampaign.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0F1ED] text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block">
                  Product
                </span>
                <span className="font-semibold text-[#171A18]">{selectedCampaign.product}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block">
                  Deadline
                </span>
                <span className="font-semibold text-red-700">{selectedCampaign.deadline}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block">
                  Start Date
                </span>
                <span className="font-semibold text-[#171A18]">{selectedCampaign.startDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block">
                  Deliverables
                </span>
                <span className="font-semibold text-[#171A18]">
                  {selectedCampaign.deliverables.length} tracked items
                </span>
              </div>
            </div>
          </div>

          {/* Deliverables & Revisions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deliverables */}
            <div className="bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#171A18]">
                  Deliverable Requirements
                </h3>
                <span className="text-xs text-[#68716D]">
                  {selectedCampaign.deliverables.length} items
                </span>
              </div>

              <div className="space-y-3">
                {selectedCampaign.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3.5 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#171A18]">{del.name}</p>
                      <p className="text-[#8A918D] text-[11px] mt-0.5">
                        {del.contentType} · Due {del.dueDate}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                        del.status === 'Approved' || del.status === 'Final'
                          ? 'bg-[#EBF5F0] text-[#216F50]'
                          : del.status === 'Revision required'
                          ? 'bg-[#FDF4EA] text-[#B45309]'
                          : 'bg-white text-[#68716D] border border-[#E5E6E1]'
                      }`}
                    >
                      {del.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block mb-2">
                  Scope Requirements
                </span>
                <ul className="space-y-1.5 text-xs text-[#68716D]">
                  {selectedCampaign.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#216F50] font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Revisions & Feedback Queue */}
            <div className="bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#171A18]">
                    Revision Requests & Feedback
                  </h3>
                  <p className="text-xs text-[#68716D]">
                    {selectedCampaign.revisions.length} recorded notes
                  </p>
                </div>

                <button
                  onClick={() => setShowAddRevisionBox(!showAddRevisionBox)}
                  className="text-xs font-semibold text-[#216F50] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add revision note</span>
                </button>
              </div>

              {showAddRevisionBox && (
                <form onSubmit={handleAddRevisionSubmit} className="space-y-2 bg-[#F7F7F4] p-3 rounded-xl border border-[#E5E6E1]">
                  <textarea
                    rows={2}
                    required
                    value={revisionInput}
                    onChange={(e) => setRevisionInput(e.target.value)}
                    placeholder="Enter brand revision request..."
                    className="w-full bg-white border border-[#E5E6E1] rounded-lg p-2 text-xs text-[#171A18] focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRevisionBox(false)}
                      className="px-3 py-1 text-xs text-[#68716D]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#216F50] text-white px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      Save Revision
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {selectedCampaign.revisions.length === 0 ? (
                  <p className="text-xs text-[#8A918D] italic py-6 text-center">
                    No open revision requests for this campaign.
                  </p>
                ) : (
                  selectedCampaign.revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl border border-[#E5E6E1] bg-white flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-3.5 h-3.5 text-[#B45309]" />
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              rev.status === 'Resolved'
                                ? 'bg-[#EBF5F0] text-[#216F50]'
                                : 'bg-[#FDF4EA] text-[#B45309]'
                            }`}
                          >
                            {rev.status}
                          </span>
                          <span className="text-[11px] text-[#8A918D]">
                            {rev.dateRequested}
                          </span>
                        </div>
                        <p className="text-xs text-[#171A18]">{rev.feedbackText}</p>
                      </div>

                      {rev.status === 'Pending' && (
                        <button
                          onClick={() => resolveRevision(selectedCampaign.id, rev.id)}
                          className="shrink-0 flex items-center gap-1 bg-[#EBF5F0] hover:bg-[#D5EFE3] text-[#216F50] px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Related Files & Emails Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attached Files */}
            <div className="bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#171A18]">Campaign Files</h3>
              <div className="space-y-2">
                {files
                  .filter((f) => f.campaignId === selectedCampaign.id)
                  .map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#171A18]">{f.name}</p>
                        <p className="text-[#8A918D] text-[11px]">
                          {f.size} · {f.version} · {f.status}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#68716D]">
                        {f.fileType}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Related Emails */}
            <div className="bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#171A18]">Linked Brand Emails</h3>
              <div className="space-y-2">
                {emails
                  .filter((e) => e.campaignId === selectedCampaign.id)
                  .map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        setSelectedEmailId(e.id);
                        setActiveTab('inbox');
                      }}
                      className="p-3 bg-[#F7F7F4] hover:bg-[#EBEBE7] border border-[#E5E6E1] rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#171A18] truncate">{e.subject}</p>
                        <p className="text-[#8A918D] text-[11px]">{e.senderName} · {e.date}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#68716D] shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Campaign List View */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
                CAMPAIGNS
              </span>
              <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
                Brand collaborations & briefs
              </h1>
              <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
                Track deliverables, agreements, payout terms and live creative feedback across all your sponsor partnerships.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-[#216F50] hover:bg-[#185A42] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-2xs transition-colors shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create campaign</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Active', 'In revisions', 'In production', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-[#216F50] text-white shadow-2xs'
                      : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns or brands..."
                className="w-full bg-white border border-[#E5E6E1] rounded-xl px-3 py-1.5 text-xs text-[#171A18] focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
            </div>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className="bg-white border border-[#E5E6E1] hover:border-[#D0D4CD] rounded-2xl p-5 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider">
                      {camp.brandName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        camp.status === 'Completed'
                          ? 'bg-[#EBF5F0] text-[#216F50]'
                          : camp.status === 'In revisions'
                          ? 'bg-[#FDF4EA] text-[#B45309]'
                          : 'bg-[#FEF9C3] text-[#A16207]'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#171A18] line-clamp-1">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-[#68716D] line-clamp-2 mt-1 leading-relaxed">
                    {camp.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#F0F1ED] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A918D]">Agreed Fee</span>
                    <span className="font-bold text-[#171A18]">
                      ₹{camp.agreedPayment.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8A918D]">Deadline</span>
                    <span className="font-medium text-red-700">{camp.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#216F50] font-medium">
                      {camp.revisions.length > 0
                        ? `${camp.revisions.length} open revisions`
                        : `${camp.deliverables.length} deliverables`}
                    </span>
                    <span className="text-xs font-semibold text-[#171A18] flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
              <h3 className="font-bold text-[#171A18] text-base">Create Brand Collaboration</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-[#8A918D] hover:text-[#171A18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. Acme Audio"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Product
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    placeholder="e.g. Studio Headphones"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="e.g. Acme Wireless Headphone Launch"
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Agreed Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPayment}
                    onChange={(e) => setNewPayment(Number(e.target.value))}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Delivery Deadline
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="25 Nov 2026"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Description / Campaign Scope
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key messaging points, creative direction..."
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
