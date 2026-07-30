import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: {
    canonical: "/contact/",
  },
};

const contactParagraphs = [
  "We love hearing from our users. Whether you have a feature request, found a bug, or just want to say hello, reach out and we will get back to you as soon as we can.",
  "For the fastest response, email us directly using the address below. Please include the name of the tool or article you are referring to, along with a short description of your question or issue.",
];

export default function ContactPage() {
  return (
    <Container className="py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Contact Us
        </h1>
        <div className="mt-4 space-y-4 text-zinc-700">
          {contactParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Email
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-2 block text-lg font-medium text-primary hover:text-primary-hover"
          >
            {siteConfig.email}
          </a>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Social
          </h2>
          <ul className="mt-2 space-y-1 text-lg font-medium">
            <li>
              <a
                href={`https://twitter.com/${siteConfig.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover"
              >
                Twitter / X: {siteConfig.twitter}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <AdSlot slot="contact-middle" />
      </div>
    </Container>
  );
}
