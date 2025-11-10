import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Eye, MessageCircle, Clock, Loader2, Plus, Pin, Heart, Bookmark, Flag, Bell, BellOff, Hash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface ForumThread {
  id: string;
  user_id: string | null;
  username: string | null;
  title: string;
  content: string;
  category: string;
  view_count: number;
  post_count: number;
  like_count: number;
  last_post_at: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
}

const CATEGORIES = [
  "General Discussion",
  "Legal Questions",
  "Know Your Rights",
  "Organizing",
  "Resources",
  "News & Updates"
];

export const DiscussionBoard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // New thread form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("General Discussion");
  const [newUsername, setNewUsername] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User engagement state
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const [userBookmarks, setUserBookmarks] = useState<Set<string>>(new Set());
  const [userSubscriptions, setUserSubscriptions] = useState<Set<string>>(new Set());
  const [threadTags, setThreadTags] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory]);

  useEffect(() => {
    if (user) {
      fetchUserEngagement();
    }
  }, [user]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("forum_threads")
        .select("*")
        .eq("is_deleted", false)
        .order("is_pinned", { ascending: false })
        .order("last_post_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search query if present
      let filteredData = data || [];
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (thread) =>
            thread.title.toLowerCase().includes(lowerQuery) ||
            thread.content.toLowerCase().includes(lowerQuery)
        );
      }

      setThreads(filteredData);

      // Fetch tags for all threads
      if (filteredData.length > 0) {
        fetchThreadTags(filteredData.map(t => t.id));
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
      toast({
        title: "Failed to load discussions",
        description: "Unable to fetch forum threads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchThreadTags = async (threadIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from("thread_tags")
        .select("thread_id, tag")
        .in("thread_id", threadIds);

      if (error) throw error;

      const tagsMap = new Map<string, string[]>();
      data?.forEach(({ thread_id, tag }) => {
        if (!tagsMap.has(thread_id)) {
          tagsMap.set(thread_id, []);
        }
        tagsMap.get(thread_id)!.push(tag);
      });
      setThreadTags(tagsMap);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchUserEngagement = async () => {
    if (!user) return;

    try {
      // Fetch upvotes
      const { data: upvotes } = await supabase
        .from("thread_upvotes")
        .select("thread_id")
        .eq("user_id", user.id);

      if (upvotes) {
        setUserUpvotes(new Set(upvotes.map(u => u.thread_id)));
      }

      // Fetch bookmarks
      const { data: bookmarks } = await supabase
        .from("thread_bookmarks")
        .select("thread_id")
        .eq("user_id", user.id);

      if (bookmarks) {
        setUserBookmarks(new Set(bookmarks.map(b => b.thread_id)));
      }

      // Fetch subscriptions
      const { data: subscriptions } = await supabase
        .from("thread_subscriptions")
        .select("thread_id")
        .eq("user_id", user.id);

      if (subscriptions) {
        setUserSubscriptions(new Set(subscriptions.map(s => s.thread_id)));
      }
    } catch (error) {
      console.error("Error fetching user engagement:", error);
    }
  };

  const handleSearch = () => {
    fetchThreads();
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const tag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (!newTags.includes(tag)) {
      setNewTags([...newTags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setNewTags(newTags.filter(t => t !== tag));
  };

  const toggleUpvote = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upvote threads.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasUpvoted = userUpvotes.has(threadId);

      if (hasUpvoted) {
        // Remove upvote
        await supabase
          .from("thread_upvotes")
          .delete()
          .eq("thread_id", threadId)
          .eq("user_id", user.id);

        setUserUpvotes(prev => {
          const next = new Set(prev);
          next.delete(threadId);
          return next;
        });

        // Update local thread count
        setThreads(threads.map(t =>
          t.id === threadId ? { ...t, like_count: t.like_count - 1 } : t
        ));
      } else {
        // Add upvote
        await supabase
          .from("thread_upvotes")
          .insert({ thread_id: threadId, user_id: user.id });

        setUserUpvotes(prev => new Set(prev).add(threadId));

        // Update local thread count
        setThreads(threads.map(t =>
          t.id === threadId ? { ...t, like_count: t.like_count + 1 } : t
        ));
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      toast({
        title: "Failed to upvote",
        description: "Unable to update upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleBookmark = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark threads.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasBookmarked = userBookmarks.has(threadId);

      if (hasBookmarked) {
        await supabase
          .from("thread_bookmarks")
          .delete()
          .eq("thread_id", threadId)
          .eq("user_id", user.id);

        setUserBookmarks(prev => {
          const next = new Set(prev);
          next.delete(threadId);
          return next;
        });

        toast({
          title: "Bookmark removed",
          description: "Thread removed from your bookmarks.",
        });
      } else {
        await supabase
          .from("thread_bookmarks")
          .insert({ thread_id: threadId, user_id: user.id });

        setUserBookmarks(prev => new Set(prev).add(threadId));

        toast({
          title: "Thread bookmarked",
          description: "Thread added to your bookmarks.",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Failed to bookmark",
        description: "Unable to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSubscription = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to threads.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isSubscribed = userSubscriptions.has(threadId);

      if (isSubscribed) {
        await supabase
          .from("thread_subscriptions")
          .delete()
          .eq("thread_id", threadId)
          .eq("user_id", user.id);

        setUserSubscriptions(prev => {
          const next = new Set(prev);
          next.delete(threadId);
          return next;
        });

        toast({
          title: "Unsubscribed",
          description: "You will no longer receive notifications for this thread.",
        });
      } else {
        await supabase
          .from("thread_subscriptions")
          .insert({ thread_id: threadId, user_id: user.id, email_notifications: true });

        setUserSubscriptions(prev => new Set(prev).add(threadId));

        toast({
          title: "Subscribed",
          description: "You will receive notifications for new posts.",
        });
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast({
        title: "Failed to subscribe",
        description: "Unable to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const reportThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to report content.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from("content_reports")
        .insert({
          content_type: 'thread',
          content_id: threadId,
          reported_by: user.id,
          reason: 'user_report',
        });

      toast({
        title: "Content reported",
        description: "Thank you for helping keep our community safe.",
      });
    } catch (error) {
      console.error("Error reporting thread:", error);
      toast({
        title: "Failed to report",
        description: "Unable to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: newThread, error } = await supabase
        .from("forum_threads")
        .insert({
          user_id: user?.id || null,
          username: newUsername.trim() || user?.email || "Anonymous",
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags if any
      if (newTags.length > 0 && newThread) {
        const tagInserts = newTags.map(tag => ({
          thread_id: newThread.id,
          tag: tag,
        }));

        await supabase.from("thread_tags").insert(tagInserts);
      }

      toast({
        title: "Thread created",
        description: "Your discussion thread has been posted.",
      });

      // Reset form
      setNewTitle("");
      setNewContent("");
      setNewUsername("");
      setNewCategory("General Discussion");
      setNewTags([]);
      setTagInput("");
      setIsCreateDialogOpen(false);

      // Refresh threads
      fetchThreads();
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "Failed to create thread",
        description: "Unable to post your discussion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementViewCount = async (threadId: string) => {
    // Increment view count when thread is clicked
    await supabase.rpc("increment_thread_views", { thread_id: threadId });
  };

  return (
    <section id="discussion-board" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Discussion Board
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with others, share experiences, ask questions, and discuss civil rights issues.
            Build community solidarity through dialogue.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search & Filters */}
          <Card className="shadow-strong">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Discussions
                  </CardTitle>
                  <CardDescription>Browse and join community conversations</CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Thread
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Start a New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your thoughts, ask questions, or start a conversation with the community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="thread-title">Title *</Label>
                        <Input
                          id="thread-title"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Brief, descriptive title for your thread"
                        />
                      </div>

                      <div>
                        <Label htmlFor="thread-category">Category *</Label>
                        <Select value={newCategory} onValueChange={setNewCategory}>
                          <SelectTrigger id="thread-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="thread-content">Content *</Label>
                        <Textarea
                          id="thread-content"
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Describe your question or topic in detail..."
                          className="min-h-[150px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="thread-username">Display Name (Optional)</Label>
                        <Input
                          id="thread-username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Leave blank for 'Anonymous'"
                        />
                      </div>

                      <div>
                        <Label htmlFor="thread-tags">Tags (Optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="thread-tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            placeholder="Add tags (e.g., police, protest, legal)"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddTag}
                            disabled={!tagInput.trim()}
                          >
                            <Hash className="h-4 w-4" />
                          </Button>
                        </div>
                        {newTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newTags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="gap-1">
                                #{tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:bg-destructive/20 rounded-full"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateThread} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            "Create Thread"
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Thread List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory
                    ? "No discussions found matching your criteria."
                    : "No discussions yet. Be the first to start a conversation!"}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start a Discussion
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {threads.length} {threads.length === 1 ? "discussion" : "discussions"}
              </p>

              {threads.map((thread) => (
                <Card
                  key={thread.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    incrementViewCount(thread.id);
                    // In a real app, this would navigate to thread detail page
                    toast({
                      title: "Thread View",
                      description: "Full thread view would open here. (Not implemented in this demo)",
                    });
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          {thread.is_pinned && (
                            <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1 hover:text-primary transition-colors">
                              {thread.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge>{thread.category}</Badge>
                              {thread.is_locked && (
                                <Badge variant="destructive" className="text-xs">
                                  Locked
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                by {thread.username || "Anonymous"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {thread.content}
                            </p>
                            {/* Tags */}
                            {threadTags.has(thread.id) && threadTags.get(thread.id)!.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {threadTags.get(thread.id)!.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Engagement Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant={userUpvotes.has(thread.id) ? "default" : "ghost"}
                            onClick={(e) => toggleUpvote(thread.id, e)}
                            className="h-8"
                          >
                            <Heart className={`h-4 w-4 mr-1 ${userUpvotes.has(thread.id) ? 'fill-current' : ''}`} />
                            <span>{thread.like_count || 0}</span>
                          </Button>

                          <Button
                            size="sm"
                            variant={userBookmarks.has(thread.id) ? "default" : "ghost"}
                            onClick={(e) => toggleBookmark(thread.id, e)}
                            className="h-8"
                          >
                            <Bookmark className={`h-4 w-4 ${userBookmarks.has(thread.id) ? 'fill-current' : ''}`} />
                          </Button>

                          <Button
                            size="sm"
                            variant={userSubscriptions.has(thread.id) ? "default" : "ghost"}
                            onClick={(e) => toggleSubscription(thread.id, e)}
                            className="h-8"
                          >
                            {userSubscriptions.has(thread.id) ? (
                              <Bell className="h-4 w-4 fill-current" />
                            ) : (
                              <BellOff className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => reportThread(thread.id, e)}
                            className="h-8"
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{thread.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{thread.post_count}</span>
                        </div>
                        {thread.last_post_at && (
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(thread.last_post_at), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Community Guidelines */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-2">Community Guidelines</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Be respectful and constructive in all discussions</li>
                <li>Share accurate information and cite sources when possible</li>
                <li>Protect privacy - never share personal identifying information</li>
                <li>Report content that violates guidelines or contains harmful information</li>
                <li>This is a space for education and mutual support, not legal advice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
