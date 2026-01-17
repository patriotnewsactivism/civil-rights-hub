import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Send, Download, Save, Calendar, Info, Building, Search } from "lucide-react";
import { toast } from "sonner";
import { addBusinessDays, format } from "date-fns";

const AGENCY_TYPES = ["Federal", "State", "County", "Municipal"] as const;

interface FOIAAgency {
  id: string;
  name: string;
  agency_type: string;
  state: string | null;
  city: string | null;
  foia_email: string | null;
  foia_phone: string | null;
  foia_url: string | null;
  foia_address: string | null;
  response_days: number | null;
}

interface FOIATemplate {
  id: string;
  title: string;
  category: string;
  subject_template: string;
  body_template: string;
  description: string | null;
  applicable_agency_types: string[] | null;
  is_featured: boolean | null;
}

interface FOIARequestFormProps {
  onRequestCreated?: () => void;
}

export function FOIARequestForm({ onRequestCreated }: FOIARequestFormProps) {
  const { user } = useAuth();

  // Database data
  const [agencies, setAgencies] = useState<FOIAAgency[]>([]);
  const [templates, setTemplates] = useState<FOIATemplate[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Form state
  const [agencyType, setAgencyType] = useState<typeof AGENCY_TYPES[number]>("Federal");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [customAgencyName, setCustomAgencyName] = useState("");
  const [agencySearch, setAgencySearch] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  
  // Request details
  const [subject, setSubject] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterAddress, setRequesterAddress] = useState("");
  
  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [calculatedDeadline, setCalculatedDeadline] = useState<Date | null>(null);

  // Fetch agencies from database
  useEffect(() => {
    const fetchAgencies = async () => {
      setLoadingAgencies(true);
      const { data, error } = await supabase
        .from("foia_agencies")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) {
        console.error("Error fetching agencies:", error);
        toast.error("Failed to load agencies");
      } else {
        setAgencies(data ?? []);
      }
      setLoadingAgencies(false);
    };

    fetchAgencies();
  }, []);

  // Fetch templates from database
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      const { data, error } = await supabase
        .from("foia_templates")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("usage_count", { ascending: false });
      
      if (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates");
      } else {
        setTemplates(data ?? []);
      }
      setLoadingTemplates(false);
    };

    fetchTemplates();
  }, []);

  // Load user info
  useEffect(() => {
    if (user) {
      setRequesterName(user.user_metadata?.full_name || "");
      setRequesterEmail(user.email || "");
    }
  }, [user]);

  // Filter agencies based on type and search
  const filteredAgencies = agencies.filter(agency => {
    const matchesType = agency.agency_type === agencyType;
    const matchesSearch = !agencySearch || 
      agency.name.toLowerCase().includes(agencySearch.toLowerCase()) ||
      (agency.state?.toLowerCase().includes(agencySearch.toLowerCase())) ||
      (agency.city?.toLowerCase().includes(agencySearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Filter templates based on agency type
  const filteredTemplates = templates.filter(template => {
    if (!template.applicable_agency_types) return true;
    return template.applicable_agency_types.includes(agencyType);
  });

  // Get selected agency details
  const selectedAgency = agencies.find(a => a.id === selectedAgencyId);

  // Calculate deadline based on selected agency
  useEffect(() => {
    const responseDays = selectedAgency?.response_days ?? (agencyType === "Federal" ? 20 : null);
    
    if (responseDays && responseDays > 0) {
      const deadline = addBusinessDays(new Date(), responseDays);
      setCalculatedDeadline(deadline);
    } else {
      setCalculatedDeadline(null);
    }
  }, [selectedAgency, agencyType]);

  // Apply template
  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject_template);
      setRequestBody(template.body_template);
      
      // Increment usage count
      await supabase
        .from("foia_templates")
        .update({ usage_count: (template as any).usage_count + 1 })
        .eq("id", templateId);
    }
  };

  // Get agency name for form
  const getAgencyName = () => {
    if (selectedAgency) return selectedAgency.name;
    return customAgencyName;
  };

  // Generate full request letter
  const generateRequestLetter = useCallback(() => {
    const today = format(new Date(), "MMMM d, yyyy");
    const agencyName = getAgencyName();
    
    let letter = `${today}\n\n`;
    letter += `${agencyName || "[Agency Name]"}\n`;
    if (selectedAgency?.foia_address) {
      letter += `${selectedAgency.foia_address}\n`;
    } else {
      letter += `[Agency Address]\n`;
    }
    letter += `\nFREEDOM OF INFORMATION ACT REQUEST\n\n`;
    letter += `Dear FOIA Officer:\n\n`;

    let body = requestBody;
    body = body.replace(/\[YOUR_NAME\]/g, requesterName);
    body = body.replace(/\[YOUR_EMAIL\]/g, requesterEmail);
    body = body.replace(/\[YOUR_ADDRESS\]/g, requesterAddress || "");
    body = body.replace(/\[SUBJECT\]/g, subject);
    body = body.replace(/\[AGENCY_NAME\]/g, agencyName);

    letter += body;
    letter += `\n\nSincerely,\n\n`;
    letter += `${requesterName}\n`;
    letter += `${requesterEmail}\n`;
    if (requesterAddress) {
      letter += `${requesterAddress}\n`;
    }

    return letter;
  }, [selectedAgency, customAgencyName, requestBody, requesterName, requesterEmail, requesterAddress, subject]);

  const handleDownload = () => {
    const letter = generateRequestLetter();
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FOIA-Request-${format(new Date(), "yyyy-MM-dd")}.txt`;
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

    const agencyName = getAgencyName();
    if (!agencyName || !subject || !requestBody) {
      toast.error("Please fill in agency name and request details");
      return;
    }

    setSubmitting(true);
    try {
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
      
      const { error } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: agencyName,
        state: selectedAgency?.state ?? (agencyType === "Federal" ? "Federal" : ""),
        subject,
        details: requestBody,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "draft",
        request_type: selectedTemplate?.category || "General",
        submitted_at: null,
        response_due_date: null,
      });

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

    const agencyName = getAgencyName();
    if (!agencyName || !subject || !requestBody || !requesterName || !requesterEmail) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const submittedAt = new Date().toISOString();
      const deadline = calculatedDeadline ? calculatedDeadline.toISOString() : null;
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

      const { error } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: agencyName,
        state: selectedAgency?.state ?? (agencyType === "Federal" ? "Federal" : ""),
        subject,
        details: requestBody,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "submitted",
        request_type: selectedTemplate?.category || "General",
        submitted_at: submittedAt,
        response_due_date: deadline,
      });

      if (error) throw error;

      toast.success("Request submitted and tracking started!");
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
    setSelectedAgencyId("");
    setCustomAgencyName("");
    setAgencySearch("");
    setSelectedTemplateId("");
    setSubject("");
    setRequestBody("");
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

  const responseDays = selectedAgency?.response_days ?? (agencyType === "Federal" ? 20 : null);

  return (
    <div className="space-y-6">
      {/* Agency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Select Agency
          </CardTitle>
          <CardDescription>
            Choose from our database of {agencies.length} agencies or enter a custom agency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency-type">Agency Type</Label>
              <Select value={agencyType} onValueChange={(value) => {
                setAgencyType(value as typeof AGENCY_TYPES[number]);
                setSelectedAgencyId("");
                setAgencySearch("");
              }}>
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

            <div className="space-y-2">
              <Label htmlFor="agency-search">Search Agencies</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="agency-search"
                  value={agencySearch}
                  onChange={(e) => setAgencySearch(e.target.value)}
                  placeholder="Search by name, state, or city..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {loadingAgencies ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredAgencies.length > 0 ? (
            <div className="space-y-2">
              <Label>Select from Database</Label>
              <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agency..." />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {filteredAgencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      <div className="flex flex-col items-start">
                        <span>{agency.name}</span>
                        {agency.state && (
                          <span className="text-xs text-muted-foreground">
                            {agency.city ? `${agency.city}, ` : ""}{agency.state}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No agencies found for this type. Enter a custom agency name below.
              </AlertDescription>
            </Alert>
          )}

          {!selectedAgencyId && (
            <div className="space-y-2">
              <Label htmlFor="custom-agency">Or Enter Custom Agency Name</Label>
              <Input
                id="custom-agency"
                value={customAgencyName}
                onChange={(e) => setCustomAgencyName(e.target.value)}
                placeholder="e.g., Los Angeles Police Department"
              />
            </div>
          )}

          {selectedAgency && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium">{selectedAgency.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {selectedAgency.foia_email && (
                  <p><span className="font-medium">Email:</span> {selectedAgency.foia_email}</p>
                )}
                {selectedAgency.foia_phone && (
                  <p><span className="font-medium">Phone:</span> {selectedAgency.foia_phone}</p>
                )}
                {selectedAgency.foia_url && (
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    <a href={selectedAgency.foia_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      FOIA Portal
                    </a>
                  </p>
                )}
                {selectedAgency.response_days && (
                  <p><span className="font-medium">Response Time:</span> {selectedAgency.response_days} business days</p>
                )}
              </div>
            </div>
          )}

          {responseDays !== null && calculatedDeadline && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Estimated Response Deadline:</strong>{" "}
                {format(calculatedDeadline, "MMMM d, yyyy")} ({responseDays} business days)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Request Template
          </CardTitle>
          <CardDescription>
            Choose from {filteredTemplates.length} professional templates or write your own
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingTemplates ? (
            <div className="grid gap-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="grid gap-2 max-h-80 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTemplateId === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{template.title}</h4>
                        {template.is_featured && (
                          <Badge variant="default" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {template.description || template.subject_template}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {template.category}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Customize your request with specific information
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
              placeholder="Enter your request letter or select a template above..."
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requester-name">Your Name *</Label>
              <Input
                id="requester-name"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Full legal name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requester-email">Your Email *</Label>
              <Input
                id="requester-email"
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requester-address">Mailing Address (Optional)</Label>
            <Textarea
              id="requester-address"
              value={requesterAddress}
              onChange={(e) => setRequesterAddress(e.target.value)}
              rows={2}
              placeholder="Your mailing address for receiving physical documents"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!subject || !requestBody}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Letter
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleSaveDraft}
          disabled={submitting || (!getAgencyName() || !subject)}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        
        <Button
          onClick={handleSubmitRequest}
          disabled={submitting || !getAgencyName() || !subject || !requestBody || !requesterName || !requesterEmail}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit & Track
        </Button>
      </div>
    </div>
  );
}
