import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Shield, RotateCw, ExternalLink, AlertCircle } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({ isOpen, onClose }) => {
  const { user, isLiveGmailConnected, connectLiveGmail, syncGmail, sendTestEmailToSelf } = useWorkspace();
  const [syncing, setSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectLive = async () => {
    setSyncing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await connectLiveGmail();
      setSuccessMessage('Successfully connected to Gmail and fetched live messages!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(
        err.message?.includes('popup')
          ? 'Browser popup blocked. Please allow popups for this site in your browser bar to complete Google authentication.'
          : err.message || 'Failed to authenticate with Google.'
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await syncGmail();
      if (res.success) {
        setSuccessMessage(`Gmail inbox synced! Retrieved ${res.count} live messages.`);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1800);
      } else {
        setErrorMessage(res.error || 'Failed to sync with Gmail.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync with Gmail.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSendTest = async () => {
    setSyncing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await sendTestEmailToSelf();
      if (res.success) {
        setSuccessMessage(`Test email sent to ${user.gmailAddress || user.email}! Check your Gmail inbox and sent items.`);
      } else {
        setErrorMessage(res.error || 'Failed to send test email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send test email.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E6E1] pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#216F50]" />
            <h3 className="font-bold text-[#171A18] text-base">Live Gmail Integration</h3>
          </div>
          <button onClick={onClose} className="text-[#8A918D] hover:text-[#171A18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Account Status Card */}
        <div className="p-4 bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EBF5F0] text-[#216F50] flex items-center justify-center font-bold shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[#171A18] truncate">
                {user.gmailAddress || user.email}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isLiveGmailConnected
                    ? 'bg-[#EBF5F0] text-[#216F50]'
                    : 'bg-[#FDF4EA] text-[#B45309]'
                }`}
              >
                {isLiveGmailConnected ? 'LIVE CONNECTED' : 'READY TO CONNECT'}
              </span>
            </div>
            <p className="text-[11px] text-[#8A918D] mt-0.5">
              Last synced: {user.lastSynced || 'Never'}
            </p>
          </div>
        </div>

        {/* Info list */}
        <div className="space-y-2 text-xs text-[#68716D]">
          <p>
            With permission from the app's users, CreatorFlow reads incoming emails to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Synchronize sponsor contracts and usage rights terms</li>
            <li>Extract video revisions & review deadlines directly into Priorities</li>
            <li>Send approved replies directly from your connected Gmail address</li>
          </ul>
        </div>

        {/* Security and Privacy Notice */}
        <div className="p-3 bg-[#EBF5F0] text-[#216F50] text-xs rounded-xl flex items-center gap-2">
          <Shield className="w-4 h-4 shrink-0" />
          <span>OAuth tokens are cached in-memory and encrypted via Google Cloud.</span>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success notification */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {isLiveGmailConnected ? (
            <button
              onClick={handleSendTest}
              disabled={syncing}
              className="px-3 py-1.5 text-xs font-semibold text-[#216F50] bg-[#EBF5F0] hover:bg-[#D5EFE3] rounded-xl transition-colors"
            >
              Send Test Email to Me
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
            >
              Cancel
            </button>

            {!isLiveGmailConnected ? (
              <button
                onClick={handleConnectLive}
                disabled={syncing}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Connecting...' : 'Connect Live Gmail'}</span>
              </button>
            ) : (
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Live Inbox'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
