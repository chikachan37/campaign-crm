import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Clock, DollarSign, Video, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { pipelineStages } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useCRMStore } from '@/store/crmStore';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

const conversionTrend = [
  { month: 'Aug', rate: 65 }, { month: 'Sep', rate: 68 }, { month: 'Oct', rate: 70 },
  { month: 'Nov', rate: 67 }, { month: 'Dec', rate: 72 }, { month: 'Jan', rate: 75 },
];

const turnaroundData = [
  { stage: 'Pre-prod', days: 2 }, { stage: 'Shooting', days: 1 },
  { stage: 'Editing', days: 3 }, { stage: 'Review', days: 2 }, { stage: 'Delivery', days: 0.5 },
];

function Analytics() {
  const { clients, projects, invoices } = useCRMStore();
  const monthlyRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  const pipelineData = pipelineStages.map(stage => ({
    name: stage.name.split(' ')[0],
    count: clients.filter(c => c.pipelineStageId === stage.id).length,
    color: stage.color,
  }));

  const projectStatusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: 'hsl(200, 98%, 39%)' },
    { name: 'Review', value: projects.filter(p => p.status === 'review').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'hsl(152, 82%, 39%)' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: 'hsl(215, 20%, 65%)' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Analytics</h1><p className="text-muted-foreground">Performance metrics and insights</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, value: clients.length, label: 'Total Clients' },
          { icon: Target, value: '72%', label: 'Conversion Rate' },
          { icon: Clock, value: '5.2 days', label: 'Avg Turnaround' },
          { icon: DollarSign, value: formatCurrency(monthlyRevenue), label: 'Total Revenue' },
        ].map((item, i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><item.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-2xl font-bold text-foreground">{item.value}</p><p className="text-sm text-muted-foreground">{item.label}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />Pipeline Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" /><YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><PieChartIcon className="h-4 w-4" />Project Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {projectStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Conversion Rate Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={conversionTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" /><YAxis tickFormatter={(v) => `${v}%`} className="text-xs" domain={[50, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Conversion Rate']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Video className="h-4 w-4" />Production Turnaround (Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={turnaroundData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" /><YAxis type="category" dataKey="stage" className="text-xs" width={80} />
                <Tooltip formatter={(value: number) => [`${value} days`, 'Average Time']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="days" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
