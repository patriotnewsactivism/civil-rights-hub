import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Scale,
  FileText,
  AlertCircle,
  Users,
  Search,
  LucideIcon,
} from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost";
}

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  headline: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  hint?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  headline,
  description,
  primaryAction,
  secondaryAction,
  hint,
  className,
}: EmptyStateProps) {
  const IconEl =
    icon && typeof icon === "function"
      ? (() => {
          const I = icon as LucideIcon;
          return <I className="h-10 w-10 text-muted-foreground/40" />;
        })()
      : icon ?? null;

  const renderAction = (action: EmptyStateAction, isPrimary: boolean) => {
    const props = {
      variant: (action.variant ?? (isPrimary ? "default" : "outline")) as
        | "default"
        | "outline"
        | "ghost",
      size: "sm" as const,
    };
    if (action.href) {
      return (
        <Button key={action.label} {...props} asChild>
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            {action.label}
          </a>
        </Button>
      );
    }
    return (
      <Button key={action.label} {...props} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 space-y-4",
        className,
      )}
    >
      {IconEl && <div className="mb-2">{IconEl}</div>}
      <div className="space-y-1.5">
        <p className="font-semibold text-foreground text-base">{headline}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex gap-2 flex-wrap justify-center pt-1">
          {primaryAction && renderAction(primaryAction, true)}
          {secondaryAction && renderAction(secondaryAction, false)}
        </div>
      )}
      {hint && <p className="text-xs text-muted-foreground max-w-sm">{hint}</p>}
    </div>
  );
}

// Pre-built variants for common use cases
export function AttorneyEmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={Scale}
      headline="No attorneys match your filters"
      description="Try removing the state or specialty filter to see more results."
      primaryAction={onClearFilters ? { label: "Clear all filters", onClick: onClearFilters } : undefined}
      secondaryAction={{ label: "ACLU helpline", href: "https://www.aclu.org/know-your-rights" }}
      hint="Need immediate help? Call the National Lawyers Guild at 212-679-5100."
    />
  );
}

export function ViolationEmptyState({ onReport }: { onReport?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      headline="No violations reported in your area yet"
      description="Be the first to document an incident. Your report helps build accountability and connects others with resources."
      primaryAction={{ label: "Report a violation", onClick: onReport, href: onReport ? undefined : "/do-this-now#report" }}
      secondaryAction={{ label: "What to document", href: "/rights" }}
      hint="All reports can be submitted anonymously. You control what information is shared."
    />
  );
}

export function FOIAEmptyState({ onNew }: { onNew?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      headline="No FOIA requests tracked yet"
      description="Start tracking a public records request. We'll monitor deadlines, send reminders, and help you follow up."
      primaryAction={{ label: "New FOIA request", onClick: onNew }}
      secondaryAction={{ label: "Browse templates", href: "/tools" }}
      hint="Federal agencies must respond within 20 business days. State deadlines vary."
    />
  );
}

export function NetworkEmptyState() {
  return (
    <EmptyState
      icon={Users}
      headline="Your network is empty"
      description="Connect with activists, journalists, and advocates in your area to build your civil rights network."
      primaryAction={{ label: "Browse activists", href: "/activists" }}
      secondaryAction={{ label: "Join community", href: "/community" }}
    />
  );
}

export function SearchEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      headline={query ? `No results for "${query}"` : "No results found"}
      description="Try different keywords, check spelling, or browse by category."
    />
  );
}
