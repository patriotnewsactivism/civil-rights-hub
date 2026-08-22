import { useState } from "react";
import { Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NAVIGATION = [
  {
    title: "Take Action",
    links: [
      { to: "/do-this-now", label: "Emergency Tools" },
      { to: "/do-this-now#report", label: "Report an Incident" },
      { to: "/help#tools", label: "FOIA Builder" },
      { to: "/rights", label: "Rights References" },
    ],
  },
  {
    title: "Research",
    links: [
      { to: "/learn", label: "Law Library" },
      { to: "/compare-states", label: "Compare States" },
      { to: "/sol-calculator", label: "SOL Calculator" },
      { to: "/tools", label: "Research Tools" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/community", label: "Social Feed" },
      { to: "/newsroom", label: "Newsroom" },
      { to: "/newsletter", label: "Newsletter" },
      { to: "/help", label: "Get Help" },
    ],
  },
  {
    title: "About",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/volunteer", label: "Volunteer" },
      { to: "/contribute", label: "Contribute" },
      { to: "/transparency", label: "Transparency" },
    ],
  },
];

const EXTERNAL_RESOURCES = [
  { label: "ACLU Know Your Rights", url: "https://www.aclu.org/know-your-rights" },
  { label: "DOJ Civil Rights Division", url: "https://www.justice.gov/crt" },
  { label: "National Lawyers Guild", url: "https://www.nlg.org" },
  { label: "Reporters Committee Open Government Guide", url: "https://www.rcfp.org/open-government-guide" },
];

const SOCIAL_LINKS = [
  { label: "X / Twitter", href: "https://x.com/WeThePeopleNews" },
  { label: "Instagram", href: "https://www.instagram.com/WeThePeopleNews" },
  { label: "Bluesky", href: "https://bsky.app/profile/wethepeoplenews.bsky.social" },
  { label: "Mastodon", href: "https://mastodon.social/@WeThePeopleNews" },
];

const GITHUB_URL = "https://github.com/patriotnewsactivism/civil-rights-hub";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email,
        source: "footer_widget",
        is_confirmed: false,
      });
      if (error && error.code !== "23505") throw error;
      setDone(true);
      toast.success("Subscribed!", { description: "Check your inbox to confirm." });
    } catch {
      toast.error("Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return <p className="text-xs text-green-400">✓ Subscribed. Check your inbox.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-primary"
      />
      <Button type="submit" size="sm" className="h-8 px-3 text-xs flex-shrink-0" disabled={loading}>
        {loading ? "…" : "Go"}
      </Button>
    </form>
  );
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 border-t border-white/5">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Civil Rights Hub</span>
                <span className="text-sm text-slate-400">Brought to you by We The People News</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A public-interest toolkit for rights references, incident documentation, public-records work,
              research, scanner resources, and community collaboration.
            </p>
            <p className="text-xs text-amber-300/80 max-w-sm">
              Attorney, activist, incident, and accountability datasets are temporarily withheld while legacy records are re-verified against source evidence.
            </p>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Weekly digest</p>
              <FooterNewsletter />
              <p className="text-[11px] text-slate-600 mt-1.5">Unsubscribe anytime.</p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-primary transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {NAVIGATION.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-slate-400 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <h3 className="text-sm font-semibold text-white mb-4">External Reference Sources</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {EXTERNAL_RESOURCES.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {resource.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© {currentYear} Civil Rights Hub. Powered by We The People News.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-xs text-slate-500 hover:text-primary transition-colors">About</Link>
              <Link to="/transparency" className="text-xs text-slate-500 hover:text-primary transition-colors">Transparency</Link>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 mt-3 text-center max-w-4xl mx-auto">
            General information only, not legal advice. Laws, court decisions, and local procedures can change and may depend on specific facts. Confirm current authority or consult a licensed attorney for a specific legal matter.
          </p>
        </div>
      </div>
    </footer>
  );
};
