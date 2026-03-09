import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, FileText, Radio, Scale as LegalIcon, Search, AlertCircle, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10 opacity-30" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Nationwide Civil Rights Network Active
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance">
            Know Your Rights.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Protect Your Freedom.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
            The ultimate resource for activists, journalists, and citizens. Access state-specific laws, find verified attorneys, and document violations securely.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 w-full sm:w-auto">
              <Link to="/rights">
                <Shield className="mr-2 h-5 w-5" />
                Start Here
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto backdrop-blur-sm bg-background/50">
              <Link to="/community">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Link>
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12 pt-8 border-t border-border/50">
            <Link to="/tools" className="group p-4 rounded-xl bg-card border hover:border-primary/50 transition-all hover:shadow-md text-left">
              <div className="mb-3 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">FOIA Builder</h3>
              <p className="text-xs text-muted-foreground">Draft & track public records requests.</p>
            </Link>

            <Link to="/tools#scanner" className="group p-4 rounded-xl bg-card border hover:border-primary/50 transition-all hover:shadow-md text-left">
              <div className="mb-3 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">Police Scanners</h3>
              <p className="text-xs text-muted-foreground">Listen to live feeds in your area.</p>
            </Link>

            <Link to="/attorneys" className="group p-4 rounded-xl bg-card border hover:border-primary/50 transition-all hover:shadow-md text-left">
              <div className="mb-3 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <LegalIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">Find Attorney</h3>
              <p className="text-xs text-muted-foreground">Verified civil rights legal counsel.</p>
            </Link>

            <Link to="/learn" className="group p-4 rounded-xl bg-card border hover:border-primary/50 transition-all hover:shadow-md text-left">
              <div className="mb-3 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">State Laws</h3>
              <p className="text-xs text-muted-foreground">Research laws by jurisdiction.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
