import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.name} and what we build.`,
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          About {siteConfig.name}
        </h1>
        <p className="mt-3 text-zinc-600">
          {siteConfig.description}
        </p>
      </header>

      <div className="mt-8 max-w-3xl space-y-6 text-zinc-700">
        <p>
          {siteConfig.name} is a free collection of online tools and articles
          built for developers, designers, and anyone who works on the web. Our
          goal is to provide fast, reliable utilities that solve small but
          annoying problems, without forcing you to sign up or install
          anything.
        </p>
        <p>
          Every tool on this site runs entirely in your browser. That means your
          data never leaves your device, results are instant, and your privacy
          is respected by design.
        </p>
        <p>
          Alongside the tools, we publish practical articles on web
          development, performance, and productivity. We keep things focused and
          honest: no clickbait, no fluff.
        </p>
      </div>

      <div className="mt-10">
        <AdSlot slot="about-middle" />
      </div>

      <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Get in touch</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Have a tool request or found a bug? We would love to hear from you.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Contact us
        </Link>
      </div>
    </Container>
  );
}
