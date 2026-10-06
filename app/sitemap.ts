import type { MetadataRoute } from "next";
import { SITE, PATHS } from "./catholic-saint-stories/_lib/seo";

/* If app/sitemap.ts already exists, merge these two entries into it. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = { en: `${SITE}${PATHS.en}`, es: `${SITE}${PATHS.es}` };
  return [
    { url: `${SITE}${PATHS.en}`, lastModified, changeFrequency: "weekly", priority: 0.9, alternates: { languages } },
    { url: `${SITE}${PATHS.es}`, lastModified, changeFrequency: "weekly", priority: 0.9, alternates: { languages } },
  ];
}
