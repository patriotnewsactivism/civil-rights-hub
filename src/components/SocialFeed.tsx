import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Heart, MessageCircle, Upload, X, FileText, Music, 
  Image as ImageIcon, TrendingUp, Hash, Send, Flame,
  Share2, Bookmark, Copy, Check, Link2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChangeEvent } from "react";

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface Post {
  id: string;
  content: string;
  media_urls: string[] | null;
  media_types: string[] | null;
  created_at: string;
  user_id: string;
}

interface Like {
  id: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  profile?: UserProfile | null;
}

interface PostWithDetails extends Post {
  profile: UserProfile | null;
  likes: Like[];
  comments: Comment[];
  hashtags: string[];
  isBookmarked?: boolean;
  shareCount?: number;
}

// Extract hashtags from content
const extractHashtags = (content: string): string[] => {
  const matches = content.match(/#[\w]+/g);
  return matches ? [...new Set(matches.map(tag => tag.toLowerCase()))] : [];
};

// Highlight hashtags in content
const renderContentWithHashtags = (content: string, onHashtagClick: (tag: string) => void) => {
  const parts = content.split(/(#[\w]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return (
        <button
          key={index}
          onClick={() => onHashtagClick(part.toLowerCase())}
          className="text-primary hover:underline font-medium"
        >
          {part}
        </button>
      );
    }
    return part;
  });
};

