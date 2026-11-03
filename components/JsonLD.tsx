export const OrgJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bitlyst",
    url: "https://bitlyst.blog/",
    logo: "https://bitlyst.blog/logo.svg",
    sameAs: [
      "https://x.com/themohsenme",
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
    alternateName: ["Bitlyst Blog", "bitlyst.blog"],
    url: "https://bitlyst.blog/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bitlyst.blog/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
};
