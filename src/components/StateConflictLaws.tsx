import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  Shield,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
  Scale,
  ChevronRight,
  ExternalLink,
  Copy,
  Gavel,
} from "lucide-react";
import { toast } from "sonner";
import { US_STATES } from "@/data/usStates";
import { useJurisdiction } from "@/hooks/useJurisdiction";

interface ConflictingLaw {
  id: string;
  state: string;
  conflict_title: string;
  description: string;
  affected_right: string;
  federal_protection: string;
  state_law_citation: string;
  status: string;
  challenge_tips: string[];
  reporting_contacts: { org: string; phone?: string; web?: string; email?: string }[];
  severity: string;
  last_updated: string;
}

interface ReportingContact {
  id: string;
  name: string;
  organization: string;
  contact_type: string;
  contact_value: string;
  category: string;
  scope: string;
  state: string | null;
  description: string;
  is_emergency: boolean;
  available_hours: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: "Active", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
  challenged: { label: "Challenged in Court", className: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Scale },
  struck_down: { label: "Struck Down", className: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  enjoined: { label: "Enjoined / Blocked", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Shield },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 border-red-500/30 text-red-400",
  high: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
};

export function StateConflictLaws() {
  const { state: jurisdictionState } = useJurisdiction();
  const [selectedState, setSelectedState] = useState<string>(jurisdictionState || "");
  const [conflicts, setConflicts] = useState<ConflictingLaw[]>([]);
  const [nationalContacts, setNationalContacts] = useState<ReportingContact[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync with jurisdiction state
  useEffect(() => {
    if (jurisdictionState && !selectedState) {
      setSelectedState(jurisdictionState);
    }
  }, [jurisdictionState, selectedState]);

  // Load conflicts for selected state
  useEffect(() => {
    if (!selectedState || selectedState === "all") {
      // Load all conflicts when no state selected
      setLoading(true);
      supabase
        .from("state_law_conflicts")
        .select("*")
        .order("severity", { ascending: true })
        .order("state")
        .then(({ data, error }) => {
          if (!error && data) setConflicts(data as unknown as ConflictingLaw[]);
          setLoading(false);
        });
    } else {
      setLoading(true);
      supabase
        .from("state_law_conflicts")
        .select("*")
        .eq("state", selectedState)
        .order("severity", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) setConflicts(data as unknown as ConflictingLaw[]);
          setLoading(false);
        });
    }
  }, [selectedState]);

  // Load national reporting contacts
  useEffect(() => {
    supabase
      .from("reporting_contacts")
      .select("*")
      .eq("scope", "national")
      .order("is_emergency", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setNationalContacts(data as unknown as ReportingContact[]);
      });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">State Laws Conflicting with Your Rights</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            These state laws have been identified as potentially conflicting with established federal constitutional 
            protections. Each entry includes the specific federal right at stake, current legal status, 
            actionable tips to challenge the law, and contacts for immediate reporting.
          </p>
        </div>
        <div className="w-full md:w-64 shrink-0">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conflicts List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : conflicts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedState && selectedState !== "all"
                ? `No documented conflicts for ${selectedState}`
                : "Select a state to view conflicts"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Our database is continuously updated. If you know of a state law conflicting with 
              established constitutional rights, please report it through the community.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gavel className="h-4 w-4" />
            <span>{conflicts.length} conflicting law{conflicts.length !== 1 ? "s" : ""} found</span>
          </div>

          <Accordion type="multiple" className="space-y-3">
            {conflicts.map((conflict) => {
              const statusInfo = STATUS_BADGES[conflict.status] || STATUS_BADGES.active;
              const StatusIcon = statusInfo.icon;
              const severityClass = SEVERITY_COLORS[conflict.severity] || SEVERITY_COLORS.high;

              return (
                <AccordionItem
                  key={conflict.id}
                  value={conflict.id}
                  className={`border rounded-xl overflow-hidden ${severityClass}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-col items-start gap-2 text-left flex-1 mr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={statusInfo.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {conflict.affected_right}
                        </Badge>
                        {conflict.severity === "critical" && (
                          <Badge className="bg-red-600 text-white text-[10px]">CRITICAL</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{conflict.state}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{conflict.conflict_title}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{conflict.state_law_citation}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <p className="text-sm leading-relaxed">{conflict.description}</p>
                      </div>

                      {/* Federal Protection */}
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-primary mb-1">Federal Protection</p>
                            <p className="text-sm text-foreground/80">{conflict.federal_protection}</p>
                          </div>
                        </div>
                      </div>

                      {/* Challenge Tips */}
                      {conflict.challenge_tips && conflict.challenge_tips.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-amber-500" />
                            How to Challenge This Law
                          </h4>
                          <div className="space-y-2">
                            {conflict.challenge_tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm">
                                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <p className="text-foreground/80">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reporting Contacts */}
                      {conflict.reporting_contacts && conflict.reporting_contacts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-green-500" />
                            Report Immediately
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {conflict.reporting_contacts.map((contact, i) => (
                              <Card key={i} className="border-border/50">
                                <CardContent className="p-3">
                                  <p className="font-medium text-sm">{contact.org}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {contact.phone && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs gap-1"
                                        onClick={() => copyToClipboard(contact.phone!)}
                                      >
                                        <Phone className="h-3 w-3" />
                                        {contact.phone}
                                      </Button>
                                    )}
                                    {contact.web && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs gap-1"
                                        asChild
                                      >
                                        <a href={contact.web} target="_blank" rel="noopener noreferrer">
                                          <Globe className="h-3 w-3" />
                                          Website
                                          <ExternalLink className="h-2.5 w-2.5" />
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}

      {/* National Reporting Contacts */}
      {nationalContacts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">National Reporting Contacts</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            These organizations accept reports of civil rights violations nationwide. Emergency contacts are listed first.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nationalContacts.map((contact) => (
              <Card
                key={contact.id}
                className={`border ${contact.is_emergency ? "border-red-500/30 bg-red-500/5" : "border-border/50"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{contact.name}</p>
                        {contact.is_emergency && (
                          <Badge className="bg-red-600 text-white text-[10px]">EMERGENCY</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{contact.organization}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{contact.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {contact.contact_type === "phone" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => copyToClipboard(contact.contact_value)}
                      >
                        <Phone className="h-3 w-3" />
                        {contact.contact_value}
                        <Copy className="h-2.5 w-2.5" />
                      </Button>
                    )}
                    {(contact.contact_type === "web" || contact.contact_type === "email") && (
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                        <a
                          href={contact.contact_type === "email" ? `mailto:${contact.contact_value}` : contact.contact_value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-3 w-3" />
                          {contact.contact_type === "email" ? contact.contact_value : "Visit"}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </Button>
                    )}
                    <Badge variant="secondary" className="text-[10px]">{contact.available_hours}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300/50 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-900 dark:text-amber-200">
        <strong>Legal Disclaimer:</strong> This information is compiled from public legal sources and is 
        for educational purposes only. Legal status may change as cases progress through the courts. Always 
        consult with a licensed attorney in your jurisdiction before relying on this information for legal decisions.
      </div>
    </div>
  );
}
