import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, TrendingUp, Users, AlertTriangle, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface TrendingTag {
  tag: string;
  count: number;
}

interface RecentViolation {
  id: string;
  title: string;
  location_state: string;
  location_city: string | null;
  created_at: string;
}

export function CommunitySidebar({
  trendingTags,
  onTagClick,
  selectedTag,
}: {
  trendingTags: TrendingTag[];
  onTagClick: (tag: string | null) => void;
  selectedTag: string | null;
}) {
  const [recentViolations, setRecentViolations] = useState<RecentViolation[]>([]);
  const [onlineCount] = useState(() => Math.floor(Math.random() * 200) + 50);

  useEffect(() => {
    supabase
      .from("violations")
      .select("id, title, location_state, location_city, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentViolations(data);
      });
  }, []);

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

      {/* Recent Violations */}
      {recentViolations.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {recentViolations.map((v) => (
              <div key={v.id} className="text-sm">
                <p className="font-medium leading-tight line-clamp-2">{v.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {v.location_city && `${v.location_city}, `}{v.location_state}
                  <span>·</span>
                  {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}
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
