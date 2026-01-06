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
import { FileText, Send, Download, Save, Calendar, Info } from "lucide-react";
import { toast } from "sonner";
import { addBusinessDays, format } from "date-fns";

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

// State-specific response deadlines (in business days)
const STATE_RESPONSE_DAYS: Record<string, number> = {
  "Alabama": 10,
  "Alaska": 10,
  "Arizona": 5,
  "Arkansas": 3,
  "California": 10,
  "Colorado": 3,
  "Connecticut": 4,
  "Delaware": 15,
  "Florida": 0, // "Prompt" response required
  "Georgia": 3,
  "Hawaii": 10,
  "Idaho": 3,
  "Illinois": 5,
  "Indiana": 7,
  "Iowa": 10,
  "Kansas": 3,
  "Kentucky": 3,
  "Louisiana": 3,
  "Maine": 5,
  "Maryland": 30,
  "Massachusetts": 10,
  "Michigan": 5,
  "Minnesota": 10,
  "Mississippi": 7,
  "Missouri": 3,
  "Montana": 5,
  "Nebraska": 4,
  "Nevada": 5,
  "New Hampshire": 5,
  "New Jersey": 7,
  "New Mexico": 15,
  "New York": 5,
  "North Carolina": 10,
  "North Dakota": 10,
  "Ohio": 10,
  "Oklahoma": 10,
  "Oregon": 5,
  "Pennsylvania": 5,
  "Rhode Island": 10,
  "South Carolina": 15,
  "South Dakota": 10,
  "Tennessee": 7,
  "Texas": 10,
  "Utah": 10,
  "Vermont": 3,
  "Virginia": 5,
  "Washington": 5,
  "West Virginia": 5,
  "Wisconsin": 10,
  "Wyoming": 10,
  "Federal": 20, // Federal FOIA standard
};

interface FOIARequestFormProps {
  onRequestCreated?: () => void;
}

// Common FOIA request templates
const REQUEST_TEMPLATES = [
  {
    id: "police-records",
    title: "Police Records Request",
    subject: "Request for Police Incident Records",
    body: `Pursuant to the Freedom of Information Act (or applicable state public records law), I am requesting access to and copies of the following records:

All records related to [DESCRIBE INCIDENT - include date, location, case number if known], including but not limited to:

1. Incident reports and police reports
2. Body-worn camera footage
3. Dash camera footage
4. 911 call recordings and dispatch logs
5. Witness statements
6. Officer notes and memoranda
7. Any photographs or video evidence
8. Use of force reports (if applicable)
9. Arrest records (if applicable)

I am requesting a waiver of all fees associated with this request. [If applicable: As a member of the news media / researcher / representative of a non-profit organization, I am entitled to reduced fees under the applicable statute.]

If my request is denied in whole or in part, please cite the specific exemption(s) and provide any reasonably segregable non-exempt portions.

Please respond within the time frame required by law.`,
    type: "Police Records"
  },
  {
    id: "body-camera",
    title: "Body Camera Footage Request",
    subject: "Request for Body-Worn Camera Footage",
    body: `Pursuant to the Freedom of Information Act (or applicable state public records law), I am requesting access to and copies of:

All body-worn camera footage from officers involved in [DESCRIBE INCIDENT - include date, time, location, officer names/badge numbers if known].

Specifically, I request:
1. Complete, unedited footage from all officers present
2. Any audio recordings associated with the footage
3. Metadata showing date, time, and duration of recordings
4. Chain of custody documentation

I understand that certain portions may require redaction for privacy purposes, but request that any redactions be limited to only what is legally required.

I am requesting a fee waiver as this information is in the public interest and will contribute to public understanding of government operations.

Please provide a response within the statutory time frame.`,
    type: "Body Camera"
  },
  {
    id: "use-of-force",
    title: "Use of Force Records",
    subject: "Request for Use of Force Documentation",
    body: `Pursuant to the Freedom of Information Act (or applicable state public records law), I am requesting access to and copies of:

All use of force records and documentation for [SPECIFY: specific incident / officer / time period / department-wide statistics].

This request includes:
1. Use of force reports and incident documentation
2. Internal affairs investigation files
3. Citizen complaint records
4. Disciplinary actions taken
5. Training records related to use of force
6. Department policies on use of force
7. Statistical data on use of force incidents

I am requesting a fee waiver as this request serves the public interest in government accountability and transparency.

Please respond within the required statutory time frame.`,
    type: "Use of Force"
  },
  {
    id: "general-records",
    title: "General Records Request",
    subject: "Public Records Request",
    body: `Pursuant to the Freedom of Information Act (or applicable state public records law), I am requesting access to and copies of:

[DESCRIBE THE RECORDS YOU ARE SEEKING - be as specific as possible about dates, subjects, departments, and types of documents]

If you determine that some portions of the requested records are exempt from disclosure, please provide all reasonably segregable non-exempt portions.

I am requesting a waiver of fees associated with this request. [EXPLAIN WHY - public interest, news media, educational purpose, etc.]

Please notify me if the fees will exceed $[AMOUNT] before processing this request.

Please respond within the time frame required by law. If you have any questions, please contact me at the information provided below.`,
    type: "General"
  }
];

