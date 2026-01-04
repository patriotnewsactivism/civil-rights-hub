import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Megaphone, Users, Send, Activity } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface SpotlightPost {
  id: string;
  content: string | null;
  created_at: string;
  profiles: Pick<ProfileRow, "display_name" | "avatar_url" | "role"> | null;
}

const FALLBACK_POSTS: SpotlightPost[] = [
  {
    id: "fallback-1",
    content: "Documenting a retaliatory arrest outside the county courthouse. Uploading footage + seeking rapid review.",
    created_at: new Date().toISOString(),
    profiles: { display_name: "Metro Accountability Watch", avatar_url: null, role: "activist" },
  },
  {
    id: "fallback-2",
    content: "FOIA tip: agencies are trying to bill $95/hour for scanning. Use the fee cap letter template in the builder!",
    created_at: new Date().toISOString(),
    profiles: { display_name: "Public Records Lab", avatar_url: null, role: "attorney" },
  },
  {
    id: "fallback-3",
    content: "Scanner ping: multi-agency protest detail forming in downtown corridor. Need livestreamers on standby.",
    created_at: new Date().toISOString(),
    profiles: { display_name: "Heartbeat Ops", avatar_url: null, role: "journalist" },
  },
];

const SOCIAL_METRICS = [
  { label: "Verified auditors", value: "4,320+" },
  { label: "Attorneys online now", value: "118" },
  { label: "Scanner alerts today", value: "236" },
];

const HIGHLIGHTED_CHANNELS = [
  {
    platform: "YouTube",
    handle: "@WeThePeopleAudits",
    focus: "Live public records walk-throughs",
    link: "https://youtube.com",
  },
  {
    platform: "Twitch",
    handle: "CivicSignal",
    focus: "Nightly accountability scanner show",
    link: "https://twitch.tv",
  },
  {
    platform: "Twitter",
    handle: "@FirstAmendmentOps",
    focus: "Breaking case law threads",
    link: "https://twitter.com",
  },
];

export const SocialSpotlight = () => {
  const [posts, setPosts] = useState<SpotlightPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      // Fetch posts with user_id, then fetch profiles separately
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, content, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(3);

      if (postsError || !postsData || !isMounted) {
        return;
      }

      // Fetch profiles for these users
      const userIds = postsData.map((p) => p.user_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, role")
        .in("id", userIds);

      const profileMap = new Map(profilesData?.map((p) => [p.id, p]) ?? []);

      const transformedPosts: SpotlightPost[] = postsData.map((post) => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at ?? new Date().toISOString(),
        profiles: profileMap.get(post.user_id) ?? null,
      }));

      if (transformedPosts.length > 0) {
        setPosts(transformedPosts);
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="social" className="py-10 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10 space-y-2 md:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold">
            <Megaphone className="h-3 w-3 md:h-4 md:w-4" />
            Social Signal & Rapid Boosts
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold px-4">Tap into the Civil Rights social desk</h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Preview the latest posts from the Civil Rights Hub community, track how many professionals are online, and submit your livestream handles for verification.
          </p>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="shadow-strong">
            <CardHeader className="p-4 md:p-6 flex flex-col gap-2 md:gap-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Latest from the community
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Posts auto-refresh from the member-only social feed.</CardDescription>
              <Button asChild size="sm" className="w-full sm:w-auto text-xs md:text-sm">
                <Link to="/community">Share an update</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4 md:space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-border/60 bg-background/80 p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={post.profiles?.avatar_url ?? undefined} alt={post.profiles?.display_name ?? "User"} />
                      <AvatarFallback className="text-xs md:text-sm">
                        {(post.profiles?.display_name ?? "CR").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold truncate">{post.profiles?.display_name ?? "Community member"}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground capitalize">{post.profiles?.role ?? "advocate"}</p>
                    </div>
                    <span className="text-[10px] md:text-xs text-muted-foreground flex-shrink-0">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm leading-relaxed text-foreground/90">{post.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Network pulse
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Live metrics update every few minutes.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 grid gap-3 md:gap-4">
                {SOCIAL_METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border/60 bg-background/80 p-3 md:p-4 text-center">
                    <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/40">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Featured channels</CardTitle>
                <CardDescription className="text-xs md:text-sm">Boosted accounts rotate every 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3 md:space-y-4">
                {HIGHLIGHTED_CHANNELS.map((channel) => (
                  <div key={channel.handle} className="rounded-2xl border border-border/60 bg-background/80 p-3 md:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-muted-foreground">{channel.platform}</p>
                        <p className="text-sm md:text-base font-semibold truncate">{channel.handle}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Boosted</Badge>
                    </div>
                    <p className="mt-2 text-xs md:text-sm text-muted-foreground">{channel.focus}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs md:text-sm"
                      onClick={() => window.open(channel.link, "_blank")}
                    >
                      View channel
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-strong">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">List your channel</CardTitle>
                <CardDescription className="text-xs md:text-sm">Verified handles appear inside the command center and on boosted slots.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
                <Input placeholder="Livestream or social handle" className="text-sm" />
                <Input placeholder="Primary contact email" type="email" className="text-sm" />
                <Button
                  size="sm"
                  className="w-full text-xs md:text-sm"
                  onClick={() => window.open('mailto:social@civilrightshub.org?subject=Social%20Verification%20Request')}
                >
                  Request verification
                  <Send className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Separator />
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Handles appear after manual review. Members can also message you directly from the community inbox once verified.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
