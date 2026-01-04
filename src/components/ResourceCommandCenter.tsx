import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Compass,
  Filter,
  Layers3,
  MapPinned,
  Radio,
  Search,
  Sparkles,
  FileText,
  Building,
  CircuitBoard,
  Scale,
} from "lucide-react";
import type { ReactNode } from "react";
import { ViolationFeed } from "@/components/ViolationFeed";
import { InteractiveMap } from "@/components/InteractiveMap";
import { StateSelector } from "@/components/StateSelector";
import { PoliceScanner } from "@/components/PoliceScanner";
import { LawyerFinder } from "@/components/LawyerFinder";
import { AttorneySeoContent } from "@/components/AttorneySeoContent";
import { ActivistDirectory } from "@/components/ActivistDirectory";
import { OfficerAccountability } from "@/components/OfficerAccountability";
import { FOIABuilder } from "@/components/FOIABuilder";
import { FOIATracker } from "@/components/FOIATracker";
import { LegislativeActionCenter } from "@/components/LegislativeActionCenter";
import { CaseSearch } from "@/components/CaseSearch";
import { AITools } from "@/components/AITools";
import { Resources } from "@/components/Resources";
import { toast } from "sonner";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";

interface ResourceDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  featured?: boolean;
  keywords: string[];
  render: () => ReactNode;
}

const createResourceDefinitions = (
  selectedState: string,
  onStateChange: (state: string) => void
): ResourceDefinition[] => [
  {
    id: "violation-feed",
    title: "Live Violation Feed",
    description: "Crowdsourced incident reports, body cam drop links, and agency trends in one rolling dashboard.",
    category: "Rapid Response",
    featured: true,
    keywords: ["reports", "incidents", "alerts", "crowdsourced"],
    render: () => <ViolationFeed />,
  },
  {
    id: "interactive-map",
    title: "Interactive Accountability Map",
    description: "Tap a state to load emergency contacts, case law, and mutual aid partners before you roll camera.",
    category: "Rapid Response",
    featured: true,
    keywords: ["state", "map", "statutes", "travel"],
    render: () => (
      <InteractiveMap
        onStateSelect={(state) => {
          onStateChange(state);
          toast.success(`Focused on ${state} resources`);
        }}
      />
    ),
  },
  {
    id: "state-selector",
    title: "State Statute Navigator",
    description: "Search state-specific civil rights protections, stop-and-identify laws, and immunity standards.",
    category: "Rapid Response",
    keywords: ["state", "laws", "selector", "statute"],
    render: () => <StateSelector selectedState={selectedState} onStateChange={onStateChange} />,
  },
  {
    id: "police-scanner",
    title: "Police & EMS Scanner",
    description: "Monitor active calls that may impact auditors or community cop watchers in the field.",
    category: "Rapid Response",
    keywords: ["scanner", "radio", "ems"],
    render: () => <PoliceScanner />,
  },
  {
    id: "lawyer-finder",
    title: "Lawyer Finder",
    description: "Filter nationwide attorneys, legal collectives, and We The People News partners ready for protest defense.",
    category: "Legal Support",
    featured: true,
    keywords: ["attorney", "lawyer", "directory", "legal"],
    render: () => <LawyerFinder />,
  },
  {
    id: "attorney-seo",
    title: "Attorney Intelligence Profiles",
    description: "See which firms collaborate with We The People News investigations and what cases they champion.",
    category: "Legal Support",
    keywords: ["seo", "attorney", "profiles"],
    render: () => <AttorneySeoContent />,
  },
  {
    id: "activist-directory",
    title: "Activist & Watchdog Directory",
    description: "Connect with livestreamers, auditors, cop watchers, and local community observers.",
    category: "Community",
    keywords: ["activist", "directory", "community"],
    render: () => <ActivistDirectory />,
  },
  {
    id: "officer-accountability",
    title: "Officer & Agency Accountability",
    description: "Search misconduct histories, transparency scores, and discipline recommendations.",
    category: "Accountability",
    keywords: ["officer", "misconduct", "agency"],
    render: () => <OfficerAccountability />,
  },
  {
    id: "foia-builder",
    title: "FOIA Builder",
    description: "Draft airtight requests, send them securely, and collaborate with other requesters.",
    category: "Records & Data",
    keywords: ["foia", "request", "builder"],
    render: () => <FOIABuilder />,
  },
  {
    id: "foia-tracker",
    title: "FOIA Tracker",
    description: "Track deadlines, appeals, and release schedules with reminders.",
    category: "Records & Data",
    keywords: ["foia", "tracker", "deadlines"],
    render: () => <FOIATracker />,
  },
  {
    id: "legislative-action",
    title: "Legislative Action Center",
    description: "Follow bills targeting auditors, transparency, and civil rights with scripts to testify.",
    category: "Advocacy",
    keywords: ["legislation", "policy", "action"],
    render: () => <LegislativeActionCenter />,
  },
  {
    id: "case-search",
    title: "Case Search",
    description: "Research civil rights litigation precedents and crowdsource filings.",
    category: "Legal Support",
    keywords: ["cases", "search", "precedent"],
    render: () => <CaseSearch />,
  },
  {
    id: "ai-tools",
    title: "AI Research Tools",
    description: "Use AI copilots trained on civil rights pleadings and investigations.",
    category: "Records & Data",
    keywords: ["ai", "assistant", "copilot"],
    render: () => <AITools />,
  },
  {
    id: "resource-library",
    title: "Prevention & Resource Library",
    description: "Download quick guides, hotline numbers, and prevention checklists.",
    category: "Community",
    keywords: ["resources", "library", "prevention"],
    render: () => <Resources />,
  },
];

