import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ChevronRight, MapPin, Scale, Shield, Users, FileText, Radio, BookOpen, Newspaper, Phone } from "lucide-react";

const STATE_SLUGS: { slug: string; name: string }[] = [
  { slug: "alabama", name: "Alabama" },
  { slug: "alaska", name: "Alaska" },
  { slug: "arizona", name: "Arizona" },
  { slug: "arkansas", name: "Arkansas" },
  { slug: "california", name: "California" },
  { slug: "colorado", name: "Colorado" },
  { slug: "connecticut", name: "Connecticut" },
  { slug: "delaware", name: "Delaware" },
  { slug: "florida", name: "Florida" },
  { slug: "georgia", name: "Georgia" },
  { slug: "hawaii", name: "Hawaii" },
  { slug: "idaho", name: "Idaho" },
  { slug: "illinois", name: "Illinois" },
  { slug: "indiana", name: "Indiana" },
  { slug: "iowa", name: "Iowa" },
  { slug: "kansas", name: "Kansas" },
  { slug: "kentucky", name: "Kentucky" },
  { slug: "louisiana", name: "Louisiana" },
  { slug: "maine", name: "Maine" },
  { slug: "maryland", name: "Maryland" },
  { slug: "massachusetts", name: "Massachusetts" },
  { slug: "michigan", name: "Michigan" },
  { slug: "minnesota", name: "Minnesota" },
  { slug: "mississippi", name: "Mississippi" },
  { slug: "missouri", name: "Missouri" },
  { slug: "montana", name: "Montana" },
  { slug: "nebraska", name: "Nebraska" },
  { slug: "nevada", name: "Nevada" },
  { slug: "new-hampshire", name: "New Hampshire" },
  { slug: "new-jersey", name: "New Jersey" },
  { slug: "new-mexico", name: "New Mexico" },
  { slug: "new-york", name: "New York" },
  { slug: "north-carolina", name: "North Carolina" },
  { slug: "north-dakota", name: "North Dakota" },
  { slug: "ohio", name: "Ohio" },
  { slug: "oklahoma", name: "Oklahoma" },
  { slug: "oregon", name: "Oregon" },
  { slug: "pennsylvania", name: "Pennsylvania" },
  { slug: "rhode-island", name: "Rhode Island" },
  { slug: "south-carolina", name: "South Carolina" },
  { slug: "south-dakota", name: "South Dakota" },
  { slug: "tennessee", name: "Tennessee" },
  { slug: "texas", name: "Texas" },
  { slug: "utah", name: "Utah" },
  { slug: "vermont", name: "Vermont" },
  { slug: "virginia", name: "Virginia" },
  { slug: "washington", name: "Washington" },
  { slug: "west-virginia", name: "West Virginia" },
  { slug: "wisconsin", name: "Wisconsin" },
  { slug: "wyoming", name: "Wyoming" },
  { slug: "washington-dc", name: "Washington D.C." },
];

const MAIN_PAGES = [
  { path: "/", label: "Home", icon: Shield },
  { path: "/rights", label: "Know Your Rights", icon: Scale },
  { path: "/do-this-now", label: "What To Do Now", icon: Radio },
  { path: "/tools", label: "Activism Tools", icon: FileText },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/newsroom", label: "Newsroom", icon: Newspaper },
  { path: "/help", label: "Get Help", icon: Phone },
  { path: "/community", label: "Community", icon: Users },
  { path: "/attorneys", label: "Find an Attorney", icon: Scale },
  { path: "/states", label: "Attorneys by State", icon: MapPin },
  { path: "/activists", label: "Activists", icon: Users },
  { path: "/resources", label: "Resource Library", icon: BookOpen },
];

export default function Sitemap() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Sitemap | Civil Rights Hub"
        description="Complete sitemap of Civil Rights Hub. Find all pages including state attorney directories, tools, resources, and community features."
        canonicalUrl="https://civilrightshub.org/sitemap"
      />

      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Sitemap</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Main Pages
            </h2>
            <ul className="space-y-2">
              {MAIN_PAGES.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* States A-M */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Attorneys by State (A–M)
            </h2>
            <ul className="space-y-1">
              {STATE_SLUGS.filter((s) => s.name[0] <= "M").map((state) => (
                <li key={state.slug}>
                  <Link
                    to={`/state/${state.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5 block"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* States N-Z */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Attorneys by State (N–Z)
            </h2>
            <ul className="space-y-1">
              {STATE_SLUGS.filter((s) => s.name[0] > "M").map((state) => (
                <li key={state.slug}>
                  <Link
                    to={`/state/${state.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5 block"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
