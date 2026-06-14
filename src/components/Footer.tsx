import { useState } from "react";
import { Shield, ExternalLink, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

const NAVIGATION = [
  {
    title: "Take Action",
    links: [
      { to: "/do-this-now", label: "Do This Now" },
      { to: "/rights?tab=conflicts", label: "Conflicting Laws" },
      { to: "/tools", label: "FOIA Builder" },
      { to: "/do-this-now#report", label: "Report Violation" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/rights", label: "Know Your Rights" },
      { to: "/learn", label: "Law Library" },
      { to: "/attorneys", label: "Attorney Directory" },
      { to: "/tools#scanner", label: "Scanner Feeds" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/community", label: "Social Feed" },
      { to: "/newsroom", label: "Newsroom" },
      { to: "/activists", label: "Activist Directory" },
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
  { label: "Reporters Committee FOIA", url: "https://www.rcfp.org/open-government-guide" },
];

const SOCIAL_LINKS = [
  {
    label: "X / Twitter",
    href: "https://x.com/WeThePeopleNews",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/WeThePeopleNews",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/wethepeoplenews.bsky.social",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
      </svg>
    ),
  },
  {
    label: "Mastodon",
    href: "https://mastodon.social/@WeThePeopleNews",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
      </svg>
    ),
  },
];

const GITHUB_URL = "https://github.com/patriotnewsactivism/civil-rights-hub";
const BUTTONDOWN_USERNAME = import.meta.env.VITE_BUTTONDOWN_USERNAME as string | undefined;

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (BUTTONDOWN_USERNAME) {
        const res = await fetch("https://api.buttondown.email/v1/subscribers", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Token ${BUTTONDOWN_USERNAME}` },
          body: JSON.stringify({ email_address: email }),
        });
        if (!res.ok && res.status !== 409) throw new Error();
      }
      setDone(true);
      toast.success("Subscribed!", { description: "Check your inbox to confirm." });
    } catch {
      toast.error("Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return <p className="text-xs text-green-400">✓ Subscribed! Check your inbox.</p>;
  }

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
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand + newsletter column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Civil Rights Hub</span>
                <span className="text-sm text-slate-400">by We The People News</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The nation's most comprehensive civil rights platform. Report violations, find attorneys,
              file FOIAs, know your rights, and connect with your community.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Weekly digest — free
              </p>
              <FooterNewsletter />
              <p className="text-[11px] text-slate-600 mt-1.5">No spam. Unsubscribe anytime.</p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-slate-500 hover:text-primary transition-colors"
                >
                  {icon}
                </a>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-500 hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for the people</span>
            </div>
          </div>

          {/* Navigation columns */}
          {NAVIGATION.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* External resources strip */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Trusted External Resources
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {EXTERNAL_RESOURCES.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {label}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* City SEO links */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs uppercase tracking-wider text-slate-600 mb-3 font-semibold">
            City Civil Rights Hubs
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {CITY_LINKS.map(({ slug, label }) => (
              <Link
                key={slug}
                to={`/city/${slug}`}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-600">
              © {currentYear} Civil Rights Hub by We The People News. Educational resource — not a substitute for legal advice.
            </p>
            <div className="flex gap-4 text-xs">
              <Link to="/transparency" className="text-slate-600 hover:text-slate-400 transition-colors">Transparency</Link>
              <button className="text-slate-600 hover:text-slate-400 transition-colors">Privacy</button>
              <button className="text-slate-600 hover:text-slate-400 transition-colors">Terms</button>
              <a href="mailto:info@civilrightshub.org" className="text-slate-600 hover:text-slate-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
