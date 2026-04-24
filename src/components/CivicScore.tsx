import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  FileText,
  AlertCircle,
  Users,
  Star,
  Shield,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CivicScoreData {
  score: number;
  streak: number;
  level: string;
  levelColor: string;
  nextLevel: string;
  nextScore: number;
  achievements: Achievement[];
  breakdown: { label: string; points: number; icon: string }[];
}

interface Achievement {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  icon: string;
}

const LEVELS = [
  { name: "Newcomer", min: 0, max: 49, color: "text-muted-foreground" },
  { name: "Advocate", min: 50, max: 149, color: "text-blue-500" },
  { name: "Activist", min: 150, max: 349, color: "text-green-500" },
  { name: "Defender", min: 350, max: 699, color: "text-purple-500" },
  { name: "Champion", min: 700, max: 999, color: "text-orange-500" },
  { name: "Guardian", min: 1000, max: Infinity, color: "text-primary" },
];

const BASE_ACHIEVEMENTS: Achievement[] = [
  { id: "first_report", label: "First Report", description: "Filed your first violation report", earned: false, icon: "🚨" },
  { id: "first_foia", label: "FOIA Filer", description: "Submitted your first FOIA request", earned: false, icon: "📋" },
  { id: "community_voice", label: "Community Voice", description: "Made 5 posts in the community feed", earned: false, icon: "✊" },
  { id: "attorney_connected", label: "Connected", description: "Reached out to an attorney", earned: false, icon: "⚖️" },
  { id: "week_streak", label: "Weekly Warrior", description: "7-day activity streak", earned: false, icon: "🔥" },
  { id: "verified_member", label: "Verified Member", description: "Completed profile verification", earned: false, icon: "✅" },
];

function getLevel(score: number) {
  return LEVELS.find((l) => score >= l.min && score <= l.max) ?? LEVELS[0];
}

export function CivicScore() {
  const [data, setData] = useState<CivicScoreData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const calculate = async () => {
      // Count user's contributions across tables
      const [reportsRes, postsRes, foiasRes, followsRes] = await Promise.all([
        supabase.from("violations").select("id", { count: "exact", head: true }).eq("reporter_id", userId),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("foia_requests").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", userId),
      ]);

      const reports = reportsRes.count ?? 0;
      const posts = postsRes.count ?? 0;
      const foias = foiasRes.count ?? 0;
      const follows = followsRes.count ?? 0;

      const score = reports * 20 + posts * 5 + foias * 15 + follows * 2;
      const level = getLevel(score);
      const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

      const achievements = BASE_ACHIEVEMENTS.map((a) => ({
        ...a,
        earned:
          (a.id === "first_report" && reports > 0) ||
          (a.id === "first_foia" && foias > 0) ||
          (a.id === "community_voice" && posts >= 5) ||
          (a.id === "week_streak" && posts >= 7),
      }));

      setData({
        score,
        streak: Math.min(posts, 30),
        level: level.name,
        levelColor: level.color,
        nextLevel: nextLevel?.name ?? "Max",
        nextScore: nextLevel?.min ?? score,
        achievements,
        breakdown: [
          { label: "Violation Reports", points: reports * 20, icon: "🚨" },
          { label: "FOIA Requests", points: foias * 15, icon: "📋" },
          { label: "Community Posts", points: posts * 5, icon: "✊" },
          { label: "Network Connections", points: follows * 2, icon: "🤝" },
        ].filter((b) => b.points > 0),
      });
    };

    void calculate();
  }, [userId]);

  if (loading) return null;

  if (!userId) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-8 text-center space-y-3">
          <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Sign in to track your Civic Score and earn badges
          </p>
          <Link to="/auth">
            <Badge variant="default" className="cursor-pointer">Join the movement</Badge>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const progressPct =
    data.nextScore > data.score
      ? Math.round(((data.score - (getLevel(data.score).min)) / (data.nextScore - getLevel(data.score).min)) * 100)
      : 100;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-primary" />
            Civic Score
          </CardTitle>
          <div className="flex items-center gap-2">
            {data.streak > 0 && (
              <Badge variant="outline" className="text-orange-500 border-orange-500/30 text-xs">
                <Flame className="h-3 w-3 mr-1" />
                {data.streak}d streak
              </Badge>
            )}
            <Badge className={`text-xs font-bold ${data.levelColor}`} variant="secondary">
              {data.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score display */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black">{data.score}</span>
          <span className="text-muted-foreground text-sm pb-1">pts</span>
        </div>

        {/* Progress to next level */}
        {data.nextScore > data.score && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{data.level}</span>
              <span>{data.nextLevel} ({data.nextScore - data.score} pts away)</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        )}

        {/* Points breakdown */}
        {data.breakdown.length > 0 && (
          <div className="space-y-1">
            {data.breakdown.map((b) => (
              <div key={b.label} className="flex justify-between text-xs text-muted-foreground">
                <span>{b.icon} {b.label}</span>
                <span className="font-medium text-foreground">+{b.points}</span>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {data.achievements.map((a) => (
            <div
              key={a.id}
              title={a.description}
              className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                a.earned
                  ? "border-primary/30 bg-primary/10"
                  : "border-border/30 opacity-40 grayscale"
              }`}
            >
              <span className="text-lg">{a.icon}</span>
              <span className="text-[9px] font-medium mt-0.5 leading-tight">{a.label}</span>
            </div>
          ))}
        </div>

        {data.score === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Report a violation or file a FOIA to start earning points
          </p>
        )}
      </CardContent>
    </Card>
  );
}
