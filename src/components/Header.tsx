import React, { useState } from 'react';
import { Search, Bell, Sparkles, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const Header: React.FC = () => {
  const {
    user,
    searchQuery,
    setSearchQuery,
    assistantOpen,
    setAssistantOpen,
    priorities,
    emails,
    setActiveTab,
    setSelectedEmailId,
    setSelectedCampaignId,
  } = useWorkspace();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Compute pending notification alerts
  const notifications = [
    {
      id: 'notif-1',
      title: 'Revision overdue for Nova Athletics',
      time: '9 days overdue',
      type: 'urgent',
      action: () => {
        setActiveTab('priorities');
        setNotificationsOpen(false);
      },
    },
    {
      id: 'notif-2',
      title: 'GlowSkin awaiting usage reply',
      time: 'Today',
      type: 'mail',
      action: () => {
        setActiveTab('inbox');
        setSelectedEmailId('email-glowskin-1');
        setNotificationsOpen(false);
      },
    },
    {
      id: 'notif-3',
      title: 'INV-1042 payout due from Urban Brew',
      time: '12 days overdue',
      type: 'urgent',
      action: () => {
        setActiveTab('campaigns');
        setSelectedCampaignId('camp-urbanbrew');
        setNotificationsOpen(false);
      },
    },
    {
      id: 'notif-4',
      title: 'Marketing team review tomorrow at 4 PM',
      time: 'Nova Athletics',
      type: 'deadline',
      action: () => {
        setActiveTab('inbox');
        setSelectedEmailId('email-nova-1');
        setNotificationsOpen(false);
      },
    },
  ];

  return (
    <header className="h-16 px-8 border-b border-[#E5E6E1] bg-[#F7F7F4]/90 backdrop-blur-xs flex items-center justify-between sticky top-0 z-30">
      {/* Global Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-[#8A918D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campaigns, emails, brands..."
          className="w-full bg-white border border-[#E5E6E1] rounded-xl pl-10 pr-4 py-2 text-sm text-[#171A18] placeholder:text-[#8A918D] focus:outline-none focus:ring-1 focus:ring-[#216F50] focus:border-[#216F50] transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A918D] hover:text-[#171A18]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Creator Workspace Status Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-white border border-[#E5E6E1] rounded-full px-3 py-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#216F50]"></span>
          <span className="text-[11px] font-semibold text-[#171A18] tracking-wide">
            {user.handle ? `${user.handle.toUpperCase()} · ACTIVE` : 'CREATOR WORKSPACE'}
          </span>
        </div>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-xl border border-[#E5E6E1] bg-white flex items-center justify-center text-[#68716D] hover:text-[#171A18] hover:border-[#D5D7D0] transition-colors relative shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#216F50] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#F7F7F4]">
              10
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E5E6E1] p-2 z-50 animate-fade-in text-xs">
              <div className="p-2 border-b border-[#F0F1ED] flex items-center justify-between">
                <span className="font-semibold text-[#171A18] text-sm">Action Alerts</span>
                <span className="text-[#216F50] font-medium text-[11px]">10 active notices</span>
              </div>
              <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={n.action}
                    className="w-full text-left p-2 hover:bg-[#F7F7F4] rounded-lg transition-colors flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-[#171A18] leading-tight">{n.title}</p>
                      <p className="text-[#8A918D] text-[11px] mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ask CreatorFlow Green Button */}
        <button
          onClick={() => setAssistantOpen(!assistantOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
            assistantOpen
              ? 'bg-[#185A42] text-white ring-2 ring-[#216F50]/30'
              : 'bg-[#216F50] hover:bg-[#185A42] text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Ask CreatorFlow</span>
        </button>
      </div>
    </header>
  );
};