export function SocialFeed() {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [newPost, setNewPost] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("latest");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [shareComment, setShareComment] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPosts = useCallback(async () => {
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
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
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map((profilesData ?? []).map((p) => [p.id, p as UserProfile]));

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

    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, content, user_id, post_id")
      .in("post_id", postIds);

    const commentUserIds = [...new Set((commentsData ?? []).map((c) => c.user_id))];
    const { data: commentProfilesData } = await supabase
      .from("user_profiles")
      .select("id, display_name, avatar_url")
      .in("id", commentUserIds);

    const commentProfileMap = new Map((commentProfilesData ?? []).map((p) => [p.id, p as UserProfile]));

    const commentsMap = new Map<string, Comment[]>();
    (commentsData ?? []).forEach((comment) => {
      const existing = commentsMap.get(comment.post_id) ?? [];
      existing.push({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        profile: commentProfileMap.get(comment.user_id) ?? null,
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

    const postsWithDetails: PostWithDetails[] = typedPosts.map((post) => ({
      ...post,
      profile: profileMap.get(post.user_id) ?? null,
      likes: likesMap.get(post.id) ?? [],
      comments: commentsMap.get(post.id) ?? [],
      hashtags: extractHashtags(post.content),
      isBookmarked: bookmarkedPostIds.has(post.id),
      shareCount: sharesMap.get(post.id) ?? 0,
    }));

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
      toast.error("Sign in to share updates with the community");
      return;
    }

    if (!newPost.trim() && mediaFiles.length === 0) return;

    setUploading(true);

    try {
      const { mediaUrls, mediaTypes } = await uploadMedia(mediaFiles, currentUserId);

      const { error } = await supabase.from("posts").insert({
        content: newPost,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_types: mediaTypes.length > 0 ? mediaTypes : null,
        user_id: currentUserId,
      });

      if (error) throw error;

      setNewPost("");
      setMediaFiles([]);
      toast.success("Post shared with the community!");
      await fetchPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create post";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, [currentUserId, fetchPosts, mediaFiles, newPost, uploadMedia]);

  const toggleLike = useCallback(
    async (postId: string) => {
      if (!currentUserId) {
        toast.error("Sign in to react to posts");
        return;
      }

      const targetPost = posts.find((post) => post.id === postId);
      if (!targetPost) return;

      const existingLike = targetPost.likes.find((like) => like.user_id === currentUserId);

      if (existingLike) {
        const { error } = await supabase.from("likes").delete().eq("id", existingLike.id);
        if (error) {
          toast.error("Failed to remove like");
          return;
        }
      } else {
        const { error } = await supabase.from("likes").insert({ post_id: postId, user_id: currentUserId });
        if (error) {
          toast.error("Failed to add like");
          return;
        }
      }

      await fetchPosts();
    },
    [currentUserId, fetchPosts, posts]
  );

  const addComment = useCallback(async (postId: string) => {
    if (!currentUserId) {
      toast.error("Sign in to comment");
      return;
    }

    const content = newComment[postId]?.trim();
    if (!content) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      content,
    });

    if (error) {
      toast.error("Failed to add comment");
      return;
    }

    setNewComment(prev => ({ ...prev, [postId]: "" }));
    await fetchPosts();
    toast.success("Comment added!");
  }, [currentUserId, newComment, fetchPosts]);

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
      toast.error("Sign in to bookmark posts");
      return;
    }

    const isBookmarked = bookmarks.has(postId);

    if (isBookmarked) {
      const { error } = await supabase
        .from("post_bookmarks")
        .delete()
        .eq("user_id", currentUserId)
        .eq("post_id", postId);

      if (error) {
        toast.error("Failed to remove bookmark");
        return;
      }

      setBookmarks(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      toast.success("Bookmark removed");
    } else {
      const { error } = await supabase
        .from("post_bookmarks")
        .insert({ user_id: currentUserId, post_id: postId });

      if (error) {
        toast.error("Failed to bookmark post");
        return;
      }

      setBookmarks(prev => new Set([...prev, postId]));
      toast.success("Post bookmarked");
    }
  }, [currentUserId, bookmarks]);

  const openShareDialog = (postId: string) => {
    setSharePostId(postId);
    setShareComment("");
    setShareDialogOpen(true);
  };

  const sharePost = async () => {
    if (!currentUserId || !sharePostId) {
      toast.error("Sign in to share posts");
      return;
    }

    const { error } = await supabase
      .from("post_shares")
      .insert({
        user_id: currentUserId,
        post_id: sharePostId,
        share_comment: shareComment || null,
      });

    if (error) {
      toast.error("Failed to share post");
      return;
    }

    toast.success("Post shared!");
    setShareDialogOpen(false);
    await fetchPosts();
  };

  const copyPostLink = async (postId: string) => {
    const url = `${window.location.origin}/social?post=${postId}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast.success("Link copied to clipboard");
  };

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) return;
        setCurrentUserId(data.user?.id ?? null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    void fetchPosts();

    const channel = supabase
      .channel("social-feed-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        void fetchPosts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, () => {
        void fetchPosts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        void fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  // Trending hashtags calculation
  const trendingHashtags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    posts.forEach(post => {
      const postTime = new Date(post.created_at).getTime();
      if (postTime > oneDayAgo) {
        post.hashtags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  // Trending posts (most likes in last 24 hours)
  const trendingPosts = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    return posts
      .filter(post => new Date(post.created_at).getTime() > oneDayAgo)
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 20);
  }, [posts]);

  // Filtered posts
  const displayedPosts = useMemo(() => {
    let filtered = activeTab === "trending" ? trendingPosts : posts;
    
    if (selectedHashtag) {
      filtered = filtered.filter(post => 
        post.hashtags.includes(selectedHashtag.toLowerCase())
      );
    }
    
    return filtered;
  }, [posts, trendingPosts, activeTab, selectedHashtag]);

  const getMediaIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const renderMedia = (url: string, type: string) => {
    if (type.startsWith("image/")) {
      return (
        <img 
          src={url} 
          alt="Post media" 
          className="max-h-96 w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity" 
        />
      );
    }
    if (type.startsWith("video/")) {
      return <video src={url} controls className="w-full rounded-lg max-h-96" />;
    }
    if (type.startsWith("audio/")) {
      return <audio src={url} controls className="w-full" />;
    }
    if (type === "application/pdf") {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline p-4 bg-muted rounded-lg">
          <FileText className="h-5 w-5" />
          View PDF document
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        View file
      </a>
    );
  };

  const handleHashtagClick = (tag: string) => {
    setSelectedHashtag(tag === selectedHashtag ? null : tag);
  };

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Trending Topics</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map(({ tag, count }) => (
                <Button
                  key={tag}
                  variant={selectedHashtag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleHashtagClick(tag)}
                  className="gap-1"
                >
                  <Hash className="h-3 w-3" />
                  {tag.slice(1)}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>
            {selectedHashtag && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedHashtag(null)}
                className="mt-3 text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear filter
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Post Composer */}
      {currentUserId && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <h3 className="font-semibold">Share an Update</h3>
            <p className="text-sm text-muted-foreground">
              Use #hashtags to join conversations • Share evidence, updates, or collaborate
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's happening? Use #hashtags to categorize your post..."
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              className="min-h-24 resize-none"
            />

            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaFiles.map((file, index) => (
                  <Badge key={`${file.name}-${index}`} variant="secondary" className="gap-2 py-1.5">
                    {getMediaIcon(file.type)}
                    <span className="max-w-32 truncate">{file.name}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeFile(index)} />
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Input
                  type="file"
                  id="media-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,video/*,audio/*,application/pdf"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("media-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Media
                </Button>
              </div>
              <Button 
                onClick={() => void createPost()} 
                disabled={uploading || (!newPost.trim() && mediaFiles.length === 0)}
                className="gap-2"
              >
                {uploading ? "Posting..." : (
                  <>
                    <Send className="h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentUserId && (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Sign in to share updates and join the conversation.
          </CardContent>
        </Card>
      )}

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="latest" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Latest
          </TabsTrigger>
          <TabsTrigger value="trending" className="gap-2">
            <Flame className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="mt-4 space-y-4">
          {displayedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {selectedHashtag ? (
                  <p>No posts found with {selectedHashtag}</p>
                ) : (
                  <p>No posts yet. Be the first to share!</p>
                )}
              </CardContent>
            </Card>
          ) : (
            displayedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={toggleLike}
                onHashtagClick={handleHashtagClick}
                renderMedia={renderMedia}
                newComment={newComment[post.id] ?? ""}
                onCommentChange={(value) => setNewComment(prev => ({ ...prev, [post.id]: value }))}
                onAddComment={() => addComment(post.id)}
                isExpanded={expandedComments.has(post.id)}
                onToggleComments={() => toggleComments(post.id)}
                onToggleBookmark={toggleBookmark}
                onOpenShareDialog={openShareDialog}
                isBookmarked={bookmarks.has(post.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-4 space-y-4">
          {displayedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Flame className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No trending posts in the last 24 hours</p>
              </CardContent>
            </Card>
          ) : (
            displayedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={toggleLike}
                onHashtagClick={handleHashtagClick}
                renderMedia={renderMedia}
                newComment={newComment[post.id] ?? ""}
                onCommentChange={(value) => setNewComment(prev => ({ ...prev, [post.id]: value }))}
                onAddComment={() => addComment(post.id)}
                isExpanded={expandedComments.has(post.id)}
                onToggleComments={() => toggleComments(post.id)}
                onToggleBookmark={toggleBookmark}
                onOpenShareDialog={openShareDialog}
                isBookmarked={bookmarks.has(post.id)}
                trendingRank={index + 1}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>
              Share this post with your followers or copy the link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add a comment (optional)..."
              value={shareComment}
              onChange={(e) => setShareComment(e.target.value)}
              className="min-h-20"
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => sharePostId && copyPostLink(sharePostId)}
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button className="w-full sm:w-auto" onClick={sharePost}>
              <Share2 className="h-4 w-4 mr-2" />
              Share to Feed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PostCardProps {
  post: PostWithDetails;
  currentUserId: string | null;
  onLike: (postId: string) => void;
  onHashtagClick: (tag: string) => void;
  renderMedia: (url: string, type: string) => React.ReactNode;
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  isExpanded: boolean;
  onToggleComments: () => void;
  onToggleBookmark: (postId: string) => void;
  onOpenShareDialog: (postId: string) => void;
  isBookmarked: boolean;
  trendingRank?: number;
}

function PostCard({
  post,
  currentUserId,
  onLike,
  onHashtagClick,
  renderMedia,
  newComment,
  onCommentChange,
  onAddComment,
  isExpanded,
  onToggleComments,
  onToggleBookmark,
  onOpenShareDialog,
  isBookmarked,
  trendingRank,
}: PostCardProps) {
  const isLiked = post.likes.some((like) => like.user_id === currentUserId);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {trendingRank && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm font-bold">
              {trendingRank}
            </div>
          )}
          <Avatar className="ring-2 ring-primary/10">
            <AvatarImage src={post.profile?.avatar_url ?? ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {post.profile?.display_name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{post.profile?.display_name ?? "Anonymous"}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {renderContentWithHashtags(post.content, onHashtagClick)}
        </p>

        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 text-xs"
                onClick={() => onHashtagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {post.media_urls && post.media_types && (
          <div className={`grid gap-2 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media_urls.map((url, index) => (
              <div key={url} className="overflow-hidden rounded-lg border">
                {renderMedia(url, post.media_types?.[index] ?? "")}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {post.likes.length > 0 && post.likes.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={onToggleComments}
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments.length > 0 && post.comments.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onOpenShareDialog(post.id)}
          >
            <Share2 className="h-4 w-4" />
            {post.shareCount && post.shareCount > 0 && post.shareCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 ${isBookmarked ? "text-primary" : ""}`}
            onClick={() => onToggleBookmark(post.id)}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Comments section */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            {post.comments.length > 0 && (
              <div className="space-y-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.profile?.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs">
                        {comment.profile?.display_name?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                      <p className="font-medium text-xs">{comment.profile?.display_name ?? "Anonymous"}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentUserId && (
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => onCommentChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onAddComment()}
                  className="text-sm"
                />
                <Button size="sm" onClick={onAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
