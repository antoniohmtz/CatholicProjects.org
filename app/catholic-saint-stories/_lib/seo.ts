import type { Metadata } from "next";

/* ─────────────────────────────────────────────────────────────
   Catholic Saint Stories — SEO source of truth
   Shared by both language routes, the OG images, sitemap and robots.
   ───────────────────────────────────────────────────────────── */

export type Lang = "en" | "es";

export const SITE = "https://app.catholicprojects.org";
export const PATHS = {
  en: "/catholic-saint-stories/support",
  es: "/catholic-saint-stories/apoyo",
} as const;

export const BRAND = "Catholic Saint Stories";
export const PARENT = "CatholicProjects";
export const PARENT_URL = "https://catholicprojects.org";
export const LOGO = `${SITE}/brand/catholicprojects-logo.png`;
export const CONTACT = "team@catholicprojects.org";

export const SOCIAL = {
  instagram: "https://instagram.com/catholicsaintstories",
  facebook: "https://www.facebook.com/people/Catholicsaintstories/61592672761916/",
  tiktok: "https://tiktok.com/@catholicsaintstories2",
  youtube: "https://youtube.com/@catholicsaintstories2",
};

export const SEO = {
  en: {
    title: "Support Catholic Saint Stories — Free Films of the Saints",
    description:
      "Cinematic short films about the saints, faithfully sourced and free for everyone in English and Spanish. Help carry the saints to the world from $5 a month.",
    ogTitle: "Stories of the Saints. Made for a new generation.",
    ogSub: "Free cinematic films · English & Español",
    locale: "en_US",
    breadcrumb: "Support",
  },
  es: {
    title: "Apoya Catholic Saint Stories — Películas de los santos, gratis",
    description:
      "Cortometrajes cinematográficos sobre los santos, fieles a las fuentes y gratis para todos, en español e inglés. Ayuda a llevar a los santos al mundo desde $5 al mes.",
    ogTitle: "Historias de los Santos. Hechas para una nueva generación.",
    ogSub: "Películas gratuitas · Español e inglés",
    locale: "es_LA",
    breadcrumb: "Apoyar",
  },
} as const;

/* Next.js Metadata for one language route. hreflang + canonical + OG + robots. */
export function buildMetadata(lang: Lang): Metadata {
  const s = SEO[lang];
  const other: Lang = lang === "en" ? "es" : "en";
  return {
    metadataBase: new URL(SITE),
    title: { absolute: s.title },
    description: s.description,
    alternates: {
      canonical: PATHS[lang],
      languages: { en: PATHS.en, es: PATHS.es, "x-default": PATHS.en },
    },
    openGraph: {
      type: "website",
      siteName: PARENT,
      url: PATHS[lang],
      title: s.title,
      description: s.description,
      locale: s.locale,
      alternateLocale: [SEO[other].locale],
      // images: supplied automatically by opengraph-image.tsx in each route folder
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    other: { "theme-color": "#120D09" },
  };
}

/* JSON-LD: the brand as an Organization under CatholicProjects, the page, and breadcrumbs. */
export function buildJsonLd(lang: Lang) {
  const s = SEO[lang];
  const url = `${SITE}${PATHS[lang]}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${PARENT_URL}/#organization`,
        name: PARENT,
        url: PARENT_URL,
        logo: { "@type": "ImageObject", url: LOGO },
        email: CONTACT,
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/catholic-saint-stories/#brand`,
        name: BRAND,
        url: `${SITE}${PATHS.en}`,
        logo: { "@type": "ImageObject", url: LOGO },
        parentOrganization: { "@id": `${PARENT_URL}/#organization` },
        sameAs: Object.values(SOCIAL),
        description:
          lang === "en"
            ? "Cinematic short films about the saints, grounded in Catholic primary sources and released free in English and Spanish."
            : "Cortometrajes cinematográficos sobre los santos, basados en fuentes católicas primarias y publicados gratis en español e inglés.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        name: PARENT,
        url: SITE,
        publisher: { "@id": `${PARENT_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: s.title,
        description: s.description,
        inLanguage: lang,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/catholic-saint-stories/#brand` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: PARENT, item: PARENT_URL },
          { "@type": "ListItem", position: 2, name: BRAND, item: `${SITE}${PATHS.en}` },
          { "@type": "ListItem", position: 3, name: s.breadcrumb, item: url },
        ],
      },
    ],
  };
}
