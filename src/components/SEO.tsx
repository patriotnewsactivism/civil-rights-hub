import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export const SEO = ({
  title = "Civil Rights Hub by We The People News - Know Your Rights | Constitutional Rights & Legal Resources",
  description = "Comprehensive civil rights platform with state-specific laws, legal resources, attorney directory, violation reporting, FOIA requests, and community forums. Protect your constitutional rights.",
  keywords = "civil rights, constitutional rights, know your rights, legal aid, attorney directory, state laws, recording laws, police accountability, FOIA requests, violation reporting, legal resources, First Amendment, Fourth Amendment, Fifth Amendment",
  ogTitle,
  ogDescription,
  ogImage = "https://civilrightshub.org/og-image.png",
  ogUrl = "https://civilrightshub.org/",
  twitterTitle,
  twitterDescription,
  twitterImage = "https://civilrightshub.org/twitter-image.png",
  canonicalUrl = "https://civilrightshub.org/",
  structuredData
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
