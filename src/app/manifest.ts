import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// 静态导出兼容：标记为 force-static
export const dynamic = "force-static";

// PWA manifest：使用 siteConfig 的 name / short_name
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
