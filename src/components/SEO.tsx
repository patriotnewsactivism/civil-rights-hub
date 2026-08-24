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

const DEFAULT_TITLE = "Civil Rights Hub | Rights · Records · Research · Response";
const DEFAULT_DESCRIPTION = "Civil Rights Hub is a public-interest toolkit for rights references, emergency encounter tools, incident documentation, public-records work, legal research, scanner resources, and community collaboration.";
const DEFAULT_KEYWORDS = "civil rights, constitutional rights, rights references, public records, FOIA request, incident documentation, civil liberties, legal research, government transparency";
const DEFAULT_SOCIAL_IMAGE = "https://civilrightshub.org/civil-rights-hub-social.png";

export const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_SOCIAL_IMAGE,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage = DEFAULT_SOCIAL_IMAGE,
  canonicalUrl = "https://civilrightshub.org/",
  structuredData
}: SEOProps) => {
  const effectiveUrl = ogUrl || canonicalUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Civil Rights Hub" />
      <meta property="og:url" content={effectiveUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Civil Rights Hub — Rights, Records, Research, Response" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CivilRightsHub" />
      <meta name="twitter:url" content={effectiveUrl} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content="Civil Rights Hub — Rights, Records, Research, Response" />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
