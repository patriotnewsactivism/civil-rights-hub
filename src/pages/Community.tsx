import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/UserProfile";
import { User, Bell, Globe, Newspaper, CalendarDays, MessageCircle, MessageSquare } from "lucide-react";
import { SEO } from "@/components/SEO";
import MessagingPanel from "@/components/MessagingPanel";
import NotificationsCenter from "@/components/NotificationsCenter";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityMobileNav } from "@/components/community/CommunityMobileNav";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

type CommunityTab = "feed" | "discuss" | "events" | "messages" | "notifications" | "network" | "profile";
const COMMUNITY_TABS: CommunityTab[] = ["feed", "discuss", "events", "messages", "notifications", "network", "profile"];

export default function Community() {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const initialTab = useMemo(() => {
    const paramTab = searchParams.get("tab") as CommunityTab | null;
    return paramTab && COMMUNITY_TABS.includes(paramTab) ? paramTab : "feed";
  }, [searchParams]);
  const [activeTab, setActiveTab] = useState<CommunityTab>(initialTab);

  useEffect(() => {
    const paramTab = searchParams.get("tab") as CommunityTab | null;
    if (paramTab && COMMUNITY_TABS.includes(paramTab) && paramTab !== activeTab) {
      setActiveTab(paramTab);
    }
  }, [activeTab, searchParams]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .then(({ count, error }) => {
        if (!error) setUnreadNotifications(count ?? 0);
      });

    supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setCurrentUserRole(data?.role ?? null));
  }, [user?.id]);

  const handleTabChange = (value: string) => {
    if (!COMMUNITY_TABS.includes(value as CommunityTab)) return;
    setActiveTab(value as CommunityTab);
    if (value === "notifications") setUnreadNotifications(0);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Community Account Workspace | Civil Rights Hub"
        description="Use private messaging, notifications, and your account profile while Civil Rights Hub removes synthetic community seed content and rebuilds public community verification."
        canonicalUrl="https://civilrightshub.org/community"
        ogUrl="https://civilrightshub.org/community"
      />

      <main className="flex-1 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Community</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Messaging and account tools remain available while public social content is cleaned and re-verified.
              </p>
            </div>
            <button
              onClick={() => handleTabChange("notifications")}
              className="relative mt-1 rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="hidden h-auto w-full flex-nowrap justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 lg:flex">
              {[
                { value: "feed", icon: Newspaper, label: "Feed" },
                { value: "discuss", icon: MessageCircle, label: "Discuss" },
                { value: "events", icon: CalendarDays, label: "Events" },
                { value: "messages", icon: MessageSquare, label: "Messages" },
                { value: "notifications", icon: Bell, label: "Alerts" },
                { value: "network", icon: Globe, label: "Network" },
                { value: "profile", icon: User, label: "Profile" },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <CommunityMobileNav activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="mt-6">
              <TabsContent value="feed" className="mt-0">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                  <VerifiedDataHold
                    title="Public social feed is temporarily withheld"
                    description="Known demo migrations inserted synthetic legal/news posts under a real user's account. Those records are being quarantined and removed before the public feed is restored."
                    detail="No activity totals, trending counters, seeded posts, or public incident feed are shown while the cleanup migration remains unapplied."
                  />
                  <aside className="hidden lg:block">
                    <div className="sticky top-24">
                      <CommunitySidebar currentUserRole={currentUserRole} />
                    </div>
                  </aside>
                </div>
              </TabsContent>

              <TabsContent value="discuss" className="mt-0">
                <VerifiedDataHold
                  title="Public discussions are temporarily withheld"
                  description="A legacy seed created synthetic forum threads, fabricated view counts, and first-person claims under a real user's account. The known seeded threads are being quarantined before discussions reopen."
                  detail="Private messaging and your own account profile remain available during the cleanup."
                />
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <VerifiedDataHold
                  title="Community events are temporarily withheld"
                  description="The legacy events dataset contains published dates, organizer identities, contacts, locations, and registration links without durable per-event provenance. Events will return only after each listing is checked against an authoritative organizer or venue source."
                  detail="Do not rely on a previously displayed Civil Rights Hub event date or registration link unless you independently confirm it with the organizer."
                />
              </TabsContent>

              <TabsContent value="messages" className="mt-0">
                <MessagingPanel />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationsCenter />
              </TabsContent>

              <TabsContent value="network" className="mt-0">
                <VerifiedDataHold
                  title="Public profile discovery is temporarily withheld"
                  description="Legacy community profile verification flags have not yet been tied to the same source-provenance standard used for public directories."
                  detail="Your own profile remains available, but Civil Rights Hub is not presenting other accounts as verified journalists, attorneys, or activists until that workflow is audited."
                />
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <UserProfile />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
