import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CITY_LINKS = [
  { slug: "los-angeles", label: "Los Angeles" },
  { slug: "new-york", label: "New York" },
  { slug: "chicago", label: "Chicago" },
  { slug: "houston", label: "Houston" },
  { slug: "phoenix", label: "Phoenix" },
  { slug: "philadelphia", label: "Philadelphia" },
  { slug: "san-antonio", label: "San Antonio" },
  { slug: "san-diego", label: "San Diego" },
  { slug: "dallas", label: "Dallas" },
  { slug: "san-francisco", label: "San Francisco" },
  { slug: "seattle", label: "Seattle" },
  { slug: "denver", label: "Denver" },
  { slug: "atlanta", label: "Atlanta" },
  { slug: "miami", label: "Miami" },
  { slug: "portland", label: "Portland" },
  { slug: "minneapolis", label: "Minneapolis" },
  { slug: "new-orleans", label: "New Orleans" },
  { slug: "baltimore", label: "Baltimore" },
  { slug: "oakland", label: "Oakland" },
  { slug: "nashville", label: "Nashville" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        {/* City links for SEO */}
        <div className="border-b border-background/10 pb-8 mb-8">
          <p className="text-xs uppercase tracking-wider text-background/40 mb-4 font-semibold">
            City Civil Rights Hubs
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {CITY_LINKS.map(({ slug, label }) => (
              <Link
                key={slug}
                to={`/city/${slug}`}
                className="text-xs text-background/60 hover:text-background transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Civil Rights Hub</span>
              <span className="text-sm font-normal">by We The People News</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm text-background/80">
              Educational resource for civil rights information. Not a substitute for legal advice.
            </p>
            <p className="text-sm text-background/60 mt-2">
              © {currentYear} Civil Rights Hub by We The People News. Information subject to change.
            </p>
          </div>

          <div className="flex gap-4 text-sm flex-wrap justify-center">
            <Link to="/newsroom" className="hover:text-primary-glow transition-colors text-background/80">Newsroom</Link>
            <Link to="/attorneys" className="hover:text-primary-glow transition-colors text-background/80">Attorneys</Link>
            <Link to="/community" className="hover:text-primary-glow transition-colors text-background/80">Community</Link>
            <button className="hover:text-primary-glow transition-colors text-background/80">Privacy</button>
            <button className="hover:text-primary-glow transition-colors text-background/80">Terms</button>
            <button className="hover:text-primary-glow transition-colors text-background/80">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
