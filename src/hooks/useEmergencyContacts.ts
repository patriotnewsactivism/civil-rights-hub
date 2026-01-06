import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EmergencyContact = Database["public"]["Tables"]["emergency_contacts"]["Row"];

export const useEmergencyContacts = (userId: string | null) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) {
        setContacts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId)
        .order("priority_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching emergency contacts:", error);
        setContacts([]);
      } else {
        setContacts(data ?? []);
      }

      setLoading(false);
    };

    void fetchContacts();
  }, [userId]);

  return { contacts, loading };
};
