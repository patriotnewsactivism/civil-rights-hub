import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AtSign, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export interface MentionUser {
  userId: string;
  displayName: string;
  avatarUrl?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: MentionUser[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  users?: MentionUser[];
  fetchUsers?: boolean;
}

interface UserFromDB {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "Type @ to mention someone...",
  disabled = false,
  className,
  rows = 3,
  users: propUsers,
  fetchUsers = false,
}: MentionInputProps): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState<MentionUser[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const users = useMemo(() => {
    if (propUsers && propUsers.length > 0) return propUsers;
    if (fetchUsers) return fetchedUsers;
    return [];
  }, [propUsers, fetchUsers, fetchedUsers]);

  useEffect(() => {
    if (fetchUsers && (!propUsers || propUsers.length === 0)) {
      const fetchUsersFromDB = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .limit(50);

        if (!error && data) {
          const mapped: MentionUser[] = (data as UserFromDB[]).map((user) => ({
            userId: user.id,
            displayName: user.display_name || "Unknown User",
            avatarUrl: user.avatar_url || undefined,
          }));
          setFetchedUsers(mapped);
        }
      };
      fetchUsersFromDB();
    }
  }, [fetchUsers, propUsers]);

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const lowerQuery = query.toLowerCase();
    return users.filter((user) => user.displayName.toLowerCase().includes(lowerQuery));
  }, [users, query]);

  const extractMentions = useCallback(
    (text: string): MentionUser[] => {
      const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
      const mentions: MentionUser[] = [];
      let match;

      while ((match = mentionRegex.exec(text)) !== null) {
        const mentionName = match[1];
        const user = users.find(
          (u) => u.displayName.toLowerCase() === mentionName.toLowerCase()
        );
        if (user && !mentions.some((m) => m.userId === user.userId)) {
          mentions.push(user);
        }
      }

      return mentions;
    },
    [users]
  );

  const calculateDropdownPosition = useCallback(() => {
    if (!textareaRef.current) return { top: 0, left: 0 };

    const textarea = textareaRef.current;
    const { selectionStart } = textarea;
    const text = textarea.value.substring(0, selectionStart);
    const lines = text.split("\n");
    const currentLineIndex = lines.length - 1;
    const currentLineText = lines[currentLineIndex];

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const charWidth = 8;

    const top = (currentLineIndex + 1) * lineHeight + 8;
    const left = Math.min(currentLineText.length * charWidth, textarea.offsetWidth - 200);

    return { top, left: Math.max(8, left) };
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const cursorPos = e.target.selectionStart;

      onChange(newValue, extractMentions(newValue));

      const lastAtIndex = newValue.lastIndexOf("@", cursorPos - 1);

      if (lastAtIndex !== -1) {
        const textAfterAt = newValue.substring(lastAtIndex + 1, cursorPos);
        const hasSpaceAfterAt = textAfterAt.includes(" ") && !textAfterAt.endsWith(" ");

        if (!hasSpaceAfterAt && (cursorPos === lastAtIndex + 1 || textAfterAt.match(/^[\w\s]*$/))) {
          if (cursorPos === lastAtIndex + 1) {
            setQuery("");
          } else {
            setQuery(textAfterAt.trim());
          }
          setMentionStart(lastAtIndex);
          setSelectedIndex(0);
          setDropdownPosition(calculateDropdownPosition());
          setShowDropdown(true);
          return;
        }
      }

      setShowDropdown(false);
      setMentionStart(null);
      setQuery("");
    },
    [onChange, extractMentions, calculateDropdownPosition]
  );

  const insertMention = useCallback(
    (user: MentionUser) => {
      if (!textareaRef.current || mentionStart === null) return;

      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const beforeMention = value.substring(0, mentionStart);
      const afterCursor = value.substring(cursorPos);
      const mentionText = `@${user.displayName} `;

      const newValue = beforeMention + mentionText + afterCursor;
      const newCursorPos = mentionStart + mentionText.length;

      onChange(newValue, extractMentions(newValue));

      setShowDropdown(false);
      setMentionStart(null);
      setQuery("");

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, mentionStart, onChange, extractMentions]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showDropdown || filteredUsers.length === 0) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          if (filteredUsers[selectedIndex]) {
            insertMention(filteredUsers[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowDropdown(false);
          setMentionStart(null);
          setQuery("");
          break;
      }
    },
    [showDropdown, filteredUsers, selectedIndex, insertMention]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setMentionStart(null);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownRef.current && showDropdown) {
      const selectedElement = dropdownRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, showDropdown]);

  const highlightMatch = (displayName: string, searchQuery: string): JSX.Element => {
    if (!searchQuery) return <span>{displayName}</span>;

    const lowerName = displayName.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const matchIndex = lowerName.indexOf(lowerQuery);

    if (matchIndex === -1) return <span>{displayName}</span>;

    const before = displayName.substring(0, matchIndex);
    const match = displayName.substring(matchIndex, matchIndex + searchQuery.length);
    const after = displayName.substring(matchIndex + searchQuery.length);

    return (
      <span>
        {before}
        <span className="bg-primary/20 text-primary font-medium">{match}</span>
        {after}
      </span>
    );
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-64 max-h-60 overflow-auto rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            {filteredUsers.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                <AtSign className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <ul className="p-1">
                {filteredUsers.map((user, index) => (
                  <li
                    key={user.userId}
                    data-index={index}
                    onClick={() => insertMention(user)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer transition-colors",
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {highlightMatch(user.displayName, query)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {value.includes("@") && (
        <div className="mt-2 flex flex-wrap gap-1">
          {extractMentions(value).map((mention) => (
            <span
              key={mention.userId}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              <User className="h-3 w-3" />
              {mention.displayName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}