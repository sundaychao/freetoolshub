// 站点集中配置：用户可在此替换域名、AdSense ID、邮箱等占位符

export const siteConfig = {
  name: "FreeToolsHub", // 站点名称
  domain: "sundaychaos.com", // 用户真实域名
  url: "https://sundaychaos.com", // 站点完整 URL（HTTPS）
  description: "Free online tools and articles for developers and creators.",
  locale: "en_US",
  // 国内备案：备案通过后填入备案号（如 "粤ICP备12345678号"），审核期间留空
  icp: {
    number: "", // 备案号，审核通过后填入
    url: "https://beian.miit.gov.cn", // 工信部备案查询地址
  },
  // Google AdSense
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX", // AdSense publisher ID（占位，审核通过前留空或占位）
    enabled: false, // 默认关闭，审核通过后改 true
  },
  // Google Analytics 4：填入 Measurement ID（格式 G-XXXXXXXXXX）后改为 true 启用
  analytics: {
    measurementId: "G-Q0SYFYGFJD", // GA4 Measurement ID
    enabled: true, // 已启用
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
