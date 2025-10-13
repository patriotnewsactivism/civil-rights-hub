import { Shield } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">Civil Rights Hub</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-sm text-background/80">
              Educational resource for civil rights information. Not a substitute for legal advice.
            </p>
            <p className="text-sm text-background/60 mt-2">
              © {currentYear} Civil Rights Hub. Information subject to change.
            </p>
          </div>
          
          <div className="flex gap-4 text-sm">
            <button className="hover:text-primary-glow transition-colors">Privacy</button>
            <button className="hover:text-primary-glow transition-colors">Terms</button>
            <button className="hover:text-primary-glow transition-colors">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
