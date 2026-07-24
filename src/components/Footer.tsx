import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                T
              </span>
              <span>{siteConfig.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-600">
              {siteConfig.description}
            </p>
          </div>

          {Object.entries(siteConfig.footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                {group}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </span>
          {siteConfig.icp.number && (
            <a
              href={siteConfig.icp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-primary"
            >
              {siteConfig.icp.number}
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
