import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock, Scale, ExternalLink, Loader2, Video, Phone, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { format, formatDistanceToNow, isFuture, isPast } from "date-fns";

interface CourtHearing {
  id: string;
  case_name: string;
  case_number: string | null;
  case_type: string | null;
  description: string;
  court_name: string;
  court_type: string | null;
  city: string;
  state: string;
  address: string | null;
  hearing_date: string;
  hearing_type: string | null;
  judge_name: string | null;
  plaintiff: string | null;
  defendant: string | null;
  is_public: boolean;
  zoom_link: string | null;
  phone_number: string | null;
  courtroom: string | null;
  organizations_involved: string[] | null;
  issues: string[] | null;
  external_url: string | null;
  notes: string | null;
  status: string;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const CourtWatch = () => {
  const { toast } = useToast();
  const location = useGeolocation();
  const [hearings, setHearings] = useState<CourtHearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "all">("upcoming");

  useEffect(() => {
    if (location.state && !selectedState) {
      setSelectedState(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    fetchHearings();
  }, [selectedState, timeFilter]);

  const fetchHearings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("court_calendars")
        .select("*")
        .eq("is_public", true)
        .order("hearing_date", { ascending: true });

      if (selectedState) {
        query = query.eq("state", selectedState);
      }

      if (timeFilter === "upcoming") {
        query = query.gte("hearing_date", new Date().toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setHearings(data || []);
    } catch (error) {
      console.error("Error fetching court calendars:", error);
      toast({
        title: "Failed to load court calendars",
        description: "Unable to fetch hearing information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: { variant: "default" as const, label: "Scheduled" },
      postponed: { variant: "destructive" as const, label: "Postponed" },
      completed: { variant: "secondary" as const, label: "Completed" },
      cancelled: { variant: "outline" as const, label: "Cancelled" },
    };
    const badge = badges[status as keyof typeof badges] || badges.scheduled;
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  return (
    <section id="court-watch" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Court Watch Calendar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track upcoming civil rights hearings and trials. Attend court proceedings to show
            support and witness the justice system in action.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Filters */}
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Filter Hearings
              </CardTitle>
              <CardDescription>
                Find civil rights court proceedings in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={(val) => setTimeFilter(val as "upcoming" | "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming Only</SelectItem>
                  <SelectItem value="all">All Hearings</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Hearings List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hearings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Scale className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  {selectedState
                    ? `No hearings found for ${selectedState}. Check back soon as we add more events.`
                    : "No hearings found. Try selecting a specific state or changing the time filter."}
                </p>
                <p className="text-sm text-muted-foreground">
                  Court calendars are updated regularly. Submit a hearing for inclusion using the contact form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Found {hearings.length} {hearings.length === 1 ? "hearing" : "hearings"}
              </p>

              {hearings.map((hearing) => {
                const hearingDate = new Date(hearing.hearing_date);
                const isUpcoming = isFuture(hearingDate);

                return (
                  <Card key={hearing.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(hearing.status)}
                            {hearing.case_type && (
                              <Badge variant="outline">{hearing.case_type}</Badge>
                            )}
                            {!isUpcoming && isPast(hearingDate) && (
                              <Badge variant="secondary">Past</Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {hearing.case_name}
                          </h3>
                          {hearing.case_number && (
                            <p className="text-sm text-muted-foreground">
                              Case No. {hearing.case_number}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground">{hearing.description}</p>

                      {/* Date & Time */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">
                              {format(hearingDate, "EEEE, MMMM d, yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(hearingDate, "h:mm a")}
                            </p>
                            {isUpcoming && (
                              <p className="text-xs text-primary">
                                {formatDistanceToNow(hearingDate, { addSuffix: true })}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">{hearing.court_name}</p>
                            {hearing.court_type && (
                              <p className="text-sm text-muted-foreground">{hearing.court_type}</p>
                            )}
                            {hearing.courtroom && (
                              <p className="text-sm text-muted-foreground">Courtroom {hearing.courtroom}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {hearing.city}, {hearing.state}
                          </p>
                          {hearing.address && (
                            <p className="text-sm text-muted-foreground">{hearing.address}</p>
                          )}
                        </div>
                      </div>

                      {/* Parties */}
                      {(hearing.plaintiff || hearing.defendant) && (
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {hearing.plaintiff && (
                            <div>
                              <span className="font-semibold">Plaintiff: </span>
                              <span className="text-muted-foreground">{hearing.plaintiff}</span>
                            </div>
                          )}
                          {hearing.defendant && (
                            <div>
                              <span className="font-semibold">Defendant: </span>
                              <span className="text-muted-foreground">{hearing.defendant}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Judge */}
                      {hearing.judge_name && (
                        <div className="text-sm">
                          <span className="font-semibold">Judge: </span>
                          <span className="text-muted-foreground">{hearing.judge_name}</span>
                        </div>
                      )}

                      {/* Issues */}
                      {hearing.issues && hearing.issues.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm mb-2">Legal Issues:</p>
                          <div className="flex flex-wrap gap-2">
                            {hearing.issues.map((issue) => (
                              <Badge key={issue} variant="secondary">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Organizations */}
                      {hearing.organizations_involved && hearing.organizations_involved.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm mb-2">Organizations Involved:</p>
                          <div className="flex flex-wrap gap-2">
                            {hearing.organizations_involved.map((org) => (
                              <Badge key={org} variant="outline">
                                {org}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Access Info */}
                      {(hearing.zoom_link || hearing.phone_number || hearing.external_url) && (
                        <div className="border-t pt-4 space-y-2">
                          <p className="font-semibold text-sm">Public Access:</p>
                          <div className="flex flex-wrap gap-3">
                            {hearing.zoom_link && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={hearing.zoom_link} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Zoom
                                </a>
                              </Button>
                            )}
                            {hearing.phone_number && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={`tel:${hearing.phone_number}`}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call In
                                </a>
                              </Button>
                            )}
                            {hearing.external_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={hearing.external_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  More Info
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {hearing.notes && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">{hearing.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Information Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-2">About Court Watch</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Court watching is an important form of civic engagement. By attending hearings, you can:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Show support for plaintiffs fighting for civil rights</li>
                <li>Hold judges and prosecutors accountable through public observation</li>
                <li>Learn how the legal system handles civil rights cases</li>
                <li>Document proceedings for community awareness</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Most court proceedings are public, but rules vary. Check with the court clerk about photography,
                recording, and seating policies before attending.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
