import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";

const ALERT_TYPES = [
  { value: "detained", label: "I'm being detained", description: "Alert your contacts that police have stopped you." },
  { value: "arrested", label: "Arrest in progress", description: "Notify your team and request legal help immediately." },
  { value: "emergency", label: "Emergency assistance", description: "Send a distress call for urgent help." },
];

type PanicAlert = Database["public"]["Tables"]["panic_alerts"]["Row"];

const formatCoordinate = (value: number | null) => (typeof value === "number" ? value.toFixed(6) : null);

export const PanicButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useGeolocation();
  const { contacts, loading: contactsLoading } = useEmergencyContacts(user?.id ?? null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<string>(ALERT_TYPES[0]?.value ?? "detained");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const coordinateSummary = useMemo(() => {
    if (location.loading) {
      return "Fetching location...";
    }
    if (location.error) {
      return location.error;
    }
    if (location.latitude && location.longitude) {
      return `${location.city ?? "Unknown city"}, ${location.state ?? ""}`.trim();
    }
    return "Location unavailable";
  }, [location]);

  useEffect(() => {
    if (contacts.length > 0) {
      const prioritized = contacts.filter((contact) => contact.is_primary);
      setSelectedContacts((current) => {
        if (current.length > 0) {
          return current.filter((id) => contacts.some((contact) => contact.id === id));
        }
        if (prioritized.length > 0) {
          return prioritized.map((contact) => contact.id);
        }
        return contacts.map((contact) => contact.id);
      });
    } else {
      setSelectedContacts([]);
    }
  }, [contacts]);

  useEffect(() => {
    const loadAlerts = async () => {
      if (!user?.id) return;
      setAlertsLoading(true);
      const { data, error } = await supabase
        .from("panic_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        toast({
          title: "Unable to load alerts",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAlerts(data ?? []);
      }
      setAlertsLoading(false);
    };

    void loadAlerts();
  }, [toast, user?.id]);

  const handleSendAlert = async () => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Create an account to use the panic button and notify your contacts.",
        variant: "destructive",
      });
      return;
    }

    const latitude = formatCoordinate(location.latitude);
    const longitude = formatCoordinate(location.longitude);

    if (!latitude || !longitude) {
      if (!testMode) {
        toast({
          title: "Location unavailable",
          description: "Enable location services to send an alert with your position.",
          variant: "destructive",
        });
        return;
      }
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "Select a contact",
        description: "Choose at least one person to notify before sending the alert.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const notifiedContacts = contacts
      .filter((contact) => selectedContacts.includes(contact.id))
      .map((contact) => `${contact.name} (${contact.phone})`);

    const alertPayload = {
      user_id: user.id,
      latitude: latitude ?? "0",
      longitude: longitude ?? "0",
      address:
        location.city || location.state
          ? [location.city, location.state].filter(Boolean).join(", ")
          : null,
      alert_type: testMode ? "test" : alertType,
      message: message.trim() ? message.trim() : null,
      contacts_notified: testMode ? [] : notifiedContacts,
    } satisfies Database["public"]["Tables"]["panic_alerts"]["Insert"];

    const { data, error } = await supabase.from("panic_alerts").insert(alertPayload).select().single();

    if (error) {
      toast({
        title: "Alert failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: testMode ? "Test alert sent" : "Panic alert activated",
        description: testMode
          ? "This was only a drill. Your contacts were not notified."
          : "Your emergency contacts have been notified with your current location.",
      });
      setAlerts((current) => (data ? [data, ...current].slice(0, 10) : current));
      setMessage("");
    }

    setSending(false);
  };

  const toggleContact = (id: string, checked: boolean) => {
    setSelectedContacts((current) => {
      if (checked) {
        return Array.from(new Set([...current, id]));
      }
      return current.filter((contactId) => contactId !== id);
    });
  };

  const handleResolve = async (alert: PanicAlert) => {
    const { error } = await supabase
      .from("panic_alerts")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", alert.id)
      .eq("user_id", alert.user_id);

    if (error) {
      toast({
        title: "Unable to resolve alert",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alert marked as resolved",
      description: "Great job checking back in with your team.",
    });

    setAlerts((current) =>
      current.map((item) =>
        item.id === alert.id
          ? { ...item, status: "resolved", resolved_at: new Date().toISOString() }
          : item
      )
    );
  };

  const disableSend = sending || contactsLoading || selectedContacts.length === 0;

  return (
    <Card className="bg-gradient-to-b from-destructive/10 via-background to-background shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
          <ShieldAlert className="h-6 w-6" /> Panic Button
        </CardTitle>
        <CardDescription>
          Share your live location and alert your emergency contacts instantly during police encounters or civil rights actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-card/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Location status</p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{coordinateSummary}</span>
              </div>
            </div>
            <Badge variant={location.error ? "destructive" : "secondary"} className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              {location.loading ? "Detecting" : location.error ? "Unavailable" : "Ready"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium uppercase tracking-wide">Alert mode</Label>
            <div className="space-y-3">
              {ALERT_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setAlertType(option.value);
                    setTestMode(false);
                  }}
                  className={`w-full rounded-lg border p-3 text-left transition hover:border-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 ${
                    !testMode && alertType === option.value
                      ? "border-destructive bg-destructive/5"
                      : "border-border"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <p className="font-semibold">Test mode</p>
                <p className="text-sm text-muted-foreground">
                  Practice activating the panic button without notifying contacts.
                </p>
              </div>
              <Switch
                checked={testMode}
                onCheckedChange={(checked) => {
                  setTestMode(checked);
                  if (checked) {
                    setAlertType("detained");
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium uppercase tracking-wide">Notify</Label>
            <ScrollArea className="h-48 rounded-lg border p-3">
              <div className="space-y-3">
                {contactsLoading && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts...
                  </div>
                )}
                {!contactsLoading && contacts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add emergency contacts to notify them instantly when you need backup.
                  </p>
                )}
                {!contactsLoading &&
                  contacts.map((contact) => (
                    <label key={contact.id} className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => toggleContact(contact.id, Boolean(checked))}
                      />
                      <div>
                        <p className="font-semibold leading-tight">
                          {contact.name}
                          {contact.is_primary && <Badge className="ml-2" variant="secondary">Primary</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[contact.relationship, contact.phone].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                    </label>
                  ))}
              </div>
            </ScrollArea>

            <div className="grid gap-2">
              <Label htmlFor="panic-message">Add context (optional)</Label>
              <Textarea
                id="panic-message"
                placeholder="Badge number, livestream link, or urgent instructions for your team."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-6">
        <Button
          size="lg"
          className="h-16 w-full text-lg font-semibold uppercase tracking-wide"
          onClick={handleSendAlert}
          disabled={disableSend}
        >
          {sending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Sending alert...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <BellRing className="h-5 w-5" /> {testMode ? "Run safety drill" : "Activate panic alert"}
            </span>
          )}
        </Button>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <AlertCircle className="h-4 w-4" /> Recent alerts
          </div>
          <div className="space-y-3">
            {alertsLoading && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking recent alerts...
              </div>
            )}
            {!alertsLoading && alerts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No alerts yet. Use test mode to practice so your team knows what to expect.
              </p>
            )}
            {!alertsLoading &&
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.status === "resolved" ? "secondary" : "destructive"}>
                          {alert.status?.toUpperCase() ?? "ACTIVE"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.address ?? "No address captured"}
                      </p>
                    </div>
                    {alert.status !== "resolved" && (
                      <Button variant="outline" size="sm" onClick={() => void handleResolve(alert)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark safe
                      </Button>
                    )}
                  </div>
                  {alert.message && <p className="mt-2 text-sm">“{alert.message}”</p>}
                </div>
              ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
