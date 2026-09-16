import { create } from 'zustand';
import { Client, Project, Invoice } from '@/types/crm.types';
import { mockClients, mockProjects, mockInvoices } from '@/data/mockData';
import { ScheduleEvent } from '@/components/dialogs/AddEventDialog';

const defaultEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Shoot: Torres Climate Campaign',
    type: 'shoot',
    date: new Date(2025, 0, 30),
    time: '9:00 AM',
    location: 'Sacramento, CA',
    client: 'Sen. Michael Torres'
  },
  {
    id: '2',
    title: 'Review Meeting: Brooks Launch Video',
    type: 'meeting',
    date: new Date(2025, 1, 1),
    time: '2:00 PM',
    location: 'Virtual',
    client: 'Mayor David Brooks'
  },
  {
    id: '3',
    title: 'Shoot: Walsh Factory Tour',
    type: 'shoot',
    date: new Date(2025, 1, 5),
    time: '10:00 AM',
    location: 'Pittsburgh, PA',
    client: 'Rep. Jennifer Walsh'
  },
  {
    id: '4',
    title: 'Edit Deadline: Torres Town Hall',
    type: 'deadline',
    date: new Date(2025, 1, 10),
    time: 'EOD',
    location: '',
    client: 'Sen. Michael Torres'
  },
];

interface CRMStore {
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  events: ScheduleEvent[];

  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  moveClientStage: (clientId: string, stageId: string) => void;

  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  addInvoice: (invoice: Invoice) => void;

  addEvent: (event: ScheduleEvent) => void;
}

export const useCRMStore = create<CRMStore>((set) => ({
  clients: [...mockClients],
  projects: [...mockProjects],
  invoices: [...mockInvoices],
  events: [...defaultEvents],

  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),

  updateClient: (updated) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === updated.id ? updated : c)),
    })),

  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),

  moveClientStage: (clientId, stageId) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, pipelineStageId: stageId, updatedAt: new Date().toISOString() } : c
      ),
    })),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
      clients: state.clients.map((c) =>
        c.id === project.clientId
          ? { ...c, projectCount: c.projectCount + 1, updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
}));
