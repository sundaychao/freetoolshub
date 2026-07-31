"use client";

import { useMemo, useState } from "react";
import { testRegex } from "@/lib/seo-tool-utils";

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("");
  const result = useMemo(() => testRegex(pattern, flags, text), [pattern, flags, text]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <div><label htmlFor="regex-pattern" className="mb-2 block text-sm font-medium text-zinc-700">Pattern</label><input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} spellCheck={false} placeholder="(hello)" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label htmlFor="regex-flags" className="mb-2 block text-sm font-medium text-zinc-700">Flags</label><input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} spellCheck={false} placeholder="gi" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      </div>
      <div><label htmlFor="regex-text" className="mb-2 block text-sm font-medium text-zinc-700">Test text</label><textarea id="regex-text" value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} placeholder="Type or paste text to test..." className="h-48 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      {result.error ? <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p> : <div><h2 className="text-sm font-medium text-zinc-700">Matches ({result.matches.length})</h2><div className="mt-2 overflow-hidden rounded-lg border border-zinc-300">{result.matches.length === 0 ? <p className="bg-zinc-50 px-4 py-3 text-sm text-zinc-600">No matches yet.</p> : result.matches.map((match, index) => <div key={`${match.index}-${index}`} className="border-b border-zinc-200 p-4 last:border-b-0"><p className="font-mono text-sm text-zinc-900"><span className="text-zinc-500">{match.index}: </span>{match.match}</p>{match.groups.length > 0 && <p className="mt-2 font-mono text-xs text-zinc-600">Groups: {match.groups.map((group, groupIndex) => `$${groupIndex + 1}=${JSON.stringify(group)}`).join(", ")}</p>}</div>)}</div></div>}
    </div>
  );
}

export default RegexTester;
