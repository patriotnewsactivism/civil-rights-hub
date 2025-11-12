import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Send, Download, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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

const REQUEST_TYPES = {
  "Police Records": ["Police Department", "Sheriff's Office"],
  "Court Records": ["County Clerk", "State Court System"],
  "Government Emails": ["City Council", "State Agency"],
  "Arrest Records": ["Police Department", "County Sheriff"],
  "Body Camera Footage": ["Police Department"],
  "Use of Force Reports": ["Police Department", "Internal Affairs"],
  "Budget Documents": ["City Finance Department", "State Comptroller"],
  "Meeting Minutes": ["City Council", "County Commission"],
  "Other": ["Specify Agency"]
};

interface FOIARequest {
  id: string;
  state: string;
  agency_name: string;
  request_type: string;
  subject: string;
  details: string;
  requester_name: string;
  requester_email: string;
  requester_address: string | null;
  status: string;
  submitted_at: string | null;
  response_due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function FOIABuilder() {
  const { user } = useAuth();
  const { state: userState } = useGeolocation();
  const [activeTab, setActiveTab] = useState("create");

  // Form state
  const [selectedState, setSelectedState] = useState("");
  const [requestType, setRequestType] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterAddress, setRequesterAddress] = useState("");

  // My requests
  const [myRequests, setMyRequests] = useState<FOIARequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userState) {
      setSelectedState(userState);
    }
  }, [userState]);

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('foia_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setMyRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  const generateRequestLetter = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `${today}

${agencyName}
${selectedState}

FREEDOM OF INFORMATION ACT REQUEST

Dear FOIA Officer:

Pursuant to the Freedom of Information Act and ${selectedState} public records law, I hereby request the following records:

SUBJECT: ${subject}

DESCRIPTION: ${details}

I request that these records be provided in electronic format if available. If there are any fees for searching or copying these records, please inform me before processing this request if the cost will exceed $50.

If any portion of this request is denied, please provide a detailed explanation citing specific exemptions under FOIA that justify the withholding of information.

I request a response within the statutory time period.

Sincerely,

${requesterName}
${requesterEmail}
${requesterAddress || ''}`;
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Please sign in to save requests");
      return;
    }

    if (!selectedState || !requestType || !agencyName || !subject || !details || !requesterName || !requesterEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from('foia_requests').insert({
        user_id: user.id,
        state: selectedState,
        agency_name: agencyName,
        request_type: requestType,
        subject,
        details,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_address: requesterAddress || null,
        status: 'draft'
      });

      if (error) throw error;
      
      toast.success("Request saved as draft!");
      await fetchMyRequests();
      setActiveTab("my-requests");
    } catch (error) {
      console.error('Error saving request:', error);
      toast.error("Failed to save request");
    }
  };

  const handleDownload = () => {
    const letter = generateRequestLetter();
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FOIA-Request-${selectedState}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("FOIA request letter downloaded!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          FOIA / Public Records Request Builder
        </h2>
        <p className="text-muted-foreground">
          Create state-specific public records requests with pre-populated legal language
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Request</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request-type">Request Type *</Label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger id="request-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(REQUEST_TYPES).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {requestType && (
                <div className="space-y-2">
                  <Label htmlFor="agency">Agency Name *</Label>
                  <Select value={agencyName} onValueChange={setAgencyName}>
                    <SelectTrigger id="agency">
                      <SelectValue placeholder="Select agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_TYPES[requestType as keyof typeof REQUEST_TYPES].map((agency) => (
                        <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Request Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Body camera footage from incident on Main St"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Detailed Description *</Label>
                <Textarea
                  id="details"
                  placeholder="Provide specific details about the records you're requesting, including dates, locations, case numbers, or other identifying information..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Mailing Address (Optional)</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={requesterAddress}
                  onChange={(e) => setRequesterAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Request Letter
            </Button>
            <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="my-requests">
          {!user ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Sign in to view your saved requests</p>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading your requests...</p>
              </CardContent>
            </Card>
          ) : myRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't created any requests yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.subject}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.agency_name} • {request.state}
                        </p>
                      </div>
                      <Badge variant={request.status === 'draft' ? 'secondary' : 'default'}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {request.details}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
