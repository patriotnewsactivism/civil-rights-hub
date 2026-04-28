import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ExternalShareButtonsProps {
  url: string;
  title?: string;
  text?: string;
}

const PLATFORMS = [
  {
    name: "X / Twitter",
    icon: "𝕏",
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
  },
  {
    name: "Facebook",
    icon: "f",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
  },
  {
    name: "Reddit",
    icon: "⬡",
    getUrl: (url: string, text: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    color: "hover:bg-[#FF5700]/10 hover:text-[#FF5700]",
  },
  {
    name: "Telegram",
    icon: "✈",
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    color: "hover:bg-[#0088CC]/10 hover:text-[#0088CC]",
  },
  {
    name: "WhatsApp",
    icon: "☎",
    getUrl: (url: string, text: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
    color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
  },
  {
    name: "Email",
    icon: "✉",
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    color: "hover:bg-muted hover:text-foreground",
  },
];

export function ExternalShareButtons({
  url,
  title = "Civil Rights Hub",
  text = "Check this out on Civil Rights Hub",
}: ExternalShareButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Share externally
      </p>
      <div className="grid grid-cols-3 gap-2">
        {PLATFORMS.map(({ name, icon, getUrl, color }) => (
          <a
            key={name}
            href={getUrl(url, text)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="outline"
              size="sm"
              className={`w-full gap-1.5 text-xs h-9 border-border/60 ${color} transition-all`}
            >
              <span className="text-base leading-none">{icon}</span>
              {name}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}
