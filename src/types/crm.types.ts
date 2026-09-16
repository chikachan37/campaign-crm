// User & Auth Types
export type UserRole = 'admin' | 'staff' | 'contractor' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Client Types
export type PoliticalParty = 'Democratic' | 'Republican' | 'Independent' | 'Green' | 'Libertarian' | 'Other';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  politicalParty: PoliticalParty;
  constituency: string;
  region: string;
  values: string[];
  status: string;
  pipelineStageId: string;
  position: number;
  projectCount: number;
  activeVideos: number;
  nextDeadline?: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

// Pipeline Types
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  description?: string;
}

export interface ClientCard {
  id: string;
  client: Client;
  stageId: string;
  position: number;
}

// Project & Video Types
export type VideoStatus = 'pre-production' | 'shooting' | 'editing' | 'review' | 'approved' | 'delivered';
export type ProjectStatus = 'active' | 'review' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  videoCount: number;
  deadline: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  projectId: string;
  title: string;
  status: VideoStatus;
  version: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  assignedEditor?: User;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export type CommentPriority = 'critical' | 'important' | 'nice-to-have';

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  user: User;
  timestamp: number; // in seconds
  content: string;
  priority: CommentPriority;
  resolved: boolean;
  createdAt: string;
}

// Finance Types
export type InvoiceStatus = 'draft' | 'pending' | 'sent' | 'overdue' | 'paid';

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingBalance: number;
  overdueAmount: number;
  avgProjectValue: number;
}

// Activity Timeline
export type ActivityType = 'project_created' | 'video_uploaded' | 'comment_added' | 'status_changed' | 'invoice_sent' | 'payment_received' | 'contract_signed';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalClients: number;
  activeProjects: number;
  pendingReviews: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgTurnaroundDays: number;
}
