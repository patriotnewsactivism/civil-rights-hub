import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Filter, MapPin, PlusCircle, Users, Video } from "lucide-react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Calendar, dateFnsLocalizer, type Event as CalendarEvent } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

import { enUS } from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type CommunityEvent = Database["public"]["Tables"]["community_events"]["Row"];
type EventRsvp = Database["public"]["Tables"]["event_rsvps"]["Row"];

type ViewMode = "list" | "calendar";

const EVENT_TYPE_LABELS: Record<string, string> = {
  protest: "Protest",
  rally: "Rally",
  workshop: "Workshop",
  training: "Training",
  meeting: "Meeting",
  court_watch: "Court watch",
  other: "Other",
};

const EVENT_TYPE_FILTERS = [
  { label: "All types", value: "" },
  ...Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({ label, value })),
];

const formatForCalendar = (date: Date) => formatInTimeZone(date, "UTC", "yyyyMMdd'T'HHmmss'Z'");

const buildGoogleCalendarUrl = (event: CommunityEvent) => {
  const start = new Date(event.start_date);
  const end = event.end_date ? new Date(event.end_date) : new Date(new Date(event.start_date).getTime() + 60 * 60 * 1000);
  const params = new URLSearchParams({
    text: event.title,
    details: event.description,
    location: event.is_virtual ? event.virtual_link ?? "Virtual" : [event.location_name, event.city, event.state].filter(Boolean).join(", "),
    dates: `${formatForCalendar(start)}/${formatForCalendar(end)}`,
  });
  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
};

