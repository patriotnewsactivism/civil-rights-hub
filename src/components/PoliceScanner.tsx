import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Radio, MapPin, ExternalLink, Loader2, Users, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { SCANNER_FALLBACK_DATA } from "@/lib/scannerFallback";
import { ScannerLinkRecord } from "@/types/scanner";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const PoliceScanner = () => {
  const { toast } = useToast();
  const location = useGeolocation();
  const [scanners, setScanners] = useState<ScannerLinkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchScanners = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("scanner_links")
        .select("*")
        .eq("is_active", true)
        .order("listener_count", { ascending: false })
        .order("scanner_name");

      if (error) throw error;

      if (data && data.length > 0) {
        setScanners(data as ScannerLinkRecord[]);
        setUsingFallback(false);
      } else {
        setScanners(SCANNER_FALLBACK_DATA);
        setUsingFallback(true);
      }
    } catch (error) {
      console.error("Error fetching scanner links:", error);
      setScanners(SCANNER_FALLBACK_DATA);
      setUsingFallback(true);
      toast({
        title: "Failed to load scanner links",
        description: "Showing cached Broadcastify feeds instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (location.state && selectedState === "all") {
      setSelectedState(location.state);
    }
  }, [location.state, selectedState]);

  useEffect(() => {
    void fetchScanners();
  }, [fetchScanners]);

  const filteredScanners = useMemo(() => {
    if (selectedState === "all") {
      return scanners;
    }
    return scanners.filter((scanner) => scanner.state === selectedState);
  }, [scanners, selectedState]);

  const getScannerUrl = (scanner: ScannerLinkRecord): string | null => {
    return scanner.broadcastify_url || scanner.scanner_radio_url || scanner.other_url;
  };

  const getLinkTypeBadge = (linkType: string | null) => {
    if (!linkType) return null;

    const badges = {
      broadcastify: { label: "Broadcastify", variant: "default" as const },
      scanner_radio: { label: "Scanner Radio", variant: "secondary" as const },
      frequency: { label: "Frequency Info", variant: "outline" as const },
      other: { label: "Other", variant: "outline" as const },
    };

    const badge = badges[linkType as keyof typeof badges];
    return badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null;
  };

  return (
    <section id="police-scanner" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Police Scanner Links
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Listen to live police, fire, and EMS radio communications in your area.
            Stay informed about incidents and emergency responses in real-time.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* State Filter */}
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Select Location
              </CardTitle>
              <CardDescription>
                Choose your state to find local police scanner feeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Scanner Links */}
          {usingFallback && (
            <Alert className="border-dashed">
              <Database className="h-4 w-4" />
              <AlertTitle>Loaded cached scanner feeds</AlertTitle>
              <AlertDescription>
                Supabase is offline right now. These Broadcastify and OpenMHZ feeds come from the
                bundled seed data so you can still monitor activity.
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredScanners.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Radio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {selectedState
                    ? `No scanner links found for ${selectedState}. Check back soon as we add more feeds.`
                    : "No scanner links available. Try selecting a specific state."}
                </p>
                <p className="text-sm text-muted-foreground">
                  You can also visit{" "}
                  <a
                    href="https://www.broadcastify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Broadcastify.com
                  </a>{" "}
                  directly to search for feeds in your area.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Found {filteredScanners.length} active {filteredScanners.length === 1 ? "feed" : "feeds"}
              </p>

              {filteredScanners.map((scanner) => {
                const url = getScannerUrl(scanner);
                return (
                  <Card key={scanner.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <Radio className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground mb-1">
                                {scanner.scanner_name}
                              </h3>
                              <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {scanner.city ? `${scanner.city}, ${scanner.state_code}` : scanner.state}
                                </span>
                                {scanner.county && (
                                  <span>• {scanner.county} County</span>
                                )}
                                {scanner.listener_count > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {scanner.listener_count} listeners
                                  </span>
                                )}
                              </div>

                              {scanner.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {scanner.description}
                                </p>
                              )}

                              {scanner.frequency && (
                                <div className="text-sm">
                                  <span className="font-semibold">Frequency: </span>
                                  <span className="text-muted-foreground">{scanner.frequency}</span>
                                </div>
                              )}

                              {scanner.notes && (
                                <p className="text-xs text-muted-foreground italic mt-2">
                                  {scanner.notes}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 mt-3">
                                {getLinkTypeBadge(scanner.link_type)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {url && (
                          <Button asChild size="sm">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Listen
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Information Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-2">About Police Scanners</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Police scanners provide real-time audio feeds of emergency services radio communications.
                Listening to scanners can help you:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Stay informed about local incidents and emergencies</li>
                <li>Monitor police activity during protests or demonstrations</li>
                <li>Track emergency response in your neighborhood</li>
                <li>Understand how law enforcement operates in your community</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Note: Some jurisdictions encrypt their radio communications. Availability varies by location.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
