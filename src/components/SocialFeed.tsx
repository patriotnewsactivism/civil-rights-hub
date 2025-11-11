import { useEffect, useState } from "react";
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

interface Post {
  id: string;
  content: string;
  media_urls: string[] | null;
  media_types: string[] | null;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    role: string;
  };
  likes: { id: string; user_id: string }[];
  comments: { id: string; content: string; user_id: string; profiles: { display_name: string } }[];
}

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));
    fetchPosts();

    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        media_urls,
        media_types,
        created_at,
        user_id,
        profiles!user_id (display_name, avatar_url, role),
        likes (id, user_id),
        comments (id, content, user_id, profiles!user_id (display_name))
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load posts");
    } else {
      setPosts((data as any) || []);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createPost = async () => {
    if (!newPost.trim() && mediaFiles.length === 0) return;
    
    setUploading(true);
    const mediaUrls: string[] = [];
    const mediaTypes: string[] = [];

    try {
      // Upload files
      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${currentUserId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        mediaUrls.push(publicUrl);
        mediaTypes.push(file.type);
      }

      // Create post
      const { error } = await supabase.from('posts').insert({
        content: newPost,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_types: mediaTypes.length > 0 ? mediaTypes : null,
        user_id: currentUserId,
      });

      if (error) throw error;

      setNewPost("");
      setMediaFiles([]);
      toast.success("Post created!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    const existingLike = posts
      .find((p) => p.id === postId)
      ?.likes.find((l) => l.user_id === currentUserId);

    if (existingLike) {
      await supabase.from('likes').delete().eq('id', existingLike.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: currentUserId });
    }
  };

  const getMediaIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const renderMedia = (url: string, type: string) => {
    if (type.startsWith('image/')) {
      return <img src={url} alt="Post media" className="w-full rounded-lg max-h-96 object-cover" />;
    }
    if (type.startsWith('audio/')) {
      return <audio src={url} controls className="w-full" />;
    }
    if (type === 'application/pdf') {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
          <FileText className="h-5 w-5" />
          View PDF Document
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        View File
      </a>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {currentUserId && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Share an update</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, evidence, or collaborate..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-24"
            />
            
            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaFiles.map((file, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
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
                onClick={() => document.getElementById('media-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Attach Media
              </Button>
              <Button onClick={createPost} disabled={uploading || (!newPost.trim() && mediaFiles.length === 0)}>
                {uploading ? "Posting..." : "Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url || ""} />
                <AvatarFallback>{post.profiles?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.profiles?.display_name || "Anonymous"}</span>
                  {post.profiles?.role && post.profiles.role !== 'user' && (
                    <Badge variant="secondary" className="text-xs">{post.profiles.role}</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{post.content}</p>
            
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="space-y-2">
                {post.media_urls.map((url, index) => (
                  <div key={index}>{renderMedia(url, post.media_types?.[index] || '')}</div>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id)}
                className={post.likes.some((l) => l.user_id === currentUserId) ? "text-red-500" : ""}
              >
                <Heart className="h-4 w-4 mr-1" />
                {post.likes.length}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments.length}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
