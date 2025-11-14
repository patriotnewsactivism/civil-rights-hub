import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionQuickNavProps {
  sections: SectionNavItem[];
}

export function SectionQuickNav({ sections }: SectionQuickNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const uniqueSections = useMemo(
    () =>
      sections.filter((section, index) =>
        sections.findIndex((candidate) => candidate.id === section.id) === index
      ),
    [sections]
  );

  useEffect(() => {
    setActiveId(uniqueSections[0]?.id ?? "");
  }, [uniqueSections]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1
      }
    );

    const observedElements: HTMLElement[] = [];

    uniqueSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        observedElements.push(element);
      }
    });

    return () => {
      observedElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [uniqueSections]);

  const scrollToSection = useCallback(
    (id: string) => {
      if (typeof window === "undefined") {
        return;
      }

      const element = document.getElementById(id);
      if (!element) {
        return;
      }

      const yOffset = -80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
      setActiveId(id);
      setIsCollapsed(false);
    },
    []
  );

  const activeIndex = uniqueSections.findIndex((section) => section.id === activeId);

  const handlePrevious = () => {
    if (activeIndex > 0) {
      scrollToSection(uniqueSections[activeIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (activeIndex < uniqueSections.length - 1 && activeIndex !== -1) {
      scrollToSection(uniqueSections[activeIndex + 1].id);
    }
  };

  if (uniqueSections.length === 0) {
    return null;
  }

  return (
    <div className="hidden xl:block" data-testid="section-quick-nav">
      <div className="fixed top-32 right-6 z-40 w-64">
        <div className="rounded-3xl border border-border/60 bg-background/85 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick Jump
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Scroll to previous section"
                disabled={activeIndex <= 0}
                className={cn(
                  "rounded-full border border-border/60 bg-background p-1 text-muted-foreground transition hover:text-foreground",
                  activeIndex <= 0 && "opacity-40 hover:text-muted-foreground"
                )}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Scroll to next section"
                disabled={activeIndex === uniqueSections.length - 1 || activeIndex === -1}
                className={cn(
                  "rounded-full border border-border/60 bg-background p-1 text-muted-foreground transition hover:text-foreground",
                  (activeIndex === uniqueSections.length - 1 || activeIndex === -1) &&
                    "opacity-40 hover:text-muted-foreground"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed((prev) => !prev)}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Expand quick navigation" : "Collapse quick navigation"}
                className="rounded-full border border-border/60 bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                {isCollapsed ? "Show" : "Hide"}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <nav aria-label="Quick section navigation" className="max-h-[60vh] overflow-y-auto px-3 pb-4">
              <ul className="space-y-1.5">
                {uniqueSections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      aria-current={activeId === section.id ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                        activeId === section.id
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          activeId === section.id ? "bg-primary-foreground" : "bg-muted-foreground/60"
                        )}
                      />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
