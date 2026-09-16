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

export interface ScheduleEvent {
  id: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  client: string;
}

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (event: ScheduleEvent) => void;
  defaultDate?: Date;
}

export function AddEventDialog({ open, onOpenChange, onAdd, defaultDate }: AddEventDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('meeting');
  const [date, setDate] = useState(defaultDate ? defaultDate.toISOString().split('T')[0] : '');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      title,
      type,
      date: new Date(date),
      time: time || '9:00 AM',
      location,
      client,
    };
    onAdd(newEvent);
    setTitle('');
    setType('meeting');
    setDate('');
    setTime('');
    setLocation('');
    setClient('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>Schedule a shoot, meeting, or deadline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Title *</Label>
              <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shoot: Campaign Video" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shoot">Shoot</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-time">Time</Label>
                <Input id="event-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 9:00 AM" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Virtual" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-client">Client</Label>
              <Input id="event-client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Sen. Torres" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
