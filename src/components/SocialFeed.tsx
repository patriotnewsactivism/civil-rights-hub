import { ChangeEvent, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ExternalShareButtons } from "@/components/social/ExternalShareButtons";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Hash,
  Shield,
  ImageIcon,
  FileText,
  X,
  Send,
  Link2,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserMentions } from "./community/UserMentions";
import { PollCreator } from "./social/PollCreator";
import { PollDisplay } from "./social/PollDisplay";
import { ReactionPicker } from "./social/ReactionPicker";
import { ThreadedComments } from "./social/ThreadedComments";
import { BarChart2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_urls: string[] | null;
  media_types: string[] | null;
  poll_data?: PollData | null;
}

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_verified: boolean | null;
}

interface Like {
  id: string;
  user_id: string;
}

interface ReactionRecord {
  id: string;
  user_id: string;
  reaction_type: string;
}

interface ReactionSummary {
  type: string;
  count: number;
  users: string[];
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  profile: { display_name: string; avatar_url: string | null };
}

interface PollData {
  id: string;
  question: string;
  options: { id: string; text: string; voteCount: number }[];
  endsAt?: string;
  allowMultiple: boolean;
  totalVotes: number;
}

interface PostWithDetails extends Post {
  profile: UserProfile | null;
  likes: Like[];
  reactions: ReactionRecord[];
  reactionSummary: ReactionSummary[];
  currentUserReaction: string | null;
  comments: Comment[];
  hashtags: string[];
  isBookmarked: boolean;
  shareCount: number;
  userVotes?: string[];
}

