"use client";

import { useMemo, useState } from "react";
import { generateRobotsTxt } from "@/lib/seo-tool-utils";

export function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState("/admin\n/login");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [host, setHost] = useState("");
  const output = useMemo(() => generateRobotsTxt({
    userAgent: userAgent.trim() || "*",
    allowAll,
    disallowPaths: disallowPaths.split("\n").map((path) => path.trim()).filter(Boolean),
    sitemapUrl: sitemapUrl.trim(),
    host: host.trim(),
  }), [allowAll, disallowPaths, host, sitemapUrl, userAgent]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div><label htmlFor="robots-user-agent" className="mb-2 block text-sm font-medium text-zinc-700">User-agent</label><input id="robots-user-agent" value={userAgent} onChange={(event) => setUserAgent(event.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700"><input type="checkbox" checked={allowAll} onChange={(event) => setAllowAll(event.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary" />Allow all paths</label>
        <div><label htmlFor="robots-disallow-paths" className="mb-2 block text-sm font-medium text-zinc-700">Disallow paths</label><textarea id="robots-disallow-paths" value={disallowPaths} onChange={(event) => setDisallowPaths(event.target.value)} placeholder="One path per line, for example /admin" spellCheck={false} className="h-32 w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label htmlFor="robots-sitemap" className="mb-2 block text-sm font-medium text-zinc-700">Sitemap URL</label><input id="robots-sitemap" type="url" value={sitemapUrl} onChange={(event) => setSitemapUrl(event.target.value)} placeholder="https://example.com/sitemap.xml" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label htmlFor="robots-host" className="mb-2 block text-sm font-medium text-zinc-700">Host</label><input id="robots-host" value={host} onChange={(event) => setHost(event.target.value)} placeholder="https://example.com" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      </div>
      <div><label htmlFor="robots-output" className="mb-2 block text-sm font-medium text-zinc-700">Generated robots.txt</label><textarea id="robots-output" value={output} readOnly spellCheck={false} className="h-full min-h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none" /></div>
    </div>
  );
}

export default RobotsTxtGenerator;
