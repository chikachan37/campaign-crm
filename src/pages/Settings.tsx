import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bell, Shield, Save } from 'lucide-react';
import { currentUser } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

function Settings() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email, setEmail] = useState(currentUser.email);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [feedbackAlerts, setFeedbackAlerts] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="h-4 w-4" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">{firstName[0]}{lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: 'Coming soon', description: 'Avatar upload will be available with Cloud storage' })}>Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: 'Profile updated', description: 'Your profile has been saved successfully' })}>
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-foreground">Email Notifications</p><p className="text-sm text-muted-foreground">Receive email updates about your projects</p></div>
                  <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-foreground">Client Feedback Alerts</p><p className="text-sm text-muted-foreground">Get notified when clients add feedback</p></div>
                  <Switch checked={feedbackAlerts} onCheckedChange={setFeedbackAlerts} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-foreground">Invoice Reminders</p><p className="text-sm text-muted-foreground">Alerts for overdue invoices</p></div>
                  <Switch checked={invoiceReminders} onCheckedChange={setInvoiceReminders} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-foreground">Deadline Reminders</p><p className="text-sm text-muted-foreground">Get reminded about upcoming deadlines</p></div>
                  <Switch checked={deadlineReminders} onCheckedChange={setDeadlineReminders} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-foreground">Weekly Digest</p><p className="text-sm text-muted-foreground">Weekly summary of all activity</p></div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: 'Preferences saved', description: 'Notification preferences updated' })}>
                  <Save className="h-4 w-4 mr-2" />Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div><p className="font-medium text-foreground">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of security</p></div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: 'Coming soon', description: '2FA will be available with authentication setup' })}>Enable</Button>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => {
                  if (newPassword && newPassword !== confirmPassword) {
                    toast({ title: 'Passwords do not match', description: 'Please make sure both passwords are the same', variant: 'destructive' });
                    return;
                  }
                  if (!currentPassword) {
                    toast({ title: 'Current password required', variant: 'destructive' });
                    return;
                  }
                  toast({ title: 'Password updated', description: 'Your password has been changed successfully' });
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}>
                  <Save className="h-4 w-4 mr-2" />Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
