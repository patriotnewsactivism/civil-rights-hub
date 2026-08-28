import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserCheck, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PublicProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
};

export function CommunityNetwork() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [profilesResult, followsResult] = await Promise.all([
      supabase.from("user_profiles")
        .select("id, user_id, display_name, username, bio, avatar_url, location, location_city, location_state")
        .eq("is_public", true).neq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("follows").select("following_id").eq("follower_id", user.id),
    ]);

    if (profilesResult.error) {
      toast.error("Unable to load the member network");
      setProfiles([]);
    } else {
      setProfiles((profilesResult.data ?? []) as PublicProfile[]);
    }
    setFollowing(new Set((followsResult.data ?? []).map((row) => row.following_id)));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter((profile) =>
      [profile.display_name, profile.username, profile.bio, profile.location, profile.location_city, profile.location_state]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [profiles, query]);

  const toggleFollow = async (targetId: string) => {
    if (!user?.id) return;
    const isFollowing = following.has(targetId);
    const result = isFollowing
      ? await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetId)
      : await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId });
    if (result.error) {
      toast.error("Unable to update follow status");
      return;
    }
    setFollowing((current) => {
      const next = new Set(current);
      if (isFollowing) next.delete(targetId); else next.add(targetId);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold"><Users className="h-6 w-6" /> Community network</h2>
        <p className="mt-1 text-sm text-muted-foreground">Discover members who chose to make their profiles public. Civil Rights Hub does not infer or display professional credentials here.</p>
      </div>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search public profiles" className="pl-9" />
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading public profiles…</div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-muted-foreground">No matching public profiles yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((profile) => {
            const name = profile.display_name || profile.username || "Community member";
            const location = profile.location || [profile.location_city, profile.location_state].filter(Boolean).join(", ");
            const isFollowing = following.has(profile.user_id);
            return (
              <Card key={profile.id}><CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">{name.slice(0, 1).toUpperCase()}</div>}
                  <div className="min-w-0"><div className="truncate font-semibold">{name}</div>{location && <div className="truncate text-xs text-muted-foreground">{location}</div>}</div>
                </div>
                {profile.bio && <p className="line-clamp-4 text-sm text-muted-foreground">{profile.bio}</p>}
                <Button variant={isFollowing ? "secondary" : "default"} className="w-full" onClick={() => toggleFollow(profile.user_id)}>
                  {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}{isFollowing ? "Following" : "Follow"}
                </Button>
              </CardContent></Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
