import { useState, useEffect, useRef } from "react";
import {
  Smile,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Flame,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Reaction {
  type: string;
  count: number;
  users: string[];
}

interface ReactionConfig {
  type: string;
  emoji: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ReactionPickerProps {
  postId: string;
  currentReaction: string | null;
  reactions: Reaction[];
  onReact: (type: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const REACTION_CONFIGS: ReactionConfig[] = [
  { type: "like", emoji: "👍", label: "Like", icon: ThumbsUp, color: "text-blue-500" },
  { type: "love", emoji: "❤️", label: "Love", icon: Heart, color: "text-red-500" },
  { type: "laugh", emoji: "😂", label: "Laugh", icon: Laugh, color: "text-yellow-500" },
  { type: "wow", emoji: "😮", label: "Wow", icon: Sparkles, color: "text-amber-500" },
  { type: "sad", emoji: "😢", label: "Sad", icon: Frown, color: "text-blue-400" },
  { type: "angry", emoji: "😠", label: "Angry", icon: Angry, color: "text-orange-500" },
  { type: "fire", emoji: "🔥", label: "Fire", icon: Flame, color: "text-orange-600" },
  { type: "celebrate", emoji: "🎉", label: "Celebrate", icon: PartyPopper, color: "text-purple-500" },
];

function getReactionConfig(type: string): ReactionConfig | undefined {
  return REACTION_CONFIGS.find((r) => r.type === type);
}

function AnimatedEmoji({
  emoji,
  isAnimating,
}: {
  emoji: string;
  isAnimating: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block text-lg transition-transform duration-200",
        isAnimating && "animate-bounce"
      )}
    >
      {emoji}
    </span>
  );
}

function ReactionButton({
  config,
  isActive,
  count,
  onClick,
  disabled,
}: {
  config: ReactionConfig;
  isActive: boolean;
  count: number;
  onClick: () => void;
  disabled: boolean;
}) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-200",
        "hover:scale-110 hover:bg-accent",
        isActive && "bg-accent ring-2 ring-primary/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span className="text-2xl">{config.emoji}</span>
      <span
        className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium shadow-md",
          "transition-opacity duration-200",
          showLabel ? "opacity-100" : "opacity-0"
        )}
      >
        {config.label}
      </span>
      {count > 0 && (
        <span className="mt-1 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

function ReactionSummary({
  reactions,
  onReactionClick,
}: {
  reactions: Reaction[];
  onReactionClick: (type: string) => void;
}) {
  const validReactions = reactions.filter((r) => r.count > 0);

  if (validReactions.length === 0) return null;

  const totalCount = validReactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <button
      type="button"
      onClick={() => {
        const firstReaction = validReactions[0];
        if (firstReaction) onReactionClick(firstReaction.type);
      }}
      className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-sm transition-colors hover:bg-muted"
    >
      <div className="flex -space-x-1">
        {validReactions.slice(0, 3).map((reaction) => {
          const config = getReactionConfig(reaction.type);
          if (!config) return null;
          return (
            <span
              key={reaction.type}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-sm"
            >
              {config.emoji}
            </span>
          );
        })}
      </div>
      <span className="font-medium text-muted-foreground">{totalCount}</span>
    </button>
  );
}

function ReactionUsers({
  users,
  maxUsers = 3,
}: {
  users: string[];
  maxUsers?: number;
}) {
  const displayUsers = users.slice(0, maxUsers);
  const remainingCount = users.length - maxUsers;

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {displayUsers.map((user, index) => (
          <Avatar key={index} className="h-6 w-6 border-2 border-background">
            <AvatarImage src="" alt={user} />
            <AvatarFallback className="text-xs">
              {user.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs text-muted-foreground">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

export function ReactionPicker({
  postId,
  currentReaction,
  reactions,
  onReact,
  onRemove,
  disabled = false,
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(
    null
  );
  const prevReactionRef = useRef<string | null>(currentReaction);

  useEffect(() => {
    if (currentReaction !== prevReactionRef.current) {
      setAnimatingReaction(currentReaction);
      const timer = setTimeout(() => setAnimatingReaction(null), 500);
      prevReactionRef.current = currentReaction;
      return () => clearTimeout(timer);
    }
  }, [currentReaction]);

  const handleReactionClick = (type: string) => {
    if (disabled) return;

    if (currentReaction === type) {
      onRemove();
    } else {
      onReact(type);
    }
    setIsOpen(false);
  };

  const currentConfig = currentReaction
    ? getReactionConfig(currentReaction)
    : null;

  const getReactionCount = (type: string): number => {
    const reaction = reactions.find((r) => r.type === type);
    return reaction?.count ?? 0;
  };

  const getReactionUsers = (type: string): string[] => {
    const reaction = reactions.find((r) => r.type === type);
    return reaction?.users ?? [];
  };

  const allUsers = reactions.flatMap((r) => r.users);
  const uniqueUsers = [...new Set(allUsers)];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              className={cn(
                "gap-1 transition-all duration-200",
                currentReaction && "font-medium"
              )}
            >
              {currentConfig ? (
                <>
                  <AnimatedEmoji
                    emoji={currentConfig.emoji}
                    isAnimating={animatingReaction === currentReaction}
                  />
                  <span className={currentConfig.color}>
                    {currentConfig.label}
                  </span>
                </>
              ) : (
                <>
                  <Smile className="h-4 w-4" />
                  <span>React</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2"
            align="start"
            side="top"
            sideOffset={8}
          >
            <div className="flex gap-1">
              {REACTION_CONFIGS.map((config) => (
                <ReactionButton
                  key={config.type}
                  config={config}
                  isActive={currentReaction === config.type}
                  count={getReactionCount(config.type)}
                  onClick={() => handleReactionClick(config.type)}
                  disabled={disabled}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <ReactionSummary
          reactions={reactions}
          onReactionClick={handleReactionClick}
        />
      </div>

      {uniqueUsers.length > 0 && (
        <div className="flex items-center justify-between">
          <ReactionUsers users={uniqueUsers} />
        </div>
      )}
    </div>
  );
}

export type { ReactionPickerProps, Reaction, ReactionConfig };
