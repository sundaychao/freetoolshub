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
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    description:
      "Create custom QR codes for URLs, text, contacts and more. Download as PNG or SVG instantly.",
    category: "Web",
    icon: "QR",
  },
  {
    slug: "timestamp-converter",
    title: "Unix Timestamp Converter",
    description:
      "Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds, any timezone.",
    category: "Data",
    icon: "TS",
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description:
      "Generate placeholder text in Lorem Ipsum style. Choose paragraph count, sentence length and output as plain text or HTML.",
    category: "Text",
    icon: "L§",
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    description:
      "Convert between length, weight, temperature and data units. Metric to imperial and more, all instant.",
    category: "Data",
    icon: "↔",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode JWT headers and payloads locally in your browser without sending tokens to a server.",
    category: "Security",
    icon: "JWT",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions against text locally in your browser and inspect every match and capture group.",
    category: "Web",
    icon: ".*",
  },
  {
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    description:
      "Compare two blocks of text locally in your browser and review added, removed, and unchanged lines.",
    category: "Text",
    icon: "DIFF",
  },
  {
    slug: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description:
      "Encode or decode HTML entities locally in your browser for safer markup and readable text.",
    category: "Web",
    icon: "&;",
  },
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    description: "Convert CSV data to formatted JSON locally in your browser without uploading your files.",
    category: "Data",
    icon: "CSV",
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    description: "Convert JSON arrays to CSV locally in your browser without sending data to a server.",
    category: "Data",
    icon: "JSON",
  },
  {
    slug: "yaml-to-json",
    title: "YAML to JSON Converter",
    description: "Convert simple YAML to formatted JSON locally in your browser with private, client-side processing.",
    category: "Data",
    icon: "YAML",
  },
  {
    slug: "json-to-typescript",
    title: "JSON to TypeScript Converter",
    description: "Generate TypeScript types from JSON locally in your browser without sending your data anywhere.",
    category: "Web",
    icon: "TS",
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
  "qr-generator",
  "timestamp-converter",
  "lorem-ipsum",
  "unit-converter",
  "jwt-decoder",
  "regex-tester",
  "text-diff-checker",
  "html-entity-encoder",
  "csv-to-json",
  "json-to-csv",
  "yaml-to-json",
  "json-to-typescript",
]);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
