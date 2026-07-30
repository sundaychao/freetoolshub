import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all free online tools available on the site.",
  alternates: {
    canonical: "/tools/",
  },
};

export default function ToolsPage() {
  return (
    <Container className="py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          All Tools
        </h1>
        <p className="mt-3 text-zinc-600">
          A growing collection of free, browser-based utilities. Everything runs
          locally, so your data never leaves your device.
        </p>
      </header>

      <div className="mt-10">
        <AdSlot slot="tools-top" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <div className="mt-10">
        <AdSlot slot="tools-bottom" />
      </div>
    </Container>
  );
}
