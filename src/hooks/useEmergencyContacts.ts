import { useState } from "react";

// Placeholder types - emergency_contacts table doesn't exist yet
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

/**
 * Placeholder hook for emergency contacts.
 * The emergency_contacts table doesn't exist in the database yet.
 * Returns empty state until the table is created.
 */
export const useEmergencyContacts = (_userId: string | null) => {
  const [contacts] = useState<EmergencyContact[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const addContact = async (_input: EmergencyContactInput): Promise<EmergencyContact | null> => {
    console.warn("emergency_contacts table not yet created");
    return null;
  };

  const updateContact = async (_id: string, _input: Partial<EmergencyContactInput>): Promise<boolean> => {
    console.warn("emergency_contacts table not yet created");
    return false;
  };

  const deleteContact = async (_id: string): Promise<boolean> => {
    console.warn("emergency_contacts table not yet created");
    return false;
  };

  const reorderContact = async (_id: string, _direction: "up" | "down"): Promise<boolean> => {
    console.warn("emergency_contacts table not yet created");
    return false;
  };

  const setPrimaryContact = async (_id: string): Promise<boolean> => {
    console.warn("emergency_contacts table not yet created");
    return false;
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
  };
};
