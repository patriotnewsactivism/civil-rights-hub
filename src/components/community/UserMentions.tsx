import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface UserMentionsProps {
  query: string;
  onSelect: (displayName: string) => void;
  className?: string;
}

export function UserMentions({ query, onSelect, className }: UserMentionsProps) {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, display_name, avatar_url")
          .ilike("display_name", `${query}%`)
          .limit(5);

        if (error) throw error;
        setSuggestions(data || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Error fetching mention suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        onSelect(suggestions[selectedIndex].display_name || "anonymous");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex, onSelect]);

  if (suggestions.length === 0 && !loading) return null;

  return (
    <div className={cn(
      "absolute z-50 w-64 bg-background border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100",
      className
    )}>
      <div className="p-2 border-b border-border bg-muted/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Mention User
        </span>
      </div>
      <ScrollArea className="max-h-[200px]">
        {loading && suggestions.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground italic">
            Searching...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground italic">
            No users found
          </div>
        ) : (
          <div className="p-1">
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => onSelect(user.display_name || "anonymous")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors",
                  index === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {user.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none">
                    {user.display_name || "Anonymous"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
