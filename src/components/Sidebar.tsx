import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Send,
  Folder,
  ListChecks,
  Activity,
  Settings,
  ChevronsUpDown,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, unreadEmailsCount, user, resetToDemo, logout } = useWorkspace();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadEmailsCount },
    { id: 'campaigns', label: 'Campaigns', icon: Sparkles },
    { id: 'deliverables', label: 'Deliverables', icon: Send },
    { id: 'files', label: 'Files', icon: Folder },
    { id: 'priorities', label: 'Priorities', icon: ListChecks },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleReset = () => {
    resetToDemo();
    setShowResetNotice(true);
    setProfileDropdownOpen(false);
    setTimeout(() => setShowResetNotice(false), 2500);
  };

  return (
    <aside className="w-72 bg-[#F1F1ED] border-r border-[#E5E6E1] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#216F50] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            C
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#171A18] tracking-tight leading-none">
              CreatorFlow AI
            </h1>
            <p className="text-xs text-[#68716D] mt-1 leading-none">
              Brand collaboration workspace
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 pt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#171A18] shadow-xs border border-[#E5E6E1]'
                    : 'text-[#68716D] hover:text-[#171A18] hover:bg-[#E8E8E3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#216F50]' : 'text-[#7A827F]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#216F50] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-[#E5E6E1] relative">
        {showResetNotice && (
          <div className="absolute -top-12 left-3 right-3 bg-[#185A42] text-white text-xs px-3 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-green-300" />
            <span>Workspace reset to demo data!</span>
          </div>
        )}

        {/* Profile Dropdown Menu */}
        {profileDropdownOpen && (
          <div className="absolute bottom-18 left-3 right-3 bg-white rounded-xl shadow-lg border border-[#E5E6E1] p-1.5 z-50 text-xs">
            <div className="px-3 py-2 border-b border-[#F0F1ED]">
              <p className="font-semibold text-[#171A18]">{user.name}</p>
              <p className="text-[#68716D] text-[11px]">{user.gmailAddress}</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('settings');
                setProfileDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] rounded-lg text-[#171A18] flex items-center gap-2 mt-1"
            >
              <Settings className="w-3.5 h-3.5 text-[#68716D]" />
              Account Settings
            </button>
            <button
              onClick={handleReset}
              className="w-full text-left px-3 py-2 hover:bg-[#FEE2E2] text-red-700 rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-600" />
              Reset Workspace Records
            </button>
            <div className="my-1 border-t border-[#F0F1ED]"></div>
            <button
              onClick={() => {
                setProfileDropdownOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] text-[#171A18] font-medium rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-[#68716D]" />
              Sign Out
            </button>
          </div>
        )}

        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#E8E8E3] transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#185A42] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.initials}
              </div>
              {user.isGoogleAuth && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#171A18] truncate leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-[#68716D] truncate leading-tight mt-0.5">
                {user.handle} · {user.role}
              </p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-[#8A918D] shrink-0 ml-1" />
        </button>
      </div>
    </aside>
  );
};
