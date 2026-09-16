import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FolderKanban, Video, DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { mockActivities } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useCRMStore } from '@/store/crmStore';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function KPICard({ title, value, change, changeType, icon: Icon }: { title: string; value: string | number; change?: string; changeType?: 'positive' | 'negative'; icon: React.ElementType }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === 'positive' ? <ArrowUpRight className="h-3 w-3 text-primary" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
                <span className={`text-xs ${changeType === 'positive' ? 'text-primary' : 'text-destructive'}`}>{change}</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { clients, projects, invoices } = useCRMStore();

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const pendingReviews = projects.filter(p => p.status === 'review').length;
  const monthlyRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/clients"><Users className="h-4 w-4 mr-2" />View Clients</Link></Button>
          <Button asChild><Link to="/pipeline"><Plus className="h-4 w-4 mr-2" />Add Lead</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Clients" value={clients.length} change="+2 this month" changeType="positive" icon={Users} />
        <KPICard title="Active Projects" value={activeProjects} change="+1 this week" changeType="positive" icon={FolderKanban} />
        <KPICard title="Pending Reviews" value={pendingReviews} icon={Video} />
        <KPICard title="Monthly Revenue" value={formatCurrency(monthlyRevenue)} change="+12% vs last month" changeType="positive" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base">Performance Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background">
              <div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium">Conversion Rate</p><p className="text-xs text-muted-foreground">Lead to Client</p></div></div>
              <span className="text-2xl font-bold text-primary">72%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background">
              <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium">Avg. Turnaround</p><p className="text-xs text-muted-foreground">Video delivery</p></div></div>
              <span className="text-2xl font-bold text-primary">5.2 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Active Projects</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/projects">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.clientName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                    <span className="text-xs text-muted-foreground">Due {format(new Date(project.deadline), 'MMM d')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Outstanding Invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/finance">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{invoice.clientName}</p>
                    <p className="text-xs text-muted-foreground">{invoice.projectName || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={invoice.status === 'overdue' ? 'destructive' : 'outline'}>{invoice.status}</Badge>
                    <span className="text-sm font-semibold">{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
