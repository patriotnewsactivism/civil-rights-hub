import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialFeed } from "@/components/SocialFeed";
import { UserProfile } from "@/components/UserProfile";
import { DiscussionBoard } from "@/components/DiscussionBoard";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Users, MessageSquare, User, Bell, Globe, Newspaper, CalendarDays, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import MessagingPanel from "@/components/MessagingPanel";
import NotificationsCenter from "@/components/NotificationsCenter";
import UserNetwork from "@/components/UserNetwork";
import { CommunityActionBar } from "@/components/community/CommunityActionBar";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityMobileNav } from "@/components/community/CommunityMobileNav";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type CommunityTab = "feed" | "discuss" | "events" | "messages" | "notifications" | "network" | "profile";
const COMMUNITY_TABS: CommunityTab[] = ["feed", "discuss", "events", "messages", "notifications", "network", "profile"];

export default function Community() {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [trendingTags, setTrendingTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    supabase
      .from("popular_tags")
      .select("tag, use_count")
      .order("use_count", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setTrendingTags(data.map((row) => ({ tag: row.tag, count: row.use_count })));
        }
      });
  }, []);

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

  const handleTabChange = (value: string) => {
    if (!COMMUNITY_TABS.includes(value as CommunityTab)) return;
    setActiveTab(value as CommunityTab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Community Network - Civil Rights Hub",
    "description": "Connect with journalists, activists, and attorneys across the civil rights movement",
    "url": "https://civilrightshub.org/community"
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <SEO
        title="Community - Civil Rights Hub | Social Network for Activists"
        description="Post updates, report violations, go live recording police encounters, and connect with activists and attorneys fighting for justice."
        keywords="civil rights community, activist network, police accountability, violation reporting, live recording"
        canonicalUrl="https://civilrightshub.org/community"
        ogUrl="https://civilrightshub.org/community"
        ogTitle="Community Network - Civil Rights Hub"
        ogDescription="Connect with journalists, activists, and attorneys across the civil rights movement"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Post, report, go live, and connect with the movement
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="hidden lg:flex w-full justify-start overflow-x-auto flex-nowrap bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
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
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <CommunityMobileNav activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="mt-6">
            {/* Feed Tab - Social media style with sidebar */}
            <TabsContent value="feed" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-4">
                  {/* Action Bar - Go Live, Report, etc */}
                  <CommunityActionBar userId={user.id} />
                  {/* Social Feed */}
                  <SocialFeed />
                </div>
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <CommunitySidebar
                      trendingTags={trendingTags}
                      onTagClick={setSelectedHashtag}
                      selectedTag={selectedHashtag}
                    />
                  </div>
                </aside>
              </div>
            </TabsContent>

            {/* Discussion Board */}
            <TabsContent value="discuss" className="mt-0">
              <DiscussionBoard />
            </TabsContent>

            {/* Events */}
            <TabsContent value="events" className="mt-0">
              <EventsCalendar />
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="mt-0">
              <MessagingPanel />
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="mt-0">
              <NotificationsCenter />
            </TabsContent>

            {/* Network */}
            <TabsContent value="network" className="mt-0">
              <UserNetwork />
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile" className="mt-0">
              <UserProfile />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
