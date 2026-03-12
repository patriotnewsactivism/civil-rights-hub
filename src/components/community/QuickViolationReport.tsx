import { useState } from "react";
import { AlertCircle, MapPin, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export function QuickViolationReport({ userId }: { userId: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const location = useGeolocation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    state: "",
    city: "",
  });

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Sign in to report a violation");
      return;
    }
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    const state = form.state || location.state || "";
    if (!state) {
      toast.error("Please select a state");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("violations").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        location_state: state,
        location_city: form.city || location.city || null,
        incident_date: new Date().toISOString(),
        user_id: userId,
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
      });

      if (error) throw error;

      toast.success("Violation reported successfully. Stay safe.");
      setForm({ title: "", description: "", state: "", city: "" });
      setExpanded(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <Button
        onClick={() => setExpanded(true)}
        variant="outline"
        className="gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <AlertCircle className="h-4 w-4" />
        Report Violation
      </Button>
    );
  }

  return (
    <Card className="border-destructive/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-sm">Quick Violation Report</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(false)} className="h-7 w-7">
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <Input
          placeholder="What happened? (brief title)"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="text-sm"
        />

        <Textarea
          placeholder="Describe what you witnessed — include badge numbers, agency names, timestamps if possible..."
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="text-sm min-h-[80px]"
        />

        <div className="grid grid-cols-2 gap-2">
          <Select value={form.state} onValueChange={(v) => setForm(prev => ({ ...prev, state: v }))}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={location.state || "State"} />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={location.city || "City"}
            value={form.city}
            onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
            className="text-sm"
          />
        </div>

        {location.state && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Auto-detected: {location.city && `${location.city}, `}{location.state}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>Cancel</Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting || !form.title.trim() || !form.description.trim()}
            className="gap-1"
          >
            <Send className="h-3 w-3" />
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
