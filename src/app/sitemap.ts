import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { tools } from "@/lib/tools";
import { posts } from "@/lib/posts";

// 静态导出兼容：标记为 force-static
export const dynamic = "force-static";

// 动态 sitemap：列出所有静态路由 + 工具 + 博客
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const pageUrl = (path: string) => `${base}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: pageUrl("/tools/"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: pageUrl("/blog/"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: pageUrl("/about/"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: pageUrl("/contact/"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: pageUrl("/privacy/"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: pageUrl("/terms/"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: pageUrl("/cookie/"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: pageUrl(`/tools/${tool.slug}/`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: pageUrl(`/blog/${post.slug}/`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}