const categoryIcons: Record<string, ReactNode> = {
  "Rapid Response": <Radio className="h-4 w-4" />,
  "Legal Support": <Scale className="h-4 w-4" />,
  Community: <Layers3 className="h-4 w-4" />,
  Accountability: <Building className="h-4 w-4" />,
  "Records & Data": <FileText className="h-4 w-4" />,
  Advocacy: <CircuitBoard className="h-4 w-4" />,
};

export const ResourceCommandCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { state: focusState, setState: setFocusState } = useJurisdiction();

  const resourceDefinitions = useMemo(
    () => createResourceDefinitions(focusState, (state) => setFocusState(state)),
    [focusState, setFocusState]
  );

  const filteredResources = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return resourceDefinitions;
    }
    return resourceDefinitions.filter((resource) =>
      `${resource.title} ${resource.description} ${resource.keywords.join(" ")}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [resourceDefinitions, searchQuery]);

  const categoryGroups = useMemo(() => {
    const grouped: Record<string, ResourceDefinition[]> = {};
    filteredResources.forEach((resource) => {
      if (!grouped[resource.category]) {
        grouped[resource.category] = [];
      }
      grouped[resource.category]?.push(resource);
    });
    return Object.entries(grouped);
  }, [filteredResources]);

  const selectedResource = useMemo(
    () => resourceDefinitions.find((resource) => resource.id === selectedId) ?? null,
    [resourceDefinitions, selectedId]
  );

  const openResource = (id: string) => {
    setSelectedId(id);
    setIsSheetOpen(true);
  };

  return (
    <section id="resource-command" className="py-20">
      <span id="states" className="relative -top-24 block h-0" aria-hidden="true" />
      <span id="resources" className="relative -top-24 block h-0" aria-hidden="true" />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
            <Compass className="h-4 w-4" />
            Resource Command
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Navigate every tool without endless scrolling</h2>
          <p className="text-muted-foreground">
            Use the searchable menu to open scanners, FOIA copilots, attorney finders, and activist directories inside a focused command window.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Card className="border-primary/40 shadow-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Featured essentials
              </CardTitle>
              <CardDescription>
                These resources stay pinned for quick launches. Tap one to open it in the command drawer without losing your place on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {resourceDefinitions
                .filter((resource) => resource.featured)
                .map((resource) => (
                  <div
                    key={resource.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4"
                  >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{resource.category}</p>
                      <p className="text-lg font-semibold">{resource.title}</p>
                    </div>
                    <Button variant="secondary" onClick={() => openResource(resource.id)}>
                      Launch
                      <MapPinned className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Filter className="h-6 w-6 text-primary" />
                Search every resource
              </CardTitle>
              <CardDescription>
                Type any keyword ("scanner", "Florida", "AI") or browse by category. Results open in a slide-over workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command>
                <CommandInput
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Find a resource, law, or tool"
                />
                <CommandList>
                  <CommandEmpty>No resources matched that phrase.</CommandEmpty>
                  {categoryGroups.map(([category, resources]) => (
                    <CommandGroup key={category} heading={category} className="text-sm">
                      {resources.map((resource) => (
                        <CommandItem
                          key={resource.id}
                          className="flex items-center justify-between gap-4"
                          value={`${resource.title} ${resource.description}`}
                          onSelect={() => openResource(resource.id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-xs text-muted-foreground">{resource.description}</span>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {categoryIcons[category] ?? <Search className="h-3 w-3" />}
                            Menu
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl">
          {selectedResource ? (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle>{selectedResource.title}</SheetTitle>
                <SheetDescription>{selectedResource.description}</SheetDescription>
              </SheetHeader>
              <Separator />
              <div className="space-y-8">{selectedResource.render()}</div>
              {focusState && focusState !== DEFAULT_JURISDICTION && (
                <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
                  Focused on <span className="font-semibold text-primary">{focusState}</span>. Select a different state via the map or statute navigator to swap resources.
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Select a resource from the menu to load it here.
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
};