export function FOIARequestForm({ onRequestCreated }: FOIARequestFormProps) {
  const { user } = useAuth();

  // Form state
  const [agencyType, setAgencyType] = useState<typeof AGENCY_TYPES[number]>("Federal");
  const [state, setState] = useState<string>("");
  const [agencyName, setAgencyName] = useState("");
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

  // Load user info
  useEffect(() => {
    if (user) {
      setRequesterName(user.user_metadata?.full_name || "");
      setRequesterEmail(user.email || "");
    }
  }, [user]);

  // Calculate deadline based on state
  useEffect(() => {
    const responseDays = agencyType === "Federal" 
      ? STATE_RESPONSE_DAYS["Federal"]
      : state ? STATE_RESPONSE_DAYS[state] : null;
    
    if (responseDays && responseDays > 0) {
      const deadline = addBusinessDays(new Date(), responseDays);
      setCalculatedDeadline(deadline);
    } else if (responseDays === 0) {
      // Florida and similar "prompt response" states
      setCalculatedDeadline(null);
    } else {
      setCalculatedDeadline(null);
    }
  }, [agencyType, state]);

  // Apply template
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = REQUEST_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setRequestBody(template.body);
    }
  };

  // Generate full request letter
  const generateRequestLetter = useCallback(() => {
    const today = format(new Date(), "MMMM d, yyyy");
    
    let letter = `${today}\n\n`;
    letter += `${agencyName || "[Agency Name]"}\n`;
    letter += `[Agency Address]\n\n`;
    letter += `FREEDOM OF INFORMATION ACT REQUEST\n\n`;
    letter += `Dear FOIA Officer:\n\n`;

    // Replace placeholders in body
    let body = requestBody;
    body = body.replace(/\[YOUR_NAME\]/g, requesterName);
    body = body.replace(/\[YOUR_EMAIL\]/g, requesterEmail);
    body = body.replace(/\[YOUR_ADDRESS\]/g, requesterAddress || "");
    body = body.replace(/\[SUBJECT\]/g, subject);

    letter += body;
    letter += `\n\nSincerely,\n\n`;
    letter += `${requesterName}\n`;
    letter += `${requesterEmail}\n`;
    if (requesterAddress) {
      letter += `${requesterAddress}\n`;
    }

    return letter;
  }, [agencyName, requestBody, requesterName, requesterEmail, requesterAddress, subject]);

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

    if (!agencyName || !subject || !requestBody) {
      toast.error("Please fill in agency name and request details");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: agencyName,
        state: agencyType === "Federal" ? "Federal" : state,
        subject,
        details: requestBody,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "draft",
        request_type: REQUEST_TEMPLATES.find(t => t.id === selectedTemplateId)?.type || "General",
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

    if (!agencyName || !subject || !requestBody || !requesterName || !requesterEmail) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const submittedAt = new Date().toISOString();
      const deadline = calculatedDeadline ? calculatedDeadline.toISOString() : null;

      const { error } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: agencyName,
        state: agencyType === "Federal" ? "Federal" : state,
        subject,
        details: requestBody,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: "submitted",
        request_type: REQUEST_TEMPLATES.find(t => t.id === selectedTemplateId)?.type || "General",
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
    setAgencyName("");
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

  const responseDays = agencyType === "Federal" 
    ? STATE_RESPONSE_DAYS["Federal"]
    : state ? STATE_RESPONSE_DAYS[state] : null;

  return (
    <div className="space-y-6">
      {/* Agency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Agency
          </CardTitle>
          <CardDescription>
            Choose the agency type and enter the agency name
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

          <div className="space-y-2">
            <Label htmlFor="agency-name">Agency Name *</Label>
            <Input
              id="agency-name"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g., Los Angeles Police Department, FBI, City of Austin"
            />
          </div>

          {responseDays !== null && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                {responseDays === 0 ? (
                  <span><strong>Response Requirement:</strong> Prompt response required (no specific deadline)</span>
                ) : calculatedDeadline ? (
                  <span>
                    <strong>Estimated Response Deadline:</strong>{" "}
                    {format(calculatedDeadline, "MMMM d, yyyy")} ({responseDays} business days)
                  </span>
                ) : null}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Request Template (Optional)
          </CardTitle>
          <CardDescription>
            Start with a pre-written template or write your own request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {REQUEST_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedTemplateId === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{template.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.subject}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {template.type}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
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
          disabled={submitting || !agencyName || !subject}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        
        <Button
          onClick={handleSubmitRequest}
          disabled={submitting || !agencyName || !subject || !requestBody || !requesterName || !requesterEmail}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit & Track
        </Button>
      </div>
    </div>
  );
}
