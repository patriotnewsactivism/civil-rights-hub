import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  onPollCreate: (poll: {
    question: string;
    options: string[];
    endsAt?: Date;
    allowMultiple: boolean;
  }) => void;
  onCancel: () => void;
}

const generateId = (): string => Math.random().toString(36).substring(2, 9);

export function PollCreator({ onPollCreate, onCancel }: PollCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { id: generateId(), text: "" },
    { id: generateId(), text: "" },
  ]);
  const [endsAt, setEndsAt] = useState<string>("");
  const [allowMultiple, setAllowMultiple] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: generateId(), text: "" }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const isValid =
    question.trim().length > 0 &&
    options.every((opt) => opt.text.trim().length > 0) &&
    options.length >= 2;

  const handleCreate = () => {
    if (!isValid) return;

    const pollData: {
      question: string;
      options: string[];
      endsAt?: Date;
      allowMultiple: boolean;
    } = {
      question: question.trim(),
      options: options.map((opt) => opt.text.trim()),
      allowMultiple,
    };

    if (endsAt) {
      pollData.endsAt = new Date(endsAt);
    }

    onPollCreate(pollData);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Question</label>
        <Input
          placeholder="What would you like to ask?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={280}
        />
        <p className="mt-1 text-xs text-muted-foreground">{question.length}/280</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                maxLength={100}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(option.id)}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="mt-2"
          >
            <Plus className="h-4 w-4" />
            Add option
          </Button>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {options.length}/6 options
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          End date/time (optional)
        </label>
        <Input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Allow multiple answers</p>
          <p className="text-xs text-muted-foreground">
            Voters can select more than one option
          </p>
        </div>
        <Switch checked={allowMultiple} onCheckedChange={setAllowMultiple} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleCreate} disabled={!isValid}>
          Create Poll
        </Button>
      </div>
    </div>
  );
}
