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
  Share2, Bookmark, Check, Link2, MoreHorizontal, Shield
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

const extractHashtags = (content: string): string[] => {
  const matches = content.match(/#[\w]+/g);
  return matches ? [...new Set(matches.map(tag => tag.toLowerCase()))] : [];
};

const renderContentWithHashtags = (content: string, onHashtagClick: (tag: string) => void) => {
  const parts = content.split(/(#[\w]+)/g);
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
      toast.error("Sign in to share updates");
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
      toast.success("Post broadcasted!");
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
        toast.error("Sign in to react");
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
      setCurrentUserId(data.user?.id ?? null);
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
    if (selectedHashtag) {
      filtered = filtered.filter(post => post.hashtags.includes(selectedHashtag.toLowerCase()));
    }
    return filtered;
  }, [posts, selectedHashtag]);

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
            onChange={(e) => setSelectedHashtag(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
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
            <div className="p-6 space-y-4">
              <Textarea
                placeholder="Document a violation, share a resource, or organize..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-transparent border-none focus-visible:ring-0 text-lg min-h-[120px] p-0 placeholder:text-muted-foreground/50"
              />
              
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

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => document.getElementById("media-upload")?.click()} className="text-muted-foreground hover:text-primary">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Evidence
                  </Button>
                  <input type="file" id="media-upload" className="hidden" onChange={handleFileSelect} multiple accept="image/*,video/*,audio/*,application/pdf" />
                </div>
                <Button onClick={createPost} disabled={uploading || (!newPost.trim() && mediaFiles.length === 0)} className="rounded-full px-8 shadow-lg shadow-primary/20">
                  {uploading ? "Uploading..." : "Broadcast"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {displayedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onLike={toggleLike}
            onHashtagClick={(tag) => setSelectedHashtag(tag)}
            isBookmarked={bookmarks.has(post.id)}
            onToggleBookmark={toggleBookmark}
            onCommentChange={(val) => setNewComment(prev => ({ ...prev, [post.id]: val }))}
            newComment={newComment[post.id] || ""}
            onAddComment={() => addComment(post.id)}
            isExpanded={expandedComments.has(post.id)}
            onToggleComments={() => toggleComments(post.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, currentUserId, onLike, onHashtagClick, isBookmarked, onToggleBookmark, newComment, onCommentChange, onAddComment, isExpanded, onToggleComments }: any) {
  const isLiked = post.likes.some((l: any) => l.user_id === currentUserId);

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
              <div className="font-bold flex items-center gap-2">
                {post.profile?.display_name || "Anonymous Correspondent"}
                <Badge className="bg-primary/20 text-primary text-[10px] hover:bg-primary/30">VERIFIED</Badge>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                Public Intel
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {renderContentWithHashtags(post.content, onHashtagClick)}
        </p>

        {post.media_urls && (
          <div className={`grid gap-2 overflow-hidden rounded-xl border border-white/5 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media_urls.map((url: string, i: number) => (
              <img key={i} src={url} alt="Post intel" className="w-full h-auto object-cover max-h-[400px] hover:scale-[1.02] transition-transform cursor-zoom-in" />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes.length || 0}
            </button>
            <button onClick={onToggleComments} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="h-5 w-5" />
              {post.comments.length || 0}
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button onClick={() => onToggleBookmark(post.id)} className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {isExpanded && (
          <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {post.comments.map((c: any) => (
              <div key={c.id} className="flex gap-3 text-sm">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={c.profile?.avatar_url} />
                  <AvatarFallback className="text-[10px]">{c.profile?.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
                  <div className="font-bold text-[11px] text-primary/80 mb-0.5">{c.profile?.display_name}</div>
                  <p className="text-foreground/80 leading-snug">{c.content}</p>
                </div>
              </div>
            ))}
            {currentUserId && (
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="Analyze report..." 
                  value={newComment} 
                  onChange={(e) => onCommentChange(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
                  className="bg-white/5 border-white/10 rounded-full h-9 text-xs" 
                />
                <Button size="icon" onClick={onAddComment} disabled={!newComment.trim()} className="h-9 w-9 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white border-none">
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