interface PostCardProps {
  post: PostWithDetails;
  currentUserId: string | null;
  onReact: (postId: string, reactionType: string) => Promise<void>;
  onRemoveReaction: (postId: string) => Promise<void>;
  onShare: (postId: string) => void;
  onPollVote: (optionIds: string[]) => void;
  onHashtagClick: (tag: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => Promise<void>;
  onAddComment: (content?: string, parentId?: string) => Promise<void>;
  isExpanded: boolean;
  onToggleComments: () => void;
}

function extractHashtags(content: string): string[] {
  const matches = content.match(/#[\w]+/g);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
}

const renderContentWithEntities = (content: string, onHashtagClick: (tag: string) => void) => {
  const parts = content.split(/((?:#|@)[\w]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return (
        <button
          key={index}
          onClick={() => onHashtagClick(part.toLowerCase())}
          className="text-primary hover:text-accent transition-colors font-semibold"
        >
          {part}
        </button>
      );
    }
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-primary/70 hover:text-primary transition-colors font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
};

export function SocialFeed() {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [newPost, setNewPost] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewPost(val);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPosition);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.slice(1));
      
      if (textareaRef.current) {
        // Simple positioning relative to the textarea
        setMentionPos({ 
          top: 160, // approximate position below the textarea top
          left: 24
        });
      }
    } else {
      setMentionQuery(null);
    }
  };

  const handleMentionSelect = (displayName: string) => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = newPost.slice(0, cursorPosition);
    const textAfterCursor = newPost.slice(cursorPosition);
    
    const words = textBeforeCursor.split(/\s/);
    words[words.length - 1] = `@${displayName}`;
    
    const newContent = words.join(" ") + " " + textAfterCursor;
    setNewPost(newContent);
    setMentionQuery(null);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = words.join(" ").length + 1;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"foryou" | "following" | "popular">("foryou");
  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(new Set());
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [shareComment, setShareComment] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pendingPoll, setPendingPoll] = useState<{
    question: string;
    options: string[];
    endsAt?: Date;
    allowMultiple: boolean;
  } | null>(null);

  const fetchPosts = useCallback(async () => {
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, content, user_id, created_at, media_urls, media_types, poll_data")
      .order("created_at", { ascending: false })
      .limit(100);

    if (postsError) {
      toast.error("Failed to load posts");
      setPosts([]);
      return;
    }

    const typedPosts = (postsData ?? []) as Post[];
    
    if (typedPosts.length === 0) {
      setPosts([]);
      return;
    }

    const userIds = [...new Set(typedPosts.map((p) => p.user_id))];
    const postIds = typedPosts.map((p) => p.id);

    const { data: profilesData } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, avatar_url, role, is_verified")
      .in("user_id", userIds);

    const profileMap = new Map((profilesData ?? []).map((p) => [p.user_id, p as UserProfile]));

    const { data: likesData } = await supabase
      .from("likes")
      .select("id, user_id, post_id")
      .in("post_id", postIds);

    const likesMap = new Map<string, Like[]>();
    (likesData ?? []).forEach((like) => {
      const existing = likesMap.get(like.post_id) ?? [];
      existing.push({ id: like.id, user_id: like.user_id });
      likesMap.set(like.post_id, existing);
    });

    // Fetch full reactions from post_reactions table
    const reactionsMap = new Map<string, ReactionRecord[]>();
    try {
      const { data: reactionsData } = await supabase
        .from("post_reactions")
        .select("id, user_id, post_id, reaction_type")
        .in("post_id", postIds);
      (reactionsData ?? []).forEach((r: { id: string; user_id: string; post_id: string; reaction_type: string }) => {
        const existing = reactionsMap.get(r.post_id) ?? [];
        existing.push({ id: r.id, user_id: r.user_id, reaction_type: r.reaction_type });
        reactionsMap.set(r.post_id, existing);
      });
    } catch {
      // post_reactions table not yet migrated — fall back to likes only
    }

    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, content, user_id, post_id, parent_comment_id, created_at")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    const commentUserIds = [...new Set((commentsData ?? []).map((c) => c.user_id))];
    const { data: commentProfilesData } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", commentUserIds);

    const commentProfileMap = new Map((commentProfilesData ?? []).map((p) => [p.user_id, p as UserProfile]));

    const commentsMap = new Map<string, Comment[]>();
    (commentsData ?? []).forEach((comment) => {
      const existing = commentsMap.get(comment.post_id) ?? [];
      const profile = commentProfileMap.get(comment.user_id);
      existing.push({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        parent_comment_id: comment.parent_comment_id ?? null,
        created_at: comment.created_at ?? new Date().toISOString(),
        profile: {
          display_name: profile?.display_name ?? "Anonymous",
          avatar_url: profile?.avatar_url ?? null,
        },
      });
      commentsMap.set(comment.post_id, existing);
    });

    let bookmarkedPostIds = new Set<string>();
    if (currentUserId) {
      const { data: bookmarksData } = await supabase
        .from("post_bookmarks")
        .select("post_id")
        .eq("user_id", currentUserId);
      bookmarkedPostIds = new Set((bookmarksData ?? []).map((b) => b.post_id));
      setBookmarks(bookmarkedPostIds);
    }

    const { data: sharesData } = await supabase
      .from("post_shares")
      .select("post_id")
      .in("post_id", postIds);

    const sharesMap = new Map<string, number>();
    (sharesData ?? []).forEach((share) => {
      sharesMap.set(share.post_id, (sharesMap.get(share.post_id) ?? 0) + 1);
    });

    // Load user's poll votes (graceful – table may not exist yet)
    const userVotesMap = new Map<string, string[]>();
    if (currentUserId) {
      try {
        const { data: pollVotesData, error: pvErr } = await supabase
          .from("poll_votes")
          .select("post_id, option_id")
          .eq("user_id", currentUserId)
          .in("post_id", postIds);
        if (!pvErr) {
          (pollVotesData ?? []).forEach((vote) => {
            const existing = userVotesMap.get(vote.post_id) ?? [];
            existing.push(vote.option_id);
            userVotesMap.set(vote.post_id, existing);
          });
        }
      } catch {
        // poll_votes table not yet migrated
      }
    }

    const postsWithDetails: PostWithDetails[] = typedPosts.map((post) => {
      const postReactions = reactionsMap.get(post.id) ?? [];
      // Build reaction summary grouped by type
      const reactionsByType = new Map<string, { count: number; users: string[] }>();
      postReactions.forEach((r) => {
        const existing = reactionsByType.get(r.reaction_type) ?? { count: 0, users: [] };
        existing.count++;
        existing.users.push(r.user_id);
        reactionsByType.set(r.reaction_type, existing);
      });
      const reactionSummary: ReactionSummary[] = Array.from(reactionsByType.entries()).map(
        ([type, data]) => ({ type, count: data.count, users: data.users })
      );
      // Find current user's reaction
      const currentUserReaction = currentUserId
        ? (postReactions.find((r) => r.user_id === currentUserId)?.reaction_type ?? null)
        : null;

      return {
        ...post,
        profile: profileMap.get(post.user_id) ?? null,
        likes: likesMap.get(post.id) ?? [],
        reactions: postReactions,
        reactionSummary,
        currentUserReaction,
        comments: commentsMap.get(post.id) ?? [],
        hashtags: extractHashtags(post.content),
        isBookmarked: bookmarkedPostIds.has(post.id),
        shareCount: sharesMap.get(post.id) ?? 0,
        userVotes: userVotesMap.get(post.id),
      };
    });

    setPosts(postsWithDetails);
  }, [currentUserId]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setMediaFiles((current) => [...current, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  const uploadMedia = useCallback(
    async (files: File[], userId: string) => {
      const mediaUrls: string[] = [];
      const mediaTypes: string[] = [];

      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("posts").getPublicUrl(filePath);
        mediaUrls.push(publicUrlData.publicUrl);
        mediaTypes.push(file.type);
      }

      return { mediaUrls, mediaTypes };
    },
    []
  );

  const createPost = useCallback(async () => {
    if (!currentUserId) {
      toast.error("Sign in to share updates");
      return;
    }

    if (!newPost.trim() && mediaFiles.length === 0) return;

    setUploading(true);

    try {
      const { mediaUrls, mediaTypes } = await uploadMedia(mediaFiles, currentUserId);

      const pollData = pendingPoll
        ? {
            id: crypto.randomUUID(),
            question: pendingPoll.question,
            options: pendingPoll.options.map((text) => ({
              id: crypto.randomUUID(),
              text,
              voteCount: 0,
            })),
            endsAt: pendingPoll.endsAt?.toISOString(),
            allowMultiple: pendingPoll.allowMultiple,
            totalVotes: 0,
          }
        : null;

      const { error } = await supabase.from("posts").insert({
        content: newPost,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_types: mediaTypes.length > 0 ? mediaTypes : null,
        user_id: currentUserId,
        ...(pollData ? { poll_data: pollData } : {}),
      });

      if (error) throw error;

      setNewPost("");
      setMediaFiles([]);
      setPendingPoll(null);
      setShowPollCreator(false);
      toast.success("Post broadcasted!");
      await fetchPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create post";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, [currentUserId, fetchPosts, mediaFiles, newPost, pendingPoll, uploadMedia]);

  const toggleReaction = useCallback(
    async (postId: string, reactionType: string) => {
      if (!currentUserId) {
        toast.error("Sign in to react");
        return;
      }

      const targetPost = posts.find((post) => post.id === postId);
      if (!targetPost) return;

      // Remove existing reaction if any (swap or toggle)
      const existingReaction = targetPost.reactions.find((r) => r.user_id === currentUserId);
      if (existingReaction) {
        await supabase.from("post_reactions").delete().eq("id", existingReaction.id);
        // Also remove from legacy likes table for consistency
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", currentUserId);
      }

      // If clicking the same reaction, it's a toggle-off — don't insert
      if (existingReaction?.reaction_type === reactionType) {
        await fetchPosts();
        return;
      }

      // Insert new reaction
      const { error } = await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: currentUserId,
        reaction_type: reactionType,
      } as Record<string, unknown>);
      if (error) {
        toast.error("Failed to react");
        return;
      }

      // Also insert into legacy likes table if it's a "like" (backward compat)
      if (reactionType === "like") {
        await supabase.from("likes").insert({ post_id: postId, user_id: currentUserId });
      }

      await fetchPosts();
    },
    [currentUserId, fetchPosts, posts]
  );

  const removeReaction = useCallback(
    async (postId: string) => {
      if (!currentUserId) return;
      const targetPost = posts.find((post) => post.id === postId);
      if (!targetPost) return;

      const existingReaction = targetPost.reactions.find((r) => r.user_id === currentUserId);
      if (existingReaction) {
        await supabase.from("post_reactions").delete().eq("id", existingReaction.id);
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", currentUserId);
      }
      await fetchPosts();
    },
    [currentUserId, fetchPosts, posts]
  );

  const addComment = useCallback(async (postId: string, content?: string, parentId?: string) => {
    if (!currentUserId) {
      toast.error("Sign in to comment");
      return;
    }

    const body = content ?? newComment[postId]?.trim();
    if (!body) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      content: body,
      ...(parentId ? { parent_comment_id: parentId } : {}),
    });

    if (error) {
      toast.error("Failed to add comment");
      return;
    }

    if (!content) setNewComment(prev => ({ ...prev, [postId]: "" }));
    await fetchPosts();
  }, [currentUserId, newComment, fetchPosts]);

  const handlePollVote = useCallback(async (postId: string, optionIds: string[]) => {
    if (!currentUserId) {
      toast.error("Sign in to vote");
      return;
    }
    const post = posts.find((p) => p.id === postId);
    if (!post?.poll_data) return;

    // Update vote counts in poll_data JSONB and record user vote
    const updatedOptions = post.poll_data.options.map((opt) => ({
      ...opt,
      voteCount: optionIds.includes(opt.id) ? opt.voteCount + 1 : opt.voteCount,
    }));
    const updatedPoll = {
      ...post.poll_data,
      options: updatedOptions,
      totalVotes: post.poll_data.totalVotes + 1,
    };

    await supabase
      .from("posts")
      .update({ poll_data: updatedPoll } as unknown as Record<string, unknown>)
      .eq("id", postId);

    // Record user votes in poll_votes table (graceful)
    try {
      await supabase.from("poll_votes").upsert(
        optionIds.map((optId) => ({ post_id: postId, user_id: currentUserId, option_id: optId }))
      );
    } catch { /* poll_votes table not yet migrated */ }

    await fetchPosts();
  }, [currentUserId, fetchPosts, posts]);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const toggleBookmark = useCallback(async (postId: string) => {
    if (!currentUserId) {
      toast.error("Sign in to bookmark");
      return;
    }

    const isBookmarked = bookmarks.has(postId);

    if (isBookmarked) {
      await supabase.from("post_bookmarks").delete().eq("user_id", currentUserId).eq("post_id", postId);
      setBookmarks(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    } else {
      await supabase.from("post_bookmarks").insert({ user_id: currentUserId, post_id: postId });
      setBookmarks(prev => new Set([...prev, postId]));
    }
  }, [currentUserId, bookmarks]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setCurrentUserId(uid);
      if (uid) {
        supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", uid)
          .then(({ data: followData }) => {
            setFollowingUserIds(new Set((followData ?? []).map((f) => f.following_id)));
          });
      }
    });
  }, []);

  useEffect(() => {
    void fetchPosts();
    const channel = supabase.channel("social-feed-stream").on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => fetchPosts()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const trendingHashtags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    posts.forEach(post => {
      post.hashtags.forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
    });
    return Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const displayedPosts = useMemo(() => {
    let filtered = posts;
    if (activeTab === "following") {
      filtered = filtered.filter(post => followingUserIds.has(post.user_id));
    } else if (activeTab === "popular") {
      filtered = [...filtered].sort((a, b) => (b.reactions.length + b.likes.length + b.comments.length) - (a.reactions.length + a.likes.length + a.comments.length));
    }
    if (selectedHashtag) {
      filtered = filtered.filter(post => post.hashtags.includes(selectedHashtag.toLowerCase()));
    }
    return filtered;
  }, [posts, selectedHashtag, activeTab, followingUserIds]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search & Trending Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search movement hashtags..." 
            className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
            value={selectedHashtag || ""}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (!val) {
                setSelectedHashtag(null);
              } else {
                setSelectedHashtag(val.startsWith('#') ? val : `#${val}`);
              }
            }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {trendingHashtags.map(({ tag }) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className={`cursor-pointer hover:bg-primary hover:text-white transition-all whitespace-nowrap ${selectedHashtag === tag ? 'bg-primary text-white' : 'bg-background/50'}`}
              onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-border">
        {([
          { key: "foryou", label: "For You" },
          { key: "following", label: "Following" },
          { key: "popular", label: "Popular" },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Post Composer */}
      {currentUserId && (
        <Card className="glass-panel border-none shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/10 px-6 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Shield className="h-4 w-4" />
                New Intelligence Report
              </div>
              <Badge variant="outline" className="text-[10px] opacity-70">ENCRYPTED END-TO-END</Badge>
            </div>
            <div className="p-6 space-y-4 relative">
              <Textarea
                ref={textareaRef}
                placeholder="Document a violation, share a resource, or organize..."
                value={newPost}
                onChange={handlePostChange}
                className="bg-transparent border-none focus-visible:ring-0 text-lg min-h-[120px] p-0 placeholder:text-muted-foreground/50"
              />
              
              {mentionQuery !== null && (
                <UserMentions 
                  query={mentionQuery} 
                  onSelect={handleMentionSelect}
                  className="absolute"
                  style={{ top: mentionPos.top, left: mentionPos.left }}
                />
              )}
              
              {mediaFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="h-20 w-20 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                        ) : <FileText className="h-8 w-8 text-primary" />}
                      </div>
                      <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Poll Creator */}
              {showPollCreator && (
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                  <PollCreator
                    onPollCreate={(poll) => { setPendingPoll(poll); setShowPollCreator(false); }}
                    onCancel={() => setShowPollCreator(false)}
                  />
                </div>
              )}

              {/* Pending poll preview */}
              {pendingPoll && !showPollCreator && (
                <div className="border border-primary/20 rounded-xl p-3 bg-primary/5 flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">📊 Poll: {pendingPoll.question}</span>
                  <button onClick={() => setPendingPoll(null)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => document.getElementById("media-upload")?.click()} className="text-muted-foreground hover:text-primary">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Evidence
                  </Button>
                  <input type="file" id="media-upload" className="hidden" onChange={handleFileSelect} multiple accept="image/*,video/*,audio/*,application/pdf" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPollCreator(!showPollCreator)}
                    className={`text-muted-foreground hover:text-primary ${showPollCreator ? "text-primary" : ""}`}
                  >
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Poll
                  </Button>
                </div>
                <Button onClick={createPost} disabled={uploading || (!newPost.trim() && mediaFiles.length === 0 && !pendingPoll)} className="rounded-full px-8 shadow-lg shadow-primary/20">
                  {uploading ? "Uploading..." : "Broadcast"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {displayedPosts.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {currentUserId
                  ? "Be the first to broadcast an update. Document violations, share resources, or organize with the community."
                  : "Sign in to see community posts and share updates with the movement."}
              </p>
            </CardContent>
          </Card>
        )}
        {displayedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onReact={toggleReaction}
            onRemoveReaction={removeReaction}
            onShare={(postId) => { setSharePostId(postId); setShareDialogOpen(true); }}
            onPollVote={(optionIds) => handlePollVote(post.id, optionIds)}
            onHashtagClick={(tag) => setSelectedHashtag(tag)}
            isBookmarked={bookmarks.has(post.id)}
            onToggleBookmark={toggleBookmark}
            onAddComment={(content, parentId) => addComment(post.id, content, parentId)}
            isExpanded={expandedComments.has(post.id)}
            onToggleComments={() => toggleComments(post.id)}
          />
        ))}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment to your share..."
              value={shareComment}
              onChange={(e) => setShareComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
              <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {typeof window !== "undefined" ? `${window.location.origin}/community?post=${sharePostId}` : ""}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto shrink-0 h-7 px-2"
                onClick={() => {
                  const url = `${window.location.origin}/community?post=${sharePostId}`;
                  if (navigator.share) {
                    navigator.share({ title: "Civil Rights Hub", url }).catch(() => navigator.clipboard.writeText(url));
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
              >
                {copiedLink ? <Check className="h-3 w-3 text-green-500" /> : <Link2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <ExternalShareButtons
            url={typeof window !== "undefined" ? `${window.location.origin}/community?post=${sharePostId}` : ""}
            title="Civil Rights Hub"
            text="Check this out on Civil Rights Hub — a free platform for civil rights advocacy"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!currentUserId || !sharePostId) { setShareDialogOpen(false); return; }
                await supabase.from("post_shares").insert({ post_id: sharePostId, user_id: currentUserId });
                toast.success("Post shared!");
                setShareDialogOpen(false);
                setShareComment("");
                await fetchPosts();
              }}
            >
              Share in Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  journalist: { label: "Journalist", className: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" },
  attorney: { label: "Attorney", className: "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30" },
  activist: { label: "Activist", className: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" },
  moderator: { label: "Moderator", className: "bg-green-500/20 text-green-400 hover:bg-green-500/30" },
  admin: { label: "Admin", className: "bg-red-500/20 text-red-400 hover:bg-red-500/30" },
};

function PostCard({ post, currentUserId, onReact, onRemoveReaction, onShare, onPollVote, onHashtagClick, isBookmarked, onToggleBookmark, onAddComment, isExpanded, onToggleComments }: PostCardProps) {
  // Use full reaction data if available, fall back to likes for backward compat
  const hasReactions = post.reactionSummary.length > 0;
  const displayReactions = hasReactions
    ? post.reactionSummary
    : (post.likes.length > 0
        ? [{ type: "like", count: post.likes.length, users: post.likes.map((l) => l.user_id) }]
        : []);
  const currentReaction = post.currentUserReaction
    ?? (post.likes.some((l) => l.user_id === currentUserId) ? "like" : null);
  const isPollExpired = post.poll_data?.endsAt ? new Date(post.poll_data.endsAt) < new Date() : false;
  const roleBadge = post.profile?.role && post.profile.role !== "user" ? ROLE_BADGE[post.profile.role] : null;

  return (
    <Card className="glass-card border-none overflow-hidden group">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={post.profile?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{post.profile?.display_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold flex items-center gap-2 flex-wrap">
                {post.profile?.display_name || "Community Member"}
                {post.profile?.is_verified && (
                  <Badge className="bg-primary/20 text-primary text-[10px] hover:bg-primary/30">✓ Verified</Badge>
                )}
                {roleBadge && (
                  <Badge className={`text-[10px] ${roleBadge.className}`}>{roleBadge.label}</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                Public
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {post.content && (
          <p className="text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {renderContentWithEntities(post.content, onHashtagClick)}
          </p>
        )}

        {post.media_urls && post.media_urls.length > 0 && (
          <div className={`grid gap-2 overflow-hidden rounded-xl border border-white/5 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media_urls.map((url: string, i: number) => (
              <img key={i} src={url} alt="Post intel" className="w-full h-auto object-cover max-h-[400px] hover:scale-[1.02] transition-transform cursor-zoom-in" />
            ))}
          </div>
        )}

        {/* Poll Display */}
        {post.poll_data && (
          <PollDisplay
            poll={post.poll_data}
            userVotes={post.userVotes ?? null}
            onVote={(optionIds) => onPollVote(optionIds)}
            isExpired={isPollExpired}
          />
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            {/* Reaction Picker replaces simple heart */}
            <ReactionPicker
              postId={post.id}
              currentReaction={currentReaction}
              reactions={displayReactions}
              onReact={(type) => onReact(post.id, type)}
              onRemove={() => onRemoveReaction(post.id)}
            />
            <button onClick={onToggleComments} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="h-5 w-5" />
              {post.comments.length || 0}
            </button>
            <button onClick={() => onShare(post.id)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              <Share2 className="h-5 w-5" />
              {post.shareCount > 0 && post.shareCount}
            </button>
          </div>
          <button onClick={() => onToggleBookmark(post.id)} className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Threaded Comments */}
        {isExpanded && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <ThreadedComments
              postId={post.id}
              comments={post.comments}
              currentUserId={currentUserId}
              onAddComment={(content, parentId) => onAddComment(content, parentId)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
