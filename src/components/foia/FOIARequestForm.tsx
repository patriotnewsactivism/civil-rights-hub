import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Download, FileText, Info, Save, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AGENCY_TYPES = ["Federal", "State", "County", "Municipal", "Other"] as const;
type AgencyType = (typeof AGENCY_TYPES)[number];

interface FOIARequestFormProps {
  onRequestCreated?: () => void;
}

const STARTER_TEXT = `I request access to the following public records:\n\n[Describe the records with enough detail to help the agency locate them.]\n\nPlease let me know what submission process, fees, or identification requirements apply before processing. If any records or portions are withheld, please identify the authority relied upon when an explanation is required or available under the applicable public-records law.\n\nPlease contact me if clarification would help identify the records I am seeking.`;

export function FOIARequestForm({ onRequestCreated }: FOIARequestFormProps) {
  const { user } = useAuth();
  const [agencyType, setAgencyType] = useState<AgencyType>("Federal");
  const [agencyName, setAgencyName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("Federal");
  const [subject, setSubject] = useState("");
  const [requestBody, setRequestBody] = useState(STARTER_TEXT);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterAddress, setRequesterAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setRequesterName(user.user_metadata?.full_name || "");
    setRequesterEmail(user.email || "");
  }, [user]);

  useEffect(() => {
    if (agencyType === "Federal") setJurisdiction("Federal");
    else if (jurisdiction === "Federal") setJurisdiction("");
  }, [agencyType, jurisdiction]);

  const generateRequestLetter = useCallback(() => {
    const today = format(new Date(), "MMMM d, yyyy");
    const lines = [
      today,
      "",
      agencyName || "[Agency name]",
      jurisdiction ? `${jurisdiction} jurisdiction` : "[Jurisdiction]",
      "",
      "PUBLIC RECORDS REQUEST",
      "",
      `Subject: ${subject || "[Request subject]"}`,
      "",
      requestBody,
      "",
      "Sincerely,",
      requesterName || "[Requester name]",
      requesterEmail || "[Requester email]",
    ];
    if (requesterAddress) lines.push(requesterAddress);
    return lines.join("\n");
  }, [agencyName, jurisdiction, requestBody, requesterAddress, requesterEmail, requesterName, subject]);

  const handleDownload = () => {
    const blob = new Blob([generateRequestLetter()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `public-records-request-${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success("Draft downloaded");
  };

  const validate = () => {
    if (!agencyName.trim() || !subject.trim() || !requestBody.trim()) {
      toast.error("Agency, subject, and request description are required");
      return false;
    }
    if (!jurisdiction.trim()) {
      toast.error("Enter the agency jurisdiction");
      return false;
    }
    return true;
  };

  const saveRequest = async (markSubmitted: boolean) => {
    if (!user) {
      toast.error("Please sign in to save requests");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: agencyName.trim(),
        agency_type: agencyType,
        state: jurisdiction.trim(),
        request_subject: subject.trim(),
        request_body: requestBody.trim(),
        contact_name: requesterName.trim() || null,
        contact_email: requesterEmail.trim() || null,
        notes: requesterAddress.trim() ? `Requester mailing address: ${requesterAddress.trim()}` : null,
        status: markSubmitted ? "submitted" : "draft",
        submitted_date: markSubmitted ? now : null,
        response_deadline: null,
        submission_method: markSubmitted ? "other" : "draft",
      } as any);

      if (error) throw error;
      toast.success(markSubmitted ? "Saved as submitted" : "Draft saved");
      onRequestCreated?.();
      setAgencyName("");
      setSubject("");
      setRequestBody(STARTER_TEXT);
      setRequesterAddress("");
    } catch (error) {
      console.error("Unable to save public-records request", error);
      toast.error("Unable to save request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
          <p className="text-muted-foreground">Sign in to draft and track your own public-records requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Civil Rights Hub does not currently auto-select agency contacts or calculate statutory deadlines. Public-records laws and submission rules vary by jurisdiction. Verify the correct recipient, governing law, and any deadline directly from an official source before relying on them.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Agency and jurisdiction</CardTitle>
          <CardDescription>Enter the recipient from an official agency source. No unverified directory data is auto-filled.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="agency-type">Agency type</Label>
            <Select value={agencyType} onValueChange={(value) => setAgencyType(value as AgencyType)}>
              <SelectTrigger id="agency-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AGENCY_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Input id="jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="e.g., Texas, City of Houston, Federal" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="agency-name">Agency name</Label>
            <Input id="agency-name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Enter the official agency name" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request</CardTitle>
          <CardDescription>Use the neutral starter language or replace it with your own wording after checking the applicable law.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="request-subject">Subject</Label>
            <Input id="request-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Describe the records sought" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-body">Request text</Label>
            <Textarea id="request-body" value={requestBody} onChange={(e) => setRequestBody(e.target.value)} rows={12} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Requester information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="requester-name">Name</Label><Input id="requester-name" value={requesterName} onChange={(e) => setRequesterName(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="requester-email">Email</Label><Input id="requester-email" type="email" value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)} /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="requester-address">Mailing address (optional)</Label><Input id="requester-address" value={requesterAddress} onChange={(e) => setRequesterAddress(e.target.value)} /></div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download draft</Button>
        <Button type="button" variant="secondary" disabled={submitting} onClick={() => void saveRequest(false)}><Save className="mr-2 h-4 w-4" />Save draft</Button>
        <Button type="button" disabled={submitting} onClick={() => void saveRequest(true)}><Send className="mr-2 h-4 w-4" />Mark as submitted</Button>
      </div>

      <p className="text-xs text-muted-foreground">
        “Mark as submitted” records your status and current date only. It does not transmit the request to the agency and does not create a legal deadline.
      </p>
    </div>
  );
}
