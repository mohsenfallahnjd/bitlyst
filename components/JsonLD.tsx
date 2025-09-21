export const OrgJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bitlyst",
    url: "https://bitlyst.vercel.app",
    logo: "https://bitlyst.vercel.app/favicon.svg",
    sameAs: [
      "https://x.com/mohsenfallahnjd",
      "https://github.com/mohsenfallahnjd",
      "https://www.linkedin.com/in/mohsenfallahnjd/",
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
};

export const JsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bitlyst",
    url: "https://bitlyst.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bitlyst.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
};
