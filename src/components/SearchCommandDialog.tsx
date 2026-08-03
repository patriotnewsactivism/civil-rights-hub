import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Scale,
  Zap,
  LifeBuoy,
  Users,
  Newspaper,
  Info,
  HandHeart,
  DollarSign,
  BarChart3,
  FileText,
  Radio,
  AlertCircle,
  MapPin,
  Map,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface CommandEntry {
  label: string;
  to: string;
  icon: typeof Scale;
  group: string;
  keywords?: string;
}

const ENTRIES: CommandEntry[] = [
  { label: "Know Your Rights", to: "/rights", icon: ShieldCheck, group: "Rights & Action", keywords: "constitutional amendments recording laws" },
  { label: "Act Now (Rapid Response)", to: "/do-this-now", icon: Zap, group: "Rights & Action", keywords: "emergency scripts rights card" },
  { label: "Report a Violation", to: "/do-this-now#report", icon: AlertCircle, group: "Rights & Action", keywords: "incident report police misconduct" },
  { label: "Law Library", to: "/learn", icon: BookOpen, group: "Rights & Action", keywords: "state laws guides" },

  { label: "Attorney Directory", to: "/help#attorneys", icon: Scale, group: "Tools & Help", keywords: "lawyer pro bono legal" },
  { label: "Activist Directory", to: "/help#activists", icon: Users, group: "Tools & Help", keywords: "auditor first amendment" },
  { label: "Public Records Tracker", to: "/help#records", icon: FileText, group: "Tools & Help", keywords: "foia tracker deadlines" },
  { label: "Resource Library", to: "/help#resources", icon: BookOpen, group: "Tools & Help", keywords: "guides templates" },
  { label: "All Tools (Command Center)", to: "/help#tools", icon: LifeBuoy, group: "Tools & Help", keywords: "scanner foia map case search ai" },
  { label: "Live Scanner Feeds", to: "/help#tools", icon: Radio, group: "Tools & Help", keywords: "police ems broadcastify" },

  { label: "Newsroom", to: "/newsroom", icon: Newspaper, group: "Community", keywords: "journalism investigations" },
  { label: "Community Feed", to: "/community", icon: Users, group: "Community", keywords: "social posts stories go live" },
  { label: "States Directory", to: "/states", icon: Map, group: "Community", keywords: "state page map" },

  { label: "About", to: "/about", icon: Info, group: "Organization", keywords: "wtpn mission" },
  { label: "Volunteer", to: "/volunteer", icon: HandHeart, group: "Organization", keywords: "contribute help roles" },
  { label: "Contribute", to: "/contribute", icon: HandHeart, group: "Organization", keywords: "donate support" },
  { label: "Donate", to: "/donate", icon: DollarSign, group: "Organization", keywords: "patreon cashapp venmo support" },
  { label: "Transparency", to: "/transparency", icon: BarChart3, group: "Organization", keywords: "costs funding governance" },
  { label: "Find My State", to: "/states", icon: MapPin, group: "Organization", keywords: "jurisdiction location" },
];

export const SearchCommandDialog = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const groups = [...new Set(ENTRIES.map((e) => e.group))];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Civil Rights Hub</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search pages, tools, and resources…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group} heading={group}>
                {ENTRIES.filter((e) => e.group === group).map(({ label, to, icon: Icon, keywords }) => (
                  <CommandItem
                    key={label}
                    value={`${label} ${keywords ?? ""}`}
                    onSelect={() => go(to)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
