import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Loader2, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  violation_id: string;
  user_id: string | null;
  username: string | null;
  content: string;
  like_count: number;
  is_deleted: boolean;
  created_at: string;
}

interface ViolationCommentsProps {
  violationId: string;
}

export const ViolationComments = ({ violationId }: ViolationCommentsProps) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`violation_comments:${violationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "violation_comments",
          filter: `violation_id=eq.${violationId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [violationId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("violation_comments")
        .select("*")
        .eq("violation_id", violationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("violation_comments").insert({
        violation_id: violationId,
        user_id: user?.id || null,
        username: username.trim() || user?.email || "Anonymous",
        content: newComment.trim(),
      });

      if (error) throw error;

      toast({
        title: "Comment posted",
        description: "Your comment has been added.",
      });

      setNewComment("");
      setUsername("");
      setShowCommentForm(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Failed to post comment",
        description: "Unable to add your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Count & Add Button */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Comments ({comments.length})
        </h4>
        {!showCommentForm && (
          <Button size="sm" variant="outline" onClick={() => setShowCommentForm(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="comment-username">Display Name (Optional)</Label>
              <Input
                id="comment-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Leave blank for 'Anonymous'"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="comment-content">Your Comment</Label>
              <Textarea
                id="comment-content"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, support, or additional information..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCommentForm(false);
                  setNewComment("");
                  setUsername("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitComment} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">
                        {comment.username || "Anonymous"}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {comment.like_count > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.like_count}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
