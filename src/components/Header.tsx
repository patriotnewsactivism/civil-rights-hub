import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Users,
  MessageCircle,
  Sparkles,
  Menu,
  ShieldCheck,
  Zap,
  Wrench,
  Newspaper,
  LifeBuoy,
  BookOpenText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StateQuickSelect } from "@/components/StateQuickSelect";
import { NotificationBell } from "@/components/NotificationBell";

export function Header() {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setUnreadMessages(0);
      return;
    }

    const loadCounts = async () => {
      const { count: msgCount } = await supabase
        .from("direct_messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false)
        .eq("is_deleted_by_recipient", false);

      setUnreadMessages(msgCount ?? 0);
    };

    void loadCounts();

    const channel = supabase
      .channel(`header-counts-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${user.id}` },
        () => {
          void loadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-base md:text-xl">
          <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm md:text-base">Civil Rights Hub</span>
            <span className="text-[10px] md:text-xs font-normal text-muted-foreground hidden sm:block">by We The People News</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/rights">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Rights
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/do-this-now">
                <Zap className="h-4 w-4 mr-2" />
                Do This Now
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tools">
                <Wrench className="h-4 w-4 mr-2" />
                Tools
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/learn">
                <BookOpenText className="h-4 w-4 mr-2" />
                Learn
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/newsroom">
                <Newspaper className="h-4 w-4 mr-2" />
                Newsroom
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help">
                <LifeBuoy className="h-4 w-4 mr-2" />
                Get Help
              </Link>
            </Button>
          </div>

          <div className="hidden lg:block">
            <StateQuickSelect />
          </div>

          {/* User Actions - Always Visible */}
          {user && (
            <>
              <NotificationBell />
              <Button variant="ghost" size="icon" asChild className="relative h-9 w-9">
                <Link to="/community?tab=messages" aria-label="Messages">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {Math.min(unreadMessages, 99)}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          )}

          {/* Auth Button / Community Button */}
          {user ? (
            <Button asChild size="sm" className="hidden sm:flex">
              <Link to="/community">
                <Users className="h-4 w-4 mr-2" />
                Community
              </Link>
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" className="hidden sm:flex flex-col items-start gap-0 px-3 md:px-4 text-left leading-tight h-auto py-2">
                  <span className="font-semibold text-xs md:text-sm">Join Network</span>
                  <span className="text-[10px] text-primary-foreground/90 hidden md:block">
                    Reports, FOIAs & Legal Support
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Why create an account?</p>
                      <p className="text-xs text-muted-foreground">
                        Securely collaborate with attorneys, track violation updates, and receive scanner alerts tailored to your state.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        Citizen Intel
                      </Badge>
                      <span>Archive footage, documents, and FOIA drafts in one encrypted workspace.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        Alerts
                      </Badge>
                      <span>Receive notifications when attorneys boost availability or when scanner incidents match your area.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        Community
                      </Badge>
                      <span>Message journalists, activists, and pro bono partners coordinating on the same case.</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/auth">Create a free profile</Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                <StateQuickSelect />
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/rights">
                    <ShieldCheck className="h-4 w-4 mr-3" />
                    Know Your Rights
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/do-this-now">
                    <Zap className="h-4 w-4 mr-3" />
                    Do This Now
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/tools">
                    <Wrench className="h-4 w-4 mr-3" />
                    Tools
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/learn">
                    <BookOpenText className="h-4 w-4 mr-3" />
                    Learn
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/newsroom">
                    <Newspaper className="h-4 w-4 mr-3" />
                    Newsroom
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/help">
                    <LifeBuoy className="h-4 w-4 mr-3" />
                    Get Help
                  </Link>
                </Button>
                {user ? (
                  <Button asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/community">
                      <Users className="h-4 w-4 mr-3" />
                      Community
                    </Link>
                  </Button>
                ) : (
                  <Button asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/auth">
                      <Sparkles className="h-4 w-4 mr-3" />
                      Join Network
                    </Link>
                  </Button>
                )}
                {!user && (
                  <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-semibold mb-2">Create a Free Account</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>• File violation reports</li>
                      <li>• Track FOIA requests</li>
                      <li>• Connect with attorneys</li>
                      <li>• Scanner alerts for your area</li>
                    </ul>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
       </nav>
     </div>
   </header>
  );
}
