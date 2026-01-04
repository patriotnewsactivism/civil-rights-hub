import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FOIAAgencySelector } from "./FOIAAgencySelector";
import { FileText, Send, Download, Save, Clock, Sparkles, Info, Calendar } from "lucide-react";
import { toast } from "sonner";
import { addBusinessDays, format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type FOIAAgency = Database["public"]["Tables"]["foia_agencies"]["Row"];
type FOIATemplate = Database["public"]["Tables"]["foia_templates"]["Row"];

const AGENCY_TYPES = ["Federal", "State", "County", "Municipal"] as const;
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

interface FOIARequestFormProps {
  onRequestCreated?: () => void;
}

export function FOIARequestForm({ onRequestCreated }: FOIARequestFormProps) {
  const { user } = useAuth();

  // Agency selection
  const [agencyType, setAgencyType] = useState<typeof AGENCY_TYPES[number]>("Federal");
  const [state, setState] = useState<string>("");
  const [selectedAgency, setSelectedAgency] = useState<FOIAAgency | null>(null);

  // Template selection
  const [templates, setTemplates] = useState<FOIATemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FOIATemplate | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Request details
  const [subject, setSubject] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterAddress, setRequesterAddress] = useState("");
  const [customDetails, setCustomDetails] = useState("");

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [calculatedDeadline, setCalculatedDeadline] = useState<Date | null>(null);

  // Load user info
  useEffect(() => {
    if (user) {
      setRequesterName(user.user_metadata?.full_name || "");
      setRequesterEmail(user.email || "");
    }
  }, [user]);

  // Calculate deadline when agency selected
  useEffect(() => {
    if (selectedAgency?.standard_response_days) {
      const deadline = addBusinessDays(new Date(), selectedAgency.standard_response_days);
      setCalculatedDeadline(deadline);
    } else {
      setCalculatedDeadline(null);
    }
  }, [selectedAgency]);

  // Load templates based on agency
  const fetchTemplates = useCallback(async () => {
    if (!selectedAgency) {
      setTemplates([]);
      return;
    }

    setLoadingTemplates(true);
    try {
      let query = supabase
        .from("foia_templates")
        .select("*")
        .order("use_count", { ascending: false });

      if (selectedAgency.agency_type === "Federal") {
        query = query.or("agency_type.eq.Federal,template_type.eq.General");
      } else if (selectedAgency.state) {
        query = query.or(
          `state.eq.${selectedAgency.state},agency_type.eq.${selectedAgency.agency_type},template_type.eq.General`
        );
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load request templates");
    } finally {
      setLoadingTemplates(false);
    }
  }, [selectedAgency]);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  // Apply template when selected
  const handleTemplateSelect = (template: FOIATemplate) => {
    setSelectedTemplate(template);
    setSubject(template.subject_line);
    setRequestBody(template.template_body);
  };

  // Generate full request letter
  const generateRequestLetter = () => {
    const today = format(new Date(), "MMMM d, yyyy");
    const agencyName = selectedAgency?.name || "[Agency Name]";
    const agencyAddress = selectedAgency?.mailing_address || "[Agency Address]";

    let letter = `${today}\n\n`;
    letter += `${agencyName}\n`;
    letter += `${agencyAddress}\n\n`;

    if (selectedAgency?.foia_contact_name) {
      letter += `Attn: ${selectedAgency.foia_contact_name}\n`;
    }
    if (selectedAgency?.foia_office_name) {
      letter += `${selectedAgency.foia_office_name}\n`;
    }

    letter += `\nFREEDOM OF INFORMATION ACT REQUEST\n\n`;
    letter += `Dear FOIA Officer:\n\n`;

    // Replace template placeholders
    let body = requestBody;
    body = body.replace(/\[YOUR_NAME\]/g, requesterName);
    body = body.replace(/\[YOUR_EMAIL\]/g, requesterEmail);
    body = body.replace(/\[YOUR_ADDRESS\]/g, requesterAddress || "");
    body = body.replace(/\[SUBJECT\]/g, subject);
    body = body.replace(/\[DETAILS\]/g, customDetails);
    body = body.replace(/\[AGENCY_NAME\]/g, agencyName);
    body = body.replace(/\[STATE\]/g, selectedAgency?.state || "");

    letter += body;

    letter += `\n\nSincerely,\n\n`;
    letter += `${requesterName}\n`;
    letter += `${requesterEmail}\n`;
    if (requesterAddress) {
      letter += `${requesterAddress}\n`;
    }

    return letter;
  };

  const handleDownload = () => {
    const letter = generateRequestLetter();
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FOIA-Request-${selectedAgency?.acronym || "Agency"}-${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("FOIA request letter downloaded!");
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Please sign in to save requests");
      return;
    }

    if (!selectedAgency || !subject || !requestBody) {
      toast.error("Please select an agency and fill in request details");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Database["public"]["Tables"]["foia_requests"]["Insert"] = {
        user_id: user.id,
        agency_id: selectedAgency.id,
        agency_name: selectedAgency.name,
        state: selectedAgency.state || "",
        subject,
        details: `${requestBody}\n\n${customDetails}`,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "draft",
        request_type: "Other",
        submitted_at: null,
        response_due_date: null,
        template_id: selectedTemplate?.id || null,
        response_text: null,
        response_deadline: null,
      };

      const { error } = await supabase.from("foia_requests").insert(payload);

      if (error) throw error;

      toast.success("Request saved as draft!");
      onRequestCreated?.();
      resetForm();
    } catch (error) {
      console.error("Error saving request:", error);
      toast.error("Failed to save request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!user) {
      toast.error("Please sign in to submit requests");
      return;
    }

    if (!selectedAgency || !subject || !requestBody || !requesterName || !requesterEmail) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const submittedAt = new Date().toISOString();
      const deadline = calculatedDeadline ? calculatedDeadline.toISOString() : null;

      const payload: Database["public"]["Tables"]["foia_requests"]["Insert"] = {
        user_id: user.id,
        agency_id: selectedAgency.id,
        agency_name: selectedAgency.name,
        state: selectedAgency.state || "",
        subject,
        details: `${requestBody}\n\n${customDetails}`,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "submitted",
        request_type: "Other",
        submitted_at: submittedAt,
        response_due_date: deadline,
        response_deadline: deadline,
        template_id: selectedTemplate?.id || null,
        response_text: null,
      };

      const { data, error } = await supabase.from("foia_requests").insert(payload).select().single();

      if (error) throw error;

      // Create initial update record
      if (data) {
        await supabase.from("foia_request_updates").insert({
          request_id: data.id,
          update_type: "status_change",
          message: "Request submitted to agency",
          old_status: "draft",
          new_status: "submitted",
        });
      }

      toast.success("Request submitted and tracked!");
      onRequestCreated?.();
      resetForm();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAgency(null);
    setSelectedTemplate(null);
    setSubject("");
    setRequestBody("");
    setCustomDetails("");
    setRequesterAddress("");
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
          <p className="text-muted-foreground">Please sign in to create and track FOIA requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Agency
          </CardTitle>
          <CardDescription>
            Choose the federal, state, county, or local agency you want to submit a request to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency-type">Agency Type</Label>
              <Select value={agencyType} onValueChange={(value) => setAgencyType(value as typeof AGENCY_TYPES[number])}>
                <SelectTrigger id="agency-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGENCY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type} Agency
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {agencyType !== "Federal" && (
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <FOIAAgencySelector
            onSelect={setSelectedAgency}
            selectedAgencyId={selectedAgency?.id}
            agencyType={agencyType}
            state={agencyType !== "Federal" ? state : null}
          />

          {calculatedDeadline && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">Estimated Response Deadline:</span>{" "}
                {format(calculatedDeadline, "MMMM d, yyyy")} ({selectedAgency?.standard_response_days} business days)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedAgency && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Request Template (Optional)
              </CardTitle>
              <CardDescription>
                Start with a pre-written template or write your own request from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTemplates ? (
                <p className="text-sm text-muted-foreground">Loading templates...</p>
              ) : templates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No templates available for this agency type</p>
              ) : (
                <Tabs defaultValue="templates">
                  <TabsList>
                    <TabsTrigger value="templates">Available Templates</TabsTrigger>
                  </TabsList>
                  <TabsContent value="templates" className="space-y-2 mt-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`w-full text-left p-4 rounded-lg border ${
                          selectedTemplate?.id === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        } transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{template.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {template.instructions}
                            </p>
                          </div>
                          {template.is_popular && (
                            <Badge variant="secondary" className="ml-2">
                              Popular
                            </Badge>
                          )}
                        </div>
                        {template.use_count && template.use_count > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Used {template.use_count} times
                          </p>
                        )}
                      </button>
                    ))}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>
                Customize your request with specific information about the records you're seeking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Request Title *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Body camera footage from incident on Main St, January 15, 2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-body">Request Letter *</Label>
                <Textarea
                  id="request-body"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={12}
                  placeholder="Enter your request letter or select a template above to get started..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You can use placeholders: [YOUR_NAME], [YOUR_EMAIL], [SUBJECT], [DETAILS], [AGENCY_NAME]
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-details">Additional Details (Optional)</Label>
                <Textarea
                  id="custom-details"
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  rows={4}
                  placeholder="Add any additional details, dates, case numbers, or clarifying information..."
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requester-name">Your Full Name *</Label>
                  <Input
                    id="requester-name"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requester-email">Your Email *</Label>
                  <Input
                    id="requester-email"
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester-address">Mailing Address (Optional)</Label>
                <Input
                  id="requester-address"
                  value={requesterAddress}
                  onChange={(e) => setRequesterAddress(e.target.value)}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Template Instructions:</p>
                  <p className="text-sm whitespace-pre-line">{selectedTemplate.instructions}</p>
                  {selectedTemplate.submission_method && selectedTemplate.submission_method.length > 0 && (
                    <p className="text-sm">
                      <span className="font-semibold">Submission Methods:</span>{" "}
                      {selectedTemplate.submission_method.join(", ")}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSubmitRequest} disabled={submitting} className="flex-1 sm:flex-none">
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit & Track Request"}
            </Button>
            <Button onClick={handleSaveDraft} disabled={submitting} variant="outline" className="flex-1 sm:flex-none">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Download Letter
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
