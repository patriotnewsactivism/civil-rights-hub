import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { Scale, Search, ExternalLink, Loader2, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FederalLaw {
  id: string;
  title: string;
  short_name: string | null;
  category: string;
  statute_citation: string;
  year_enacted: number | null;
  summary: string;
  full_text: string | null;
  key_provisions: string[] | null;
  protected_classes: string[] | null;
  enforcing_agency: string | null;
  enforcement_details: string | null;
  amendments: string | null;
  related_laws: string[] | null;
  external_links: any;
}

const CATEGORIES = [
  "Employment",
  "Housing",
  "Education",
  "Voting",
  "Accessibility",
  "Criminal Justice",
  "Immigration",
  "Healthcare",
  "Public Accommodations",
  "Other"
];

export const FederalLaws = () => {
  const { toast } = useToast();
  const [laws, setLaws] = useState<FederalLaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchLaws();
  }, [selectedCategory]);

  const fetchLaws = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("federal_laws")
        .select("*")
        .order("year_enacted", { ascending: false, nullsFirst: false })
        .order("title");

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search query if present
      let filteredData = data || [];
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (law) =>
            law.title.toLowerCase().includes(lowerQuery) ||
            law.short_name?.toLowerCase().includes(lowerQuery) ||
            law.summary.toLowerCase().includes(lowerQuery) ||
            law.statute_citation.toLowerCase().includes(lowerQuery)
        );
      }

      setLaws(filteredData);
    } catch (error) {
      console.error("Error fetching federal laws:", error);
      toast({
        title: "Failed to load federal laws",
        description: "Unable to fetch legal information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLaws();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <section id="federal-laws" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Federal Civil Rights Laws
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive database of federal statutes protecting civil rights and civil liberties.
            Learn about your protections under federal law.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Federal Laws
              </CardTitle>
              <CardDescription>
                Find statutes by keyword, category, or citation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by title, citation, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button size="sm" onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : laws.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No federal laws found matching your criteria. Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {laws.length} federal {laws.length === 1 ? "statute" : "statutes"}
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                {laws.map((law) => (
                  <AccordionItem key={law.id} value={law.id} className="border rounded-lg">
                    <Card>
                      <AccordionTrigger className="hover:no-underline px-6 py-4">
                        <div className="flex items-start justify-between w-full text-left pr-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge>{law.category}</Badge>
                              {law.short_name && (
                                <Badge variant="outline">{law.short_name}</Badge>
                              )}
                              {law.year_enacted && (
                                <span className="text-xs text-muted-foreground">
                                  Enacted {law.year_enacted}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {law.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {law.statute_citation}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-6 space-y-4">
                          {/* Summary */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                            <p className="text-sm text-muted-foreground">{law.summary}</p>
                          </div>

                          {/* Protected Classes */}
                          {law.protected_classes && law.protected_classes.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Protected Classes
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {law.protected_classes.map((cls) => (
                                  <Badge key={cls} variant="secondary">
                                    {cls}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Provisions */}
                          {law.key_provisions && law.key_provisions.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Key Provisions
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {law.key_provisions.map((provision, idx) => (
                                  <li key={idx}>{provision}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Enforcement */}
                          {(law.enforcing_agency || law.enforcement_details) && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Enforcement
                              </h4>
                              {law.enforcing_agency && (
                                <p className="text-sm text-muted-foreground mb-1">
                                  <span className="font-semibold">Agency: </span>
                                  {law.enforcing_agency}
                                </p>
                              )}
                              {law.enforcement_details && (
                                <p className="text-sm text-muted-foreground">
                                  {law.enforcement_details}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Amendments */}
                          {law.amendments && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Amendments
                              </h4>
                              <p className="text-sm text-muted-foreground">{law.amendments}</p>
                            </div>
                          )}

                          {/* Related Laws */}
                          {law.related_laws && law.related_laws.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Related Laws
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {law.related_laws.map((related) => (
                                  <Badge key={related} variant="outline">
                                    {related}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* External Links */}
                          {law.external_links && Object.keys(law.external_links).length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="font-semibold text-foreground mb-2">
                                External Resources
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(law.external_links).map(([key, url]) => (
                                  <Button key={key} variant="outline" size="sm" asChild>
                                    <a href={url as string} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Information Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Scale className="h-5 w-5" />
                About Federal Civil Rights Laws
              </h4>
              <p className="text-sm text-muted-foreground">
                Federal civil rights laws protect individuals from discrimination and guarantee fundamental
                freedoms. These statutes are enforced by agencies like the EEOC, DOJ, HUD, and others.
                State laws may provide additional protections beyond federal minimums.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
