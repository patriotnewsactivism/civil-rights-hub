import { Shield, ExternalLink, Heart } from "lucide-react";
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
      { to: "/get-help", label: "Get Help" },
    ],
  },
];

const EXTERNAL_RESOURCES = [
  { label: "ACLU Know Your Rights", url: "https://www.aclu.org/know-your-rights" },
  { label: "DOJ Civil Rights Division", url: "https://www.justice.gov/crt" },
  { label: "National Lawyers Guild", url: "https://www.nlg.org" },
  { label: "Reporters Committee FOIA", url: "https://www.rcfp.org/open-government-guide" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 border-t border-white/5">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
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
              <button className="text-slate-600 hover:text-slate-400 transition-colors">Privacy</button>
              <button className="text-slate-600 hover:text-slate-400 transition-colors">Terms</button>
              <button className="text-slate-600 hover:text-slate-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
