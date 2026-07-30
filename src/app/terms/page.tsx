import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}.`,
  alternates: {
    canonical: "/terms/",
  },
};

type Section = {
  heading: string;
  paragraphs: string[];
};

const lastUpdated = "June 30, 2026";

const intro: string[] = [
  `These Terms of Service ("Terms") govern your access to and use of ${siteConfig.domain} (the "Site"), which is operated by ${siteConfig.name} ("we", "us", or "our"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Site.`,
];

const sections: Section[] = [
  {
    heading: "Use of the Site",
    paragraphs: [
      "We grant you a personal, non-exclusive, non-transferable, and revocable license to use the Site and the tools provided on it for your own purposes. You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the Site.",
      "Our tools are provided for general informational and productivity purposes. You are responsible for the data you process using the tools, and for the results you rely on.",
    ],
  },
  {
    heading: "No Warranty",
    paragraphs: [
      "The Site and all tools are provided on an \"as is\" and \"as available\" basis without warranties of any kind, whether express or implied. We do not warrant that the tools will be accurate, reliable, uninterrupted, or free from errors. You use the Site at your own risk.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of the Site or the tools.",
    ],
  },
  {
    heading: "Advertising",
    paragraphs: [
      "The Site displays advertisements served by third-party advertising networks, including Google AdSense. We are not responsible for the content of advertisements or the practices of advertisers. Your interactions with advertisers are solely between you and the advertiser.",
    ],
  },
  {
    heading: "Intellectual Property",
    paragraphs: [
      `The Site, including its design, text, and code, is owned by ${siteConfig.name} and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from the Site without our prior written consent.`,
    ],
  },
  {
    heading: "Third-Party Links and Content",
    paragraphs: [
      "The Site may contain links to third-party websites and content that we do not control. We are not responsible for the content, privacy policies, or practices of any third-party sites and assume no responsibility for them.",
    ],
  },
  {
    heading: "Changes to These Terms",
    paragraphs: [
      "We may revise these Terms at any time. When we do, we will update the last updated date at the top of this page. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have any questions about these Terms, you can contact us by email at ${siteConfig.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <Container className="py-12">
      <article className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

        <div className="mt-6 space-y-4 text-zinc-700">
          {intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-4 text-zinc-700">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-10">
          <AdSlot slot="terms-bottom" />
        </div>
      </article>
    </Container>
  );
}
