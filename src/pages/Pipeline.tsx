import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Video,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pipelineStages } from '@/data/mockData';
import { Client, PipelineStage } from '@/types/crm.types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCRMStore } from '@/store/crmStore';
import { AddClientDialog } from '@/components/dialogs/AddClientDialog';
import { EditClientDialog } from '@/components/dialogs/EditClientDialog';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

function getPartyColor(party: string): string {
  switch (party) {
    case 'Democratic': return 'bg-blue-500';
    case 'Republican': return 'bg-red-500';
    case 'Independent': return 'bg-purple-500';
    case 'Green': return 'bg-green-500';
    case 'Libertarian': return 'bg-yellow-500';
    default: return 'bg-muted';
  }
}

function ClientCardComponent({ client, onDragStart, onDragEnd, onEdit, onCreateProject, onDelete }: { 
  client: Client; 
  onDragStart: (e: React.DragEvent, client: Client) => void;
  onDragEnd: () => void;
  onEdit: (client: Client) => void;
  onCreateProject: (client: Client) => void;
  onDelete: (client: Client) => void;
}) {
  return (
    <Card 
      className="bg-card cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
      draggable
      onDragStart={(e) => onDragStart(e, client)}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getPartyColor(client.politicalParty))} />
            <Link 
              to={`/clients/${client.id}`}
              className="font-medium text-sm text-foreground truncate hover:text-primary transition-colors"
            >
              {client.name}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/clients/${client.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client)}>Edit Client</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateProject(client)}>Create Project</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(client)}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {client.politicalParty}
          </Badge>
          <span className="text-xs text-muted-foreground">{client.constituency}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {client.projectCount > 0 && (
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              <span>{client.activeVideos} videos</span>
            </div>
          )}
          {client.nextDeadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(client.nextDeadline), 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineColumn({ 
  stage, 
  clients, 
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDragStart,
  onDragEnd,
  onAddLead,
  onEdit,
  onCreateProject,
  onDelete,
}: { 
  stage: PipelineStage; 
  clients: Client[];
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDragStart: (e: React.DragEvent, client: Client) => void;
  onDragEnd: () => void;
  onAddLead: (stageId: string) => void;
  onEdit: (client: Client) => void;
  onCreateProject: (client: Client) => void;
  onDelete: (client: Client) => void;
}) {
  return (
    <div 
      className={cn(
        "flex flex-col min-w-[300px] w-[300px] h-full",
        isDragOver && "bg-primary/5 rounded-lg"
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
          <h3 className="font-medium text-sm text-foreground">{stage.name}</h3>
          <Badge variant="outline" className="text-xs">{clients.length}</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAddLead(stage.id)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {clients.map((client) => (
          <ClientCardComponent 
            key={client.id} 
            client={client} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onEdit={onEdit}
            onCreateProject={onCreateProject}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function Pipeline() {
  const { clients, addClient, updateClient, deleteClient, moveClientStage, addProject } = useCRMStore();
  const { toast } = useToast();
  const [draggedClient, setDraggedClient] = useState<Client | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addClientStage, setAddClientStage] = useState('lead');
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectClient, setProjectClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const handleDragStart = (e: React.DragEvent, client: Client) => {
    setDraggedClient(client);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedClient(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedClient) return;
    moveClientStage(draggedClient.id, stageId);
    const stageName = pipelineStages.find(s => s.id === stageId)?.name;
    toast({ title: 'Client moved', description: `${draggedClient.name} moved to ${stageName}` });
    setDraggedClient(null);
    setDragOverStage(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.constituency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientsForStage = (stageId: string) => 
    filteredClients.filter(client => client.pipelineStageId === stageId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-muted-foreground">Manage your leads and clients through the sales funnel</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search clients..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button onClick={() => { setAddClientStage('lead'); setAddClientOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full pb-4">
          {pipelineStages.map((stage) => (
            <PipelineColumn 
              key={stage.id}
              stage={stage}
              clients={getClientsForStage(stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              isDragOver={dragOverStage === stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onAddLead={(stageId) => { setAddClientStage(stageId); setAddClientOpen(true); }}
              onEdit={(c) => { setEditingClient(c); setEditClientOpen(true); }}
              onCreateProject={(c) => { setProjectClient(c); setProjectDialogOpen(true); }}
              onDelete={(c) => { setDeletingClient(c); setDeleteDialogOpen(true); }}
            />
          ))}
        </div>
      </div>

      <AddClientDialog
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        defaultStageId={addClientStage}
        onAdd={(c) => { addClient(c); toast({ title: 'Client added', description: `${c.name} added to pipeline` }); }}
      />
      <EditClientDialog
        open={editClientOpen}
        onOpenChange={setEditClientOpen}
        client={editingClient}
        onSave={(c) => { updateClient(c); toast({ title: 'Client updated', description: `${c.name} has been updated` }); }}
      />
      <AddProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        clientId={projectClient?.id}
        clientName={projectClient?.name}
        onAdd={(p) => { addProject(p); toast({ title: 'Project created', description: `${p.name} has been created` }); }}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Client"
        description={`Are you sure you want to remove ${deletingClient?.name}? This action cannot be undone.`}
        destructive
        onConfirm={() => {
          if (deletingClient) {
            deleteClient(deletingClient.id);
            toast({ title: 'Client removed', description: `${deletingClient.name} has been removed`, variant: 'destructive' });
          }
        }}
      />
    </div>
  );
}

export default Pipeline;
