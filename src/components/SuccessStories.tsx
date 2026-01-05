import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Heart, MapPin, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const OUTCOMES = [
  "Charges Dropped",
  "Policy Change",
  "Settlement Reached",
  "Case Dismissed",
  "Community Win",
];

interface SuccessStory {
  id: string;
  title: string;
  story: string;
  outcome: string | null;
  state: string | null;
  case_type: string | null;
  is_verified: boolean | null;
  submitter_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

type StoryFormState = {
  title: string;
  story: string;
  outcome: string;
  state: string;
  case_type: string;
};

const initialStory: StoryFormState = {
  title: "",
  story: "",
  outcome: OUTCOMES[0] ?? "",
  state: "",
  case_type: "",
};

export const SuccessStories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filtered, setFiltered] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<string>("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("");
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [storyForm, setStoryForm] = useState(initialStory);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("success_stories")
      .select("id, title, story, outcome, state, case_type, is_verified, submitter_id, created_at, updated_at")
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Unable to load success stories",
        description: error.message,
        variant: "destructive",
      });
      setStories([]);
      setFiltered([]);
      setLoading(false);
      return;
    }

    const typed = (data ?? []) as SuccessStory[];
    setStories(typed);
    setFiltered(typed);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    const next = stories.filter((story) => {
      const matchesState = stateFilter ? story.state === stateFilter : true;
      const matchesOutcome = outcomeFilter ? story.outcome === outcomeFilter : true;
      return matchesState && matchesOutcome;
    });
    setFiltered(next);
  }, [stories, stateFilter, outcomeFilter]);

  const states = useMemo(() => Array.from(new Set(stories.map((story) => story.state).filter(Boolean))), [stories]);

  const handleSubmitStory = async () => {
    if (!storyForm.title || !storyForm.story || !storyForm.outcome) {
      toast({
        title: "Missing information",
        description: "Share a title, outcome, and summary so others can celebrate the win.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("success_stories").insert({
      title: storyForm.title,
      story: storyForm.story,
      outcome: storyForm.outcome,
      state: storyForm.state || null,
      case_type: storyForm.case_type || null,
      submitter_id: user?.id ?? null,
      is_verified: false,
    });

    if (error) {
      toast({
        title: "Unable to share story",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Story submitted",
      description: "Thank you for sharing! Moderators will review before featuring it in the feed.",
    });

    setSubmitDialogOpen(false);
    setStoryForm(initialStory);
  };

  const handleShare = async (story: SuccessStory) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.story.slice(0, 120),
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast({
            title: "Unable to share",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${story.title} — ${story.story}`);
        toast({ title: "Copied", description: "Story copied to clipboard for sharing." });
      } catch (error) {
        toast({
          title: "Unable to copy",
          description: error instanceof Error ? error.message : "Clipboard access was denied.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Success Stories</h2>
          <p className="text-sm text-muted-foreground">Celebrate victories, policy wins, and court triumphs from community legal teams.</p>
        </div>
        <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Sparkles className="mr-2 h-4 w-4" /> Share your win
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit a success story</DialogTitle>
              <DialogDescription>Inspire the movement with a recent legal or organizing victory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Headline for your victory"
                value={storyForm.title}
                onChange={(event) => setStoryForm((state) => ({ ...state, title: event.target.value }))}
              />
              <Textarea
                placeholder="Describe the actions taken, allies involved, and the outcome."
                value={storyForm.story}
                onChange={(event) => setStoryForm((state) => ({ ...state, story: event.target.value }))}
                className="min-h-[160px]"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outcome</label>
                  <Select value={storyForm.outcome} onValueChange={(value) => setStoryForm((state) => ({ ...state, outcome: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTCOMES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case type</label>
                  <Input
                    placeholder="Protest, traffic stop, lawsuit..."
                    value={storyForm.case_type}
                    onChange={(event) => setStoryForm((state) => ({ ...state, case_type: event.target.value }))}
                  />
                </div>
              </div>
              <Input
                placeholder="State (e.g. CA)"
                value={storyForm.state}
                onChange={(event) => setStoryForm((state) => ({ ...state, state: event.target.value.toUpperCase() }))}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSubmitDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleSubmitStory()}>Submit story</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/60 p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All states</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state!}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All outcomes</SelectItem>
            {OUTCOMES.map((outcome) => (
              <SelectItem key={outcome} value={outcome}>
                {outcome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Loading success stories…</CardTitle>
            <CardDescription>Spotlighting community wins, legal victories, and accountability milestones.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((story) => (
            <Card key={story.id} className="flex h-full flex-col justify-between border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-semibold">{story.title}</CardTitle>
                  {story.is_verified && <Badge className="bg-emerald-100 text-emerald-800">Verified</Badge>}
                </div>
                <CardDescription>{story.story.slice(0, 160)}{story.story.length > 160 ? "…" : ""}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {story.state && (
                    <Badge variant="outline">
                      <MapPin className="mr-1 h-3 w-3" /> {story.state}
                    </Badge>
                  )}
                  {story.outcome && <Badge variant="outline">{story.outcome}</Badge>}
                  {story.case_type && <Badge variant="outline">{story.case_type}</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>{story.created_at && new Date(story.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => void handleShare(story)}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {!loading && filtered.length === 0 && (
            <Card className="border-dashed text-center">
              <CardHeader>
                <CardTitle>No stories yet</CardTitle>
                <CardDescription>Share how your community pushed back against injustice so others can replicate the win.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </section>
  );
};
