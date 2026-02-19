import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string | null;
  relationship: string | null;
  notes: string | null;
  is_primary: boolean;
  priority_order: number | null;
  created_at: string;
}

export interface EmergencyContactInput {
  name: string;
  phone: string;
  email?: string | null;
  relationship?: string | null;
  notes?: string | null;
  is_primary?: boolean;
}

export const useEmergencyContacts = (userId: string | null) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!userId) {
      setContacts([]);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("priority_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setContacts([]);
    } else {
      setContacts((data as EmergencyContact[]) ?? []);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  const addContact = async (input: EmergencyContactInput): Promise<EmergencyContact | null> => {
    if (!userId) {
      setError("You must be signed in to add contacts");
      return null;
    }

    setError(null);

    const maxOrder = contacts.reduce((max, c) => Math.max(max, c.priority_order ?? 0), 0);

    if (input.is_primary) {
      await supabase
        .from("emergency_contacts")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("is_primary", true);
    }

    const { data, error: insertError } = await supabase
      .from("emergency_contacts")
      .insert({
        user_id: userId,
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        relationship: input.relationship ?? null,
        notes: input.notes ?? null,
        is_primary: input.is_primary ?? false,
        priority_order: maxOrder + 1,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    await fetchContacts();
    return data as EmergencyContact;
  };

  const updateContact = async (id: string, input: Partial<EmergencyContactInput>): Promise<boolean> => {
    if (!userId) {
      setError("You must be signed in to update contacts");
      return false;
    }

    setError(null);

    if (input.is_primary) {
      await supabase
        .from("emergency_contacts")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("is_primary", true);
    }

    const { error: updateError } = await supabase
      .from("emergency_contacts")
      .update({
        name: input.name,
        phone: input.phone,
        email: input.email,
        relationship: input.relationship,
        notes: input.notes,
        is_primary: input.is_primary,
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
      return false;
    }

    await fetchContacts();
    return true;
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    if (!userId) {
      setError("You must be signed in to delete contacts");
      return false;
    }

    setError(null);

    const { error: deleteError } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    await fetchContacts();
    return true;
  };

  const reorderContact = async (id: string, direction: "up" | "down"): Promise<boolean> => {
    if (!userId || contacts.length < 2) return false;

    const currentIndex = contacts.findIndex((c) => c.id === id);
    if (currentIndex === -1) return false;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= contacts.length) return false;

    const currentContact = contacts[currentIndex];
    const targetContact = contacts[targetIndex];

    const { error: error1 } = await supabase
      .from("emergency_contacts")
      .update({ priority_order: targetContact.priority_order })
      .eq("id", currentContact.id);

    if (error1) {
      setError(error1.message);
      return false;
    }

    const { error: error2 } = await supabase
      .from("emergency_contacts")
      .update({ priority_order: currentContact.priority_order })
      .eq("id", targetContact.id);

    if (error2) {
      setError(error2.message);
      return false;
    }

    await fetchContacts();
    return true;
  };

  const setPrimaryContact = async (id: string): Promise<boolean> => {
    if (!userId) {
      setError("You must be signed in to set primary contact");
      return false;
    }

    setError(null);

    const { error: clearError } = await supabase
      .from("emergency_contacts")
      .update({ is_primary: false })
      .eq("user_id", userId)
      .eq("is_primary", true);

    if (clearError) {
      setError(clearError.message);
      return false;
    }

    const { error: setPrimaryError } = await supabase
      .from("emergency_contacts")
      .update({ is_primary: true })
      .eq("id", id)
      .eq("user_id", userId);

    if (setPrimaryError) {
      setError(setPrimaryError.message);
      return false;
    }

    await fetchContacts();
    return true;
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    reorderContact,
    setPrimaryContact,
    refetch: fetchContacts,
  };
};
