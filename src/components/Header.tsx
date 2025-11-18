import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, Users, Scale, Megaphone, BookOpen, Bell, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadMessages(0);
      setUnreadNotifications(0);
      return;
    }

    const loadCounts = async () => {
      const [{ count: notifCount }, { count: msgCount }] = await Promise.all([
        supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false),
        supabase
          .from("direct_messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("is_read", false)
          .eq("is_deleted_by_recipient", false),
      ]);

      setUnreadNotifications(notifCount ?? 0);
      setUnreadMessages(msgCount ?? 0);
    };

    void loadCounts();

    const channel = supabase
      .channel(`header-counts-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          void loadCounts();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${user.id}` },
        () => {
          void loadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span>Civil Rights Hub</span>
            <span className="text-xs font-normal text-muted-foreground">by We The People News</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link to="/attorneys">
              <Scale className="h-4 w-4 mr-2" />
              Attorneys
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link to="/activists">
              <Megaphone className="h-4 w-4 mr-2" />
              Activists
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link to="/resources">
              <BookOpen className="h-4 w-4 mr-2" />
              Resources
            </Link>
          </Button>
          {user && (
            <>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/community?tab=notifications" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {Math.min(unreadNotifications, 99)}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/community?tab=messages" aria-label="Messages">
                  <MessageCircle className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {Math.min(unreadMessages, 99)}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          )}
          {user ? (
            <Button asChild>
              <Link to="/community">
                <Users className="h-4 w-4 mr-2" />
                Community
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
