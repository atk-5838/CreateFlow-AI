import React, { useState } from 'react';
import {
  Layers,
  Mail,
  Scissors,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  RotateCw,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface OverviewViewProps {
  onOpenDeliverModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenDeliverModal }) => {
  const {
    activeCampaignsCount,
    unreadEmailsCount,
    pendingRevisionsCount,
    paymentsAwaitingCount,
    paymentsAwaitingAmount,
    priorities,
    campaigns,
    setActiveTab,
    setSelectedCampaignId,
  } = useWorkspace();

  const [briefingText, setBriefingText] = useState(
    "You have 6 items that need attention today. Nova Athletics is waiting for your revised video, and Urban Brew's delivery deadline is close."
  );
  const [isRewriting, setIsRewriting] = useState(false);

  const handleRewriteBriefing = async () => {
    setIsRewriting(true);
    try {
      const res = await fetch('/api/ai/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priorities: priorities.filter((p) => !p.completed),
          unreadCount: unreadEmailsCount,
        }),
      });
      const data = await res.json();
      if (data.briefing) {
        setBriefingText(data.briefing);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleOpenCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  // Top 3 priority items to display in the main card
  const topPriorities = priorities.slice(0, 3);

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Top Welcome Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
            1 NOV 2026
          </span>
          <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
            Good evening, Alex.
          </h1>
          <p className="text-sm text-[#68716D] mt-1 max-w-2xl">
            You have 6 items that need attention today. Nova Athletics is waiting for your revised video, and Urban Brew's delivery deadline is close.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDeliverModal}
            className="flex items-center gap-2 bg-white border border-[#E5E6E1] text-[#171A18] hover:bg-[#F3F4F0] px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#216F50]" />
            <span>Prepare a delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className="flex items-center gap-2 bg-[#216F50] hover:bg-[#185A42] text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Open inbox</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Campaigns */}
        <div
          onClick={() => setActiveTab('campaigns')}
          className="bg-white border border-[#E5E6E1] rounded-2xl p-5 hover:border-[#D0D4CD] transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider">
              ACTIVE CAMPAIGNS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EBF5F0] flex items-center justify-center text-[#216F50]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#171A18] tracking-tight">
              {activeCampaignsCount}
            </div>
            <p className="text-xs text-[#68716D] mt-1 font-medium">
              1 completed · 1 in revisions
            </p>
          </div>
        </div>

        {/* Card 2: Unread Important Mail */}
        <div
          onClick={() => setActiveTab('inbox')}
          className="bg-white border border-[#E5E6E1] rounded-2xl p-5 hover:border-[#D0D4CD] transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider">
              UNREAD IMPORTANT MAIL
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EBF3F5] flex items-center justify-center text-[#2B6CB0]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#171A18] tracking-tight">
              {unreadEmailsCount > 0 ? 1 : 0}
            </div>
            <p className="text-xs text-[#68716D] mt-1 font-medium truncate">
              Nova Athletics
            </p>
          </div>
        </div>

        {/* Card 3: Pending Revisions */}
        <div
          onClick={() => setActiveTab('priorities')}
          className="bg-white border border-[#E5E6E1] rounded-2xl p-5 hover:border-[#D0D4CD] transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider">
              PENDING REVISIONS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FDF4EA] flex items-center justify-center text-[#B45309]">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#171A18] tracking-tight">
              {pendingRevisionsCount}
            </div>
            <p className="text-xs text-[#68716D] mt-1 font-medium">
              5 open across your campaigns
            </p>
          </div>
        </div>

        {/* Card 4: Payments Awaiting Follow-up */}
        <div
          onClick={() => setActiveTab('campaigns')}
          className="bg-white border border-[#E5E6E1] rounded-2xl p-5 hover:border-[#D0D4CD] transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider">
              PAYMENTS AWAITING FOLLOW-UP
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#B91C1C]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#171A18] tracking-tight">
              {paymentsAwaitingCount}
            </div>
            <p className="text-xs text-[#68716D] mt-1 font-medium">
              ₹{paymentsAwaitingAmount.toLocaleString()} still open
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: Today's Priorities + AI Daily Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Today's Priorities (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E6E1] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#171A18]">
                Today's priorities
              </h2>
              <p className="text-xs text-[#68716D] mt-0.5">
                Built from revision requests, unread brand mail and open invoices.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('priorities')}
              className="text-xs font-semibold text-[#216F50] hover:text-[#185A42] flex items-center gap-1 group transition-colors"
            >
              <span>All priorities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Priority Rows */}
          <div className="space-y-3">
            {topPriorities.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#E5E6E1] hover:border-[#D0D4CD] transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        item.category === 'REVISION'
                          ? 'bg-[#FDF4EA] text-[#B45309]'
                          : item.category === 'DEADLINE'
                          ? 'bg-[#FEF9C3] text-[#A16207]'
                          : 'bg-[#EBF5F0] text-[#216F50]'
                      }`}
                    >
                      {item.category}
                    </span>

                    <span className="font-semibold text-sm text-[#171A18]">
                      {item.title}
                    </span>

                    {item.isOverdue && item.overdueText && (
                      <span className="bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.overdueText}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#68716D] line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenCampaign(item.campaignId)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] text-xs font-medium rounded-lg transition-colors self-start sm:self-center"
                >
                  <span>Open campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#68716D]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Daily Briefing (1 col) */}
        <div className="bg-[#185A42] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <h3 className="text-base font-bold tracking-tight">AI daily briefing</h3>
              </div>
              <button
                onClick={handleRewriteBriefing}
                disabled={isRewriting}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-400/30 text-emerald-100 hover:bg-white/10 text-xs font-medium transition-colors"
              >
                <RotateCw className={`w-3 h-3 ${isRewriting ? 'animate-spin' : ''}`} />
                <span>Rewrite</span>
              </button>
            </div>
            <p className="text-[10px] font-semibold text-emerald-200/80 uppercase tracking-wider mt-1">
              SUMMARISED FROM TODAY'S RECORDS
            </p>

            <p className="text-sm text-emerald-50/95 leading-relaxed mt-4 font-normal">
              {briefingText}
            </p>
          </div>

          {/* Recommended Next Actions */}
          <div className="pt-4 border-t border-emerald-700/50">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-2.5">
              RECOMMENDED NEXT ACTIONS
            </span>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleOpenCampaign('camp-nova')}
                className="w-full text-left text-emerald-100 hover:text-white flex items-start gap-2 group transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
                <span>Complete 3 requested revisions for Nova Athletics</span>
              </button>
              <button
                onClick={() => handleOpenCampaign('camp-peakaudio')}
                className="w-full text-left text-emerald-100 hover:text-white flex items-start gap-2 group transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
                <span>Complete 2 requested revisions for Peak Audio</span>
              </button>
              <button
                onClick={() => handleOpenCampaign('camp-urbanbrew')}
                className="w-full text-left text-emerald-100 hover:text-white flex items-start gap-2 group transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
                <span>Deliver Urban Brew's One coffee product video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
