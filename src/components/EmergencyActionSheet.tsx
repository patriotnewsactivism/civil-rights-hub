import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  Video,
  MapPin,
  Phone,
  FileText,
  Shield,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

interface EmergencyActionSheetProps {
  open: boolean;
  onClose: () => void;
}

const ACTIONS = [
  {
    icon: Video,
    label: "Go Live / Record",
    description: "Start recording with automatic cloud backup",
    to: "/do-this-now#golive",
    color: "text-red-500",
    bg: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30",
  },
  {
    icon: MapPin,
    label: "Share My Location",
    description: "Instantly alert your emergency contacts",
    to: "/do-this-now#location",
    color: "text-orange-500",
    bg: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30",
  },
  {
    icon: AlertCircle,
    label: "Report Violation",
    description: "Document and submit a civil rights violation",
    to: "/do-this-now#report",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30",
  },
  {
    icon: FileText,
    label: "Auto-Draft Report",
    description: "AI drafts your incident report in 30 seconds",
    to: "/do-this-now#autodraft",
    color: "text-blue-500",
    bg: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
  },
  {
    icon: Shield,
    label: "Find Attorney NOW",
    description: "Nearest available civil rights attorney",
    to: "/attorneys",
    color: "text-green-500",
    bg: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30",
  },
  {
    icon: Phone,
    label: "Emergency Contacts",
    description: "ACLU, legal aid, and bail hotlines",
    to: "/do-this-now#contacts",
    color: "text-purple-500",
    bg: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30",
  },
];

export function EmergencyActionSheet({ open, onClose }: EmergencyActionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-8"
      >
        <SheetHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <SheetTitle className="text-lg font-black">
                I Need Help NOW
              </SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Everything you need — record, locate, alert, report, find help.
          </p>
        </SheetHeader>

        <div className="grid grid-cols-1 gap-2 mt-4">
          {ACTIONS.map(({ icon: Icon, label, description, to, color, bg }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-4 p-4 rounded-xl border ${bg} transition-all group`}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg bg-background`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          If you are in immediate danger, call{" "}
          <a href="tel:911" className="text-primary font-bold">
            911
          </a>
        </p>
      </SheetContent>
    </Sheet>
  );
}

// Floating button that lives on every page
export function EmergencyFAB() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-2xl shadow-red-900/40 transition-all animate-pulse-slow"
        aria-label="Emergency help"
      >
        <Zap className="h-4 w-4" />
        <span className="hidden sm:inline">Help Now</span>
      </button>
      <EmergencyActionSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
