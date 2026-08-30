import { useEffect, useState } from "react";
import { buildSignupMetadata } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { AuthChangeEvent, User } from "@supabase/supabase-js";

function recoveryLinkPresent() {
  if (typeof window === "undefined") return false;
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return search.get("type") === "recovery" || hash.get("type") === "recovery";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(recoveryLinkPresent);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setIsPasswordRecovery(event === "PASSWORD_RECOVERY" || recoveryLinkPresent());
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const metadata = buildSignupMetadata(email, displayName);
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: metadata,
      },
    });
  };

  const requestPasswordReset = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
  };

  const updatePassword = async (password: string) => {
    const result = await supabase.auth.updateUser({ password });
    if (!result.error) setIsPasswordRecovery(false);
    return result;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    setIsPasswordRecovery(false);
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    isPasswordRecovery,
    isAuthenticated: !!user,
  };
};
