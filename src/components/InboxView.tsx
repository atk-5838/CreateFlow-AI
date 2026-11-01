import React, { useState } from 'react';
import {
  Mail,
  Search,
  Sparkles,
  ListChecks,
  PenSquare,
  ArrowUpRight,
  RotateCw,
  Send,
  CheckCircle2,
  X,
  ExternalLink,
  Inbox as InboxIcon,
  Check,
  Copy,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { EmailCategory, EmailThread } from '../types';

interface InboxViewProps {
  onOpenGmailModal: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onOpenGmailModal }) => {
  const {
    emails,
    selectedEmailId,
    setSelectedEmailId,
    toggleEmailUnread,
    setActiveTab,
    setSelectedCampaignId,
    addPriority,
    logActivity,
    sendLiveReply,
    sendTestEmailToSelf,
    syncGmail,
    isLiveGmailConnected,
    user,
  } = useWorkspace();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [inboxSearch, setInboxSearch] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  
  // Draft / Compose Reply Modal state
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'reply' | 'compose'>('reply');
  const [recipientTo, setRecipientTo] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [ccMe, setCcMe] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftSentNotice, setDraftSentNotice] = useState(false);
  const [sendSuccessDetail, setSendSuccessDetail] = useState<string | null>(null);
  const [sendErrorDetail, setSendErrorDetail] = useState<string | null>(null);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [isSendingLive, setIsSendingLive] = useState(false);

  // Extract Actions Modal state
  const [actionItemsModalOpen, setActionItemsModalOpen] = useState(false);
  const [extractedActions, setExtractedActions] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [actionAddedNotice, setActionAddedNotice] = useState<string | null>(null);

  // Count live emails
  const liveEmailsCount = emails.filter((e) => e.isLive || e.id.startsWith('live-gmail')).length;

  // Filter categories
  const categories: { label: string; count: number }[] = [
    { label: 'All', count: emails.length },
    { label: 'Unread', count: emails.filter((e) => e.unread).length },
    ...(liveEmailsCount > 0 ? [{ label: 'Live Gmail', count: liveEmailsCount }] : []),
    { label: 'Brand Deals', count: emails.filter((e) => e.categories.includes('Brand Deals')).length },
    { label: 'Feedback', count: emails.filter((e) => e.categories.includes('Feedback')).length },
    { label: 'Deadlines', count: emails.filter((e) => e.categories.includes('Deadlines')).length },
    { label: 'Follow-ups', count: emails.filter((e) => e.categories.includes('Follow-ups')).length },
  ];

  // Filtered emails
  const filteredEmails = emails.filter((email) => {
    const isLiveMsg = email.isLive || email.id.startsWith('live-gmail');
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Unread'
        ? email.unread
        : activeCategory === 'Live Gmail'
        ? isLiveMsg
        : email.categories.includes(activeCategory as EmailCategory);

    const matchesSearch =
      inboxSearch === '' ||
      email.brandName.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.senderName.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.senderEmail.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.subject.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.body.toLowerCase().includes(inboxSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || emails[0];

  const handleOpenCampaign = (campaignId?: string) => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
      setActiveTab('campaigns');
    }
  };

  const handleReanalyze = async () => {
    if (!selectedEmail) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail }),
      });
      const data = await res.json();
      if (data.summary) {
        selectedEmail.aiInsights.summary = data.summary;
        selectedEmail.aiInsights.detectedIntent = data.detectedIntent;
        selectedEmail.aiInsights.requestedChanges = data.requestedChanges;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraftReplyClick = async () => {
    if (!selectedEmail) return;
    setModalMode('reply');
    setRecipientTo(selectedEmail.senderEmail);
    setReplySubject(selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`);
    setSendSuccessDetail(null);
    setSendErrorDetail(null);
    setDraftModalOpen(true);
    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail }),
      });
      const data = await res.json();
      setDraftText(data.draft || '');
    } catch (e) {
      setDraftText(
        `Hi ${selectedEmail.senderName},\n\nThank you for following up! Everything looks good on my end. I will review the notes and send through the updated links shortly.\n\nBest regards,\nAlex`
      );
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleComposeNewEmail = () => {
    setModalMode('compose');
    setRecipientTo(user.gmailAddress || user.email);
    setReplySubject('Creator Partnership Inquiry');
    setDraftText(`Hi there,\n\nI hope you are having a wonderful week!\n\nI am writing to share our latest media kit and explore potential collaboration opportunities for upcoming content campaigns.\n\nPlease feel free to let me know if you would like to review our deliverables and current availability.\n\nBest regards,\n${user.name}\n${user.handle} · Creator`);
    setSendSuccessDetail(null);
    setSendErrorDetail(null);
    setDraftModalOpen(true);
  };

  const handleExtractActionsClick = async () => {
    if (!selectedEmail) return;
    setActionItemsModalOpen(true);
    setIsExtracting(true);
    try {
      const res = await fetch('/api/ai/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail }),
      });
      const data = await res.json();
      if (data.actionItems && data.actionItems.length > 0) {
        setExtractedActions(data.actionItems);
      } else {
        setExtractedActions([
          `Reply to ${selectedEmail.senderName} regarding "${selectedEmail.subject}"`,
          selectedEmail.aiInsights.requestedChanges !== 'No changes requested'
            ? selectedEmail.aiInsights.requestedChanges
            : 'Confirm proposed collaboration terms and contract details',
        ]);
      }
    } catch (e) {
      setExtractedActions([
        `Respond to ${selectedEmail.brandName} request`,
        'Verify dates and deliverables with management',
      ]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddExtractedTaskToPriorities = (itemText: string) => {
    if (!selectedEmail) return;
    addPriority({
      category: 'EMAIL',
      title: itemText,
      description: `Extracted from email: "${selectedEmail.subject}" from ${selectedEmail.senderName}`,
      campaignId: selectedEmail.campaignId || 'camp-glowskin',
      campaignName: selectedEmail.campaignName || selectedEmail.brandName,
      brandName: selectedEmail.brandName,
      timeframe: 'today',
      isOverdue: false,
      dueDate: '1 Nov 2026',
      completed: false,
    });
    setActionAddedNotice(itemText);
    setTimeout(() => setActionAddedNotice(null), 3000);
  };

  const handleOpenSendConfirmation = () => {
    setConfirmSendOpen(true);
  };

  const handleConfirmedSendLiveReply = async () => {
    setIsSendingLive(true);
    setSendSuccessDetail(null);
    setSendErrorDetail(null);
    try {
      const targetTo = recipientTo.trim() || selectedEmail?.senderEmail || user.email;
      const ccTarget = ccMe ? (user.gmailAddress || user.email) : undefined;
      const res = await sendLiveReply(targetTo, replySubject, draftText, ccTarget);
      
      if (res.success) {
        setSendSuccessDetail(`Email delivered to ${targetTo}${ccTarget ? ` (CC: ${ccTarget})` : ''}!`);
        setDraftSentNotice(true);
        setTimeout(() => {
          setConfirmSendOpen(false);
          setDraftModalOpen(false);
          setDraftSentNotice(false);
          setSendSuccessDetail(null);
        }, 2200);
      } else {
        setSendErrorDetail(res.error || 'Failed to send via Gmail. Please check popup authorization.');
      }
    } catch (err: any) {
      setSendErrorDetail(err.message || 'Error occurred while sending email.');
    } finally {
      setIsSendingLive(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
            INTELLIGENT INBOX
          </span>
          <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
            Brand conversations, sorted
          </h1>
          <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
            Every brand email is read, categorised and linked to the campaign it belongs to — so nothing needs remembering.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={handleComposeNewEmail}
            className="flex items-center gap-1.5 bg-[#216F50] hover:bg-[#185A42] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <PenSquare className="w-4 h-4" />
            <span>Compose Email</span>
          </button>

          <button
            onClick={onOpenGmailModal}
            className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors ${
              isLiveGmailConnected
                ? 'bg-[#EBF5F0] border-[#D5EFE3] text-[#216F50] hover:bg-[#D5EFE3]'
                : 'bg-white border-[#E5E6E1] text-[#171A18] hover:bg-[#F3F4F0]'
            }`}
          >
            {isLiveGmailConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#216F50] animate-pulse" />
                <span>Gmail Connected (Live)</span>
              </>
            ) : (
              <>
                <InboxIcon className="w-4 h-4 text-[#216F50]" />
                <span>Connect Gmail</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Mailbox Sync & Test Strip */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
              isLiveGmailConnected
                ? 'bg-[#EBF5F0] text-[#216F50]'
                : 'bg-[#FDF4EA] text-[#B45309]'
            }`}
          >
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#171A18]">
                {user.gmailAddress || user.email}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isLiveGmailConnected
                    ? 'bg-[#EBF5F0] text-[#216F50]'
                    : 'bg-[#FDF4EA] text-[#B45309]'
                }`}
              >
                {isLiveGmailConnected ? '● Live Mailbox Active' : '○ Standby / Demo Mode'}
              </span>
            </div>
            <p className="text-[11px] text-[#68716D] mt-0.5">
              {isLiveGmailConnected
                ? `Syncing live with Google Gmail API. Last refresh: ${user.lastSynced || 'Just now'}.`
                : `Connect your live Gmail account to fetch real messages and deliver replies directly to your inbox.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={async () => {
              setIsSyncing(true);
              const res = await syncGmail();
              if (res.success) {
                setSyncStatusMessage(`Synced ${res.count} live messages from your Gmail!`);
              } else {
                setSyncStatusMessage(res.error || 'Could not sync live messages.');
              }
              setTimeout(() => setSyncStatusMessage(null), 4000);
              setIsSyncing(false);
            }}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F3F4F0] px-3 py-1.5 rounded-xl text-xs font-medium text-[#171A18] shadow-2xs transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#216F50] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              setIsSendingTest(true);
              const res = await sendTestEmailToSelf();
              if (res.success) {
                setSyncStatusMessage(`Test email sent to ${user.gmailAddress || user.email}! Check your Gmail inbox & sent folder.`);
              } else {
                setSyncStatusMessage(`Send failed: ${res.error}`);
              }
              setTimeout(() => setSyncStatusMessage(null), 6000);
              setIsSendingTest(false);
            }}
            disabled={isSendingTest}
            className="flex items-center gap-1.5 bg-[#EBF5F0] hover:bg-[#D5EFE3] text-[#216F50] border border-[#D5EFE3] px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
            <span>{isSendingTest ? 'Sending...' : 'Send Test Email to Me'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner Notice */}
      {syncStatusMessage && (
        <div className="bg-[#EBF5F0] border border-[#D5EFE3] text-[#216F50] text-xs p-3 rounded-xl flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{syncStatusMessage}</span>
          </div>
          <button
            onClick={() => setSyncStatusMessage(null)}
            className="text-[#216F50] hover:text-[#185A42] font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main 2-Panel Inbox Card */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Panel: Email Threads List (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#E5E6E1] flex flex-col bg-white">
          {/* Search Box */}
          <div className="p-4 border-b border-[#E5E6E1]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A918D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                placeholder="Search senders, brands, subjects..."
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171A18] placeholder:text-[#8A918D] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#216F50]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#216F50] text-white shadow-2xs'
                        : 'bg-[#F7F7F4] text-[#68716D] hover:text-[#171A18] hover:bg-[#EBEBE7] border border-[#E5E6E1]'
                    }`}
                  >
                    {cat.label} {cat.count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F1ED] max-h-[600px]">
            {filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`p-4 transition-colors cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#F7F7F4]'
                      : 'hover:bg-[#FAFAF8] bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Brand Initials Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        email.brandColor === '#216F50' || email.unread
                          ? 'bg-[#216F50] text-white'
                          : 'bg-[#E5E6E1] text-[#68716D]'
                      }`}
                    >
                      {email.brandInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top Row: Brand & Date & Dot */}
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#171A18]">
                          {email.brandName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#8A918D]">
                            {email.date}
                          </span>
                          {email.unread && (
                            <span className="w-2 h-2 rounded-full bg-[#216F50] shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <h4 className="text-xs font-semibold text-[#171A18] truncate mt-0.5">
                        {email.subject}
                      </h4>

                      {/* Snippet Preview */}
                      <p className="text-[11px] text-[#68716D] line-clamp-2 mt-1 leading-snug">
                        {email.preview}
                      </p>

                      {/* Category and Brand Tags */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {(email.isLive || email.id.startsWith('live-gmail')) && (
                          <span className="bg-[#185A42] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            LIVE GMAIL
                          </span>
                        )}
                        {email.categories.map((c) => (
                          <span
                            key={c}
                            className="bg-[#EBF5F0] text-[#216F50] text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                        <span className="bg-[#F1F1ED] text-[#68716D] text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-[120px]">
                          {email.senderEmail || email.brandName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Selected Email Thread Details (7 cols) */}
        {selectedEmail && (
          <div className="lg:col-span-7 flex flex-col bg-white">
            {/* Thread Header Bar */}
            <div className="p-6 border-b border-[#E5E6E1] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#EBF5F0] text-[#216F50] text-xs font-semibold px-2.5 py-0.5 rounded-md">
                    {selectedEmail.categories[0] || 'Brand Deals'}
                  </span>
                  <button
                    onClick={() => handleOpenCampaign(selectedEmail.campaignId)}
                    className="bg-[#F1F1ED] hover:bg-[#E5E6E1] text-[#68716D] text-xs font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-colors"
                  >
                    <span>{selectedEmail.brandName}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => toggleEmailUnread(selectedEmail.id)}
                  className="flex items-center gap-1.5 text-xs text-[#68716D] hover:text-[#171A18] font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedEmail.unread ? 'Mark read' : 'Mark unread'}</span>
                </button>
              </div>

              {/* Subject Title */}
              <div>
                <h2 className="text-xl font-bold text-[#171A18] tracking-tight">
                  {selectedEmail.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#68716D] mt-1.5">
                  <span className="font-semibold text-[#171A18]">
                    {selectedEmail.senderName}
                  </span>
                  <span>{selectedEmail.senderEmail}</span>
                  <span>·</span>
                  <span>{selectedEmail.timestamp}</span>
                </div>
              </div>

              {/* Functional Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleReanalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-[#216F50] ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>Summarize email</span>
                </button>

                <button
                  onClick={handleExtractActionsClick}
                  className="flex items-center gap-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <ListChecks className="w-3.5 h-3.5 text-[#216F50]" />
                  <span>Extract action items</span>
                </button>

                <button
                  onClick={handleDraftReplyClick}
                  className="flex items-center gap-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <PenSquare className="w-3.5 h-3.5 text-[#216F50]" />
                  <span>Draft reply</span>
                </button>

                <button
                  onClick={() => handleOpenCampaign(selectedEmail.campaignId)}
                  className="flex items-center gap-1.5 bg-[#185A42] hover:bg-[#216F50] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <span>Open campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Email Body & AI Insights Subgrid */}
            <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 overflow-y-auto">
              {/* Message Body (7 cols) */}
              <div className="xl:col-span-7 text-sm text-[#171A18] whitespace-pre-line leading-relaxed font-normal">
                {selectedEmail.body}
              </div>

              {/* AI Insights Card (5 cols) */}
              <div className="xl:col-span-5 bg-[#FAFAF8] border border-[#E5E6E1] rounded-xl p-4 flex flex-col justify-between space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-2.5">
                    <span className="flex items-center gap-1.5 bg-[#EBF5F0] text-[#216F50] px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-wide">
                      <Sparkles className="w-3 h-3" />
                      AI INSIGHTS
                    </span>
                    <button
                      onClick={handleReanalyze}
                      disabled={isAnalyzing}
                      className="text-[#68716D] hover:text-[#171A18] flex items-center gap-1 text-[11px] font-medium"
                    >
                      <RotateCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>Re-analyse</span>
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block mb-1">
                      SUMMARY
                    </span>
                    <p className="text-xs text-[#171A18] leading-relaxed">
                      {selectedEmail.aiInsights.summary}
                    </p>
                  </div>

                  {/* Detected Intent */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block mb-1">
                      DETECTED INTENT
                    </span>
                    <span className="inline-block bg-[#EBF5F0] text-[#216F50] font-medium px-2 py-0.5 rounded text-xs">
                      {selectedEmail.aiInsights.detectedIntent}
                    </span>
                  </div>

                  {/* Related Campaign */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block mb-1">
                      CAMPAIGN
                    </span>
                    <button
                      onClick={() => handleOpenCampaign(selectedEmail.campaignId)}
                      className="text-[#216F50] hover:underline font-medium flex items-center gap-1 text-xs text-left"
                    >
                      <span>{selectedEmail.campaignName || 'General Brand Inquiry'}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>

                  {/* Requested Changes & Deadlines */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block mb-1">
                      REQUESTED CHANGES & DEADLINES
                    </span>
                    <p className="text-xs text-[#68716D]">
                      {selectedEmail.aiInsights.requestedChanges}
                    </p>
                    {selectedEmail.aiInsights.deadlineNotice && (
                      <p className="text-xs text-amber-700 mt-1 font-medium">
                        {selectedEmail.aiInsights.deadlineNotice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Draft & Compose Email Modal */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#216F50]" />
                <h3 className="font-bold text-[#171A18] text-base">
                  {modalMode === 'compose'
                    ? 'Compose New Message'
                    : `Reply to ${selectedEmail?.brandName || 'Brand'}`}
                </h3>
              </div>
              <button
                onClick={() => setDraftModalOpen(false)}
                className="text-[#8A918D] hover:text-[#171A18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingDraft ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-[#216F50] animate-spin" />
                <p className="text-xs text-[#68716D] font-medium">
                  Drafting professional message with creator terms...
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Recipient To */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#68716D]">
                      To (Recipient Email)
                    </label>
                    <button
                      type="button"
                      onClick={() => setRecipientTo(user.gmailAddress || user.email)}
                      className="text-[11px] font-medium text-[#216F50] hover:underline"
                    >
                      Use my email ({user.email})
                    </button>
                  </div>
                  <input
                    type="email"
                    value={recipientTo}
                    onChange={(e) => setRecipientTo(e.target.value)}
                    placeholder="sponsor@brand.com or your email"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>

                {/* Body Message */}
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={7}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl p-3 text-xs text-[#171A18] font-normal leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#216F50] focus:bg-white"
                  />
                </div>

                {/* CC Me Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ccMe}
                      onChange={(e) => setCcMe(e.target.checked)}
                      className="rounded border-[#E5E6E1] text-[#216F50] focus:ring-[#216F50]"
                    />
                    <span className="text-xs text-[#68716D]">
                      Send a copy to my inbox ({user.email})
                    </span>
                  </label>
                </div>

                {/* Success Notice */}
                {sendSuccessDetail && (
                  <div className="bg-[#EBF5F0] border border-[#D5EFE3] text-[#216F50] text-xs p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{sendSuccessDetail}</span>
                  </div>
                )}

                {/* Error Notice */}
                {sendErrorDetail && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center justify-between gap-2">
                    <span>{sendErrorDetail}</span>
                    <button
                      type="button"
                      onClick={onOpenGmailModal}
                      className="bg-red-700 text-white font-medium text-[11px] px-2 py-1 rounded-lg"
                    >
                      Connect Gmail
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(draftText);
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#68716D] hover:text-[#171A18] font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy message</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDraftModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOpenSendConfirmation}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send via Gmail</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive / Mutating Email Operation */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#216F50] flex items-center justify-center font-bold shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#171A18]">
                  Confirm Sending Email
                </h3>
                <p className="text-xs text-[#68716D]">
                  This will dispatch an email through your Google account.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8A918D]">Recipient:</span>
                <span className="font-semibold text-[#171A18] truncate max-w-[240px]">
                  {recipientTo || user.email}
                </span>
              </div>
              {ccMe && (
                <div className="flex justify-between">
                  <span className="text-[#8A918D]">CC:</span>
                  <span className="font-semibold text-[#171A18]">{user.gmailAddress || user.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#8A918D]">Subject:</span>
                <span className="font-semibold text-[#171A18] truncate max-w-[240px]">
                  {replySubject || 'No Subject'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A918D]">From:</span>
                <span className="font-semibold text-[#216F50]">
                  {user.gmailAddress || user.email}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#68716D]">
              Confirming will send this email directly via Gmail API to the specified recipient.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedSendLiveReply}
                disabled={isSendingLive}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingLive ? 'animate-spin' : ''}`} />
                <span>{isSendingLive ? 'Sending via Gmail...' : 'Confirm & Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extract Action Items Modal */}
      {actionItemsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#216F50]" />
                <h3 className="font-bold text-[#171A18] text-base">
                  Extracted Action Items
                </h3>
              </div>
              <button
                onClick={() => setActionItemsModalOpen(false)}
                className="text-[#8A918D] hover:text-[#171A18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isExtracting ? (
              <div className="py-10 flex flex-col items-center justify-center gap-2">
                <RotateCw className="w-5 h-5 text-[#216F50] animate-spin" />
                <p className="text-xs text-[#68716D]">
                  Extracting actionable revision tasks...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#68716D]">
                  CreatorFlow parsed the following action points from {selectedEmail?.senderName}'s message:
                </p>

                <div className="space-y-2">
                  {extractedActions.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="text-[#171A18] font-medium">{act}</span>
                      <button
                        onClick={() => handleAddExtractedTaskToPriorities(act)}
                        className="shrink-0 bg-[#216F50] hover:bg-[#185A42] text-white px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                      >
                        + Add to Priorities
                      </button>
                    </div>
                  ))}
                </div>

                {actionAddedNotice && (
                  <div className="bg-[#EBF5F0] text-[#216F50] text-xs p-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to your priorities queue!</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActionItemsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium bg-[#171A18] text-white rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
