export const siteConfig = {
    name: "GXSHIFT",
    description: "Rank Up. Dominate. Be Legendary. Premium Gaming Service Platform.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://gxshift.com",
    ogImage: "/assets/og-image.jpg",
    links: {
      whatsapp: "https://wa.me/6282120002589", // Fallback if DB fetch fails
      instagram: "https://instagram.com/gxshift",
    },
    keywords: [
      "gaming",
      "boosting",
      "mobile legends",
      "rank boost",
      "joki ml",
      "gxshift"
    ]
  };
  
  export type SiteConfig = typeof siteConfig;