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
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/types/crm.types';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: Project) => void;
  clientId?: string;
  clientName?: string;
}

export function AddProjectDialog({ open, onOpenChange, onAdd, clientId, clientName }: AddProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [videoCount, setVideoCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newProject: Project = {
      id: crypto.randomUUID(),
      clientId: clientId || '',
      clientName: clientName || '',
      name,
      description,
      videoCount,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    onAdd(newProject);
    setName('');
    setDescription('');
    setDeadline('');
    setVideoCount(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              {clientName ? `Create a project for ${clientName}.` : 'Set up a new video production project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="proj-name">Project Name *</Label>
              <Input id="proj-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Campaign Launch Video" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea id="proj-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the project..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="proj-deadline">Deadline</Label>
                <Input id="proj-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proj-videos">Number of Videos</Label>
                <Input id="proj-videos" type="number" min={1} value={videoCount} onChange={(e) => setVideoCount(parseInt(e.target.value) || 1)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
