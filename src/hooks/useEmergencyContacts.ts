import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";

export type EmergencyContact = Database["public"]["Tables"]["emergency_contacts"]["Row"];
export type EmergencyContactInput = Pick<
  Database["public"]["Tables"]["emergency_contacts"]["Insert"],
  "name" | "relationship" | "phone" | "email" | "notes" | "is_primary"
>;

interface UseEmergencyContactsResult {
  contacts: EmergencyContact[];
  loading: boolean;
  error: string | null;
  addContact: (input: EmergencyContactInput) => Promise<EmergencyContact | null>;
  updateContact: (id: string, updates: Partial<EmergencyContactInput>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  reorderContact: (id: string, direction: "up" | "down") => Promise<void>;
  refreshContacts: () => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
}

const sortContacts = (items: EmergencyContact[]) => {
  return [...items].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    const aOrder = a.priority_order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.priority_order ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
};

export const useEmergencyContacts = (userId: string | null): UseEmergencyContactsResult => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!userId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("priority_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      toast({
        title: "Unable to load contacts",
        description: queryError.message,
        variant: "destructive",
      });
      setContacts([]);
    } else {
      setContacts(sortContacts(data ?? []));
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  const refreshContacts = useCallback(async () => {
    await fetchContacts();
  }, [fetchContacts]);

  const addContact = useCallback(
    async (input: EmergencyContactInput) => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You need to be signed in to manage emergency contacts.",
          variant: "destructive",
        });
        return null;
      }

      const nextPriority = contacts.length;
      const { data: inserted, error: insertError } = await supabase
        .from("emergency_contacts")
        .insert({
          user_id: userId,
          priority_order: nextPriority,
          ...input,
        })
        .select()
        .single();

      if (insertError) {
        toast({
          title: "Could not save contact",
          description: insertError.message,
          variant: "destructive",
        });
        setError(insertError.message);
        return null;
      }

      toast({
        title: "Contact added",
        description: `${input.name} has been added to your emergency list.`,
      });

      await fetchContacts();
      return inserted ?? null;
    },
    [contacts.length, fetchContacts, userId]
  );

  const updateContact = useCallback(
    async (id: string, updates: Partial<EmergencyContactInput>) => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You need to be signed in to manage emergency contacts.",
          variant: "destructive",
        });
        return;
      }

      const { error: updateError } = await supabase
        .from("emergency_contacts")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId);

      if (updateError) {
        toast({
          title: "Could not update contact",
          description: updateError.message,
          variant: "destructive",
        });
        setError(updateError.message);
        return;
      }

      toast({
        title: "Contact updated",
        description: "Your emergency contact details have been saved.",
      });

      setContacts((current) =>
        sortContacts(
          current.map((contact) =>
            contact.id === id
              ? {
                  ...contact,
                  ...updates,
                  updated_at: new Date().toISOString(),
                }
              : contact
          )
        )
      );
    },
    [userId]
  );

  const deleteContact = useCallback(
    async (id: string) => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You need to be signed in to manage emergency contacts.",
          variant: "destructive",
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        toast({
          title: "Could not remove contact",
          description: deleteError.message,
          variant: "destructive",
        });
        setError(deleteError.message);
        return;
      }

      toast({
        title: "Contact removed",
        description: "The emergency contact has been removed from your list.",
      });

      await fetchContacts();
    },
    [fetchContacts, userId]
  );

  const reorderContact = useCallback(
    async (id: string, direction: "up" | "down") => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You need to be signed in to manage emergency contacts.",
          variant: "destructive",
        });
        return;
      }

      const ordered = sortContacts(contacts);
      const index = ordered.findIndex((contact) => contact.id === id);
      if (index === -1) return;

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= ordered.length) return;

      const reordered = [...ordered];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(swapIndex, 0, moved);

      const previousPriorityById = new Map(
        ordered.map((contact) => [contact.id, contact.priority_order ?? 0])
      );

      const nextContacts = reordered.map((contact, priority) => ({
        ...contact,
        priority_order: priority,
      }));

      setContacts(nextContacts);

      const updates = nextContacts
        .filter((contact) => {
          const previousPriority = previousPriorityById.get(contact.id);
          return previousPriority === undefined || previousPriority !== (contact.priority_order ?? 0);
        })
        .map((contact) =>
          supabase
            .from("emergency_contacts")
            .update({ priority_order: contact.priority_order ?? 0 })
            .eq("id", contact.id)
            .eq("user_id", userId)
        );

      try {
        await Promise.all(updates);
        toast({
          title: "Priority updated",
          description: "Emergency contacts reordered successfully.",
        });
      } catch (updateError) {
        const message = updateError instanceof Error ? updateError.message : "Unknown error";
        toast({
          title: "Could not update order",
          description: message,
          variant: "destructive",
        });
        await fetchContacts();
      }
    },
    [contacts, fetchContacts, userId]
  );

  const setPrimaryContact = useCallback(
    async (id: string) => {
      if (!userId) {
        toast({
          title: "Sign in required",
          description: "You need to be signed in to manage emergency contacts.",
          variant: "destructive",
        });
        return;
      }

      const { error: clearError } = await supabase
        .from("emergency_contacts")
        .update({ is_primary: false })
        .eq("user_id", userId);

      if (clearError) {
        toast({
          title: "Could not update primary contact",
          description: clearError.message,
          variant: "destructive",
        });
        setError(clearError.message);
        return;
      }

      const { error: setErrorResponse } = await supabase
        .from("emergency_contacts")
        .update({ is_primary: true })
        .eq("id", id)
        .eq("user_id", userId);

      if (setErrorResponse) {
        toast({
          title: "Could not update primary contact",
          description: setErrorResponse.message,
          variant: "destructive",
        });
        setError(setErrorResponse.message);
        return;
      }

      toast({
        title: "Primary contact set",
        description: "This contact will receive urgent alerts first.",
      });

      await fetchContacts();
    },
    [fetchContacts, userId]
  );

  const memoizedContacts = useMemo(() => sortContacts(contacts), [contacts]);

  return {
    contacts: memoizedContacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    reorderContact,
    refreshContacts,
    setPrimaryContact,
  };
};
