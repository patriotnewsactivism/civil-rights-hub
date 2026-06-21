import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Story {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  background_color: string | null;
  text_color: string | null;
  hashtags: string[] | null;
  view_count: number;
  expires_at: string;
  created_at: string;
  author?: { display_name: string | null; avatar_url: string | null; role: string | null };
  viewed?: boolean;
}

interface StoryGroup {
  user_id: string;
  author: Story["author"];
  stories: Story[];
  hasUnviewed: boolean;
}

const BG_COLORS = [
  "#1a1a2e", "#0f3460", "#16213e", "#1b262c",
  "#2d3436", "#6c5ce7", "#00b894", "#e17055",
];

export function StoriesBar({ currentUserId }: { currentUserId: string | null }) {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [composing, setComposing] = useState({
    content: "", bg: BG_COLORS[0], textColor: "#ffffff",
  });
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storyDuration = 5000;

  useEffect(() => {
    loadStories();
  }, [currentUserId]);

  async function loadStories() {
    setLoading(true);
    const now = new Date().toISOString();
    const { data: stories } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", now)
      .order("created_at", { ascending: false });

    if (!stories?.length) { setLoading(false); return; }

    const userIds = [...new Set(stories.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, avatar_url, role")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));

    let viewedSet = new Set<string>();
    if (currentUserId) {
      const { data: views } = await supabase
        .from("story_views")
        .select("story_id")
        .eq("viewer_id", currentUserId)
        .in("story_id", stories.map((s) => s.id));
      viewedSet = new Set(views?.map((v) => v.story_id));
    }

    const enriched = stories.map((s) => ({
      ...s,
      author: profileMap.get(s.user_id) || null,
      viewed: viewedSet.has(s.id),
    }));

    const groupMap = new Map<string, Story[]>();
    enriched.forEach((s) => {
      const arr = groupMap.get(s.user_id) || [];
      arr.push(s);
      groupMap.set(s.user_id, arr);
    });

    const groups: StoryGroup[] = Array.from(groupMap.entries()).map(([uid, sts]) => ({
      user_id: uid,
      author: sts[0].author,
      stories: sts,
      hasUnviewed: sts.some((s) => !s.viewed),
    }));

    // Sort: unviewed first, then own stories, then rest
    groups.sort((a, b) => {
      if (a.user_id === currentUserId) return -1;
      if (b.user_id === currentUserId) return 1;
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return 0;
    });

    setStoryGroups(groups);
    setLoading(false);
  }

  function openViewer(groupIdx: number) {
    setActiveGroupIdx(groupIdx);
    setActiveStoryIdx(0);
    setProgress(0);
    setViewerOpen(true);
  }

  const currentGroup = storyGroups[activeGroupIdx];
  const currentStory = currentGroup?.stories[activeStoryIdx];

  useEffect(() => {
    if (!viewerOpen || !currentStory) return;

    if (currentUserId && !currentStory.viewed) {
      supabase.from("story_views").insert({ story_id: currentStory.id, viewer_id: currentUserId })
        .then(() => {
          setStoryGroups((prev) => prev.map((g, gi) => gi !== activeGroupIdx ? g : {
            ...g,
            stories: g.stories.map((s) => s.id === currentStory.id ? { ...s, viewed: true } : s),
            hasUnviewed: g.stories.filter((s) => s.id !== currentStory.id).some((s) => !s.viewed),
          }));
          supabase.from("stories").update({ view_count: (currentStory.view_count || 0) + 1 })
            .eq("id", currentStory.id);
        });
    }

    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const interval = 50;
    const step = (interval / storyDuration) * 100;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          advanceStory();
          return 0;
        }
        return p + step;
      });
    }, interval);

    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [viewerOpen, activeGroupIdx, activeStoryIdx]);

  function advanceStory() {
    const group = storyGroups[activeGroupIdx];
    if (!group) return;
    if (activeStoryIdx < group.stories.length - 1) {
      setActiveStoryIdx((i) => i + 1);
    } else if (activeGroupIdx < storyGroups.length - 1) {
      setActiveGroupIdx((i) => i + 1);
      setActiveStoryIdx(0);
    } else {
      setViewerOpen(false);
    }
    setProgress(0);
  }

  function prevStory() {
    if (activeStoryIdx > 0) {
      setActiveStoryIdx((i) => i - 1);
    } else if (activeGroupIdx > 0) {
      setActiveGroupIdx((i) => i - 1);
      setActiveStoryIdx(0);
    }
    setProgress(0);
  }

  async function submitStory(e: FormEvent) {
    e.preventDefault();
    if (!currentUserId || !composing.content.trim()) return;

    const hashtags = (composing.content.match(/#[\w]+/g) || []).map((h) => h.slice(1).toLowerCase());

    const { error } = await supabase.from("stories").insert({
      user_id: currentUserId,
      content: composing.content,
      media_type: "text",
      background_color: composing.bg,
      text_color: composing.textColor,
      hashtags: hashtags.length ? hashtags : null,
    });

    if (error) { toast.error("Failed to post story"); return; }
    toast.success("Story posted — visible for 24 hours");
    setComposerOpen(false);
    setComposing({ content: "", bg: BG_COLORS[0], textColor: "#ffffff" });
    loadStories();
  }

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1,2,3,4].map((i) => (
          <div key={i} className="flex-shrink-0 w-16 h-16 rounded-full bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center">
        {/* Add Story */}
        {currentUserId && (
          <button onClick={() => setComposerOpen(true)} className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Add</span>
          </button>
        )}

        {storyGroups.map((group, i) => {
          const initials = (group.author?.display_name || "?").charAt(0).toUpperCase();
          const ringClass = group.user_id === currentUserId
            ? "ring-2 ring-primary/60"
            : group.hasUnviewed
              ? "ring-2 ring-primary"
              : "ring-2 ring-muted";

          return (
            <button key={group.user_id} onClick={() => openViewer(i)}
              className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className={`w-16 h-16 rounded-full overflow-hidden ${ringClass} ring-offset-2 ring-offset-background`}>
                {group.author?.avatar_url ? (
                  <img src={group.author.avatar_url} alt={initials} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-xs text-foreground/80 max-w-[60px] truncate">
                {group.user_id === currentUserId ? "Your story" : (group.author?.display_name || "Member")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Viewer */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-transparent border-0 shadow-none" hideClose>
          {currentStory && (
            <div
              className="relative w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: currentStory.background_color || "#1a1a2e" }}
            >
              {/* Progress bars */}
              <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-20">
                {currentGroup.stories.map((s, i) => (
                  <div key={s.id} className="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-none"
                      style={{
                        width: i < activeStoryIdx ? "100%" : i === activeStoryIdx ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="absolute top-5 left-0 right-0 z-20 flex items-center gap-2 px-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                  {currentStory.author?.avatar_url ? (
                    <img src={currentStory.author.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                      {(currentStory.author?.display_name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">
                    {currentStory.author?.display_name || "Community Member"}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {formatDistanceToNow(new Date(currentStory.created_at), { addSuffix: true })}
                  </p>
                </div>
                <button onClick={() => setViewerOpen(false)} className="ml-auto text-white/80 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center p-6 mt-16">
                {currentStory.media_url && currentStory.media_type === "image" ? (
                  <img src={currentStory.media_url} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                  <p className="text-center text-lg font-medium leading-relaxed"
                    style={{ color: currentStory.text_color || "#ffffff" }}>
                    {currentStory.content}
                  </p>
                )}
              </div>

              {/* Hashtags & views */}
              <div className="absolute bottom-6 left-0 right-0 px-4 flex items-end justify-between">
                <div className="flex flex-wrap gap-1">
                  {currentStory.hashtags?.map((tag) => (
                    <Badge key={tag} className="bg-white/20 text-white text-[10px] border-0">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Eye className="h-3 w-3" />
                  {currentStory.view_count}
                </div>
              </div>

              {/* Tap zones */}
              <button onClick={prevStory}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex items-center pl-2 opacity-0 hover:opacity-100">
                <ChevronLeft className="h-8 w-8 text-white/80" />
              </button>
              <button onClick={advanceStory}
                className="absolute right-0 top-0 bottom-0 w-2/3 z-10" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Story Composer */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Story</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitStory} className="space-y-4">
            {/* Preview */}
            <div
              className="w-full aspect-[9/16] rounded-xl flex items-center justify-center p-6 text-center"
              style={{ backgroundColor: composing.bg }}
            >
              <p className="text-sm leading-relaxed" style={{ color: composing.textColor }}>
                {composing.content || "Your story text appears here..."}
              </p>
            </div>

            <textarea
              value={composing.content}
              onChange={(e) => setComposing((p) => ({ ...p, content: e.target.value }))}
              placeholder="What's happening? Use #hashtags to reach more people..."
              rows={3}
              className="w-full border rounded-lg p-3 text-sm bg-background resize-none"
              maxLength={280}
              required
            />

            <div>
              <p className="text-xs text-muted-foreground mb-2">Background color</p>
              <div className="flex gap-2 flex-wrap">
                {BG_COLORS.map((c) => (
                  <button key={c} type="button"
                    onClick={() => setComposing((p) => ({ ...p, bg: c }))}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${composing.bg === c ? "border-primary scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Stories disappear automatically after 24 hours.
            </p>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Post Story</Button>
              <Button type="button" variant="outline" onClick={() => setComposerOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
