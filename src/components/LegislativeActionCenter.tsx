import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Legislation {
  id: string;
  bill_number: string;
  title: string;
  description: string | null;
  level: string;
  state: string | null;
  category: string[];
  status: string;
  introduced_date: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  support_count: number;
  oppose_count: number;
}

interface ActionTemplate {
  id: string;
  template_type: string;
  position: string;
  subject_line: string | null;
  body_text: string;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
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

export function LegislativeActionCenter() {
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [legislation, setLegislation] = useState<Legislation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    fetchLegislation();
  }, [selectedState, selectedLevel, selectedCategory]);

  const fetchLegislation = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('legislation')
        .select('*')
        .order('introduced_date', { ascending: false });

      if (selectedLevel !== "all") {
        query = query.eq('level', selectedLevel);
      }

      if (selectedState !== "all") {
        query = query.or(`state.eq.${selectedState},state.is.null`);
      }

      if (selectedCategory !== "all") {
        query = query.contains('category', [selectedCategory]);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLegislation(data || []);
    } catch (error) {
      console.error('Error fetching legislation:', error);
      toast.error("Failed to load legislation");
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle>Search & Filter Legislation</CardTitle>
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
                      <SelectItem key={state} value={state}>{state}</SelectItem>
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

        <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>How to Take Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>1. Find Your Representatives:</strong> Click "Contact Representatives" on any bill to find your elected officials.
            </p>
            <p>
              <strong>2. Use Pre-Written Scripts:</strong> We provide email templates and call scripts to make contacting officials easy.
            </p>
            <p>
              <strong>3. Track Your Actions:</strong> Record when you've contacted officials to stay organized.
            </p>
            <p className="text-muted-foreground pt-2">
              Your voice matters. Regular constituent contact is one of the most effective ways to influence legislation.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function BillCard({ bill }: { bill: Legislation }) {
  const [showTemplate, setShowTemplate] = useState(false);
  const [templates, setTemplates] = useState<ActionTemplate[]>([]);
  const statusConfig = STATUS_CONFIG[bill.status as keyof typeof STATUS_CONFIG];

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from('action_templates')
      .select('*')
      .eq('bill_id', bill.id);
    if (data) setTemplates(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">{bill.bill_number}</Badge>
              <Badge className={`${statusConfig?.color} text-white`}>
                {statusConfig?.label}
              </Badge>
              {bill.level === 'state' && bill.state && (
                <Badge variant="outline">{bill.state}</Badge>
              )}
            </div>
            <CardTitle className="text-xl mb-2">{bill.title}</CardTitle>
            {bill.description && (
              <CardDescription className="text-sm">{bill.description}</CardDescription>
            )}
          </div>
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

        <div className="grid md:grid-cols-2 gap-3 text-sm pt-2 border-t">
          {bill.introduced_date && (
            <div>
              <span className="text-muted-foreground">Introduced:</span>{' '}
              <span className="font-medium">{format(new Date(bill.introduced_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          {bill.last_action_date && (
            <div>
              <span className="text-muted-foreground">Last Action:</span>{' '}
              <span className="font-medium">{format(new Date(bill.last_action_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

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
              <Button onClick={fetchTemplates} className="gap-2">
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
                    No templates available yet for this bill. You can still contact your representatives directly!
                  </p>
                ) : (
                  templates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          {template.template_type === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                          {template.template_type === 'email' ? 'Email Template' : 'Call Script'}
                          {template.position && (
                            <Badge variant={template.position === 'support' ? 'default' : 'destructive'}>
                              {template.position}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {template.subject_line && (
                          <div>
                            <strong className="text-sm">Subject:</strong>
                            <p className="text-sm mt-1">{template.subject_line}</p>
                          </div>
                        )}
                        <div>
                          <strong className="text-sm">Body:</strong>
                          <pre className="text-sm mt-1 whitespace-pre-wrap font-sans bg-muted p-3 rounded">
                            {template.body_text}
                          </pre>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(template.body_text)}
                          className="w-full gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy to Clipboard
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            Support
          </Button>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Full Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
