import { siteConfig } from "@/site.config";
import type { Tool } from "@/lib/tools";
import type { Post } from "@/lib/posts";

const pageUrl = (path: string) => `${siteConfig.url}${path}`;

// 站点级 JSON-LD：Organization + WebSite
// 帮助 Google 理解站点整体信息，提升品牌知识面板正确率
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [
      siteConfig.github,
      `https://twitter.com/${siteConfig.twitter.replace("@", "")}`,
    ].filter(Boolean),
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// 工具页 JSON-LD：SoftwareApplication + BreadcrumbList
// 让 Google 在搜索结果中显示工具富结果（评分、价格等占位）
export function getToolJsonLd(tool: Tool) {
  const base = siteConfig.url;
  const toolUrl = pageUrl(`/tools/${tool.slug}/`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      description: tool.description,
      url: toolUrl,
      applicationCategory: "WebApplication",
      operatingSystem: "Any (Web Browser)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: base,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: pageUrl("/tools/"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.title,
          item: toolUrl,
        },
      ],
    },
  ];
}

// 博客文章 JSON-LD：Article + BreadcrumbList
// 帮助 Google 识别文章作者、发布时间，可能显示在新闻/文章富结果中
export function getPostJsonLd(post: Post) {
  const base = siteConfig.url;
  const url = pageUrl(`/blog/${post.slug}/`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Organization",
        name: post.author,
        url: base,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: base,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      keywords: post.tags.join(", "),
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: base,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: pageUrl("/blog/"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  ];
}
