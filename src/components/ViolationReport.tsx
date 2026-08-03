import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Send, Building2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const ViolationReport = () => {
  const { toast } = useToast();
  const location = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationState: location.state || "",
    locationCity: location.city || "",
    incidentDate: "",
    agencyName: "",
    officerBadge: "",
    officerFirstName: "",
    officerLastName: "",
    officerRank: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const officerName = [formData.officerFirstName.trim(), formData.officerLastName.trim()]
        .filter(Boolean)
        .join(" ") || null;

      // Insert violation
      const { data: violationData, error: violationError } = await supabase
        .from("violations")
        .insert({
          title: formData.title,
          description: formData.description,
          location_state: formData.locationState,
          location_city: formData.locationCity || null,
          incident_date: new Date(formData.incidentDate).toISOString(),
          latitude: location.latitude,
          longitude: location.longitude,
          agency_name: formData.agencyName.trim() || null,
          officer_name: officerName,
          officer_badge: formData.officerBadge.trim() || null,
          officer_rank: formData.officerRank.trim() || null,
        })
        .select()
        .single();

      if (violationError) throw violationError;

      toast({
        title: "Report Submitted",
        description: "Your violation report has been published to the community feed.",
      });

      setFormData({
        title: "",
        description: "",
        locationState: location.state || "",
        locationCity: location.city || "",
        incidentDate: "",
        agencyName: "",
        officerBadge: "",
        officerFirstName: "",
        officerLastName: "",
        officerRank: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="report-violation" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border shadow-strong">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">Report a Violation</CardTitle>
              </div>
              <CardDescription>
                Document and share civil rights violations with the community. Reports are public and help track patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of what happened"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed information: what happened, who was involved, any witnesses, badge numbers, etc."
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      required
                      value={formData.locationState}
                      onValueChange={(value) => setFormData({ ...formData, locationState: value })}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.locationCity}
                      onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                      placeholder="City name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Incident Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    required
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    max={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Agency & Officer Information (Optional)</CardTitle>
                    </div>
                    <CardDescription>
                      Help track patterns of misconduct by linking this report to a law enforcement agency and/or officer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="agency">Law Enforcement Agency</Label>
                      <Input
                        id="agency"
                        value={formData.agencyName}
                        onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                        placeholder="e.g., Galveston Police Department"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badge">Officer Badge Number</Label>
                      <Input
                        id="badge"
                        value={formData.officerBadge}
                        onChange={(e) => setFormData({ ...formData, officerBadge: e.target.value })}
                        placeholder="e.g., 12345"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="officerFirst">Officer First Name</Label>
                        <Input
                          id="officerFirst"
                          value={formData.officerFirstName}
                          onChange={(e) => setFormData({ ...formData, officerFirstName: e.target.value })}
                          placeholder="First name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officerLast">Officer Last Name</Label>
                        <Input
                          id="officerLast"
                          value={formData.officerLastName}
                          onChange={(e) => setFormData({ ...formData, officerLastName: e.target.value })}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rank">Officer Rank</Label>
                      <Input
                        id="rank"
                        value={formData.officerRank}
                        onChange={(e) => setFormData({ ...formData, officerRank: e.target.value })}
                        placeholder="e.g., Officer, Sergeant, Lieutenant"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-500/50 bg-amber-500/5">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      <strong>Before submitting:</strong> Ensure you have saved backups of any recordings. 
                      Do not include personally identifiable information of victims without consent. 
                      Reports are public and cannot be deleted.
                    </p>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