export const EventsCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedType, setSelectedType] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [rsvps, setRsvps] = useState<Map<string, EventRsvp>>(new Map());
  const [rsvpCounts, setRsvpCounts] = useState<Map<string, number>>(new Map());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "protest",
    city: "",
    state: "",
    start_date: "",
    end_date: "",
    is_virtual: false,
    virtual_link: "",
    location_name: "",
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_events")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: true })
      .limit(50);

    if (error) {
      toast({
        title: "Unable to load events",
        description: error.message,
        variant: "destructive",
      });
      setEvents([]);
      setFilteredEvents([]);
      setLoading(false);
      return;
    }

    const typedEvents = (data ?? []) as CommunityEvent[];
    setEvents(typedEvents);
    setFilteredEvents(typedEvents);
    setLoading(false);

    // Fetch RSVP counts for all events
    const eventIds = typedEvents.map((e) => e.id);
    if (eventIds.length > 0) {
      const { data: rsvpData } = await supabase
        .from("event_rsvps")
        .select("event_id")
        .in("event_id", eventIds)
        .eq("status", "going");

      const counts = new Map<string, number>();
      (rsvpData ?? []).forEach((r) => {
        counts.set(r.event_id, (counts.get(r.event_id) ?? 0) + 1);
      });
      setRsvpCounts(counts);
    }

    if (user?.id) {
      const { data: rsvpData } = await supabase
        .from("event_rsvps")
        .select("*")
        .eq("user_id", user.id);

      const map = new Map<string, EventRsvp>();
      (rsvpData ?? []).forEach((entry) => {
        if (entry.event_id) {
          map.set(entry.event_id, entry as EventRsvp);
        }
      });
      setRsvps(map);
    } else {
      setRsvps(new Map());
    }
  }, [toast, user?.id]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const next = events.filter((event) => {
      const matchesType = selectedType ? event.event_type === selectedType : true;
      const matchesState = stateFilter ? event.state === stateFilter : true;
      return matchesType && matchesState;
    });
    setFilteredEvents(next);
  }, [events, selectedType, stateFilter]);

  const handleRsvpToggle = async (eventItem: CommunityEvent) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Join the community to RSVP for events and trainings.",
        variant: "destructive",
      });
      return;
    }

    const existing = rsvps.get(eventItem.id);

    if (existing) {
      const nextStatus = existing.status === "going" ? "not_going" : "going";
      const { data, error } = await supabase
        .from("event_rsvps")
        .update({ status: nextStatus })
        .eq("id", existing.id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (error) {
        toast({
          title: "Unable to update RSVP",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setRsvps((current) => new Map(current).set(eventItem.id, data as EventRsvp));
      setRsvpCounts((current) => {
        const newCounts = new Map(current);
        const currentCount = newCounts.get(eventItem.id) ?? 0;
        const increment = nextStatus === "going" ? 1 : -1;
        newCounts.set(eventItem.id, Math.max(currentCount + increment, 0));
        return newCounts;
      });
    } else {
      const { data, error } = await supabase
        .from("event_rsvps")
        .insert({ event_id: eventItem.id, user_id: user.id, status: "going" })
        .select("*")
        .single();

      if (error) {
        toast({
          title: "Unable to RSVP",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setRsvps((current) => new Map(current).set(eventItem.id, data as EventRsvp));
      setRsvpCounts((current) => {
        const newCounts = new Map(current);
        newCounts.set(eventItem.id, (newCounts.get(eventItem.id) ?? 0) + 1);
        return newCounts;
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Only verified members can publish community events.",
        variant: "destructive",
      });
      return;
    }

    if (!newEvent.title || !newEvent.description || !newEvent.start_date || !newEvent.city || !newEvent.state) {
      toast({
        title: "Missing details",
        description: "Fill in title, description, date, city, and state to publish your event.",
        variant: "destructive",
      });
      return;
    }

    const payload: Database["public"]["Tables"]["community_events"]["Insert"] = {
      title: newEvent.title,
      description: newEvent.description,
      event_type: newEvent.event_type,
      city: newEvent.city,
      state: newEvent.state,
      start_date: new Date(newEvent.start_date).toISOString(),
      end_date: newEvent.end_date ? new Date(newEvent.end_date).toISOString() : null,
      is_virtual: newEvent.is_virtual,
      virtual_link: newEvent.virtual_link || null,
      location_name: newEvent.location_name || null,
      is_published: true,
      organizer_id: user.id,
    };

    const { error } = await supabase.from("community_events").insert(payload);

    if (error) {
      toast({
        title: "Unable to create event",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Event submitted",
      description: "Your event is live! Attendees can RSVP and receive updates.",
    });

    setCreateDialogOpen(false);
    setNewEvent({
      title: "",
      description: "",
      event_type: "protest",
      city: "",
      state: "",
      start_date: "",
      end_date: "",
      is_virtual: false,
      virtual_link: "",
      location_name: "",
    });

    await fetchEvents();
  };

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return filteredEvents.map((event) => ({
      title: event.title,
      start: new Date(event.start_date),
      end: event.end_date ? new Date(event.end_date) : new Date(event.start_date),
      resource: event,
    }));
  }, [filteredEvents]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Movement Events & Trainings</h2>
          <p className="text-sm text-muted-foreground">Find mutual aid meetups, court support, and national rapid response calls.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>List view</Button>
          <Button variant={viewMode === "calendar" ? "default" : "outline"} size="sm" onClick={() => setViewMode("calendar")}>
            <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary">
                <PlusCircle className="mr-2 h-4 w-4" /> Host event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Publish a community event</DialogTitle>
                <DialogDescription>Connect activists, observers, and legal teams with on-the-ground opportunities.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(event) => setNewEvent((state) => ({ ...state, title: event.target.value }))}
                />
                <Textarea
                  placeholder="Describe the action, required materials, and accessibility info."
                  value={newEvent.description}
                  onChange={(event) => setNewEvent((state) => ({ ...state, description: event.target.value }))}
                  className="min-h-[120px]"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event type</label>
                    <Select
                      value={newEvent.event_type}
                      onValueChange={(value) => setNewEvent((state) => ({ ...state, event_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location name</label>
                    <Input
                      placeholder="Community center, courthouse, or meeting link"
                      value={newEvent.location_name}
                      onChange={(event) => setNewEvent((state) => ({ ...state, location_name: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      placeholder="City"
                      value={newEvent.city}
                      onChange={(event) => setNewEvent((state) => ({ ...state, city: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input
                      placeholder="State (e.g. CA)"
                      value={newEvent.state}
                      onChange={(event) => setNewEvent((state) => ({ ...state, state: event.target.value.toUpperCase() }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start date & time</label>
                    <Input
                      type="datetime-local"
                      value={newEvent.start_date}
                      onChange={(event) => setNewEvent((state) => ({ ...state, start_date: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End date & time</label>
                    <Input
                      type="datetime-local"
                      value={newEvent.end_date}
                      onChange={(event) => setNewEvent((state) => ({ ...state, end_date: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-semibold">Virtual event</p>
                    <p className="text-sm text-muted-foreground">Share a secure meeting link for remote attendees.</p>
                  </div>
                  <Switch
                    checked={newEvent.is_virtual}
                    onCheckedChange={(checked) => setNewEvent((state) => ({ ...state, is_virtual: checked }))}
                  />
                </div>
                {newEvent.is_virtual && (
                  <Input
                    placeholder="https://"
                    value={newEvent.virtual_link}
                    onChange={(event) => setNewEvent((state) => ({ ...state, virtual_link: event.target.value }))}
                  />
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void handleCreateEvent()}>Publish event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/60 p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPE_FILTERS.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by state (e.g. NY)"
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value.toUpperCase())}
          className="w-40"
        />
      </div>

      {loading && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Loading events…</CardTitle>
            <CardDescription>Pulling the latest protests, trainings, and court support actions.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!loading && viewMode === "list" && (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="shadow-sm">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                  </Badge>
                  {event.is_virtual && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video className="h-3 w-3" /> Virtual
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>{format(new Date(event.start_date), "PPP p")}</span>
                  {event.location_name && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {[event.location_name, event.city, event.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{rsvpCounts.get(event.id) ?? 0} attending</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant={rsvps.get(event.id)?.status === "going" ? "secondary" : "default"}
                  size="sm"
                  onClick={() => void handleRsvpToggle(event)}
                >
                  {rsvps.get(event.id)?.status === "going" ? "Cancel RSVP" : "RSVP"}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Add to Calendar
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {filteredEvents.length === 0 && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No events found</CardTitle>
                <CardDescription>Try adjusting your filters or host the first event for your community.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {!loading && viewMode === "calendar" && (
        <div className="h-[600px] rounded-lg border bg-card p-4">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
          />
        </div>
      )}
    </section>
  );
};
