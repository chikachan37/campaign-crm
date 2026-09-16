import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, MoreHorizontal, Mail } from 'lucide-react';
import { pipelineStages } from '@/data/mockData';
import { Client } from '@/types/crm.types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useCRMStore } from '@/store/crmStore';
import { AddClientDialog } from '@/components/dialogs/AddClientDialog';
import { EditClientDialog } from '@/components/dialogs/EditClientDialog';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

function getPartyBadgeVariant(party: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (party) {
    case 'Democratic': return 'default';
    case 'Republican': return 'destructive';
    default: return 'secondary';
  }
}

function getStageName(stageId: string): string {
  return pipelineStages.find(s => s.id === stageId)?.name || stageId;
}

function Clients() {
  const { clients, addClient, updateClient, deleteClient, addProject } = useCRMStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectClient, setProjectClient] = useState<Client | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.constituency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Clients</p>
            <p className="text-2xl font-bold text-foreground">{clients.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-primary">
              {clients.filter(c => c.pipelineStageId === 'onboarded').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Pipeline</p>
            <p className="text-2xl font-bold text-foreground">
              {clients.filter(c => ['lead', 'pitch', 'contract'].includes(c.pipelineStageId)).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {clients.filter(c => c.pipelineStageId === 'delivered').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <Card className="bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Constituency</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-accent/50">
                <TableCell>
                  <Link to={`/clients/${client.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                    {client.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPartyBadgeVariant(client.politicalParty)}>{client.politicalParty}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.constituency}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getStageName(client.pipelineStageId)}</Badge>
                </TableCell>
                <TableCell className="text-foreground">{client.projectCount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(client.lastActivity), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/clients/${client.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditingClient(client); setEditOpen(true); }}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setProjectClient(client); setProjectOpen(true); }}>Create Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => { setDeletingClient(client); setDeleteOpen(true); }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} onAdd={(c) => { addClient(c); toast({ title: 'Client added', description: `${c.name} added successfully` }); }} />
      <EditClientDialog open={editOpen} onOpenChange={setEditOpen} client={editingClient} onSave={(c) => { updateClient(c); toast({ title: 'Client updated', description: `${c.name} updated successfully` }); }} />
      <AddProjectDialog open={projectOpen} onOpenChange={setProjectOpen} clientId={projectClient?.id} clientName={projectClient?.name} onAdd={(p) => { addProject(p); toast({ title: 'Project created', description: `${p.name} created for ${projectClient?.name}` }); }} />
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Client" description={`Are you sure you want to delete ${deletingClient?.name}? This action cannot be undone.`} destructive onConfirm={() => { if (deletingClient) { deleteClient(deletingClient.id); toast({ title: 'Client deleted', variant: 'destructive' }); } }} />
    </div>
  );
}

export default Clients;
