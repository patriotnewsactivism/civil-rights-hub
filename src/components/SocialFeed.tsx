import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, MessageCircle, Upload, X, FileText, Music, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChangeEvent } from "react";
import type { Database } from "@/integrations/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type LikeRow = Database["public"]["Tables"]["likes"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type PostQueryResult = PostRow & {
  profiles: Pick<ProfileRow, "display_name" | "avatar_url" | "role"> | null;
  likes: Pick<LikeRow, "id" | "user_id">[];
  comments: (Pick<CommentRow, "id" | "content" | "user_id"> & {
    profiles: Pick<ProfileRow, "display_name"> | null;
  })[];
};

export function SocialFeed() {
  const [posts, setPosts] = useState<PostQueryResult[]>([]);
  const [newPost, setNewPost] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        media_urls,
        media_types,
        created_at,
        user_id,
        profiles!posts_user_id_fkey(display_name, avatar_url, role),
        likes(id, user_id),
        comments(id, content, user_id, profiles!comments_user_id_fkey(display_name))
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load posts");
      setPosts([]);
      return;
    }

    setPosts((data ?? []) as PostQueryResult[]);
  }, []);

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

        if (uploadError) {
          throw uploadError;
        }

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

      if (error) {
        throw error;
      }

      setNewPost("");
      setMediaFiles([]);
      toast.success("Post created");
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

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          toast.error("Unable to determine user session");
          return;
        }
        setCurrentUserId(data.user?.id ?? null);
      })
      .catch((error) => {
        if (!isMounted) return;
        toast.error(error instanceof Error ? error.message : "Unable to determine user session");
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

  const currentUserHasPosts = useMemo(() => Boolean(posts.find((post) => post.user_id === currentUserId)), [currentUserId, posts]);

  const getMediaIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const renderMedia = (url: string, type: string) => {
    if (type.startsWith("image/")) {
      return <img src={url} alt="Post media" className="max-h-96 w-full rounded-lg object-cover" />;
    }
    if (type.startsWith("audio/")) {
      return <audio src={url} controls className="w-full" />;
    }
    if (type === "application/pdf") {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {currentUserId && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Share an update</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, evidence, or collaborate..."
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              className="min-h-24"
            />

            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaFiles.map((file, index) => (
                  <Badge key={`${file.name}-${index}`} variant="secondary" className="gap-2">
                    {getMediaIcon(file.type)}
                    {file.name.slice(0, 20)}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFile(index)} />
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="file"
                id="media-upload"
                className="hidden"
                onChange={handleFileSelect}
                multiple
                accept="image/*,audio/*,application/pdf"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("media-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Attach media
              </Button>
              <Button onClick={() => void createPost()} disabled={uploading || (!newPost.trim() && mediaFiles.length === 0)}>
                {uploading ? "Posting..." : "Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentUserId && !currentUserHasPosts && (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Sign in to share updates and join the conversation.
          </CardContent>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url ?? ""} />
                <AvatarFallback>{post.profiles?.display_name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.profiles?.display_name ?? "Anonymous"}</span>
                  {post.profiles?.role && post.profiles.role !== "user" && (
                    <Badge variant="secondary" className="text-xs">
                      {post.profiles.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${post.likes.some((like) => like.user_id === currentUserId) ? "text-primary" : ""}`}
                onClick={() => void toggleLike(post.id)}
              >
                <Heart className={`h-4 w-4 ${post.likes.some((like) => like.user_id === currentUserId) ? "fill-current" : ""}`} />
                {post.likes.length}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-line text-sm leading-relaxed">{post.content}</p>

            {post.media_urls && post.media_types && (
              <div className="space-y-3">
                {post.media_urls.map((url, index) => (
                  <div key={url} className="overflow-hidden rounded-lg border">
                    {renderMedia(url, post.media_types?.[index] ?? "")}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.likes.length}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.comments.length}
              </div>
            </div>

            {post.comments.length > 0 && (
              <div className="space-y-3 rounded-lg bg-muted/50 p-3 text-sm">
                {post.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="font-medium">{comment.profiles?.display_name ?? "Community member"}</p>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
