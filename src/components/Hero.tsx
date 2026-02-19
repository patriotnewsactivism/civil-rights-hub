import { Button } from "@/components/ui/button";
import { Shield, Scale, Users, ArrowRight, Search, FileText, Radio, Scale as LegalIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <header className="border-b border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/wtpn-logo.png" alt="WTPN Logo" className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Civil Rights Hub</span>
              <span className="text-xs text-muted-foreground">by We The People News</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/rights" className="text-muted-foreground hover:text-foreground transition-colors">Rights</Link>
            <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Tools</Link>
            <Link to="/learn" className="text-muted-foreground hover:text-foreground transition-colors">Learn</Link>
            <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Get Help</Link>
          </nav>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Know Your Rights.<br />
            <span className="text-muted-foreground">Protect Your Freedom.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Comprehensive civil rights resources, state-specific laws, and legal support—all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/rights">
                <Shield className="h-4 w-4" />
                Know Your Rights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/help">
                Find Legal Help
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/tools#foia" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <div className="p-2 rounded-lg bg-background">
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">FOIA Builder</p>
                <p className="text-xs text-muted-foreground">Draft requests</p>
              </div>
            </Link>
            <Link to="/tools#scanner" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <div className="p-2 rounded-lg bg-background">
                <Radio className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Police Scanner</p>
                <p className="text-xs text-muted-foreground">Live feeds</p>
              </div>
            </Link>
            <Link to="/help" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <div className="p-2 rounded-lg bg-background">
                <LegalIcon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Find Attorney</p>
                <p className="text-xs text-muted-foreground">Legal support</p>
              </div>
            </Link>
            <Link to="/learn" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <div className="p-2 rounded-lg bg-background">
                <Search className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">State Laws</p>
                <p className="text-xs text-muted-foreground">By jurisdiction</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
