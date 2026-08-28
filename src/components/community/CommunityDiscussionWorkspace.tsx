import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { DiscussionBoard } from "@/components/DiscussionBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function CommunityDiscussionWorkspace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const createThread = async () => {
    if (!user?.id) return;
    if (title.trim().length < 4 || content.trim().length < 10) {
      toast({ title: "Add a little more detail", description: "Use a descriptive title and at least a short explanation.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { data: profile } = await supabase.from("user_profiles").select("display_name, username").eq("user_id", user.id).maybeSingle();
    const { error } = await supabase.from("forum_threads").insert({
      user_id: user.id,
      username: profile?.display_name || profile?.username || "Community member",
      title: title.trim(),
      content: content.trim(),
      category: "general",
      is_deleted: false,
      is_locked: false,
      is_pinned: false,
      last_post_at: new Date().toISOString(),
    } as any);
    setSubmitting(false);

    if (error) {
      toast({ title: "Unable to start discussion", description: error.message, variant: "destructive" });
      return;
    }
    setTitle("");
    setContent("");
    setRefreshKey((value) => value + 1);
    toast({ title: "Discussion started", description: "Your thread is now visible to the community." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquarePlus className="h-5 w-5" /> Start a discussion</CardTitle>
          <CardDescription>Community threads are user-submitted. Share firsthand information carefully and link sources when making factual claims.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you want to discuss?" maxLength={180} />
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add context, questions, or source links." className="min-h-[120px]" maxLength={10000} />
          <div className="flex justify-end"><Button onClick={createThread} disabled={submitting || !title.trim() || !content.trim()}>{submitting ? "Publishing…" : "Publish thread"}</Button></div>
        </CardContent>
      </Card>
      <DiscussionBoard key={refreshKey} />
    </div>
  );
}
