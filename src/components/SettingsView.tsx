import React, { useState } from 'react';
import {
  Settings,
  User,
  Mail,
  Bell,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Shield,
  Save,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const SettingsView: React.FC = () => {
  const { user, resetToDemo, syncGmail, isLiveGmailConnected, connectLiveGmail } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'profile' | 'gmail' | 'ai' | 'notifications'>('profile');

  // Form state
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio);
  const [email, setEmail] = useState(user.email);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = name;
    user.handle = handle;
    user.bio = bio;
    user.email = email;
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncGmail();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
          SETTINGS
        </span>
        <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
          Workspace preferences & integrations
        </h1>
        <p className="text-sm text-[#68716D] mt-1">
          Manage creator profile, synced accounts, AI analysis preferences and notification alerts.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E6E1] pb-2 overflow-x-auto">
        {[
          { id: 'profile', label: 'Creator Profile', icon: User },
          { id: 'gmail', label: 'Gmail Connection', icon: Mail },
          { id: 'ai', label: 'AI Co-pilot Settings', icon: Sparkles },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-[#171A18] shadow-2xs border border-[#E5E6E1]'
                  : 'text-[#68716D] hover:text-[#171A18]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#216F50]' : 'text-[#8A918D]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content Area */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl shadow-2xs p-6">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-base font-bold text-[#171A18]">Public Creator Profile</h3>
            <p className="text-xs text-[#68716D]">
              This information is shared with sponsors and referenced in AI-drafted replies and media briefs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Social Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Collaboration Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Workspace Currency
                </label>
                <input
                  type="text"
                  disabled
                  value="INR (₹)"
                  className="w-full bg-[#EBEBE7] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#68716D] cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#68716D] block mb-1">
                Creator Bio / Brand Pitch
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl p-3 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
            </div>

            {savedNotice && (
              <div className="bg-[#EBF5F0] text-[#216F50] text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-[#216F50] hover:bg-[#185A42] text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Gmail */}
        {activeTab === 'gmail' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#171A18]">Gmail Sync & Brand Parser</h3>
            <p className="text-xs text-[#68716D]">
              CreatorFlow securely reads emails from brand sponsors to automatically extract revisions, deadlines, and contracts.
            </p>

            <div className="p-4 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF5F0] text-[#216F50] flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#171A18]">
                      {user.gmailAddress || user.email}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLiveGmailConnected
                          ? 'bg-[#EBF5F0] text-[#216F50]'
                          : 'bg-[#FDF4EA] text-[#B45309]'
                      }`}
                    >
                      {isLiveGmailConnected ? 'LIVE CONNECTED' : 'CONNECTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A918D] mt-0.5">
                    Last synced: {user.lastSynced || 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSyncing(true);
                    try {
                      await connectLiveGmail();
                    } finally {
                      setIsSyncing(false);
                    }
                  }}
                  className="bg-white border border-[#E5E6E1] hover:bg-[#EBEBE7] text-xs font-medium px-3 py-1.5 rounded-lg text-[#171A18] transition-colors"
                >
                  Switch Google Account
                </button>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-[#216F50] hover:bg-[#185A42] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
                >
                  {isSyncing ? 'Syncing...' : 'Sync Live Messages'}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F1ED] space-y-2 text-xs text-[#68716D]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#216F50]" />
                <span>Tokens are encrypted and isolated per creator session.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Co-pilot */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#171A18]">CreatorFlow AI Engine</h3>
            <p className="text-[#68716D]">
              Powered by Google Gemini 3.8 Flash to interpret incoming brand contracts, extract video revisions, and calculate daily priorities.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-[#171A18]">Auto-Extract Revision Notes</p>
                  <p className="text-[#8A918D] text-[11px]">
                    Automatically create pending revision tasks whenever a sponsor provides video feedback.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#216F50] w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-[#171A18]">Executive Daily Briefing</p>
                  <p className="text-[#8A918D] text-[11px]">
                    Generate prioritized summary of blockers and deadlines at morning login.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#216F50] w-4 h-4" />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#171A18]">Notification Rules</h3>
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-[#171A18]">Overdue Milestones & Invoices</p>
                  <p className="text-[#8A918D] text-[11px]">
                    Alert when a delivery date or invoice exceeds 48 hours without update.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#216F50] w-4 h-4" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone / Reset */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-2xs space-y-3">
        <h4 className="text-sm font-bold text-red-700">Demo Data Reset</h4>
        <p className="text-xs text-[#68716D]">
          Reset all workspace records (Nova Athletics, GlowSkin, Urban Brew, Peak Audio) to the initial reference state.
        </p>
        <button
          onClick={resetToDemo}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium text-xs rounded-xl border border-red-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-600" />
          <span>Reset All Workspace Records to Demo</span>
        </button>
      </div>
    </div>
  );
};
