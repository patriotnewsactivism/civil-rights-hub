import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  endsAt?: string;
  allowMultiple: boolean;
  totalVotes: number;
}

interface PollDisplayProps {
  poll: PollData;
  userVotes: string[] | null;
  onVote: (optionIds: string[]) => void;
  isExpired: boolean;
}

export function PollDisplay({
  poll,
  userVotes,
  onVote,
  isExpired,
}: PollDisplayProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(userVotes || [])
  );
  const [hasVoted, setHasVoted] = useState(userVotes !== null && userVotes.length > 0);

  useEffect(() => {
    if (userVotes !== null && userVotes.length > 0) {
      setSelectedOptions(new Set(userVotes));
      setHasVoted(true);
    }
  }, [userVotes]);

  const showResults = hasVoted || isExpired;

  const timeRemaining = useMemo(() => {
    if (!poll.endsAt) return null;
    const end = new Date(poll.endsAt).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
  }, [poll.endsAt]);

  const handleSingleSelect = (optionId: string) => {
    setSelectedOptions(new Set([optionId]));
  };

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    const newSelection = new Set(selectedOptions);
    if (checked) {
      newSelection.add(optionId);
    } else {
      newSelection.delete(optionId);
    }
    setSelectedOptions(newSelection);
  };

  const handleSubmitVote = () => {
    if (selectedOptions.size === 0) return;
    onVote(Array.from(selectedOptions));
    setHasVoted(true);
  };

  const getPercentage = (voteCount: number): number => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((voteCount / poll.totalVotes) * 100);
  };

  const isLeading = (option: PollOption): boolean => {
    if (poll.totalVotes === 0) return false;
    const maxVotes = Math.max(...poll.options.map((o) => o.voteCount));
    return option.voteCount === maxVotes && maxVotes > 0;
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{poll.question}</h3>
        {poll.endsAt && (
          <span
            className={cn(
              "flex items-center gap-1 whitespace-nowrap text-xs",
              isExpired ? "text-muted-foreground" : "text-primary"
            )}
          >
            <Clock className="h-3 w-3" />
            {isExpired ? "Expired" : timeRemaining}
          </span>
        )}
      </div>

      {showResults ? (
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = getPercentage(option.voteCount);
            const isSelected = userVotes?.includes(option.id);
            const leading = isLeading(option);

            return (
              <div key={option.id} className="relative">
                <div
                  className={cn(
                    "relative flex items-center justify-between rounded-lg border p-3 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background",
                    leading && !isSelected && "border-primary/50"
                  )}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{option.text}</span>
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-sm font-bold">{percentage}%</span>
                    <span className="text-xs text-muted-foreground">
                      ({option.voteCount})
                    </span>
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-lg bg-primary/10 transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            );
          })}

          <div className="flex items-center gap-1 pt-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
            </span>
            {poll.allowMultiple && (
              <span className="ml-1">· Multiple answers allowed</span>
            )}
          </div>
        </div>
      ) : (
        <>
          {poll.allowMultiple ? (
            <div className="space-y-2">
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                    selectedOptions.has(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Checkbox
                    checked={selectedOptions.has(option.id)}
                    onCheckedChange={(checked) =>
                      handleMultiSelect(option.id, checked as boolean)
                    }
                  />
                  <span className="text-sm">{option.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={selectedOptions.values().next().value || ""}
              onValueChange={handleSingleSelect}
              className="space-y-2"
            >
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                    selectedOptions.has(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span className="text-sm">{option.text}</span>
                </label>
              ))}
            </RadioGroup>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {poll.allowMultiple ? "Select one or more options" : "Select one option"}
            </span>
            <Button
              size="sm"
              onClick={handleSubmitVote}
              disabled={selectedOptions.size === 0}
            >
              Vote
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
