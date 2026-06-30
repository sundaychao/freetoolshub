import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
};

type Section = {
  heading: string;
  paragraphs: string[];
};

const lastUpdated = "June 30, 2026";

const intro: string[] = [
  `This Privacy Policy describes how ${siteConfig.name} ("we", "us", or "our") collects, uses, and shares information when you visit ${siteConfig.domain} (the "Site"). By using the Site, you agree to the practices described in this Policy.`,
];

const sections: Section[] = [
  {
    heading: "Information We Collect",
    paragraphs: [
      "Our tools run entirely in your browser, and we do not require you to create an account or submit personal information to use them. When you visit the Site, our servers may automatically collect log data, such as your IP address, browser type, referring pages, and the date and time of your visit.",
      "We use this information to operate, maintain, and improve the Site, and to understand how visitors use our tools and articles.",
    ],
  },
  {
    heading: "Cookies and Similar Technologies",
    paragraphs: [
      "We and our service providers use cookies and similar technologies to store information on your device. Cookies are small text files that allow the Site to remember your actions and preferences over a period of time. You can choose to disable cookies through your browser settings, but some features of the Site may not function correctly as a result.",
      "For more detail about the types of cookies we use, please read our Cookie Policy.",
    ],
  },
  {
    heading: "Google AdSense and Third-Party Advertising",
    paragraphs: [
      `We use Google AdSense to display advertisements on the Site. Google AdSense is a third-party vendor that uses cookies and similar technologies to serve ads based on your prior visits to this and other websites.`,
      "Google may use the DoubleClick DART cookie to serve advertisements to you based on your visit to this Site and other sites on the internet. You may opt out of the use of the DART cookie and personalized advertising by visiting the Google Ads Settings page at https://www.google.com/settings/ads.",
      "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this Site and other websites. These vendors may use the information they collect through cookies to provide measurement services and to serve more relevant ads.",
      "Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our Site and other sites on the internet. You can manage the personalization of ads by visiting the Google Ads Settings page referenced above, or by visiting the Network Advertising Initiative opt-out page at https://optout.networkadvertising.org.",
      "We do not control and are not responsible for the privacy practices or the content of third-party advertisers. Their privacy policies govern how they collect and use information.",
    ],
  },
  {
    heading: "Third-Party Privacy Policies",
    paragraphs: [
      "Our Privacy Policy does not apply to third-party advertisers or websites. We advise you to consult the respective privacy policies of these third parties for information on how they handle data. Their policies govern how they collect and use your information.",
    ],
  },
  {
    heading: "Children's Information",
    paragraphs: [
      "The Site is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.",
    ],
  },
  {
    heading: "Your Rights (GDPR and CCPA)",
    paragraphs: [
      "If you are located in the European Economic Area or the United Kingdom, you have certain rights under the GDPR, including the right to access, correct, or delete your personal data, and the right to object to or restrict certain processing.",
      "If you are a resident of California, you have certain rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to request deletion, and the right to opt out of the sale of personal information. We do not sell personal information.",
      "To exercise any of these rights, please contact us using the email address provided below.",
    ],
  },
  {
    heading: "Do Not Track Signals",
    paragraphs: [
      "Some browsers offer a Do Not Track feature. Because there is currently no consistent industry standard for interpreting Do Not Track signals, we do not currently respond to them. We will update this Policy if our practices change.",
    ],
  },
  {
    heading: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the last updated date at the top of this page. We encourage you to review this Policy periodically to stay informed about how we protect your information.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have any questions about this Privacy Policy, you can contact us by email at ${siteConfig.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <article className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Privacy Policy
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
          <AdSlot slot="privacy-bottom" />
        </div>
      </article>
    </Container>
  );
}
