import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/site.config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        {/* Google Analytics 4：仅当启用时注入 */}
        {siteConfig.analytics.enabled && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.measurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.analytics.measurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* AdSense 脚本：仅当启用时注入 */}
        {siteConfig.adsense.enabled && (
          <Script
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.client}`}
          />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
