import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCRMStore } from '@/store/crmStore';
import { AddInvoiceDialog } from '@/components/dialogs/AddInvoiceDialog';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

const revenueData = [
  { month: 'Aug', revenue: 42000 },
  { month: 'Sep', revenue: 38000 },
  { month: 'Oct', revenue: 55000 },
  { month: 'Nov', revenue: 48000 },
  { month: 'Dec', revenue: 62000 },
  { month: 'Jan', revenue: 68500 },
];

const statusColors: Record<string, string> = {
  paid: 'hsl(152, 82%, 39%)',
  pending: 'hsl(38, 92%, 50%)',
  sent: 'hsl(200, 98%, 39%)',
  overdue: 'hsl(0, 72%, 50%)',
  draft: 'hsl(215, 20%, 65%)',
};

function Finance() {
  const { invoices, clients, addInvoice } = useCRMStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const outstandingAmount = invoices.filter(i => ['pending', 'sent'].includes(i.status)).reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const statusBreakdown = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: statusColors.paid },
    { name: 'Pending', value: invoices.filter(i => i.status === 'pending').length, color: statusColors.pending },
    { name: 'Sent', value: invoices.filter(i => i.status === 'sent').length, color: statusColors.sent },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: statusColors.overdue },
    { name: 'Draft', value: invoices.filter(i => i.status === 'draft').length, color: statusColors.draft },
  ].filter(s => s.value > 0);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invoice.projectName && invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground">Track invoices and revenue</p>
        </div>
        <Button onClick={() => setInvoiceOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p></div><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Outstanding</p><p className="text-2xl font-bold text-foreground">{formatCurrency(outstandingAmount)}</p></div><div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center"><Clock className="h-5 w-5 text-secondary" /></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-destructive">{formatCurrency(overdueAmount)}</p></div><div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-destructive" /></div></div></CardContent></Card>
        <Card className="bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Paid Invoices</p><p className="text-2xl font-bold text-primary">{invoices.filter(i => i.status === 'paid').length}</p></div><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} className="text-xs" />
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base">Invoice Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Invoices</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.projectName || '-'}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'outline'}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.paidAt ? format(new Date(invoice.paidAt), 'MMM d, yyyy') : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddInvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} clients={clients} onAdd={(inv) => { addInvoice(inv); toast({ title: 'Invoice created', description: `Invoice for ${formatCurrency(inv.amount)} created` }); }} />
    </div>
  );
}

export default Finance;
