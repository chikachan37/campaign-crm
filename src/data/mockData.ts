import { 
  Client, 
  PipelineStage, 
  Project, 
  Invoice, 
  DashboardKPIs, 
  User,
  Video,
  VideoComment,
  ActivityEvent
} from '@/types/crm.types';

export const currentUser: User = {
  id: '1',
  email: 'admin@campaignflow.example',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  role: 'admin',
  avatar: undefined,
  createdAt: '2024-01-01T00:00:00Z'
};

export const pipelineStages: PipelineStage[] = [
  { id: 'lead', name: 'Lead Acquisition', order: 1, color: 'hsl(215, 20%, 65%)', description: 'New leads and inquiries' },
  { id: 'pitch', name: 'Active Pitch', order: 2, color: 'hsl(200, 98%, 39%)', description: 'Proposal and pitch phase' },
  { id: 'contract', name: 'Contract Review', order: 3, color: 'hsl(38, 92%, 50%)', description: 'Contract negotiation' },
  { id: 'onboarded', name: 'Onboarded', order: 4, color: 'hsl(152, 82%, 39%)', description: 'Active clients' },
  { id: 'delivered', name: 'Delivered', order: 5, color: 'hsl(215, 24%, 26%)', description: 'Completed projects' },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sen. Michael Torres',
    email: 'campaign@torres2024.com',
    phone: '(555) 123-4567',
    politicalParty: 'Democratic',
    constituency: 'California 12th District',
    region: 'West Coast',
    values: ['Climate Action', 'Healthcare', 'Education'],
    status: 'active',
    pipelineStageId: 'onboarded',
    position: 0,
    projectCount: 3,
    activeVideos: 5,
    nextDeadline: '2025-02-15',
    lastActivity: '2025-01-28',
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z'
  },
  {
    id: '2',
    name: 'Rep. Amanda Chen',
    email: 'info@chenforchange.org',
    phone: '(555) 234-5678',
    politicalParty: 'Democratic',
    constituency: 'New York 7th District',
    region: 'Northeast',
    values: ['Immigration Reform', 'Small Business', 'Veterans'],
    status: 'active',
    pipelineStageId: 'pitch',
    position: 0,
    projectCount: 0,
    activeVideos: 0,
    nextDeadline: undefined,
    lastActivity: '2025-01-27',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-27T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mayor David Brooks',
    email: 'david@brooksformayor.com',
    phone: '(555) 345-6789',
    politicalParty: 'Republican',
    constituency: 'Austin, TX',
    region: 'South',
    values: ['Economic Growth', 'Public Safety', 'Infrastructure'],
    status: 'active',
    pipelineStageId: 'contract',
    position: 0,
    projectCount: 1,
    activeVideos: 2,
    nextDeadline: '2025-02-01',
    lastActivity: '2025-01-26',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-26T00:00:00Z'
  },
  {
    id: '4',
    name: 'Council Member Lisa Park',
    email: 'lisa@parkcampaign.org',
    phone: '(555) 456-7890',
    politicalParty: 'Independent',
    constituency: 'Seattle City Council',
    region: 'West Coast',
    values: ['Housing', 'Environment', 'Transit'],
    status: 'active',
    pipelineStageId: 'lead',
    position: 0,
    projectCount: 0,
    activeVideos: 0,
    lastActivity: '2025-01-29',
    createdAt: '2025-01-28T00:00:00Z',
    updatedAt: '2025-01-29T00:00:00Z'
  },
  {
    id: '5',
    name: 'Gov. Robert Martinez',
    email: 'team@martinez2024.com',
    phone: '(555) 567-8901',
    politicalParty: 'Republican',
    constituency: 'Florida',
    region: 'Southeast',
    values: ['Tax Reform', 'Border Security', 'Jobs'],
    status: 'completed',
    pipelineStageId: 'delivered',
    position: 0,
    projectCount: 8,
    activeVideos: 0,
    lastActivity: '2025-01-15',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '6',
    name: 'Rep. Jennifer Walsh',
    email: 'jennifer@walshcongress.com',
    phone: '(555) 678-9012',
    politicalParty: 'Democratic',
    constituency: 'Pennsylvania 5th District',
    region: 'Northeast',
    values: ['Workers Rights', 'Healthcare', 'Manufacturing'],
    status: 'active',
    pipelineStageId: 'onboarded',
    position: 1,
    projectCount: 2,
    activeVideos: 3,
    nextDeadline: '2025-02-10',
    lastActivity: '2025-01-28',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z'
  },
  {
    id: '7',
    name: 'State Sen. Kevin O\'Brien',
    email: 'kevin@obrienforsenate.org',
    phone: '(555) 789-0123',
    politicalParty: 'Republican',
    constituency: 'Ohio State Senate',
    region: 'Midwest',
    values: ['Agriculture', 'Education', 'Rural Development'],
    status: 'active',
    pipelineStageId: 'lead',
    position: 1,
    projectCount: 0,
    activeVideos: 0,
    lastActivity: '2025-01-25',
    createdAt: '2025-01-24T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z'
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sen. Michael Torres',
    name: 'Climate Action Campaign',
    description: 'Series of short-form videos highlighting climate initiatives',
    videoCount: 5,
    deadline: '2025-02-15',
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z'
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'Sen. Michael Torres',
    name: 'Town Hall Highlights',
    description: 'Recap videos from constituent town halls',
    videoCount: 3,
    deadline: '2025-02-28',
    status: 'active',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Mayor David Brooks',
    name: 'Mayoral Re-election Launch',
    description: 'Campaign launch video package',
    videoCount: 2,
    deadline: '2025-02-01',
    status: 'review',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-26T00:00:00Z'
  },
  {
    id: '4',
    clientId: '6',
    clientName: 'Rep. Jennifer Walsh',
    name: 'Workers First Initiative',
    description: 'Videos supporting labor rights legislation',
    videoCount: 4,
    deadline: '2025-02-10',
    status: 'active',
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z'
  },
];

