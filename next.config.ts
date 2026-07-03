import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出：生成纯 HTML/JS/CSS 到 out/ 目录，适合 GitHub Pages 托管
  output: "export",
  // 启用图片优化时会要求 Image Optimization API，静态导出不支持，关闭即可
  images: {
    unoptimized: true,
  },
  // 以目录形式输出（about/index.html 而非 about.html）
  // 确保 GitHub Pages 对所有路径都能正确返回页面，避免 Google 爬虫遇到 404
  trailingSlash: true,
  // GitHub Pages 仓库路径为根域名，无需 basePath
  // 如果部署到 https://username.github.io/freetoolshub/ 则需设置 basePath: "/freetoolshub"
  // 你使用自定义域名 sundaychao.com，所以不需要 basePath
};

export default nextConfig;
