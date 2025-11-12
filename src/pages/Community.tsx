import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialFeed } from "@/components/SocialFeed";
import { DirectMessages } from "@/components/DirectMessages";
import { UserProfile } from "@/components/UserProfile";
import { SEO, SEOPresets } from "@/components/SEO";
import { Users, MessageSquare, User } from "lucide-react";

export default function Community() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <SEO {...SEOPresets.community} />
      <div className="container mx-auto px-4 py-8">
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
            <SocialFeed />
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
    </>
  );
}
