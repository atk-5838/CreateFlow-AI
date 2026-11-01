import React, { useState } from 'react';
import { X, Send, Upload, CheckCircle2, Film } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface DeliverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverModal: React.FC<DeliverModalProps> = ({ isOpen, onClose }) => {
  const { campaigns, addDeliverable, addFile, logActivity } = useWorkspace();

  const [selectedCampId, setSelectedCampId] = useState(campaigns[0]?.id || 'camp-nova');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [versionTag, setVersionTag] = useState('vFinal');
  const [note, setNote] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim()) return;

    const camp = campaigns.find((c) => c.id === selectedCampId) || campaigns[0];

    // Add deliverable
    addDeliverable({
      name: deliverableTitle.trim(),
      campaignId: camp.id,
      campaignName: camp.name,
      brandName: camp.brandName,
      contentType: 'Video',
      dueDate: '1 Nov 2026',
      status: 'Submitted',
      revisionCount: 0,
    });

    // Add file
    addFile({
      name: `${deliverableTitle.toLowerCase().replace(/\s+/g, '_')}_${versionTag}.mp4`,
      size: `${(Math.random() * 120 + 80).toFixed(0)} MB`,
      uploadDate: '1 Nov',
      version: versionTag,
      brandName: camp.brandName,
      campaignId: camp.id,
      campaignName: camp.name,
      fileType: 'video',
      status: 'Final',
    });

    logActivity('deliverable', 'Prepared and submitted deliverable', `${deliverableTitle} (${versionTag}) to ${camp.brandName}`, camp.brandName);

    setIsDelivered(true);
    setTimeout(() => {
      setIsDelivered(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
        <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#216F50]" />
            <h3 className="font-bold text-[#171A18] text-base">Prepare a Delivery</h3>
          </div>
          <button onClick={onClose} className="text-[#8A918D] hover:text-[#171A18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDelivered ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#216F50] animate-bounce" />
            <h4 className="font-bold text-sm text-[#171A18]">Delivery Packaged & Logged!</h4>
            <p className="text-xs text-[#68716D]">
              File attached to campaign and marked submitted for brand review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#68716D] block mb-1">
                Select Brand Collaboration
              </label>
              <select
                value={selectedCampId}
                onChange={(e) => setSelectedCampId(e.target.value)}
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.brandName} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#68716D] block mb-1">
                Deliverable Name
              </label>
              <input
                type="text"
                required
                value={deliverableTitle}
                onChange={(e) => setDeliverableTitle(e.target.value)}
                placeholder="e.g. Fall Pace Running Reel Master Cut"
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Version Tag
                </label>
                <input
                  type="text"
                  value={versionTag}
                  onChange={(e) => setVersionTag(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Format
                </label>
                <input
                  type="text"
                  disabled
                  value="4K 9:16 Video (.mp4)"
                  className="w-full bg-[#EBEBE7] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#68716D] cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#68716D] block mb-1">
                Submission Notes to Brand Contact
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Details on color grading revisions, audio stems, or promo codes included..."
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl p-3 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Deliverable</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
