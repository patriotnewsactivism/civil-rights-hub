import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  Bookmark,
  MessageSquare,
  Plus,
  Tag,
  Bell,
  BellRing,
  Flag,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";

type ThreadWithMeta = Database["public"]["Tables"]["forum_threads"]["Row"] & {
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  thread_tags: { id: string; tag: string }[];
};

type UserReactionSets = {
  upvotes: Set<string>;
  bookmarks: Set<string>;
  subscriptions: Map<string, string>;
};

type ReportDialogState = {
  open: boolean;
  threadId: string | null;
  reason: string;
};

const EMPTY_REACTIONS: UserReactionSets = {
  upvotes: new Set(),
  bookmarks: new Set(),
  subscriptions: new Map(),
};

export const DiscussionBoard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ThreadWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<UserReactionSets>(EMPTY_REACTIONS);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [reportDialog, setReportDialog] = useState<ReportDialogState>({ open: false, threadId: null, reason: "" });
  const [submittingReport, setSubmittingReport] = useState(false);

  const isAuthenticated = Boolean(user);

  const fetchUserReactions = useCallback(async (userId: string) => {
    const [upvotesResponse, bookmarksResponse, subscriptionsResponse] = await Promise.all([
      supabase.from("thread_upvotes").select("thread_id, id").eq("user_id", userId),
      supabase.from("thread_bookmarks").select("thread_id, id").eq("user_id", userId),
      supabase.from("thread_subscriptions").select("thread_id, id").eq("user_id", userId),
    ]);

    const upvoteSet = new Set((upvotesResponse.data ?? []).map((item) => item.thread_id));
    const bookmarkSet = new Set((bookmarksResponse.data ?? []).map((item) => item.thread_id));
    const subscriptionMap = new Map(
      (subscriptionsResponse.data ?? []).map((item) => [item.thread_id, item.id])
    );

    setReactions({ upvotes: upvoteSet, bookmarks: bookmarkSet, subscriptions: subscriptionMap });
  }, []);

  const fetchThreads = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("forum_threads")
      .select(
        `id, title, content, category, created_at, like_count, post_count, last_post_at, view_count, user_id,
         profiles:user_id (display_name, avatar_url),
         thread_tags (id, tag)
        `
      )
      .eq("is_deleted", false)
      .order("is_pinned", { ascending: false })
      .order("last_post_at", { ascending: false, nullsLast: true })
      .limit(20);

    if (error) {
      toast({
        title: "Unable to load discussions",
        description: error.message,
        variant: "destructive",
      });
      setThreads([]);
      setLoading(false);
      return;
    }

    const typedThreads = (data ?? []) as unknown as ThreadWithMeta[];
    setThreads(typedThreads);
    setLoading(false);

    if (user?.id) {
      await fetchUserReactions(user.id);
    } else {
      setReactions(EMPTY_REACTIONS);
    }
  }, [fetchUserReactions, toast, user?.id]);

  useEffect(() => {
    void fetchThreads();
  }, [fetchThreads]);

  const toggleUpvote = async (threadId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Create an account to support community threads.",
        variant: "destructive",
      });
      return;
    }

    const hasUpvoted = reactions.upvotes.has(threadId);

    if (hasUpvoted) {
      const { error } = await supabase
        .from("thread_upvotes")
        .delete()
        .eq("thread_id", threadId)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Unable to remove upvote",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Set(current.upvotes);
        updated.delete(threadId);
        return { ...current, upvotes: updated };
      });

      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, like_count: (thread.like_count ?? 1) - 1 }
            : thread
        )
      );
    } else {
      const { error } = await supabase
        .from("thread_upvotes")
        .insert({ thread_id: threadId, user_id: user.id });

      if (error) {
        toast({
          title: "Unable to upvote",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Set(current.upvotes);
        updated.add(threadId);
        return { ...current, upvotes: updated };
      });

      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, like_count: (thread.like_count ?? 0) + 1 }
            : thread
        )
      );
    }
  };

  const toggleBookmark = async (threadId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Save threads after creating a free account.",
        variant: "destructive",
      });
      return;
    }

    const hasBookmark = reactions.bookmarks.has(threadId);

    if (hasBookmark) {
      const { error } = await supabase
        .from("thread_bookmarks")
        .delete()
        .eq("thread_id", threadId)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Unable to remove bookmark",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Set(current.bookmarks);
        updated.delete(threadId);
        return { ...current, bookmarks: updated };
      });
    } else {
      const { error } = await supabase
        .from("thread_bookmarks")
        .insert({ thread_id: threadId, user_id: user.id });

      if (error) {
        toast({
          title: "Unable to bookmark",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Set(current.bookmarks);
        updated.add(threadId);
        return { ...current, bookmarks: updated };
      });
    }
  };

  const toggleSubscription = async (threadId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Subscribe to threads after signing in.",
        variant: "destructive",
      });
      return;
    }

    const subscriptionId = reactions.subscriptions.get(threadId);

    if (subscriptionId) {
      const { error } = await supabase
        .from("thread_subscriptions")
        .delete()
        .eq("id", subscriptionId)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Unable to unsubscribe",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Map(current.subscriptions);
        updated.delete(threadId);
        return { ...current, subscriptions: updated };
      });
    } else {
      const { data, error } = await supabase
        .from("thread_subscriptions")
        .insert({ thread_id: threadId, user_id: user.id })
        .select("id")
        .single();

      if (error) {
        toast({
          title: "Unable to subscribe",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setReactions((current) => {
        const updated = new Map(current.subscriptions);
        if (data?.id) {
          updated.set(threadId, data.id);
        }
        return { ...current, subscriptions: updated };
      });
    }
  };

  const handleAddTag = async (threadId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Log in to add collaborative tags.",
        variant: "destructive",
      });
      return;
    }

    const value = tagInputs[threadId]?.trim();
    if (!value) return;

    const normalized = value.replace(/^[#]+/, "").toLowerCase();

    const { data, error } = await supabase
      .from("thread_tags")
      .insert({ thread_id: threadId, tag: normalized })
      .select("id, tag")
      .single();

    if (error) {
      toast({
        title: "Unable to add tag",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? { ...thread, thread_tags: [...(thread.thread_tags ?? []), data] }
          : thread
      )
    );

    setTagInputs((state) => ({ ...state, [threadId]: "" }));
    toast({ title: "Tag added", description: `#${normalized} will help others find this thread.` });
  };

  const openReportDialog = (threadId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Report content after creating an account.",
        variant: "destructive",
      });
      return;
    }

    setReportDialog({ open: true, threadId, reason: "" });
  };

  const submitReport = async () => {
    if (!user?.id || !reportDialog.threadId) return;
    if (!reportDialog.reason.trim()) {
      toast({
        title: "Add details",
        description: "Let moderators know what needs review.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReport(true);

    const { error } = await supabase.from("content_reports").insert({
      reporter_id: user.id,
      content_type: "thread",
      content_id: reportDialog.threadId,
      reason: reportDialog.reason.trim(),
    });

    setSubmittingReport(false);

    if (error) {
      toast({
        title: "Unable to submit report",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report submitted",
      description: "Our moderation team will review this thread shortly.",
    });

    setReportDialog({ open: false, threadId: null, reason: "" });
  };

  const pinnedThreads = useMemo(() => threads.filter((thread) => thread.is_pinned), [threads]);
  const regularThreads = useMemo(() => threads.filter((thread) => !thread.is_pinned), [threads]);

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h2 className="text-2xl font-bold">Discussion Board</h2>
        <p className="text-sm text-muted-foreground">
          Swap legal strategies, coordinate rapid response teams, and support impacted communities in real time.
        </p>
      </header>

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-dashed p-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading community threads...
        </div>
      )}

      {!loading && pinnedThreads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <Tag className="h-4 w-4" /> Pinned by moderators
          </div>
          <div className="grid gap-4">
            {pinnedThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                isAuthenticated={isAuthenticated}
                reactions={reactions}
                tagInput={tagInputs[thread.id] ?? ""}
                onUpvote={toggleUpvote}
                onBookmark={toggleBookmark}
                onSubscribe={toggleSubscription}
                onAddTag={handleAddTag}
                onTagInputChange={(value) => setTagInputs((state) => ({ ...state, [thread.id]: value }))}
                onReport={openReportDialog}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && regularThreads.length > 0 && (
        <div className="grid gap-4">
          {regularThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isAuthenticated={isAuthenticated}
              reactions={reactions}
              tagInput={tagInputs[thread.id] ?? ""}
              onUpvote={toggleUpvote}
              onBookmark={toggleBookmark}
              onSubscribe={toggleSubscription}
              onAddTag={handleAddTag}
              onTagInputChange={(value) => setTagInputs((state) => ({ ...state, [thread.id]: value }))}
              onReport={openReportDialog}
            />
          ))}
        </div>
      )}

      {!loading && threads.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No discussions yet</CardTitle>
            <CardDescription>
              Be the first to start a thread! Share urgent news, upcoming actions, or legal support requests with the network.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {reportDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" /> Report thread
              </CardTitle>
              <CardDescription>Tell us what happened so moderators can review it quickly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe what's wrong or include timestamps for review."
                value={reportDialog.reason}
                onChange={(event) => setReportDialog((state) => ({ ...state, reason: event.target.value }))}
                className="min-h-[120px]"
              />
            </CardContent>
            <div className="flex items-center justify-end gap-2 border-t p-4">
              <Button variant="ghost" onClick={() => setReportDialog({ open: false, threadId: null, reason: "" })}>
                Cancel
              </Button>
              <Button onClick={() => void submitReport()} disabled={submittingReport || !reportDialog.reason.trim()}>
                {submittingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flag className="mr-2 h-4 w-4" />}
                Submit report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
};

interface ThreadCardProps {
  thread: ThreadWithMeta;
  isAuthenticated: boolean;
  reactions: UserReactionSets;
  tagInput: string;
  onUpvote: (threadId: string) => void;
  onBookmark: (threadId: string) => void;
  onSubscribe: (threadId: string) => void;
  onAddTag: (threadId: string) => void;
  onTagInputChange: (value: string) => void;
  onReport: (threadId: string) => void;
}

const ThreadCard = ({
  thread,
  isAuthenticated,
  reactions,
  tagInput,
  onUpvote,
  onBookmark,
  onSubscribe,
  onAddTag,
  onTagInputChange,
  onReport,
}: ThreadCardProps) => {
  const hasUpvoted = reactions.upvotes.has(thread.id);
  const hasBookmarked = reactions.bookmarks.has(thread.id);
  const hasSubscription = reactions.subscriptions.has(thread.id);

  const excerpt = useMemo(() => {
    if (!thread.content) return "";
    return thread.content.length > 280 ? `${thread.content.slice(0, 280)}…` : thread.content;
  }, [thread.content]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{thread.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span className="uppercase tracking-wide text-muted-foreground">{thread.category}</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
              </span>
              <span className="text-muted-foreground">· {thread.post_count ?? 0} replies</span>
              {thread.view_count !== null && <span className="text-muted-foreground">· {thread.view_count} views</span>}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={hasSubscription ? "default" : "outline"}
              size="sm"
              onClick={() => onSubscribe(thread.id)}
            >
              {hasSubscription ? <BellRing className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
              {hasSubscription ? "Subscribed" : "Subscribe"}
            </Button>
            <Button
              variant={hasBookmarked ? "default" : "outline"}
              size="icon"
              onClick={() => onBookmark(thread.id)}
              aria-label={hasBookmarked ? "Remove bookmark" : "Bookmark thread"}
            >
              <Bookmark className={`h-4 w-4 ${hasBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{excerpt}</p>

        {thread.thread_tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {thread.thread_tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                #{tag.tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Help the community discover this discussion by adding relevant tags.</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              value={tagInput}
              onChange={(event) => onTagInputChange(event.target.value)}
              placeholder="Add a tag"
              className="h-9 w-40"
              disabled={!isAuthenticated}
            />
            <Button size="sm" variant="secondary" onClick={() => onAddTag(thread.id)} disabled={!isAuthenticated || !tagInput.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add tag
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onReport(thread.id)} className="text-destructive">
            <Flag className="mr-2 h-4 w-4" /> Report
          </Button>
        </div>
      </CardContent>
      <div className="flex items-center justify-between border-t px-6 py-4">
        <Button
          variant={hasUpvoted ? "default" : "outline"}
          size="sm"
          onClick={() => onUpvote(thread.id)}
          className="font-semibold"
        >
          <ArrowUp className="mr-2 h-4 w-4" /> {hasUpvoted ? "Upvoted" : "Upvote"}
          <span className="ml-2 rounded bg-background px-2 py-0.5 text-xs font-medium">{thread.like_count ?? 0}</span>
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" /> {thread.post_count ?? 0} responses
        </div>
      </div>
    </Card>
  );
};
