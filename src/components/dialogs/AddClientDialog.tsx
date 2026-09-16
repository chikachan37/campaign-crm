import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Client, PoliticalParty } from '@/types/crm.types';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (client: Client) => void;
  defaultStageId?: string;
}

export function AddClientDialog({ open, onOpenChange, onAdd, defaultStageId = 'lead' }: AddClientDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [party, setParty] = useState<PoliticalParty>('Democratic');
  const [constituency, setConstituency] = useState('');
  const [region, setRegion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      politicalParty: party,
      constituency,
      region,
      values: [],
      status: 'active',
      pipelineStageId: defaultStageId,
      position: 0,
      projectCount: 0,
      activeVideos: 0,
      lastActivity: now,
      createdAt: now,
      updatedAt: now,
    };
    onAdd(newClient);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setParty('Democratic');
    setConstituency('');
    setRegion('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter the client's information to add them to the CRM.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sen. John Smith" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Political Party *</Label>
                <Select value={party} onValueChange={(v) => setParty(v as PoliticalParty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Democratic">Democratic</SelectItem>
                    <SelectItem value="Republican">Republican</SelectItem>
                    <SelectItem value="Independent">Independent</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Libertarian">Libertarian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Northeast" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="constituency">Constituency *</Label>
              <Input id="constituency" value={constituency} onChange={(e) => setConstituency(e.target.value)} placeholder="e.g. California 12th District" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
