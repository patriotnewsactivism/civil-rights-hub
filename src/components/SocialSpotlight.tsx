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

interface SpotlightPost {
  id: string;
  content: string | null;
  created_at: string;
  profiles: Pick<Database["public"]["Tables"]["profiles"]["Row"], "display_name" | "avatar_url" | "role"> | null;
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
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, content, created_at, profiles!posts_user_id_fkey(display_name, avatar_url, role)`
        )
        .order("created_at", { ascending: false })
        .limit(3);

      if (error || !data || !isMounted) {
        return;
      }

      setPosts(data);
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="social" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-semibold">
            <Megaphone className="h-4 w-4" />
            Social Signal & Rapid Boosts
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Tap into the Civil Rights social desk</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview the latest posts from the Civil Rights Hub community, track how many professionals are online, and submit your livestream handles for verification.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="shadow-strong">
            <CardHeader className="flex flex-col gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-primary" />
                Latest from the community
              </CardTitle>
              <CardDescription>Posts auto-refresh from the member-only social feed.</CardDescription>
              <Button asChild>
                <Link to="/community">Share an update</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.profiles?.avatar_url ?? undefined} alt={post.profiles?.display_name ?? "User"} />
                      <AvatarFallback>
                        {(post.profiles?.display_name ?? "CR").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{post.profiles?.display_name ?? "Community member"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{post.profiles?.role ?? "advocate"}</p>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{post.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Network pulse
                </CardTitle>
                <CardDescription>Live metrics update every few minutes.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {SOCIAL_METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border/60 bg-background/80 p-4 text-center">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/40">
              <CardHeader>
                <CardTitle>Featured channels</CardTitle>
                <CardDescription>Boosted accounts rotate every 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {HIGHLIGHTED_CHANNELS.map((channel) => (
                  <div key={channel.handle} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{channel.platform}</p>
                        <p className="text-base font-semibold">{channel.handle}</p>
                      </div>
                      <Badge variant="secondary">Boosted</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{channel.focus}</p>
                    <Button
                      variant="ghost"
                      className="mt-2"
                      onClick={() => window.open(channel.link, "_blank")}
                    >
                      View channel
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-strong">
              <CardHeader>
                <CardTitle>List your channel</CardTitle>
                <CardDescription>Verified handles appear inside the command center and on boosted slots.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Livestream or social handle" />
                <Input placeholder="Primary contact email" type="email" />
                <Button
                  onClick={() => window.open('mailto:social@civilrightshub.org?subject=Social%20Verification%20Request')}
                >
                  Request verification
                  <Send className="ml-2 h-4 w-4" />
                </Button>
                <Separator />
                <p className="text-xs text-muted-foreground">
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
