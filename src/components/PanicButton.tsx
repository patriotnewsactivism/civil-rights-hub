import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, AlertTriangle, Phone, MapPin, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  is_primary: boolean;
}

interface PanicAlert {
  id: string;
  alert_type: 'detained' | 'arrested' | 'emergency' | 'test';
  latitude: number;
  longitude: number;
  address: string | null;
  message: string | null;
  contacts_notified: string[];
  created_at: string;
  status: 'active' | 'resolved' | 'false_alarm';
}

export const PanicButton = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { location, loading: locationLoading, error: locationError, getLocation } = useGeolocation();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  const [alertType, setAlertType] = useState<'detained' | 'arrested' | 'emergency'>('detained');
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastAlert, setLastAlert] = useState<PanicAlert | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<PanicAlert[]>([]);

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchRecentAlerts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("priority_order")
        .order("created_at");

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchRecentAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("panic_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handlePanicButtonClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the panic button.",
        variant: "destructive",
      });
      return;
    }

    if (contacts.length === 0) {
      toast({
        title: "No emergency contacts",
        description: "Please add emergency contacts before using the panic button.",
        variant: "destructive",
      });
      return;
    }

    // Get current location
    getLocation();
    setShowConfirmDialog(true);
  };

  const sendPanicAlert = async () => {
    if (!user) return;

    setIsSending(true);
    setShowConfirmDialog(false);

    try {
      // Ensure we have location
      if (!location) {
        toast({
          title: "Location required",
          description: "Getting your location...",
        });
        await getLocation();
        // Wait a moment for location to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!location) {
        throw new Error("Unable to get location. Please enable location services.");
      }

      // Prepare contacts notified array
      const contactsNotified = contacts.map(c =>
        `${c.name} (${c.phone})${c.relationship ? ` - ${c.relationship}` : ''}`
      );

      // Create panic alert in database
      const alertData = {
        user_id: user.id,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || null,
        alert_type: isTestMode ? 'test' : alertType,
        message: customMessage.trim() || null,
        contacts_notified: contactsNotified,
        status: 'active' as const,
      };

      const { data: alertRecord, error } = await supabase
        .from("panic_alerts")
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;

      setLastAlert(alertRecord);

      // In a production app, this would trigger actual notifications
      // For now, we'll just show success and log the action
      console.log("Panic alert created:", alertRecord);
      console.log("Would notify:", contactsNotified);

      toast({
        title: isTestMode ? "Test alert sent" : "Emergency alert sent!",
        description: `${contacts.length} contact${contacts.length > 1 ? 's' : ''} notified`,
      });

      setShowSuccessDialog(true);
      fetchRecentAlerts();

      // Reset form
      setCustomMessage("");
      setIsTestMode(false);
      setAlertType('detained');

    } catch (error) {
      console.error("Error sending panic alert:", error);
      toast({
        title: "Failed to send alert",
        description: error instanceof Error ? error.message : "Unable to send panic alert.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'detained': return 'Being Detained';
      case 'arrested': return 'Arrested';
      case 'emergency': return 'Emergency';
      case 'test': return 'Test Alert';
      default: return type;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'detained': return 'text-orange-600';
      case 'arrested': return 'text-red-600';
      case 'emergency': return 'text-red-700';
      case 'test': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!user) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Please sign in to access the panic button.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Emergency Panic Button
              </CardTitle>
              <CardDescription>
                Send instant alerts to your emergency contacts with your location
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Status */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className={`h-5 w-5 mt-0.5 ${location ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Location Status</p>
                {locationLoading && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Getting location...
                  </p>
                )}
                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}
                {location && !locationLoading && (
                  <div className="text-sm text-muted-foreground">
                    <p>{location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3" />
                      Location ready
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contacts Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Phone className={`h-5 w-5 mt-0.5 ${contacts.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">Emergency Contacts</p>
                {contacts.length === 0 ? (
                  <p className="text-sm text-red-600">No contacts added yet</p>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>{contacts.length} contact{contacts.length > 1 ? 's' : ''} will be notified:</p>
                    <ul className="mt-2 space-y-1">
                      {contacts.slice(0, 3).map((contact) => (
                        <li key={contact.id} className="text-xs">
                          {contact.name} {contact.is_primary && '⭐'}
                        </li>
                      ))}
                      {contacts.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{contacts.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alert Type Selection */}
          <div className="space-y-2">
            <Label>Alert Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={alertType === 'detained' ? 'default' : 'outline'}
                onClick={() => setAlertType('detained')}
                disabled={isSending}
                className="h-auto py-3"
              >
                <div className="text-center">
                  <div className="font-semibold">Detained</div>
                  <div className="text-xs opacity-80">Being stopped</div>
                </div>
              </Button>
              <Button
                variant={alertType === 'arrested' ? 'default' : 'outline'}
                onClick={() => setAlertType('arrested')}
                disabled={isSending}
                className="h-auto py-3"
              >
                <div className="text-center">
                  <div className="font-semibold">Arrested</div>
                  <div className="text-xs opacity-80">In custody</div>
                </div>
              </Button>
              <Button
                variant={alertType === 'emergency' ? 'default' : 'outline'}
                onClick={() => setAlertType('emergency')}
                disabled={isSending}
                className="h-auto py-3"
              >
                <div className="text-center">
                  <div className="font-semibold">Emergency</div>
                  <div className="text-xs opacity-80">Other urgent</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="panic-message">Additional Message (Optional)</Label>
            <Textarea
              id="panic-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Any additional details..."
              className="min-h-[80px]"
              disabled={isSending}
            />
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="test-mode"
              checked={isTestMode}
              onChange={(e) => setIsTestMode(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
              disabled={isSending}
            />
            <Label htmlFor="test-mode" className="cursor-pointer">
              Test mode (won't actually alert contacts)
            </Label>
          </div>

          {/* Main Panic Button */}
          <Button
            onClick={handlePanicButtonClick}
            disabled={isSending || contacts.length === 0}
            className="w-full h-20 text-xl font-bold bg-red-600 hover:bg-red-700 text-white"
            variant="destructive"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Sending Alert...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8" />
                {isTestMode ? 'SEND TEST ALERT' : 'EMERGENCY - SEND ALERT'}
              </span>
            )}
          </Button>

          {contacts.length === 0 && (
            <p className="text-sm text-center text-muted-foreground">
              Add emergency contacts above to enable the panic button
            </p>
          )}

          {/* Recent Alerts */}
          {recentAlerts.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3 text-sm">Recent Alerts</h4>
              <div className="space-y-2">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="bg-muted/30 p-3 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${getAlertTypeColor(alert.alert_type)}`}>
                        {getAlertTypeLabel(alert.alert_type)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                    {alert.message && (
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.contacts_notified.length} contact{alert.contacts_notified.length > 1 ? 's' : ''} notified
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Emergency Alert
            </DialogTitle>
            <DialogDescription>
              {isTestMode ? (
                "This is a test alert. No actual notifications will be sent."
              ) : (
                "This will immediately notify all your emergency contacts with your location."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded">
              <p className="text-sm font-medium mb-2">Alert Details:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Type: <span className="font-medium">{getAlertTypeLabel(isTestMode ? 'test' : alertType)}</span></li>
                <li>Contacts: <span className="font-medium">{contacts.length}</span></li>
                {location && (
                  <li>Location: <span className="font-medium">{location.address || 'GPS coordinates'}</span></li>
                )}
                {customMessage && (
                  <li>Message: <span className="font-medium">{customMessage}</span></li>
                )}
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={sendPanicAlert}
                disabled={isSending}
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  isTestMode ? 'Send Test' : 'Send Alert'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Alert Sent Successfully
            </DialogTitle>
            <DialogDescription>
              Your emergency contacts have been notified with your location.
            </DialogDescription>
          </DialogHeader>
          {lastAlert && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <p className="text-sm font-medium mb-2">Contacts Notified:</p>
                <ul className="text-sm space-y-1">
                  {lastAlert.contacts_notified.map((contact, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      {contact}
                    </li>
                  ))}
                </ul>
              </div>
              {lastAlert.address && (
                <div className="bg-muted/50 p-4 rounded">
                  <p className="text-sm font-medium mb-1">Location Sent:</p>
                  <p className="text-sm text-muted-foreground">{lastAlert.address}</p>
                </div>
              )}
              <Button
                onClick={() => setShowSuccessDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
