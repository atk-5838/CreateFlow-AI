import React, { useState } from 'react';
import {
  FileVideo,
  FileImage,
  FileText,
  File,
  Eye,
  Upload,
  Download,
  Trash2,
  X,
  Plus,
  Play,
  CheckCircle,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileType, WorkspaceFile } from '../types';

export const FilesView: React.FC = () => {
  const {
    files,
    campaigns,
    addFile,
    deleteFile,
    setActiveTab,
    setSelectedCampaignId,
  } = useWorkspace();

  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image' | 'document' | 'other'>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  
  // Preview Modal
  const [previewFile, setPreviewFile] = useState<WorkspaceFile | null>(null);

  // Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCampaignId, setUploadCampaignId] = useState(campaigns[0]?.id || 'camp-nova');
  const [uploadFileType, setUploadFileType] = useState<FileType>('video');
  const [uploadVersion, setUploadVersion] = useState('v1');
  const [uploadStatus, setUploadStatus] = useState<'Draft' | 'Final' | 'Reference'>('Draft');

  // Filtered files
  const filteredFiles = files.filter((f) => {
    const matchesType = typeFilter === 'all' || f.fileType === typeFilter;
    const matchesCampaign =
      campaignFilter === 'all' ||
      f.campaignName.toLowerCase().includes(campaignFilter.toLowerCase()) ||
      f.brandName.toLowerCase().includes(campaignFilter.toLowerCase());
    return matchesType && matchesCampaign;
  });

  const handleOpenCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const camp = campaigns.find((c) => c.id === uploadCampaignId) || campaigns[0];

    addFile({
      name: uploadFileName.trim(),
      size: `${(Math.random() * 150 + 5).toFixed(1)} MB`,
      uploadDate: '1 Nov',
      version: uploadVersion,
      brandName: camp.brandName,
      campaignId: camp.id,
      campaignName: camp.name,
      fileType: uploadFileType,
      status: uploadStatus,
      isCustomUpload: true,
    });

    setUploadFileName('');
    setUploadModalOpen(false);
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'video':
        return <FileVideo className="w-5 h-5 text-[#68716D]" />;
      case 'image':
        return <FileImage className="w-5 h-5 text-[#68716D]" />;
      case 'document':
        return <FileText className="w-5 h-5 text-[#68716D]" />;
      default:
        return <File className="w-5 h-5 text-[#68716D]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
            FILES
          </span>
          <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
            Drafts, finals and briefs in one library
          </h1>
          <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
            Every file stays attached to the campaign it belongs to, with its version and status visible at a glance.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 bg-[#216F50] hover:bg-[#185A42] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-2xs transition-colors shrink-0 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload file</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'video', label: 'Video' },
            { id: 'image', label: 'Image' },
            { id: 'document', label: 'Document' },
            { id: 'other', label: 'Other' },
          ].map((item) => {
            const isActive = typeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTypeFilter(item.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#216F50] text-white shadow-2xs'
                    : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Campaign Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All campaigns' },
            { id: 'Sunrise Kombucha', label: 'Sunrise Kombucha' },
            { id: 'Trailhead Gear', label: 'Trailhead Gear' },
          ].map((item) => {
            const isActive = campaignFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCampaignFilter(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#216F50] text-white shadow-2xs'
                    : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid of File Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white border border-[#E5E6E1] rounded-2xl p-5 hover:border-[#D0D4CD] transition-all shadow-2xs flex flex-col justify-between space-y-4"
          >
            {/* Top row: Icon, Name, Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F4] border border-[#E5E6E1] flex items-center justify-center shrink-0">
                  {getFileIcon(file.fileType)}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#171A18] truncate leading-tight">
                    {file.name}
                  </h3>
                  <p className="text-xs text-[#8A918D] mt-1">
                    {file.size} · uploaded {file.uploadDate}
                  </p>

                  {/* Sub-tags */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="bg-[#F1F1ED] text-[#68716D] text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {file.version}
                    </span>
                    <button
                      onClick={() => handleOpenCampaign(file.campaignId)}
                      className="text-[#216F50] hover:underline text-[11px] font-medium truncate"
                    >
                      {file.brandName}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                  file.status === 'Draft'
                    ? 'bg-[#FEF9C3] text-[#A16207]'
                    : file.status === 'Final'
                    ? 'bg-[#EBF5F0] text-[#216F50]'
                    : 'bg-[#F1F1ED] text-[#68716D]'
                }`}
              >
                {file.status}
              </span>
            </div>

            {/* Bottom Row: File Type and Preview Action Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F1ED]">
              <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider">
                {file.fileType.toUpperCase()}
              </span>

              <button
                onClick={() => setPreviewFile(file)}
                className="flex items-center gap-1.5 text-xs text-[#68716D] hover:text-[#171A18] font-medium transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5E6E1] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-[#E5E6E1] flex items-center justify-between bg-[#F7F7F4]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E6E1] flex items-center justify-center">
                  {getFileIcon(previewFile.fileType)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#171A18] truncate max-w-md">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-[#68716D]">
                    {previewFile.brandName} · {previewFile.version} · {previewFile.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-[#8A918D] hover:text-[#171A18] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Player Preview Canvas */}
            <div className="bg-[#171A18] p-8 flex flex-col items-center justify-center min-h-[300px] text-white">
              {previewFile.fileType === 'video' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                  </div>
                  <span className="text-xs text-white/70">
                    Video Player Preview Simulator ({previewFile.name})
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileImage className="w-16 h-16 text-white/50" />
                  <span className="text-xs text-white/70">High-Resolution Creative Stills</span>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-white flex items-center justify-between">
              <button
                onClick={() => {
                  deleteFile(previewFile.id);
                  setPreviewFile(null);
                }}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete file</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob(['creatorflow file asset content'], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = previewFile.name;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 bg-[#216F50] hover:bg-[#185A42] text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download file</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
              <h3 className="font-bold text-[#171A18] text-base">Upload New File Asset</h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-[#8A918D] hover:text-[#171A18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. nova_running_cut_v3.mp4"
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Assign to Campaign
                </label>
                <select
                  value={uploadCampaignId}
                  onChange={(e) => setUploadCampaignId(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brandName} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Type
                  </label>
                  <select
                    value={uploadFileType}
                    onChange={(e: any) => setUploadFileType(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-2 py-2 text-xs text-[#171A18]"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    placeholder="v3"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-2 py-2 text-xs text-[#171A18]"
                  >
                  </input>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Status
                  </label>
                  <select
                    value={uploadStatus}
                    onChange={(e: any) => setUploadStatus(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-2 py-2 text-xs text-[#171A18]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Final">Final</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                Upload File
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
