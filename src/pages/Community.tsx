import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialFeed } from "@/components/SocialFeed";
import { DirectMessages } from "@/components/DirectMessages";
import { UserProfile } from "@/components/UserProfile";
import { PanicButton } from "@/components/PanicButton";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { DiscussionBoard } from "@/components/DiscussionBoard";
import { EventsCalendar } from "@/components/EventsCalendar";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { SuccessStories } from "@/components/SuccessStories";
import { Users, MessageSquare, User } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Community() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="feed">
            <Users className="h-4 w-4 mr-2" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="feed">
            <div className="space-y-10">
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
            <DirectMessages />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
