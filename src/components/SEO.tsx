import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  structuredData?: object;
}

export const SEO = ({
  title = "Civil Rights Hub by We The People News - Know Your Rights | Constitutional Rights & Legal Resources",
  description = "Comprehensive civil rights platform with state-specific laws, legal resources, attorney directory, violation reporting, FOIA requests, and community forums. Protect your constitutional rights.",
  keywords = "civil rights, constitutional rights, know your rights, legal aid, attorney directory, state laws, recording laws, police accountability, FOIA requests, violation reporting, legal resources, First Amendment, Fourth Amendment, Fifth Amendment",
  image = "https://civilrightshub.org/og-image.png",
  url = "https://civilrightshub.org/",
  type = "website",
  author = "Civil Rights Hub by We The People News",
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  structuredData,
}: SEOProps) => {
  const siteTitle = "Civil Rights Hub by We The People News";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {author && <meta property="article:author" content={author} />}
      {tags && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@civilrightshub" />
      <meta name="twitter:creator" content="@civilrightshub" />

      {/* Additional Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta httpEquiv="content-language" content="en-US" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Pre-configured SEO presets for common pages
export const SEOPresets = {
  home: {
    title: "Civil Rights Hub by We The People News - Know Your Rights",
    description: "Comprehensive civil rights platform with state-specific laws, legal resources, attorney directory, violation reporting, FOIA requests, and community forums. Protect your constitutional rights.",
    url: "https://civilrightshub.org/",
  },

  community: {
    title: "Community Forums - Civil Rights Discussions",
    description: "Join civil rights discussions, share experiences, ask legal questions, and connect with activists. Community forum for civil rights education and organizing.",
    keywords: "civil rights forum, community discussion, legal questions, activism, organizing, support",
    url: "https://civilrightshub.org/community",
    section: "Community",
  },

  knowYourRights: {
    title: "Know Your Rights - Constitutional Rights Guide",
    description: "Download comprehensive guides on your First, Fourth, and Fifth Amendment rights. Learn about police interactions, recording rights, and constitutional protections.",
    keywords: "constitutional rights, First Amendment, Fourth Amendment, Fifth Amendment, recording police, know your rights, civil liberties",
    url: "https://civilrightshub.org/#rights",
    section: "Education",
  },

  attorneys: {
    title: "Find Civil Rights Attorneys - Lawyer Directory",
    description: "Search our directory of civil rights attorneys by state and practice area. Find legal representation for police misconduct, discrimination, and constitutional violations.",
    keywords: "civil rights attorney, lawyer directory, legal aid, police misconduct lawyer, discrimination attorney, Section 1983",
    url: "https://civilrightshub.org/#lawyers",
    section: "Legal Resources",
  },

  foia: {
    title: "FOIA Request Builder - Freedom of Information Act Templates",
    description: "Create custom FOIA requests with our template builder. Access federal and state public records request templates for police records, body camera footage, and more.",
    keywords: "FOIA request, public records, freedom of information, police records, body camera, transparency, government accountability",
    url: "https://civilrightshub.org/#foia",
    section: "Transparency",
  },

  violationReport: {
    title: "Report Civil Rights Violations - Submit Incident Report",
    description: "Report civil rights violations anonymously. Document police misconduct, discrimination, and constitutional violations. Your voice matters.",
    keywords: "report violation, police misconduct, civil rights abuse, discrimination complaint, document incident",
    url: "https://civilrightshub.org/#report",
    section: "Reporting",
  },

  stateLaws: {
    title: "State Laws - Recording Laws and Civil Rights by State",
    description: "Comprehensive database of state-specific recording laws, police accountability statutes, and civil rights protections for all 50 states.",
    keywords: "state laws, recording laws, two-party consent, one-party consent, state civil rights, recording police by state",
    url: "https://civilrightshub.org/#states",
    section: "Legal Information",
  },
};
