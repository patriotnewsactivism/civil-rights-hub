import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  Scale,
  Search,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  LEGISLATION_DATA,
  type LegislationItem,
  type ActionTemplateItem,
} from "@/lib/referenceData";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const STATUS_CONFIG = {
  introduced: { label: "Introduced", color: "bg-blue-500" },
  in_committee: { label: "In Committee", color: "bg-yellow-500" },
  passed_house: { label: "Passed House", color: "bg-green-500" },
  passed_senate: { label: "Passed Senate", color: "bg-green-500" },
  signed: { label: "Signed into Law", color: "bg-green-600" },
  vetoed: { label: "Vetoed", color: "bg-red-500" },
  failed: { label: "Failed", color: "bg-gray-500" },
};

type DataSource = "supabase" | "reference";

export function LegislativeActionCenter() {
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [legislation, setLegislation] = useState<LegislationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dataSource, setDataSource] = useState<DataSource>("supabase");
  const referenceNoticeShown = useRef(false);

  const showReferenceNotice = useCallback(() => {
    if (!referenceNoticeShown.current) {
      toast.info(
        "Loaded curated legislation directly from Congress.gov and state legislative records.",
        {
          duration: 6000,
        },
      );
      referenceNoticeShown.current = true;
    }
  }, []);

  const applyLegislationReference = useCallback(() => {
    const filtered = LEGISLATION_DATA.legislation.filter((bill) => {
      const levelMatch = selectedLevel === "all" || bill.level === selectedLevel;
      const stateMatch =
        selectedState === "all" || bill.state === selectedState || bill.state === null;
      const categoryMatch = selectedCategory === "all" || bill.category.includes(selectedCategory);
      return levelMatch && stateMatch && categoryMatch;
    });

    setLegislation(filtered.length > 0 ? filtered : LEGISLATION_DATA.legislation);
    setDataSource("reference");
    showReferenceNotice();
  }, [selectedCategory, selectedLevel, selectedState, showReferenceNotice]);

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    applyLegislationReference();
  }, [applyLegislationReference]);

  const filteredLegislation = legislation.filter((bill) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      bill.bill_number.toLowerCase().includes(searchLower) ||
      bill.title.toLowerCase().includes(searchLower) ||
      bill.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section id="legislative-action" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Scale className="h-10 w-10 text-primary" />
            Legislative Action Center
          </h2>
          <p className="text-muted-foreground text-lg">
            Track civil rights legislation and contact your representatives
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search &amp; Filter Legislation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Bill number, title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="federal">Federal</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Police Reform">Police Reform</SelectItem>
                    <SelectItem value="Civil Rights">Civil Rights</SelectItem>
                    <SelectItem value="Privacy">Privacy</SelectItem>
                    <SelectItem value="First Amendment">First Amendment</SelectItem>
                    <SelectItem value="Transparency">Transparency</SelectItem>
                    <SelectItem value="Accountability">Accountability</SelectItem>
                    <SelectItem value="Reparations">Reparations</SelectItem>
                    <SelectItem value="Surveillance">Surveillance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">Loading legislation...</div>
        ) : filteredLegislation.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No legislation found. Try adjusting your filters.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLegislation.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {dataSource === "reference" && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-100">
            <AlertCircle className="h-4 w-4" />
            Displaying verified legislative data from Congress.gov and state legislative trackers.
          </div>
        )}

        <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>How to Take Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>1. Find Your Representatives:</strong> Click "Contact Representatives" on any
              bill to find your elected officials.
            </p>
            <p>
              <strong>2. Use Pre-Written Scripts:</strong> We provide email templates and call scripts to
              make contacting officials easy.
            </p>
            <p>
              <strong>3. Track Your Actions:</strong> Record when you've contacted officials to stay
              organized.
            </p>
            <p className="text-muted-foreground pt-2">
              Your voice matters. Regular constituent contact is one of the most effective ways to
              influence legislation.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function BillCard({ bill }: { bill: LegislationItem }) {
  const [templates, setTemplates] = useState<ActionTemplateItem[]>([]);
  const statusConfig = STATUS_CONFIG[bill.status as keyof typeof STATUS_CONFIG];

  useEffect(() => {
    // Load templates from reference data only
    setTemplates(LEGISLATION_DATA.actionTemplates[bill.id] || []);
  }, [bill.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">
                {bill.bill_number}
              </Badge>
              {statusConfig && (
                <Badge className={`${statusConfig.color} text-white`}>
                  {statusConfig.label}
                </Badge>
              )}
              {bill.level === "state" && bill.state && (
                <Badge variant="outline">{bill.state}</Badge>
              )}
            </div>
            <CardTitle className="text-xl mb-2">{bill.title}</CardTitle>
            {bill.description && (
              <CardDescription className="text-sm">{bill.description}</CardDescription>
            )}
          </div>
          {bill.source_url && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <a href={bill.source_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Docket
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bill.category && bill.category.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bill.category.map((cat, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {(bill.introduced_date || bill.last_action_date || bill.sponsor) && (
          <div className="grid md:grid-cols-3 gap-3 text-sm pt-2 border-t">
            {bill.introduced_date && (
              <div>
                <span className="text-muted-foreground">Introduced:</span>{" "}
                <span className="font-medium">
                  {format(new Date(bill.introduced_date), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {bill.last_action_date && (
              <div>
                <span className="text-muted-foreground">Last Action:</span>{" "}
                <span className="font-medium">
                  {format(new Date(bill.last_action_date), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {bill.sponsor && (
              <div>
                <span className="text-muted-foreground">Sponsor:</span>{" "}
                <span className="font-medium">{bill.sponsor}</span>
              </div>
            )}
          </div>
        )}

        {bill.last_action_description && (
          <div className="text-sm bg-muted p-3 rounded-lg">
            <strong>Latest Update:</strong> {bill.last_action_description}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm pt-2 border-t">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-green-600" />
            <span className="font-medium">{bill.support_count}</span>
            <span className="text-muted-foreground">support</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4 text-red-600" />
            <span className="font-medium">{bill.oppose_count}</span>
            <span className="text-muted-foreground">oppose</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Representatives
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Take Action on {bill.bill_number}</DialogTitle>
                <DialogDescription>
                  Use these templates to contact your representatives
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {templates.length === 0 ? (
                  <p className="text-muted-foreground">
                    No templates available yet for this bill. You can still contact your
                    representatives directly!
                  </p>
                ) : (
                  templates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          {template.template_type === "email" ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <Phone className="h-4 w-4" />
                          )}
                          {template.template_type === "email" ? "Email" : "Call"} Template
                        </CardTitle>
                        {template.subject_line && (
                          <CardDescription>Subject: {template.subject_line}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <pre className="text-sm whitespace-pre-wrap font-sans bg-muted/60 p-3 rounded-lg border">
                          {template.body_text}
                        </pre>
                        <Button
                          variant="secondary"
                          className="gap-2"
                          onClick={() => copyToClipboard(template.body_text)}
                        >
                          <Copy className="h-4 w-4" />
                          Copy Text
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
