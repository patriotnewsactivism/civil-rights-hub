import { Newspaper, MessageCircle, CalendarDays, MessageSquare, Bell, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityMobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const NAV_ITEMS = [
  { value: "feed", icon: Newspaper, label: "Feed" },
  { value: "discuss", icon: MessageCircle, label: "Discuss" },
  { value: "events", icon: CalendarDays, label: "Events" },
  { value: "messages", icon: MessageSquare, label: "Messages" },
  { value: "notifications", icon: Bell, label: "Alerts" },
  { value: "network", icon: Globe, label: "Network" },
  { value: "profile", icon: User, label: "Profile" },
];

export function CommunityMobileNav({ activeTab, onTabChange }: CommunityMobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border px-2 py-1 flex justify-around items-center h-16 safe-area-bottom">
      {NAV_ITEMS.map(({ value, icon: Icon, label }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 min-w-0 py-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", isActive && "animate-in fade-in zoom-in duration-300")} />
            <span className="text-[10px] font-medium truncate w-full text-center">
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
