import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Filter, LinkIcon, Upload, Star, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const RESOURCE_TYPES: Array<Database["public"]["Tables"]["resource_library"]["Row"]["resource_type"]> = [
  "pdf",
  "video",
  "link",
  "image",
  "audio",
  "document",
];

type Resource = Database["public"]["Tables"]["resource_library"]["Row"];
type ResourceRating = Database["public"]["Tables"]["resource_ratings"]["Row"];

type UploadFormState = {
  title: string;
  description: string;
  resource_type: Resource["resource_type"];
  category: string;
  external_url: string;
  file_url: string;
  author: string;
  source: string;
};

const initialForm: UploadFormState = {
  title: "",
  description: "",
  resource_type: "pdf",
  category: "",
  external_url: "",
  file_url: "",
  author: "",
  source: "",
};

export const ResourceLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratings, setRatings] = useState<Map<string, ResourceRating>>(new Map());
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formState, setFormState] = useState<UploadFormState>(initialForm);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resource_library")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast({
        title: "Unable to load resources",
        description: error.message,
        variant: "destructive",
      });
      setResources([]);
      setFiltered([]);
      setLoading(false);
      return;
    }

    const typed = (data ?? []) as Resource[];
    setResources(typed);
    setFiltered(typed);
    setLoading(false);

    if (user?.id) {
      const { data: ratingData, error: ratingError } = await supabase
        .from("resource_ratings")
        .select("*")
        .eq("user_id", user.id);

      if (ratingError) {
        toast({
          title: "Unable to load ratings",
          description: ratingError.message,
          variant: "destructive",
        });
      } else {
        const map = new Map<string, ResourceRating>();
        (ratingData ?? []).forEach((entry) => {
          map.set(entry.resource_id, entry as ResourceRating);
        });
        setRatings(map);
      }
    } else {
      setRatings(new Map());
    }
  }, [toast, user?.id]);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    const next = resources.filter((resource) => {
      const matchesCategory = categoryFilter ? resource.category === categoryFilter : true;
      const matchesType = typeFilter ? resource.resource_type === typeFilter : true;
      const matchesSearch = searchTerm
        ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesType && matchesSearch;
    });
    setFiltered(next);
  }, [resources, categoryFilter, typeFilter, searchTerm]);

  const categories = useMemo(() => Array.from(new Set(resources.map((resource) => resource.category))).filter(Boolean), [resources]);

  const handleRating = async (resource: Resource, score: number) => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Create an account to rate and bookmark legal resources.",
        variant: "destructive",
      });
      return;
    }

    const payload: Database["public"]["Tables"]["resource_ratings"]["Insert"] = {
      resource_id: resource.id,
      user_id: user.id,
      rating: score,
    };

    const { data, error } = await supabase.from("resource_ratings").upsert(payload, { onConflict: "resource_id,user_id" }).select("*").single();

    if (error) {
      toast({
        title: "Unable to submit rating",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Thanks for rating", description: "Your feedback helps volunteers prioritize materials." });
    setRatings((current) => new Map(current).set(resource.id, data as ResourceRating));
  };

  const handleUpload = async () => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Upload resources after creating a free account.",
        variant: "destructive",
      });
      return;
    }

    if (!formState.title || !formState.category || (!formState.file_url && !formState.external_url)) {
      toast({
        title: "Missing information",
        description: "Provide a title, category, and either a file URL or an external link.",
        variant: "destructive",
      });
      return;
    }

    const payload: Database["public"]["Tables"]["resource_library"]["Insert"] = {
      title: formState.title,
      description: formState.description || null,
      resource_type: formState.resource_type,
      category: formState.category,
      file_url: formState.file_url || null,
      external_url: formState.external_url || null,
      author: formState.author || null,
      source: formState.source || null,
      uploaded_by: user.id,
      is_approved: false,
    };

    const { error } = await supabase.from("resource_library").insert(payload);

    if (error) {
      toast({
        title: "Unable to submit resource",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Resource submitted",
      description: "Thanks for contributing! Moderators will review and approve it shortly.",
    });

    setUploadDialogOpen(false);
    setFormState(initialForm);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Legal Resource Library</h2>
          <p className="text-sm text-muted-foreground">Download legal templates, organizer toolkits, and multilingual know-your-rights guides curated by civil rights attorneys.</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" /> Submit resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share a resource</DialogTitle>
              <DialogDescription>Contribute guides, trainings, or toolkits that help organizers and impacted families.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Resource title"
                value={formState.title}
                onChange={(event) => setFormState((state) => ({ ...state, title: event.target.value }))}
              />
              <Textarea
                placeholder="Brief description of what's included"
                value={formState.description}
                onChange={(event) => setFormState((state) => ({ ...state, description: event.target.value }))}
                className="min-h-[120px]"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="e.g. Legal Templates"
                    value={formState.category}
                    onChange={(event) => setFormState((state) => ({ ...state, category: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formState.resource_type}
                    onValueChange={(value) => setFormState((state) => ({ ...state, resource_type: value as Resource["resource_type"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                placeholder="Direct file URL (optional)"
                value={formState.file_url}
                onChange={(event) => setFormState((state) => ({ ...state, file_url: event.target.value }))}
              />
              <Input
                placeholder="External link (optional)"
                value={formState.external_url}
                onChange={(event) => setFormState((state) => ({ ...state, external_url: event.target.value }))}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Author or organization"
                  value={formState.author}
                  onChange={(event) => setFormState((state) => ({ ...state, author: event.target.value }))}
                />
                <Input
                  placeholder="Source URL"
                  value={formState.source}
                  onChange={(event) => setFormState((state) => ({ ...state, source: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleUpload()}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/60 p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All formats</SelectItem>
            {RESOURCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search resources"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {loading && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Loading resources…</CardTitle>
            <CardDescription>Gathering training manuals, legal templates, and multilingual guides.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => {
            const rating = ratings.get(resource.id)?.rating ?? 0;
            return (
              <Card key={resource.id} className="flex h-full flex-col justify-between shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold">{resource.title}</CardTitle>
                    <Badge variant="secondary">{resource.resource_type.toUpperCase()}</Badge>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {resource.category && <Badge variant="outline">{resource.category}</Badge>}
                    {resource.language && <Badge variant="outline">{resource.language.toUpperCase()}</Badge>}
                    {resource.author && <span>By {resource.author}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" /> {resource.download_count ?? 0} downloads
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => void handleRating(resource, star)}
                        className="text-primary"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star className={`h-5 w-5 ${star <= rating ? "fill-primary" : "fill-transparent"}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">Average: {resource.rating ?? "—"}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    {resource.source && (
                      <a href={resource.source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary underline">
                        <LinkIcon className="h-3 w-3" /> Source
                      </a>
                    )}
                    <span>Updated {new Date(resource.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.file_url && (
                      <Button asChild size="sm">
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    )}
                    {resource.external_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                          Open link
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}

          {!loading && filtered.length === 0 && (
            <Card className="border-dashed text-center">
              <CardHeader>
                <CardTitle>No resources match your filters</CardTitle>
                <CardDescription>Try a different category or contribute a new guide for the movement.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </section>
  );
};
