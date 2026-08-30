import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { captureSocialError } from "@/lib/socialTelemetry";

interface CommunityEvent {
  id: string;
  organizer_id: string | null;
  title: string;
  description: string;
  city: string | null;
  state: string | null;
  location_name: string | null;
  is_virtual: boolean | null;
  virtual_link: string | null;
  start_date: string;
  end_date: string | null;
  rsvp_count: number | null;
}

export function CommunityEventsWorkspace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [ownRsvps, setOwnRsvps] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    locationName: "",
    startDate: "",
    endDate: "",
    virtualLink: "",
  });

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [eventsResult, rsvpResult] = await Promise.all([
      supabase
        .from("community_events")
        .select("id, organizer_id, title, description, city, state, location_name, is_virtual, virtual_link, start_date, end_date, rsvp_count")
        .eq("is_public", true)
        .eq("is_published", true)
        .eq("is_cancelled", false)
        .order("start_date", { ascending: true })
        .limit(100),
      supabase.from("event_rsvps").select("id, event_id, status").eq("user_id", user.id),
    ]);

    if (eventsResult.error) {
      captureSocialError(eventsResult.error, {
        surface: "events",
        operation: "load_events",
        table: "community_events",
      });
      toast({ title: "Unable to load events", description: "Community events could not be loaded. Please try again.", variant: "destructive" });
      setEvents([]);
    } else {
      setEvents((eventsResult.data ?? []) as CommunityEvent[]);
    }

    if (rsvpResult.error) {
      captureSocialError(rsvpResult.error, {
        surface: "events",
        operation: "load_rsvps",
        table: "event_rsvps",
      });
      setOwnRsvps(new Map());
    } else {
      const map = new Map<string, string>();
      for (const row of rsvpResult.data ?? []) {
        if (row.event_id && row.status === "going") map.set(row.event_id, row.id);
      }
      setOwnRsvps(map);
    }
    setLoading(false);
  }, [toast, user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const upcoming = useMemo(
    () => events.filter((event) => new Date(event.end_date || event.start_date).getTime() >= Date.now() - 60_000),
    [events]
  );

  const createEvent = async () => {
    if (!user?.id) return;
    if (!draft.title.trim() || !draft.description.trim() || !draft.startDate || !draft.city.trim() || !draft.state.trim()) {
      toast({ title: "Missing event details", description: "Title, description, start time, city, and state are required.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("community_events").insert({
      organizer_id: user.id,
      title: draft.title.trim(),
      description: draft.description.trim(),
      city: draft.city.trim(),
      state: draft.state.trim().toUpperCase(),
      location_name: draft.locationName.trim() || null,
      start_date: new Date(draft.startDate).toISOString(),
      end_date: draft.endDate ? new Date(draft.endDate).toISOString() : null,
      is_virtual: Boolean(draft.virtualLink.trim()),
      virtual_link: draft.virtualLink.trim() || null,
      event_type: "other",
      is_public: true,
      is_published: true,
      is_cancelled: false,
    });

    if (error) {
      captureSocialError(error, {
        surface: "events",
        operation: "create_event",
        table: "community_events",
      });
      toast({ title: "Unable to publish event", description: "The event could not be published. Please try again.", variant: "destructive" });
      return;
    }

    setDraft({ title: "", description: "", city: "", state: "", locationName: "", startDate: "", endDate: "", virtualLink: "" });
    setShowComposer(false);
    toast({ title: "Event published", description: "The listing is marked as community-submitted, not independently verified." });
    await load();
  };

  const toggleRsvp = async (eventId: string) => {
    if (!user?.id) return;
    const existingId = ownRsvps.get(eventId);
    const result = existingId
      ? await supabase.from("event_rsvps").delete().eq("id", existingId).eq("user_id", user.id)
      : await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id, status: "going" });

    if (result.error) {
      captureSocialError(result.error, {
        surface: "events",
        operation: existingId ? "cancel_rsvp" : "create_rsvp",
        table: "event_rsvps",
      });
      toast({ title: "Unable to update RSVP", description: "Your RSVP could not be updated. Please try again.", variant: "destructive" });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold"><CalendarDays className="h-6 w-6" /> Community events</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Listings are submitted by community members and are not independently verified by Civil Rights Hub. Confirm dates, locations, and organizer details before relying on them.
          </p>
        </div>
        <Button onClick={() => setShowComposer((value) => !value)}><PlusCircle className="mr-2 h-4 w-4" /> Host event</Button>
      </div>

      {showComposer && (
        <Card>
          <CardHeader>
            <CardTitle>Publish a community event</CardTitle>
            <CardDescription>Only publish details you are authorized to share.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input className="md:col-span-2" placeholder="Event title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            <Textarea className="min-h-[110px] md:col-span-2" placeholder="Description" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
            <Input placeholder="City" value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} />
            <Input placeholder="State" maxLength={2} value={draft.state} onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value.toUpperCase() }))} />
            <Input placeholder="Location name" value={draft.locationName} onChange={(e) => setDraft((d) => ({ ...d, locationName: e.target.value }))} />
            <Input placeholder="Virtual meeting link (optional)" value={draft.virtualLink} onChange={(e) => setDraft((d) => ({ ...d, virtualLink: e.target.value }))} />
            <Input type="datetime-local" value={draft.startDate} onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} />
            <Input type="datetime-local" value={draft.endDate} onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))} />
            <div className="flex justify-end md:col-span-2"><Button onClick={createEvent}>Publish event</Button></div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading events…</div>
      ) : upcoming.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-muted-foreground">No upcoming community events have been published on the clean slate yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {upcoming.map((event) => {
            const going = ownRsvps.has(event.id);
            return (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{new Date(event.start_date).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{event.description}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {[event.location_name, event.city, event.state].filter(Boolean).join(", ") || "Location not provided"}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.rsvp_count ?? 0} going</div>
                  </div>
                  <Button variant={going ? "secondary" : "default"} onClick={() => toggleRsvp(event.id)}>{going ? "Cancel RSVP" : "I'm going"}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
