import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Video, FileText, DollarSign, Edit, Plus, ExternalLink
} from 'lucide-react';
import { pipelineStages, mockActivities } from '@/data/mockData';
import { format } from 'date-fns';
import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { EditClientDialog } from '@/components/dialogs/EditClientDialog';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, projects, invoices, updateClient, deleteClient, addProject } = useCRMStore();
  const { toast } = useToast();

  const client = clients.find(c => c.id === id);

  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Client not found</h2>
          <Button asChild className="mt-4"><Link to="/clients">Back to Clients</Link></Button>
        </div>
      </div>
    );
  }

  const clientProjects = projects.filter(p => p.clientId === client.id);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  const stage = pipelineStages.find(s => s.id === client.pipelineStageId);
  const totalSpent = clientInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const outstandingBalance = clientInvoices.filter(i => ['pending', 'sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/clients"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
            <Badge variant="outline" style={{ borderColor: stage?.color, color: stage?.color }}>{stage?.name}</Badge>
          </div>
          <p className="text-muted-foreground">{client.constituency}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />Edit
          </Button>
          <Button onClick={() => setProjectOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />New Project
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="bg-card">
            <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-sm text-primary hover:underline">{client.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{client.region}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader><CardTitle className="text-base">Political Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Party</p>
                <Badge variant={client.politicalParty === 'Democratic' ? 'default' : client.politicalParty === 'Republican' ? 'destructive' : 'secondary'}>
                  {client.politicalParty}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Key Values</p>
                <div className="flex flex-wrap gap-1">
                  {client.values.map((value, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{value}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader><CardTitle className="text-base">Financial Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(totalSpent)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Outstanding</span>
                <span className={`text-sm font-semibold ${outstandingBalance > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {formatCurrency(outstandingBalance)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Video className="h-4 w-4" />Projects ({clientProjects.length})
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />Invoices ({clientInvoices.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              {clientProjects.length === 0 ? (
                <Card className="bg-card">
                  <CardContent className="p-8 text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No projects yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create a project to start working with this client</p>
                    <Button onClick={() => setProjectOpen(true)}><Plus className="h-4 w-4 mr-2" />Create Project</Button>
                  </CardContent>
                </Card>
              ) : (
                clientProjects.map((project) => (
                  <Card key={project.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Video className="h-3 w-3" />{project.videoCount} videos</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Due {format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'active' ? 'default' : project.status === 'review' ? 'secondary' : 'outline'}>{project.status}</Badge>
                          <Button variant="ghost" size="icon" asChild><Link to={`/projects`}><ExternalLink className="h-4 w-4" /></Link></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              {clientInvoices.length === 0 ? (
                <Card className="bg-card">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No invoices yet</h3>
                    <p className="text-sm text-muted-foreground">Invoices will appear here once created</p>
                  </CardContent>
                </Card>
              ) : (
                clientInvoices.map((invoice) => (
                  <Card key={invoice.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{invoice.projectName || 'General Invoice'}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                            {invoice.paidAt && ` • Paid ${format(new Date(invoice.paidAt), 'MMM d, yyyy')}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'outline'}>{invoice.status}</Badge>
                          <span className="font-semibold text-foreground">{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditClientDialog open={editOpen} onOpenChange={setEditOpen} client={client} onSave={(c) => { updateClient(c); toast({ title: 'Client updated', description: `${c.name} updated` }); }} />
      <AddProjectDialog open={projectOpen} onOpenChange={setProjectOpen} clientId={client.id} clientName={client.name} onAdd={(p) => { addProject(p); toast({ title: 'Project created', description: `${p.name} created` }); }} />
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Client" description={`Delete ${client.name}? This cannot be undone.`} destructive onConfirm={() => { deleteClient(client.id); toast({ title: 'Client deleted', variant: 'destructive' }); navigate('/clients'); }} />
    </div>
  );
}

export default ClientDetail;
