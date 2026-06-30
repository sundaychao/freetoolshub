// 工具列表数据（后续可扩展为从 CMS / MDX 读取）

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string; // 简短标识，用于卡片展示
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Beautify, minify and validate JSON instantly. Paste your data and get clean, readable output in one click.",
    category: "Data",
    icon: "{ }",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    description:
      "Encode text to Base64 or decode Base64 back to plain text. A handy utility for developers.",
    category: "Text",
    icon: "B64",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description:
      "Percent-encode or decode URLs and query parameters quickly and safely in your browser.",
    category: "Web",
    icon: "%",
  },
  {
    slug: "color-picker",
    title: "Color Picker",
    description:
      "Pick colors and convert between HEX, RGB and HSL formats for your design and CSS needs.",
    category: "Design",
    icon: "#",
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description:
      "Generate strong, random and secure passwords with customizable length and character sets.",
    category: "Security",
    icon: "***",
  },
  {
    slug: "markdown-preview",
    title: "Markdown Preview",
    description:
      "Write Markdown and see the rendered HTML preview side by side in real time.",
    category: "Text",
    icon: "M↓",
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description:
      "Generate random UUIDs (version 4) in bulk. RFC 4122 compliant, perfect for database keys and unique identifiers.",
    category: "Data",
    icon: "ID",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description:
      "Compute SHA-1, SHA-256 and SHA-512 hashes of any text. All done locally in your browser using the Web Crypto API.",
    category: "Security",
    icon: "#",
  },
  {
    slug: "case-converter",
    title: "Text Case Converter",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and kebab-case instantly.",
    category: "Text",
    icon: "Aa",
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count characters, words, sentences and paragraphs in real time. Get reading time estimates and keyword density.",
    category: "Text",
    icon: "W",
  },
];

// 标记为“已实现”的工具 slug 集合，用于在工具详情页决定渲染真实交互组件
export const implementedTools = new Set<string>([
  "json-formatter",
  "base64-encoder",
  "url-encoder",
  "color-picker",
  "password-generator",
  "markdown-preview",
  "uuid-generator",
  "hash-generator",
  "case-converter",
  "word-counter",
]);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
