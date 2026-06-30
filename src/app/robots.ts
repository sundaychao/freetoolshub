import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// 静态导出兼容：标记为 force-static
export const dynamic = "force-static";

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
