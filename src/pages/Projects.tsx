import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Video, Calendar } from 'lucide-react';
import { mockVideos } from '@/data/mockData';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';
import { useToast } from '@/hooks/use-toast';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

function getStatusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active': return 'default';
    case 'review': return 'secondary';
    case 'completed': return 'outline';
    default: return 'outline';
  }
}

function getVideoStatusColor(status: string): string {
  switch (status) {
    case 'approved': case 'delivered': return 'bg-primary text-primary-foreground';
    case 'review': return 'bg-secondary text-secondary-foreground';
    case 'editing': return 'bg-muted text-muted-foreground';
    default: return 'bg-accent text-accent-foreground';
  }
}

function Projects() {
  const { projects, clients, addProject } = useCRMStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'all' || project.clientId === selectedClient;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage video production projects</p>
        </div>
        <Button onClick={() => setProjectOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Projects</p><p className="text-2xl font-bold text-foreground">{projects.length}</p></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-primary">{projects.filter(p => p.status === 'active').length}</p></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Review</p><p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'review').length}</p></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Videos</p><p className="text-2xl font-bold text-foreground">{mockVideos.length}</p></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const projectVideos = mockVideos.filter(v => v.projectId === project.id);
          return (
            <Card key={project.id} className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <Link to={`/clients/${project.clientId}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{project.clientName}</Link>
                  </div>
                  <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground"><Video className="h-4 w-4" /><span>{project.videoCount} videos</span></div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Due {format(new Date(project.deadline), 'MMM d')}</span></div>
                </div>
                {projectVideos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Video Status</p>
                    <div className="flex flex-wrap gap-1">
                      {projectVideos.slice(0, 3).map((video) => (
                        <Badge key={video.id} className={getVideoStatusColor(video.status)}>
                          {video.title.substring(0, 20)}... - {video.status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddProjectDialog open={projectOpen} onOpenChange={setProjectOpen} onAdd={(p) => { addProject(p); toast({ title: 'Project created', description: `${p.name} created successfully` }); }} />
    </div>
  );
}

export default Projects;
