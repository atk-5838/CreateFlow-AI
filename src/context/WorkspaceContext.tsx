import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Campaign,
  Deliverable,
  EmailThread,
  PriorityItem,
  RevisionRecord,
  WorkspaceFile,
  PaymentRecord,
  ActivityRecord,
  DeliverableStatus,
  CampaignStatus,
  UserProfile,
} from '../types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_EMAILS,
  INITIAL_FILES,
  INITIAL_PRIORITIES,
  INITIAL_PAYMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_USER,
} from '../data/initialData';
import {
  googleSignIn,
  googleSignOut,
  getAccessToken,
  initAuth,
} from '../services/googleAuth';
import {
  fetchLiveGmailMessages,
  sendLiveGmailReply,
} from '../services/gmailService';

interface WorkspaceContextType {
  user: UserProfile;
  campaigns: Campaign[];
  emails: EmailThread[];
  files: WorkspaceFile[];
  priorities: PriorityItem[];
  payments: PaymentRecord[];
  activities: ActivityRecord[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  selectedEmailId: string | null;
  setSelectedEmailId: (id: string | null) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Computed metrics
  activeCampaignsCount: number;
  unreadEmailsCount: number;
  pendingRevisionsCount: number;
  paymentsAwaitingCount: number;
  paymentsAwaitingAmount: number;
  todayTasksCount: number;
  next2DaysTasksCount: number;
  thisWeekTasksCount: number;

  // Auth
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  signup: (name: string, handle: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Actions
  toggleEmailUnread: (emailId: string) => void;
  togglePriorityCompleted: (priorityId: string) => void;
  addPriority: (priority: Omit<PriorityItem, 'id'>) => void;
  addFile: (file: Omit<WorkspaceFile, 'id'>) => void;
  deleteFile: (fileId: string) => void;
  addDeliverable: (deliverable: Omit<Deliverable, 'id'>) => void;
  updateDeliverableStatus: (deliverableId: string, status: DeliverableStatus) => void;
  addRevision: (campaignId: string, feedbackText: string) => void;
  resolveRevision: (campaignId: string, revisionId: string) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'revisions' | 'deliverables'>) => void;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;
  recordPaymentStatus: (paymentId: string, status: 'Paid' | 'Open' | 'Overdue') => void;
  logActivity: (type: ActivityRecord['type'], title: string, description: string, brandName: string) => void;
  // Gmail Live
  isLiveGmailConnected: boolean;
  connectLiveGmail: () => Promise<void>;
  sendLiveReply: (to: string, subject: string, body: string, cc?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendTestEmailToSelf: () => Promise<{ success: boolean; messageId?: string; error?: string }>;
  syncGmail: () => Promise<{ success: boolean; count: number; error?: string }>;
  resetToDemo: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persistence for seamless state management
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('creatorflow_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('creatorflow_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [emails, setEmails] = useState<EmailThread[]>(() => {
    const saved = localStorage.getItem('creatorflow_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [files, setFiles] = useState<WorkspaceFile[]>(() => {
    const saved = localStorage.getItem('creatorflow_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [priorities, setPriorities] = useState<PriorityItem[]>(() => {
    const saved = localStorage.getItem('creatorflow_priorities');
    return saved ? JSON.parse(saved) : INITIAL_PRIORITIES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('creatorflow_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [activities, setActivities] = useState<ActivityRecord[]>(() => {
    const saved = localStorage.getItem('creatorflow_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('creatorflow_auth_session') === 'true';
  });

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>('email-glowskin-1');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem('creatorflow_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('creatorflow_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('creatorflow_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('creatorflow_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('creatorflow_priorities', JSON.stringify(priorities));
  }, [priorities]);

  useEffect(() => {
    localStorage.setItem('creatorflow_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('creatorflow_activities', JSON.stringify(activities));
  }, [activities]);

  // Computed metrics that guarantee alignment across views
  const activeCampaignsCount = useMemo(() => {
    return campaigns.filter((c) => c.status !== 'Completed').length;
  }, [campaigns]);

  const unreadEmailsCount = useMemo(() => {
    return emails.filter((e) => e.unread).length;
  }, [emails]);

  const pendingRevisionsCount = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + (c.revisions?.filter((r) => r.status === 'Pending').length || 0), 0);
  }, [campaigns]);

  const { paymentsAwaitingCount, paymentsAwaitingAmount } = useMemo(() => {
    const openPays = payments.filter((p) => p.status === 'Open' || p.status === 'Overdue');
    return {
      paymentsAwaitingCount: openPays.length,
      paymentsAwaitingAmount: openPays.reduce((sum, p) => sum + p.amount, 0),
    };
  }, [payments]);

  const { todayTasksCount, next2DaysTasksCount, thisWeekTasksCount } = useMemo(() => {
    const activeTasks = priorities.filter((p) => !p.completed);
    return {
      todayTasksCount: activeTasks.filter((p) => p.timeframe === 'today').length,
      next2DaysTasksCount: activeTasks.filter((p) => p.timeframe === 'next2days').length,
      thisWeekTasksCount: activeTasks.filter((p) => p.timeframe === 'thisweek').length,
    };
  }, [priorities]);

  // Log activity helper
  const logActivity = (type: ActivityRecord['type'], title: string, description: string, brandName: string) => {
    const newAct: ActivityRecord = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      brandName,
      timestamp: 'Just now',
      date: '1 Nov 2026',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Toggle Email read status
  const toggleEmailUnread = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          const next = !e.unread;
          if (!next) {
            logActivity('email', 'Marked email as read', `Read thread: "${e.subject}"`, e.brandName);
          }
          return { ...e, unread: next };
        }
        return e;
      })
    );
  };

  // Toggle Priority completion
  const togglePriorityCompleted = (priorityId: string) => {
    setPriorities((prev) =>
      prev.map((p) => {
        if (p.id === priorityId) {
          const nextCompleted = !p.completed;
          logActivity(
            'task',
            nextCompleted ? 'Completed priority task' : 'Reopened priority task',
            p.title,
            p.brandName
          );
          return { ...p, completed: nextCompleted };
        }
        return p;
      })
    );
  };

  // Add new Priority item
  const addPriority = (priority: Omit<PriorityItem, 'id'>) => {
    const newPrio: PriorityItem = {
      ...priority,
      id: `prio-${Date.now()}`,
    };
    setPriorities((prev) => [newPrio, ...prev]);
    logActivity('task', 'Created new priority item', newPrio.title, newPrio.brandName);
  };

  // Files management
  const addFile = (file: Omit<WorkspaceFile, 'id'>) => {
    const newFile: WorkspaceFile = {
      ...file,
      id: `file-${Date.now()}`,
    };
    setFiles((prev) => [newFile, ...prev]);
    logActivity('file', 'Uploaded new asset', `${newFile.name} (${newFile.size})`, newFile.brandName);
  };

  const deleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      logActivity('file', 'Deleted file asset', `Removed ${file.name}`, file.brandName);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Deliverables management
  const addDeliverable = (deliverable: Omit<Deliverable, 'id'>) => {
    const newDel: Deliverable = {
      ...deliverable,
      id: `del-${Date.now()}`,
    };
    // Attach to campaign
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === deliverable.campaignId) {
          return {
            ...c,
            deliverables: [...c.deliverables, newDel],
          };
        }
        return c;
      })
    );
    logActivity('deliverable', 'Added new deliverable', `${newDel.name} for ${newDel.brandName}`, newDel.brandName);
  };

  const updateDeliverableStatus = (deliverableId: string, status: DeliverableStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => ({
        ...c,
        deliverables: c.deliverables.map((d) => {
          if (d.id === deliverableId) {
            logActivity('deliverable', 'Updated deliverable status', `${d.name} -> ${status}`, d.brandName);
            return { ...d, status };
          }
          return d;
        }),
      }))
    );
  };

  // Revisions management
  const addRevision = (campaignId: string, feedbackText: string) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    const newRev: RevisionRecord = {
      id: `rev-${Date.now()}`,
      campaignId,
      campaignName: camp.name,
      brandName: camp.brandName,
      feedbackText,
      status: 'Pending',
      dateRequested: '1 Nov 2026',
    };

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, revisions: [...c.revisions, newRev] } : c))
    );

    // Also inject into Priorities queue
    addPriority({
      category: 'REVISION',
      title: `Complete requested revision for ${camp.brandName}`,
      description: feedbackText,
      campaignId,
      campaignName: camp.name,
      brandName: camp.brandName,
      timeframe: 'today',
      isOverdue: false,
      dueDate: '2 Nov 2026',
      completed: false,
    });

    logActivity('revision', 'Added revision note', feedbackText, camp.brandName);
  };

  const resolveRevision = (campaignId: string, revisionId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            revisions: c.revisions.map((r) => (r.id === revisionId ? { ...r, status: 'Resolved' } : r)),
          };
        }
        return c;
      })
    );
    logActivity('revision', 'Resolved revision item', 'Marked creative adjustment as complete', 'Campaigns');
  };

  // Campaigns management
  const createCampaign = (campaign: Omit<Campaign, 'id' | 'revisions' | 'deliverables'>) => {
    const newCamp: Campaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      revisions: [],
      deliverables: [],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    logActivity('campaign', 'Created new campaign', newCamp.name, newCamp.brandName);
  };

  const updateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          logActivity('campaign', 'Updated campaign status', `${c.name} is now ${status}`, c.brandName);
          return { ...c, status };
        }
        return c;
      })
    );
  };

  // Payments management
  const recordPaymentStatus = (paymentId: string, status: 'Paid' | 'Open' | 'Overdue') => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          logActivity('payment', 'Updated invoice status', `${p.invoiceNumber} is now ${status}`, p.brandName);
          return { ...p, status };
        }
        return p;
      })
    );
  };

  // Authentication Handlers
  const login = async (email: string, _password?: string): Promise<boolean> => {
    if (email === 'alex.rivera@creatorflow.internal' || email.toLowerCase().includes('alex')) {
      setUser(INITIAL_USER);
    } else {
      const parts = email.split('@')[0];
      const displayName = parts.charAt(0).toUpperCase() + parts.slice(1);
      setUser((prev: typeof INITIAL_USER) => ({
        ...prev,
        name: displayName,
        email: email,
        handle: `@${parts.toLowerCase()}`,
        initials: displayName.slice(0, 2).toUpperCase(),
        isGoogleAuth: false,
      }));
    }
    setIsAuthenticated(true);
    localStorage.setItem('creatorflow_auth_session', 'true');
    logActivity('task', 'Creator signed in', `Signed in with email: ${email}`, 'Auth');
    return true;
  };

  const [isLiveGmailConnected, setIsLiveGmailConnected] = useState(false);

  // Rehydrate auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      async (firebaseUser, token) => {
        if (firebaseUser) {
          setIsLiveGmailConnected(true);
          if (token) {
            try {
              const liveData = await fetchLiveGmailMessages(token);
              if (liveData.threads.length > 0) {
                setEmails((prev) => {
                  const existingIds = new Set(prev.map((e) => e.id));
                  const newThreads = liveData.threads.filter((t) => !existingIds.has(t.id));
                  return [...newThreads, ...prev];
                });
              }
            } catch (err) {
              console.error('Initial live Gmail sync error:', err);
            }
          }
        }
      },
      () => {
        setIsLiveGmailConnected(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (googleEmail?: string, googleName?: string): Promise<boolean> => {
    try {
      const result = await googleSignIn();
      const finalEmail = result.user.email || googleEmail || '25g26.ashraf@sjec.ac.in';
      const finalName = result.user.displayName || googleName || 'Ashraf';
      const handle = `@${finalEmail.split('@')[0]}`;
      const initials = finalName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      setUser((prev: UserProfile) => ({
        ...prev,
        name: finalName,
        email: finalEmail,
        handle,
        initials,
        isGoogleAuth: true,
        gmailConnected: true,
        gmailAddress: finalEmail,
        lastSynced: 'Just now',
      }));

      setIsAuthenticated(true);
      setIsLiveGmailConnected(true);
      localStorage.setItem('creatorflow_auth_session', 'true');

      // Live fetch messages
      if (result.accessToken) {
        try {
          const liveData = await fetchLiveGmailMessages(result.accessToken);
          if (liveData.threads.length > 0) {
            setEmails((prev) => {
              const existingIds = new Set(prev.map((e) => e.id));
              const newThreads = liveData.threads.filter((t) => !existingIds.has(t.id));
              return [...newThreads, ...prev];
            });
            logActivity('email', 'Synced Live Gmail Inbox', `Fetched ${liveData.threads.length} live messages`, 'Gmail API');
          }
        } catch (fetchErr) {
          console.error('Live Gmail fetch error:', fetchErr);
        }
      }

      logActivity('email', 'Google Account authenticated', `Logged in using Google (${finalEmail})`, 'Google OAuth');
      return true;
    } catch (err: any) {
      console.error('Google Sign in error:', err);
      // Fallback for environment constraints if popup was blocked/closed
      if (googleEmail) {
        const finalEmail = googleEmail;
        const finalName = googleName || 'Ashraf';
        const handle = `@${finalEmail.split('@')[0]}`;
        const initials = finalName.slice(0, 2).toUpperCase();
        setUser((prev: UserProfile) => ({
          ...prev,
          name: finalName,
          email: finalEmail,
          handle,
          initials,
          isGoogleAuth: true,
          gmailConnected: true,
          gmailAddress: finalEmail,
          lastSynced: 'Just now',
        }));
        setIsAuthenticated(true);
        localStorage.setItem('creatorflow_auth_session', 'true');
        return true;
      }
      throw err;
    }
  };

  const connectLiveGmail = async () => {
    const result = await googleSignIn();
    setIsLiveGmailConnected(true);
    const emailAddr = result.user.email || user.email;
    setUser((prev: UserProfile) => ({
      ...prev,
      gmailConnected: true,
      gmailAddress: emailAddr,
      lastSynced: 'Just now',
    }));

    if (result.accessToken) {
      const liveData = await fetchLiveGmailMessages(result.accessToken);
      if (liveData.threads.length > 0) {
        setEmails((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newThreads = liveData.threads.filter((t) => !existingIds.has(t.id));
          return [...newThreads, ...prev];
        });
        logActivity('email', 'Synced Live Gmail Inbox', `Retrieved ${liveData.threads.length} live messages`, 'Gmail API');
      }
    }
  };

  const syncGmail = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    let token = await getAccessToken();
    if (!token) {
      try {
        const res = await googleSignIn();
        token = res.accessToken;
        setIsLiveGmailConnected(true);
      } catch (err: any) {
        return {
          success: false,
          count: 0,
          error: 'Please allow the Google popup in your browser to sync your live Gmail account.',
        };
      }
    }

    if (token) {
      try {
        const liveData = await fetchLiveGmailMessages(token);
        setIsLiveGmailConnected(true);
        if (liveData.threads.length > 0) {
          setEmails((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newThreads = liveData.threads.filter((t) => !existingIds.has(t.id));
            return [...newThreads, ...prev];
          });
        }
        setUser((prev: UserProfile) => ({ ...prev, lastSynced: 'Just now', gmailConnected: true }));
        logActivity('email', 'Live Gmail Refreshed', `Synced ${liveData.threads.length} messages from Gmail`, 'Gmail API');
        return { success: true, count: liveData.threads.length };
      } catch (err: any) {
        return { success: false, count: 0, error: err.message || 'Failed to fetch live messages.' };
      }
    }

    return { success: false, count: 0, error: 'No active Google OAuth session found.' };
  };

  const sendLiveReply = async (
    to: string,
    subject: string,
    body: string,
    cc?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    let token = await getAccessToken();
    if (!token) {
      try {
        const authRes = await googleSignIn();
        token = authRes.accessToken;
        setIsLiveGmailConnected(true);
      } catch (err: any) {
        return {
          success: false,
          error: 'Google Sign-in / popup authorization required to send live email.',
        };
      }
    }

    if (token) {
      try {
        const sendRes = await sendLiveGmailReply(token, to, subject, body, cc);
        logActivity(
          'email',
          'Sent email via live Gmail',
          `Sent email to ${to}${cc ? ` (Cc: ${cc})` : ''}`,
          'Gmail API'
        );
        return { success: true, messageId: sendRes.id };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send via Gmail API.' };
      }
    }

    return { success: false, error: 'Could not obtain active Google authorization.' };
  };

  const sendTestEmailToSelf = async (): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const recipient = user.gmailAddress || user.email;
    const subject = `CreatorFlow AI Test Email for ${recipient}`;
    const body = `Hi ${user.name},

This is a live test email sent directly from your connected CreatorFlow AI collaboration workspace using the Google Gmail API.

Recipient: ${recipient}
Timestamp: ${new Date().toLocaleString()}
Workspace: CreatorFlow AI
Status: Verified Active

If you are seeing this message, your Gmail connection is 100% operational!

Best regards,
CreatorFlow AI System`;

    return await sendLiveReply(recipient, subject, body);
  };

  const signup = async (
    name: string,
    handle: string,
    email: string,
    _password?: string
  ): Promise<boolean> => {
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    setUser({
      ...INITIAL_USER,
      name,
      handle: cleanHandle,
      email,
      initials,
      gmailAddress: email,
      isGoogleAuth: false,
    });

    setIsAuthenticated(true);
    localStorage.setItem('creatorflow_auth_session', 'true');
    logActivity('task', 'New creator account created', `Created workspace for ${cleanHandle}`, 'Auth');
    return true;
  };

  const logout = async () => {
    try {
      await googleSignOut();
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setIsLiveGmailConnected(false);
    localStorage.removeItem('creatorflow_auth_session');
  };

  // Reset to initial demo data
  const resetToDemo = () => {
    setUser(INITIAL_USER);
    setCampaigns(INITIAL_CAMPAIGNS);
    setEmails(INITIAL_EMAILS);
    setFiles(INITIAL_FILES);
    setPriorities(INITIAL_PRIORITIES);
    setPayments(INITIAL_PAYMENTS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.clear();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        isAuthenticated,
        login,
        loginWithGoogle,
        signup,
        logout,
        isLiveGmailConnected,
        connectLiveGmail,
        sendLiveReply,
        user,
        campaigns,
        emails,
        files,
        priorities,
        payments,
        activities,
        activeTab,
        setActiveTab,
        selectedCampaignId,
        setSelectedCampaignId,
        selectedEmailId,
        setSelectedEmailId,
        assistantOpen,
        setAssistantOpen,
        searchQuery,
        setSearchQuery,
        activeCampaignsCount,
        unreadEmailsCount,
        pendingRevisionsCount,
        paymentsAwaitingCount,
        paymentsAwaitingAmount,
        todayTasksCount,
        next2DaysTasksCount,
        thisWeekTasksCount,
        toggleEmailUnread,
        togglePriorityCompleted,
        addPriority,
        addFile,
        deleteFile,
        addDeliverable,
        updateDeliverableStatus,
        addRevision,
        resolveRevision,
        createCampaign,
        updateCampaignStatus,
        recordPaymentStatus,
        logActivity,
        syncGmail,
        sendTestEmailToSelf,
        resetToDemo,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
