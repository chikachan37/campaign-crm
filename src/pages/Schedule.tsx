import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useCRMStore } from '@/store/crmStore';
import { AddEventDialog } from '@/components/dialogs/AddEventDialog';
import { useToast } from '@/hooks/use-toast';

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'shoot': return 'bg-primary text-primary-foreground';
    case 'meeting': return 'bg-secondary text-secondary-foreground';
    case 'deadline': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
}

function Schedule() {
  const { events, addEvent } = useCRMStore();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventOpen, setEventOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => events.filter(event => isSameDay(event.date, date));

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground">Manage shoots, meetings, and deadlines</p>
        </div>
        <Button onClick={() => setEventOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (<div key={`empty-${i}`} className="aspect-square" />))}
              {days.map(day => {
                const dayEvents = getEventsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded-lg text-sm relative transition-colors
                      ${isToday(day) ? 'bg-primary/10 font-bold' : ''}
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                      ${!isSameMonth(day, currentMonth) ? 'text-muted-foreground' : 'text-foreground'}
                    `}
                  >
                    <span className="block">{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((_, i) => (<div key={i} className="h-1 w-1 rounded-full bg-primary" />))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            ) : upcomingEvents.map(event => (
              <div key={event.id} className="p-3 rounded-lg bg-background space-y-2">
                <div>
                  <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                  <h3 className="font-medium text-sm text-foreground mt-2">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">{event.client}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(event.date, 'MMM d')}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                  {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Events for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setEventOpen(true)}>
                <Plus className="h-3 w-3 mr-1" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-muted-foreground">No events scheduled for this day</p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                      <div>
                        <h3 className="font-medium text-sm text-foreground">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">{event.client} • {event.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddEventDialog open={eventOpen} onOpenChange={setEventOpen} defaultDate={selectedDate || undefined} onAdd={(ev) => { addEvent(ev); toast({ title: 'Event added', description: `${ev.title} scheduled` }); }} />
    </div>
  );
}

export default Schedule;
