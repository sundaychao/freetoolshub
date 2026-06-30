// 站点集中配置：用户可在此替换域名、AdSense ID、邮箱等占位符

export const siteConfig = {
  name: "ToolHub", // 站点名称（占位，用户可改）
  domain: "example.com", // 用户域名（占位，用户必须替换）
  url: "https://example.com", // 站点完整 URL
  description: "Free online tools and articles for developers and creators.",
  locale: "en_US",
  // Google AdSense
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX", // AdSense publisher ID（占位，审核通过前留空或占位）
    enabled: false, // 默认关闭，审核通过后改 true
  },
  // 社交/联系
  email: "zhou7chao@163.com",
  twitter: "@zhou77chao",
  github: "https://github.com/sundaychao",
  nav: [
    { title: "Home", href: "/" },
    { title: "Tools", href: "/tools" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  footerLinks: {
    Legal: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookie" },
    ],
    Site: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Sitemap", href: "/sitemap.xml" },
    ],
  },
};
