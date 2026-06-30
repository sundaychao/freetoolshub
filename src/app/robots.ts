import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// robots.txt：允许全部抓取，并引用 sitemap
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
