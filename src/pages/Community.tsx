import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialFeed } from "@/components/SocialFeed";
import { UserProfile } from "@/components/UserProfile";
import { PanicButton } from "@/components/PanicButton";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { DiscussionBoard } from "@/components/DiscussionBoard";
import { EventsCalendar } from "@/components/EventsCalendar";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { SuccessStories } from "@/components/SuccessStories";
import { Users, MessageSquare, User, Bell, Globe } from "lucide-react";
import { SEO } from "@/components/SEO";
import MessagingPanel from "@/components/MessagingPanel";
import NotificationsCenter from "@/components/NotificationsCenter";
import UserNetwork from "@/components/UserNetwork";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CommunityTab = "feed" | "messages" | "notifications" | "network" | "profile";
const COMMUNITY_TABS: CommunityTab[] = ["feed", "messages", "notifications", "network", "profile"];

export default function Community() {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Community Network - Civil Rights Hub | Connect with Activists & Attorneys"
        description="Connect with journalists, activists, and attorneys across the civil rights movement. Share updates, send messages, and build your network in the fight for justice."
        keywords="civil rights community, activist network, attorney network, civil rights activists, legal community, social justice network"
        canonicalUrl="https://civilrightshub.org/community"
        ogUrl="https://civilrightshub.org/community"
        ogTitle="Community Network - Civil Rights Hub"
        ogDescription="Connect with journalists, activists, and attorneys across the civil rights movement"
        structuredData={structuredData}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community Network</h1>
        <p className="text-muted-foreground">
          Connect with journalists, activists, and attorneys across the civil rights movement
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full gap-2 sm:max-w-3xl sm:grid-cols-5">
          <TabsTrigger value="feed">
            <Users className="h-4 w-4 mr-2" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="network">
            <Globe className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="feed">
            <div className="space-y-10">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <Button variant="secondary" asChild className="justify-start">
                    <Link to="/community?tab=messages">Open Messaging Panel</Link>
                  </Button>
                  <Button variant="secondary" asChild className="justify-start">
                    <Link to="/community?tab=notifications">View Notifications</Link>
                  </Button>
                  <Button variant="secondary" asChild className="justify-start">
                    <Link to="/community?tab=network">Browse Network</Link>
                  </Button>
                </CardContent>
              </Card>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <PanicButton />
                <EmergencyContacts />
              </div>
              <SocialFeed />
              <DiscussionBoard />
              <EventsCalendar />
              <ResourceLibrary />
              <SuccessStories />
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <MessagingPanel />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsCenter />
          </TabsContent>

          <TabsContent value="network">
            <UserNetwork />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
