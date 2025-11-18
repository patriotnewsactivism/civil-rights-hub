import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, UserPlus, UserCheck, Search, Filter, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];
type UserConnectionRow = Database["public"]["Tables"]["user_connections"]["Row"];
type RoleFilter = "all" | Database["public"]["Enums"]["app_role"];

type ContributorLevel = {
  level: string;
  color: string;
  icon: string;
};

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "journalist", label: "Journalists" },
  { value: "activist", label: "Activists" },
  { value: "attorney", label: "Attorneys" },
  { value: "moderator", label: "Moderators" },
];

export default function UserNetwork() {
  const [users, setUsers] = useState<UserProfileRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<RoleFilter>("all");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user ?? null;
    setCurrentUser(user);

    if (user) {
      const { data: connections } = await supabase
        .from("user_connections")
        .select("following_id")
        .eq("follower_id", user.id)
        .returns<Pick<UserConnectionRow, "following_id">[]>();

      setFollowing(connections?.map((connection) => connection.following_id) ?? []);
    } else {
      setFollowing([]);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const loadUsers = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let query = supabase
        .from("user_profiles")
        .select("*")
        .neq("user_id", currentUser.id)
        .order("posts_created", { ascending: false })
        .limit(50);

      if (filterRole !== "all") {
        query = query.eq("role", filterRole);
      }

      const { data, error } = await query.returns<UserProfileRow[]>();
      if (error) throw error;
      setUsers(data ?? []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentUser, filterRole]);

  useEffect(() => {
    if (currentUser) {
      void loadUsers();
    }
  }, [currentUser, loadUsers]);

  const toggleFollow = async (userId: string) => {
    if (!currentUser) {
      toast.error("Please sign in to follow people");
      return;
    }

    try {
      if (following.includes(userId)) {
        await supabase
          .from("user_connections")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", userId);

        setFollowing((previous) => previous.filter((id) => id !== userId));
        toast.success("Unfollowed");
      } else {
        await supabase.from("user_connections").insert({ follower_id: currentUser.id, following_id: userId });
        setFollowing((previous) => [...previous, userId]);
        toast.success("Following");
      }
    } catch (error) {
      console.error("Error updating follow state:", error);
      toast.error("Failed to update follow status");
    }
  };

  const getRoleBadge = (role: Database["public"]["Enums"]["app_role"] | null) => {
    const roleMap: Record<string, { color: string; label: string; icon: string }> = {
      admin: { color: "bg-red-100 text-red-800 border-red-200", label: "Admin", icon: "👑" },
      moderator: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Moderator", icon: "🛡️" },
      attorney: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Civil Rights Attorney", icon: "⚖️" },
      journalist: { color: "bg-green-100 text-green-800 border-green-200", label: "Journalist", icon: "📰" },
      activist: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Activist", icon: "✊" },
      user: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Member", icon: "👤" },
    };

    const badge = roleMap[role ?? "user"];
    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getContributorLevel = (userProfile: UserProfileRow): ContributorLevel => {
    const totalActivity =
      (userProfile.posts_created ?? 0) +
      (userProfile.helpful_answers ?? 0) +
      (userProfile.threads_created ?? 0) +
      (userProfile.violations_count ?? 0);

    if (totalActivity >= 100) return { level: "Elite", color: "text-purple-600", icon: "👑" };
    if (totalActivity >= 50) return { level: "Expert", color: "text-blue-600", icon: "⭐" };
    if (totalActivity >= 25) return { level: "Active", color: "text-green-600", icon: "🌟" };
    if (totalActivity >= 10) return { level: "Regular", color: "text-yellow-600", icon: "✨" };
    return { level: "New", color: "text-gray-600", icon: "🌱" };
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const search = searchQuery.toLowerCase();

    return users.filter((user) => {
      const username = user.username?.toLowerCase() ?? "";
      const displayName = user.display_name?.toLowerCase() ?? "";
      const bio = user.bio?.toLowerCase() ?? "";
      return username.includes(search) || displayName.includes(search) || bio.includes(search);
    });
  }, [searchQuery, users]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 flex items-center text-4xl font-bold text-foreground">
          <Users className="mr-3 h-10 w-10 text-primary" /> Discover the Network
        </h1>
        <p className="text-xl text-muted-foreground">Connect with journalists, activists, and civil rights advocates.</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, username, or bio..."
              className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <select
              value={filterRole}
              onChange={(event) => setFilterRole(event.target.value as RoleFilter)}
              className="w-full appearance-none rounded-lg border border-input bg-background py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-ring"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-muted" />
          <p className="text-muted-foreground text-lg">No users found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const isFollowing = following.includes(user.user_id);
            const contributorLevel = getContributorLevel(user);
            const totalActivity =
              (user.posts_created ?? 0) +
              (user.helpful_answers ?? 0) +
              (user.threads_created ?? 0) +
              (user.violations_count ?? 0);

            return (
              <div key={user.user_id} className="space-y-4 rounded-2xl border bg-card p-6 shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold text-white">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.display_name || user.username || "Profile"} className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        (user.display_name || user.username || "?")
                          .substring(0, 1)
                          .toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-lg text-foreground">
                        <span>{user.display_name || user.username}</span>
                        {user.is_verified && <Award className="h-4 w-4 text-primary" title="Verified" />}
                      </div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  </div>
                </div>

                <div>{getRoleBadge(user.role)}</div>

                {user.bio && <p className="text-sm text-foreground line-clamp-3">{user.bio}</p>}

                <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-3 dark:from-yellow-950/20 dark:to-orange-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Contributor Level</div>
                      <div className={`font-bold ${contributorLevel.color}`}>
                        {contributorLevel.icon} {contributorLevel.level}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Activity</div>
                      <div className="text-2xl font-bold text-foreground">{totalActivity}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">{user.posts_created ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{user.threads_created ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Threads</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{user.helpful_answers ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Helpful</div>
                  </div>
                </div>

                {currentUser && currentUser.id !== user.user_id && (
                  <button
                    onClick={() => toggleFollow(user.user_id)}
                    className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                      isFollowing ? "bg-secondary text-secondary-foreground" : "bg-gradient-primary text-white"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
