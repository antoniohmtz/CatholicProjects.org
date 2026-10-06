import type { MetadataRoute } from "next";
import { SITE } from "./catholic-saint-stories/_lib/seo";

/* If app/robots.ts already exists, keep yours and just make sure the sitemap
   line is present. Add any private app routes (dashboard, admin, api) to disallow. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/admin/", "/login", "/auth/"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
