import { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, Search, Filter, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function UserNetwork() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [filterRole, currentUser]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setCurrentUser({ ...user, ...profile });

      // Load following list
      const { data: connections } = await supabase
        .from('user_connections')
        .select('following_id')
        .eq('follower_id', user.id);

      setFollowing(connections?.map(c => c.following_id) || []);
    }
  };

  const loadUsers = async () => {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', currentUser?.id || '')
        .order('posts_created', { ascending: false })
        .limit(50);

      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId: string) => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      if (following.includes(userId)) {
        await supabase
          .from('user_connections')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);

        setFollowing(following.filter(id => id !== userId));
        toast.success('Unfollowed');
      } else {
        await supabase
          .from('user_connections')
          .insert({
            follower_id: currentUser.id,
            following_id: userId,
          });

        setFollowing([...following, userId]);
        toast.success('Following');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      admin: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Admin', icon: '👑' },
      moderator: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Moderator', icon: '🛡️' },
      attorney: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Civil Rights Attorney', icon: '⚖️' },
      journalist: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Journalist', icon: '📰' },
      activist: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Activist', icon: '✊' },
      user: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Member', icon: '👤' },
    };

    const badge = badges[role] || badges.user;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getContributorLevel = (user: any) => {
    const totalActivity = (user.posts_created || 0) + (user.helpful_answers || 0) + (user.threads_created || 0);

    if (totalActivity >= 100) return { level: 'Elite', color: 'text-purple-600', icon: '👑' };
    if (totalActivity >= 50) return { level: 'Expert', color: 'text-blue-600', icon: '⭐' };
    if (totalActivity >= 25) return { level: 'Active', color: 'text-green-600', icon: '🌟' };
    if (totalActivity >= 10) return { level: 'Regular', color: 'text-yellow-600', icon: '✨' };
    return { level: 'New', color: 'text-gray-600', icon: '🌱' };
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.display_name?.toLowerCase().includes(searchLower) ||
      user.bio?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
            <Users className="h-10 w-10 mr-3 text-primary" />
            Discover the Network
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with journalists, activists, and civil rights advocates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, or bio..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="journalist">Journalists</option>
                <option value="activist">Activists</option>
                <option value="attorney">Attorneys</option>
                <option value="moderator">Moderators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-card rounded-xl shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No users found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const isFollowing = following.includes(user.user_id);
              const contributorLevel = getContributorLevel(user);
              const totalActivity = (user.posts_created || 0) + (user.helpful_answers || 0) + (user.threads_created || 0);

              return (
                <div
                  key={user.user_id}
                  className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all p-6 animate-fade-in-up"
                >
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.display_name || user.username} className="rounded-full w-full h-full object-cover" />
                        ) : (
                          (user.display_name || user.username)[0]?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground flex items-center space-x-1">
                          <span>{user.display_name || user.username}</span>
                          {user.is_verified && (
                            <Award className="h-4 w-4 text-primary" title="Verified" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-3">
                    {getRoleBadge(user.role || 'user')}
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-foreground mb-4 line-clamp-2">{user.bio}</p>
                  )}

                  {/* Contributor Level */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contributor Level</div>
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

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-lg text-foreground">{user.posts_created || 0}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-foreground">{user.threads_created || 0}</div>
                      <div className="text-xs text-muted-foreground">Threads</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-foreground">{user.helpful_answers || 0}</div>
                      <div className="text-xs text-muted-foreground">Helpful</div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {currentUser && currentUser.id !== user.user_id && (
                    <button
                      onClick={() => toggleFollow(user.user_id)}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                        isFollowing
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : 'bg-gradient-primary text-white hover:shadow-lg'
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
    </div>
  );
}
