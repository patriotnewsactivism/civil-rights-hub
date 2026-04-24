import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ViolationFeed } from "./ViolationFeed";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TrendingTag {
  tag: string;
  count: number;
}

interface SuggestedUser {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_verified: boolean | null;
}

const ROLE_COLORS: Record<string, string> = {
  journalist: "bg-blue-500/20 text-blue-400",
  attorney: "bg-teal-500/20 text-teal-300",
  activist: "bg-orange-500/20 text-orange-400",
};

const SAFETY_RESOURCES: Record<string, { title: string; links: { label: string; href: string }[] }> = {
  journalist: {
    title: "Journalist Safety",
    links: [
      { label: "CPJ Safety Advisories", href: "https://cpj.org/safety" },
      { label: "Reporters Committee", href: "https://www.rcfp.org" },
      { label: "Press Freedom Foundation", href: "https://freedom.press" },
    ],
  },
  attorney: {
    title: "Attorney Resources",
    links: [
      { label: "NACDL Resources", href: "https://www.nacdl.org" },
      { label: "NLG Legal Observer", href: "https://nlg.org/legalobservers" },
      { label: "ABA Civil Rights", href: "https://www.americanbar.org/groups/civil_rights" },
    ],
  },
  activist: {
    title: "Activist Safety",
    links: [
      { label: "Know Your Rights PDF", href: "/rights" },
      { label: "EFF Digital Security", href: "https://ssd.eff.org" },
      { label: "ACLU Rights at Protests", href: "https://www.aclu.org/know-your-rights/protesters-rights" },
    ],
  },
};

export function CommunitySidebar({
  trendingTags,
  onTagClick,
  selectedTag,
  currentUserRole,
}: {
  trendingTags: TrendingTag[];
  onTagClick: (tag: string | null) => void;
  selectedTag: string | null;
  currentUserRole?: string | null;
}) {
  const onlineCount = Math.floor(Math.random() * 200) + 50;
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setCurrentUserId(uid);

      if (uid) {
        supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", uid)
          .then(({ data: followData }) => {
            setFollowedIds(new Set((followData ?? []).map((f) => f.following_id)));
          });
      }
    });

    supabase
      .from("user_profiles")
      .select("user_id, display_name, avatar_url, role, is_verified")
      .in("role", ["journalist", "attorney", "activist"])
      .eq("is_verified", true)
      .eq("is_public", true)
      .limit(5)
      .then(({ data }) => {
        setSuggestedUsers((data ?? []) as SuggestedUser[]);
      });
  }, []);

  const handleFollow = async (targetUserId: string) => {
    if (!currentUserId) {
      toast.error("Sign in to follow users");
      return;
    }
    if (followedIds.has(targetUserId)) {
      await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId);
      setFollowedIds((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    } else {
      await supabase
        .from("user_follows")
        .insert({ follower_id: currentUserId, following_id: targetUserId });
      setFollowedIds((prev) => new Set([...prev, targetUserId]));
    }
  };

  const safetyResources = currentUserRole ? SAFETY_RESOURCES[currentUserRole] : null;

  return (
    <div className="space-y-4">
      {/* Community Stats */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">{onlineCount} people active now</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Join the movement. Post updates, report violations, and connect with activists nationwide.
          </p>
        </CardContent>
      </Card>

      <ViolationFeed />

      {/* People to Follow */}
      {suggestedUsers.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              People to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {suggestedUsers.map((u) => (
              <div key={u.user_id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={u.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {u.display_name?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{u.display_name ?? "Community Member"}</div>
                  {u.role && ROLE_COLORS[u.role] && (
                    <Badge className={`text-[9px] px-1.5 py-0 h-4 ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={followedIds.has(u.user_id) ? "secondary" : "outline"}
                  className="h-7 text-xs px-2 shrink-0"
                  onClick={() => handleFollow(u.user_id)}
                  disabled={u.user_id === currentUserId}
                >
                  {followedIds.has(u.user_id) ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trending */}
      {trendingTags.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {trendingTags.slice(0, 8).map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => onTagClick(selectedTag === tag ? null : tag)}
                className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  selectedTag === tag
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <span className="font-medium">{tag}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5">{count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Role-based Safety Resources */}
      {safetyResources && (
        <Card className="border-border/50 border-orange-500/30 bg-orange-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-400" />
              {safetyResources.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-1">
            {safetyResources.links.map(({ label, href }) =>
              href.startsWith("/") ? (
                <Button key={label} variant="ghost" size="sm" asChild className="w-full justify-start text-xs h-8 text-orange-300 hover:text-orange-200">
                  <Link to={href}>{label}</Link>
                </Button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-orange-300 hover:text-orange-200 hover:bg-muted transition-colors w-full"
                >
                  {label}
                  <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                </a>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card className="border-border/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-1">
          {[
            { label: "Know Your Rights", to: "/rights" },
            { label: "Find an Attorney", to: "/attorneys" },
            { label: "File FOIA Request", to: "/tools" },
            { label: "Resource Library", to: "/resources" },
          ].map(({ label, to }) => (
            <Button key={to} variant="ghost" size="sm" asChild className="w-full justify-start text-sm h-8">
              <Link to={to}>{label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
