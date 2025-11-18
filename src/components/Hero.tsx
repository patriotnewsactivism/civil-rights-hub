import { Button } from "@/components/ui/button";
import { Shield, Scale, Users } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header id="overview" className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0yaC04Yy0xLjEgMC0yIC45LTIgMnY4YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMnYtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/wtpn-logo.png" alt="WTPN Logo" className="h-12 w-auto" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary-foreground">Civil Rights Hub</span>
              <span className="text-sm text-primary-foreground/90">by We The People News</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection('rights')} className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Your Rights
            </button>
            <button onClick={() => scrollToSection('states')} className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              State Laws
            </button>
            <button onClick={() => scrollToSection('resources')} className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Resources
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-4 md:mb-6">
            <img src="/wtpn-logo.png" alt="WTPN Logo" className="h-20 w-auto md:h-32 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 md:mb-6 leading-tight px-4">
            Know Your Rights.<br className="hidden sm:block" /> Protect Your Freedom.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-6 md:mb-8 leading-relaxed px-4 max-w-3xl mx-auto">
            Access comprehensive civil rights information, state-specific laws, and legal resources
            to understand and defend your constitutional rights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={() => scrollToSection('resource-command')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-strong text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto"
            >
              Explore Resources
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('rights')}
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto"
            >
              Your Rights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-16 max-w-5xl mx-auto px-4">
          {[
            { icon: Shield, title: "Constitutional Rights", desc: "First, Fourth, and Fifth Amendment protections" },
            { icon: Scale, title: "Legal Resources", desc: "Connect with qualified legal aid organizations" },
            { icon: Users, title: "State-Specific Laws", desc: "Recording laws and regulations by state" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-strong">
              <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-primary-foreground mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-primary-foreground/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
