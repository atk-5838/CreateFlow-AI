export type PriorityCategory = 'REVISION' | 'DEADLINE' | 'EMAIL' | 'PAYMENT';

export type PriorityTimeframe = 'today' | 'next2days' | 'thisweek';

export interface PriorityItem {
  id: string;
  category: PriorityCategory;
  title: string;
  overdueText?: string;
  isOverdue?: boolean;
  overdueDays?: number;
  timeframe: PriorityTimeframe;
  description: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  completed?: boolean;
  dueDate: string;
}

export type EmailCategory = 'Brand Deals' | 'Feedback' | 'Deadlines' | 'Follow-ups' | 'Other';

export interface EmailThread {
  id: string;
  brandName: string;
  brandInitials: string;
  brandColor?: string;
  senderName: string;
  senderEmail: string;
  date: string;
  timestamp: string;
  subject: string;
  preview: string;
  body: string;
  unread: boolean;
  categories: EmailCategory[];
  campaignId?: string;
  campaignName?: string;
  isLive?: boolean;
  aiInsights: {
    summary: string;
    detectedIntent: string;
    requestedChanges: string;
    deadlineNotice?: string;
  };
}

export type CampaignStatus = 
  | 'In production' 
  | 'In revisions' 
  | 'In review' 
  | 'Contract Pending' 
  | 'Completed' 
  | 'Draft';

export type DeliverableStatus = 
  | 'Not started' 
  | 'In progress' 
  | 'Draft' 
  | 'Submitted' 
  | 'In review' 
  | 'Revision required' 
  | 'Approved' 
  | 'Final';

export interface Deliverable {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  contentType: 'Video' | 'Reel' | 'Story' | 'Carousel' | 'Photo' | 'YouTube' | 'TikTok';
  dueDate: string;
  status: DeliverableStatus;
  revisionCount: number;
  submissionHistory?: { date: string; note: string; version: string }[];
}

export interface RevisionRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  feedbackText: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  overdueDays?: number;
  dateRequested: string;
  fileReference?: string;
}

export type FileType = 'video' | 'image' | 'document' | 'other';
export type FileStatus = 'Draft' | 'Final' | 'Reference';

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  version: string;
  brandName: string;
  campaignId: string;
  campaignName: string;
  fileType: FileType;
  status: FileStatus;
  mimeType?: string;
  url?: string;
  isCustomUpload?: boolean;
}

export interface PaymentRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Open' | 'Overdue';
  dueDate: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  brandName: string;
  brandInitials: string;
  product: string;
  description: string;
  status: CampaignStatus;
  agreedPayment: number;
  paidAmount: number;
  paymentStatus: 'Fully Paid' | 'Partial' | 'Pending Invoice' | 'Overdue';
  startDate: string;
  deadline: string;
  requirements: string[];
  revisions: RevisionRecord[];
  deliverables: Deliverable[];
  tags: string[];
}

export interface ActivityRecord {
  id: string;
  type: 'email' | 'campaign' | 'file' | 'deliverable' | 'revision' | 'payment' | 'task';
  title: string;
  description: string;
  brandName: string;
  timestamp: string;
  date: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  initials: string;
  email: string;
  bio?: string;
  location?: string;
  currency?: string;
  timezone?: string;
  gmailConnected?: boolean;
  gmailAddress?: string;
  lastSynced?: string;
  isGoogleAuth?: boolean;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; actionId: string; payload?: any }[];
}
