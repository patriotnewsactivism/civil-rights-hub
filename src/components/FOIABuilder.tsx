import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Copy, Download, Loader2, Mail, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";

interface FOIATemplate {
  id: string;
  title: string;
  state: string | null;
  state_code: string | null;
  template_type: string | null;
  agency_name: string | null;
  agency_type: string | null;
  template_body: string;
  subject_line: string;
  instructions: string;
  submission_method: string[] | null;
  submission_email: string | null;
  submission_address: string | null;
  submission_url: string | null;
  fee_information: string | null;
  statute_citation: string | null;
  response_deadline_days: number | null;
  appeal_process: string | null;
  notes: string | null;
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

export const FOIABuilder = () => {
  const { toast } = useToast();
  const location = useGeolocation();
  const [templates, setTemplates] = useState<FOIATemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<FOIATemplate | null>(null);

  // Form fields
  const [yourName, setYourName] = useState("");
  const [yourAddress, setYourAddress] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [yourPhone, setYourPhone] = useState("");
  const [recordsRequested, setRecordsRequested] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");

  useEffect(() => {
    if (location.state && !selectedState) {
      setSelectedState(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    fetchTemplates();
  }, [selectedState]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("foia_templates")
        .select("*")
        .order("use_count", { ascending: false });

      if (selectedState) {
        query = query.or(`state.eq.${selectedState},template_type.eq.federal`);
      } else {
        query = query.eq("template_type", "federal");
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching FOIA templates:", error);
      toast({
        title: "Failed to load templates",
        description: "Unable to fetch FOIA templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateLetter = () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a template",
        description: "Please choose a FOIA template first.",
        variant: "destructive",
      });
      return;
    }

    if (!yourName || !recordsRequested) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and the records you're requesting.",
        variant: "destructive",
      });
      return;
    }

    let letter = selectedTemplate.template_body;

    // Replace placeholders
    letter = letter.replace(/\{\{YOUR_NAME\}\}/g, yourName);
    letter = letter.replace(/\{\{YOUR_ADDRESS\}\}/g, yourAddress || "[Your Address]");
    letter = letter.replace(/\{\{YOUR_EMAIL\}\}/g, yourEmail || "[Your Email]");
    letter = letter.replace(/\{\{YOUR_PHONE\}\}/g, yourPhone || "[Your Phone]");
    letter = letter.replace(/\{\{SPECIFIC_RECORDS\}\}/g, recordsRequested);
    letter = letter.replace(/\{\{TIMEFRAME\}\}/g, timeframe || "all available records");
    letter = letter.replace(/\{\{DATE\}\}/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    letter = letter.replace(/\{\{AGENCY_NAME\}\}/g, selectedTemplate.agency_name || "[Agency Name]");

    setGeneratedLetter(letter);

    // Increment use count
    supabase
      .from("foia_templates")
      .update({ use_count: (selectedTemplate.use_count || 0) + 1 })
      .eq("id", selectedTemplate.id)
      .then(() => {});
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied to clipboard",
      description: "Your FOIA request has been copied.",
    });
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FOIA-Request-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="foia-builder" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            FOIA Request Builder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build and submit Freedom of Information Act (FOIA) and state open records requests
            to obtain public documents and government information.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* Left Column: Template Selection & Form */}
          <div className="space-y-6">
            {/* State Selection */}
            <Card className="shadow-strong">
              <CardHeader>
                <CardTitle>Select Template</CardTitle>
                <CardDescription>
                  Choose your state for state-specific templates, or use federal FOIA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Federal (All States)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Federal (All States)</SelectItem>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : templates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No templates available for this selection.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <Label>Available Templates</Label>
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setGeneratedLetter("");
                        }}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{template.title}</h4>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {template.template_type}
                                </Badge>
                                {template.agency_type && (
                                  <Badge variant="outline" className="text-xs">
                                    {template.agency_type}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Form */}
            {selectedTemplate && (
              <Card className="shadow-strong">
                <CardHeader>
                  <CardTitle>Fill in Your Information</CardTitle>
                  <CardDescription>
                    Complete the form to generate your customized request
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Full Name *</Label>
                    <Input
                      id="name"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Your Address</Label>
                    <Input
                      id="address"
                      value={yourAddress}
                      onChange={(e) => setYourAddress(e.target.value)}
                      placeholder="123 Main St, City, State ZIP"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={yourEmail}
                      onChange={(e) => setYourEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Your Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={yourPhone}
                      onChange={(e) => setYourPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="records">Records Requested *</Label>
                    <Textarea
                      id="records"
                      value={recordsRequested}
                      onChange={(e) => setRecordsRequested(e.target.value)}
                      placeholder="Describe the specific records you are requesting in detail..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Timeframe (Optional)</Label>
                    <Input
                      id="timeframe"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="e.g., January 1, 2020 - December 31, 2023"
                    />
                  </div>

                  <Button onClick={generateLetter} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Request Letter
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Generated Letter & Instructions */}
          <div className="space-y-6">
            {/* Generated Letter */}
            {generatedLetter && (
              <Card className="shadow-strong">
                <CardHeader>
                  <CardTitle>Your FOIA Request</CardTitle>
                  <CardDescription>
                    Review and copy your customized request letter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {generatedLetter}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadAsText} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Template Instructions */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructions & Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">How to Submit</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedTemplate.instructions}
                    </p>
                  </div>

                  {selectedTemplate.submission_method && selectedTemplate.submission_method.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Submission Methods</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.submission_method.map((method) => (
                          <Badge key={method} variant="secondary">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTemplate.submission_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <a
                        href={`mailto:${selectedTemplate.submission_email}?subject=${encodeURIComponent(
                          selectedTemplate.subject_line
                        )}`}
                        className="text-primary hover:underline"
                      >
                        {selectedTemplate.submission_email}
                      </a>
                    </div>
                  )}

                  {selectedTemplate.submission_url && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={selectedTemplate.submission_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Submit Online
                      </a>
                    </Button>
                  )}

                  {selectedTemplate.submission_address && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Mailing Address</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {selectedTemplate.submission_address}
                      </p>
                    </div>
                  )}

                  {selectedTemplate.response_deadline_days && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">
                        <span className="font-semibold">Response Deadline: </span>
                        {selectedTemplate.response_deadline_days} days from receipt
                      </p>
                    </div>
                  )}

                  {selectedTemplate.fee_information && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Fees</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTemplate.fee_information}
                      </p>
                    </div>
                  )}

                  {selectedTemplate.statute_citation && (
                    <div className="text-xs text-muted-foreground border-t pt-3">
                      <span className="font-semibold">Legal Authority: </span>
                      {selectedTemplate.statute_citation}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* General Info Card */}
            {!selectedTemplate && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    About FOIA Requests
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The Freedom of Information Act (FOIA) and state open records laws give you the right
                    to request access to federal and state government records. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Police reports and body camera footage</li>
                    <li>Government emails and communications</li>
                    <li>Budget and spending records</li>
                    <li>Meeting minutes and agendas</li>
                    <li>Contracts and procurement documents</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Note: Some records may be exempt from disclosure for reasons like national security,
                    privacy, or ongoing investigations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
