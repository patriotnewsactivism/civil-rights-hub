import { Button } from "@/components/ui/button";
import { Shield, Scale, Users } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0yaC04Yy0xLjEgMC0yIC45LTIgMnY4YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMnYtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">Civil Rights Hub</span>
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

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <Shield className="h-32 w-32 md:h-40 md:w-40 text-primary-foreground drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Know Your Rights.<br />Protect Your Freedom.
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Access comprehensive civil rights information, state-specific laws, and legal resources
            to understand and defend your constitutional rights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('states')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-strong text-lg px-8 py-6"
            >
              Find Your State Laws
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('resources')}
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
            >
              Get Legal Help
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          {[
            { icon: Shield, title: "Constitutional Rights", desc: "First, Fourth, and Fifth Amendment protections" },
            { icon: Scale, title: "Legal Resources", desc: "Connect with qualified legal aid organizations" },
            { icon: Users, title: "State-Specific Laws", desc: "Recording laws and regulations by state" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-strong">
              <feature.icon className="h-10 w-10 text-primary-foreground mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">{feature.title}</h3>
              <p className="text-primary-foreground/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
