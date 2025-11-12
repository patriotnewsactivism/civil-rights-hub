import { useMemo, useState } from "react";
import { PhoneCall, MessageCircle, MoreVertical, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useEmergencyContacts, type EmergencyContact, type EmergencyContactInput } from "@/hooks/useEmergencyContacts";

const blankForm: EmergencyContactInput = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  notes: "",
  is_primary: false,
};

const sanitizePhone = (value: string) => value.replace(/[^0-9+]/g, "");

const ContactSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <Card key={item} className="border-dashed">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const EmergencyContacts = () => {
  const { user } = useAuth();
  const { contacts, loading, error, addContact, updateContact, deleteContact, reorderContact, setPrimaryContact } =
    useEmergencyContacts(user?.id ?? null);
  const [formState, setFormState] = useState<EmergencyContactInput>(blankForm);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const quickDialTargets = useMemo(() => contacts.slice(0, 3), [contacts]);

  const openCreateDialog = () => {
    setEditingContact(null);
    setFormState(blankForm);
    setDialogOpen(true);
  };

  const openEditDialog = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormState({
      name: contact.name,
      relationship: contact.relationship ?? "",
      phone: contact.phone,
      email: contact.email ?? "",
      notes: contact.notes ?? "",
      is_primary: Boolean(contact.is_primary),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
    setFormState(blankForm);
  };

  const handleSubmit = async () => {
    if (!formState.name.trim() || !formState.phone.trim()) {
      return;
    }

    const payload = {
      ...formState,
      phone: sanitizePhone(formState.phone),
      email: formState.email?.trim() || null,
      relationship: formState.relationship?.trim() || null,
      notes: formState.notes?.trim() || null,
    };

    if (editingContact) {
      await updateContact(editingContact.id, payload);
      if (payload.is_primary && !editingContact.is_primary) {
        await setPrimaryContact(editingContact.id);
      }
    } else {
      const inserted = await addContact(payload);
      if (payload.is_primary && inserted) {
        await setPrimaryContact(inserted.id);
      }
    }

    closeDialog();
  };

  const handlePrimaryToggle = async (contact: EmergencyContact) => {
    if (contact.is_primary) return;
    await setPrimaryContact(contact.id);
  };

  const handleDelete = async (contact: EmergencyContact) => {
    await deleteContact(contact.id);
  };

  const renderQuickDial = () => (
    <div className="flex flex-wrap gap-2">
      {quickDialTargets.map((contact) => (
        <Button key={contact.id} variant="secondary" size="sm" asChild>
          <a href={`tel:${sanitizePhone(contact.phone)}`} className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            {contact.name.split(" ")[0]}
          </a>
        </Button>
      ))}
      {quickDialTargets.length === 0 && <p className="text-sm text-muted-foreground">Add a contact to enable one-tap dialing.</p>}
    </div>
  );

  return (
    <Card className="sticky top-20 space-y-4 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Emergency Contacts</CardTitle>
            <CardDescription>Share your live status with trusted allies in one tap.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} size="sm">
                Add contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingContact ? "Edit emergency contact" : "Add emergency contact"}</DialogTitle>
                <DialogDescription>
                  These contacts receive alerts and location updates when you activate the panic button.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">Full name</Label>
                  <Input
                    id="contact-name"
                    placeholder="Auntie Maya"
                    value={formState.name}
                    onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-relationship">Relationship</Label>
                  <Input
                    id="contact-relationship"
                    placeholder="Legal observer, partner, attorney"
                    value={formState.relationship ?? ""}
                    onChange={(event) => setFormState((state) => ({ ...state, relationship: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-phone">Phone number</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="(555) 867-5309"
                    value={formState.phone}
                    onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Email (optional)</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="ally@example.org"
                    value={formState.email ?? ""}
                    onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-notes">Notes</Label>
                  <Textarea
                    id="contact-notes"
                    placeholder="Add case numbers, safe words, or response instructions."
                    value={formState.notes ?? ""}
                    onChange={(event) => setFormState((state) => ({ ...state, notes: event.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <Label htmlFor="contact-primary" className="font-medium">
                      Primary contact
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      This person receives alerts first and appears at the top of your list.
                    </p>
                  </div>
                  <Switch
                    id="contact-primary"
                    checked={Boolean(formState.is_primary)}
                    onCheckedChange={(checked) => setFormState((state) => ({ ...state, is_primary: checked }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!formState.name.trim() || !formState.phone.trim()}>
                  {editingContact ? "Save changes" : "Add contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to load contacts</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Quick dial</h4>
          {loading ? <Skeleton className="h-10 w-full" /> : renderQuickDial()}
        </div>

        <Separator />

        <div className="space-y-3">
          {loading && <ContactSkeleton />}
          {!loading && contacts.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Save your legal observer, family member, or attorney here to reach them instantly.
            </div>
          )}
          {!loading &&
            contacts.map((contact, index) => (
              <div key={contact.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-card-foreground">{contact.name}</p>
                      {contact.is_primary && <Badge variant="default">Primary</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[contact.relationship, contact.email].filter(Boolean).join(" • ") || "No additional details"}
                    </p>
                    {contact.notes && <p className="text-sm text-muted-foreground">{contact.notes}</p>}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => openEditDialog(contact)}>Edit details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrimaryToggle(contact)} disabled={Boolean(contact.is_primary)}>
                        Mark as primary
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => reorderContact(contact.id, "up")} disabled={index === 0}>
                        Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => reorderContact(contact.id, "down")}
                        disabled={index === contacts.length - 1}
                      >
                        Move down
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(contact)}>
                        Remove contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${sanitizePhone(contact.phone)}`} className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4" /> Call
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`sms:${sanitizePhone(contact.phone)}`} className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" /> Text
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handlePrimaryToggle(contact)} disabled={Boolean(contact.is_primary)}>
                    Set as priority
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Tip: Ask contacts to save your safe word and keep their phones unmuted during actions. You can reorder or update them at
          any time.
        </p>
      </CardFooter>
    </Card>
  );
};
