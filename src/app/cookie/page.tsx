import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie Policy for ${siteConfig.name}.`,
  alternates: {
    canonical: "/cookie/",
  },
};

type Section = {
  heading: string;
  paragraphs: string[];
};

const lastUpdated = "June 30, 2026";

const intro: string[] = [
  `This Cookie Policy explains how ${siteConfig.name} ("we", "us", or "our") uses cookies and similar technologies when you visit ${siteConfig.domain} (the "Site"). By using the Site, you consent to the use of cookies as described in this Policy.`,
  "Cookies are small text files placed on your device by the websites you visit. They are widely used to make websites work more efficiently and to provide information to site owners. This Policy describes the types of cookies we use and the choices you have.",
];

const sections: Section[] = [
  {
    heading: "Types of Cookies We Use",
    paragraphs: [
      "We use the following categories of cookies on the Site. Each category serves a different purpose, as described below.",
    ],
  },
  {
    heading: "Strictly Necessary Cookies",
    paragraphs: [
      "These cookies are essential for the Site to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the Site will not work without them.",
    ],
  },
  {
    heading: "Functional Cookies",
    paragraphs: [
      "These cookies enable enhanced functionality and personalization, such as remembering your preferences for tool settings. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these features may not work properly.",
    ],
  },
  {
    heading: "Analytics Cookies",
    paragraphs: [
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of the Site. They help us know which pages are the most and least popular and see how visitors move around the Site. All information collected by these cookies is aggregated and therefore anonymous.",
    ],
  },
  {
    heading: "Advertising Cookies (Google AdSense)",
    paragraphs: [
      "We use Google AdSense to display advertisements on the Site. Google AdSense and its partners use cookies to serve ads based on your prior visits to this Site and other websites.",
      "Google may use the DoubleClick DART cookie to serve advertisements to you based on your visit to this Site and other sites on the internet. The DART cookie enables Google and its partners to serve ads to you based on your visit to this Site and other sites on the internet.",
      "You may opt out of the use of the DART cookie and personalized advertising by visiting the Google Ads Settings page at https://www.google.com/settings/ads. You can also opt out of some third-party vendors' use of cookies for personalized advertising by visiting the Network Advertising Initiative opt-out page at https://optout.networkadvertising.org.",
      "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this Site and other websites. These vendors may use the information they collect through cookies to provide measurement services and to serve more relevant ads.",
    ],
  },
  {
    heading: "How to Manage and Delete Cookies",
    paragraphs: [
      "You can control and delete cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Please refer to your browser's help documentation for instructions on how to manage cookies.",
      "If you disable cookies, some features of the Site may not function correctly. In particular, advertising cookies set by Google AdSense and other third-party networks may still be set if you do not opt out through their respective settings pages.",
      "The links below provide instructions for managing cookies in popular browsers:",
    ],
  },
  {
    heading: "Changes to This Cookie Policy",
    paragraphs: [
      "We may update this Cookie Policy from time to time. When we do, we will revise the last updated date at the top of this page. We encourage you to review this Policy periodically to stay informed about how we use cookies.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have any questions about this Cookie Policy, you can contact us by email at ${siteConfig.email}.`,
    ],
  },
];

export default function CookiePage() {
  return (
    <Container className="py-12">
      <article className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Cookie Policy
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
          <AdSlot slot="cookie-bottom" />
        </div>
      </article>
    </Container>
  );
}