export const mockVideos: Video[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Climate Action - 30s Spot',
    status: 'review',
    version: 2,
    duration: 30,
    deadline: '2025-02-01',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Renewable Energy Tour',
    status: 'editing',
    version: 1,
    duration: 60,
    deadline: '2025-02-10',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-27T00:00:00Z'
  },
  {
    id: '3',
    projectId: '3',
    title: 'Campaign Launch Announcement',
    status: 'review',
    version: 3,
    duration: 45,
    deadline: '2025-02-01',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-26T00:00:00Z'
  },
];

export const mockComments: VideoComment[] = [
  {
    id: '1',
    videoId: '1',
    userId: '2',
    user: { id: '2', email: 'campaign@torres2024.com', firstName: 'Michael', lastName: 'Torres', role: 'client', createdAt: '2024-10-15T00:00:00Z' },
    timestamp: 12,
    content: 'Can we make the text larger here? Hard to read on mobile.',
    priority: 'important',
    resolved: false,
    createdAt: '2025-01-27T14:30:00Z'
  },
  {
    id: '2',
    videoId: '1',
    userId: '2',
    user: { id: '2', email: 'campaign@torres2024.com', firstName: 'Michael', lastName: 'Torres', role: 'client', createdAt: '2024-10-15T00:00:00Z' },
    timestamp: 25,
    content: 'Love this transition! Keep it.',
    priority: 'nice-to-have',
    resolved: true,
    createdAt: '2025-01-27T14:32:00Z'
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sen. Michael Torres',
    projectId: '1',
    projectName: 'Climate Action Campaign',
    amount: 15000,
    currency: 'USD',
    status: 'paid',
    dueDate: '2025-01-15',
    paidAt: '2025-01-12',
    createdAt: '2024-12-15T00:00:00Z'
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'Sen. Michael Torres',
    projectId: '2',
    projectName: 'Town Hall Highlights',
    amount: 8500,
    currency: 'USD',
    status: 'pending',
    dueDate: '2025-02-15',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Mayor David Brooks',
    projectId: '3',
    projectName: 'Mayoral Re-election Launch',
    amount: 12000,
    currency: 'USD',
    status: 'sent',
    dueDate: '2025-02-10',
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: '4',
    clientId: '5',
    clientName: 'Gov. Robert Martinez',
    amount: 45000,
    currency: 'USD',
    status: 'paid',
    dueDate: '2025-01-01',
    paidAt: '2024-12-28',
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '5',
    clientId: '6',
    clientName: 'Rep. Jennifer Walsh',
    projectId: '4',
    projectName: 'Workers First Initiative',
    amount: 18000,
    currency: 'USD',
    status: 'overdue',
    dueDate: '2025-01-20',
    createdAt: '2025-01-01T00:00:00Z'
  },
];

export const mockActivities: ActivityEvent[] = [
  {
    id: '1',
    type: 'video_uploaded',
    title: 'New video uploaded',
    description: 'Climate Action - 30s Spot v2 uploaded for review',
    createdAt: '2025-01-28T10:30:00Z'
  },
  {
    id: '2',
    type: 'comment_added',
    title: 'Client feedback received',
    description: 'Sen. Torres added 2 comments on Climate Action video',
    createdAt: '2025-01-27T14:30:00Z'
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Payment received',
    description: '$15,000 payment from Sen. Torres campaign',
    createdAt: '2025-01-12T09:00:00Z'
  },
];

export const dashboardKPIs: DashboardKPIs = {
  totalClients: 7,
  activeProjects: 4,
  pendingReviews: 2,
  monthlyRevenue: 68500,
  conversionRate: 72,
  avgTurnaroundDays: 5.2
};
