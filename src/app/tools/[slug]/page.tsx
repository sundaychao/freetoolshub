import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { JsonFormatter } from "@/components/JsonFormatter";
import { Base64Encoder } from "@/components/tools/Base64Encoder";
import { UrlEncoder } from "@/components/tools/UrlEncoder";
import { ColorPicker } from "@/components/tools/ColorPicker";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { MarkdownPreviewer } from "@/components/tools/MarkdownPreviewer";
import { UuidGenerator } from "@/components/tools/UuidGenerator";
import { HashGenerator } from "@/components/tools/HashGenerator";
import { TextCaseConverter } from "@/components/tools/TextCaseConverter";
import { WordCounter } from "@/components/tools/WordCounter";
import { QrGenerator } from "@/components/tools/QrGenerator";
import { TimestampConverter } from "@/components/tools/TimestampConverter";
import { LoremIpsum } from "@/components/tools/LoremIpsum";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { getToolBySlug, implementedTools, tools } from "@/lib/tools";
import { getToolJsonLd } from "@/lib/jsonld";

// 工具 slug -> 组件 映射表，避免长链 if/else
const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "color-picker": ColorPicker,
  "password-generator": PasswordGenerator,
  "markdown-preview": MarkdownPreviewer,
  "uuid-generator": UuidGenerator,
  "hash-generator": HashGenerator,
  "case-converter": TextCaseConverter,
  "word-counter": WordCounter,
  "qr-generator": QrGenerator,
  "timestamp-converter": TimestampConverter,
  "lorem-ipsum": LoremIpsum,
  "unit-converter": UnitConverter,
};

// 为所有工具预生成静态路由
export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

// 动态生成页面标题与描述
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: `/tools/${tool.slug}/`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const isImplemented = implementedTools.has(tool.slug);
  const ToolComponent = isImplemented ? toolComponents[tool.slug] : null;
  const jsonLd = getToolJsonLd(tool);

  return (
    <Container className="py-12">
      {/* 工具页结构化数据：SoftwareApplication + BreadcrumbList */}
      {jsonLd.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <nav className="text-sm text-zinc-500">
        <Link href="/tools" className="hover:text-primary">
          Tools
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{tool.title}</span>
      </nav>

      <header className="mt-4 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light font-mono text-sm font-bold text-primary-dark">
          {tool.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {tool.title}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">{tool.description}</p>
        </div>
      </header>

      <div className="mt-8">
        <AdSlot slot={`tool-${tool.slug}-top`} />
      </div>

      <section className="mt-8">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl">
              &#128295;
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900">
              This tool is on the way
            </h2>
            <p className="mt-2 max-w-md text-sm text-zinc-600">
              We are still building this utility. In the meantime, try the JSON
              Formatter, and check back soon for more tools.
            </p>
            <Link
              href="/tools/json-formatter"
              className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Try JSON Formatter
            </Link>
          </div>
        )}
      </section>

      <div className="mt-8">
        <AdSlot slot={`tool-${tool.slug}-bottom`} />
      </div>
    </Container>
  );
}
