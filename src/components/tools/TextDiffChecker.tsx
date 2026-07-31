"use client";

import { useMemo, useState } from "react";
import { diffLines } from "@/lib/seo-tool-utils";

const lineStyles = { unchanged: "bg-white text-zinc-700", added: "bg-green-50 text-green-800", removed: "bg-red-50 text-red-800" };
const markers = { unchanged: " ", added: "+", removed: "-" };

export function TextDiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const lines = useMemo(() => diffLines(left, right), [left, right]);

  return <div className="space-y-6"><div className="grid gap-6 lg:grid-cols-2"><TextInput id="diff-left" label="Original text" value={left} onChange={setLeft} /><TextInput id="diff-right" label="Updated text" value={right} onChange={setRight} /></div><div><h2 className="mb-2 text-sm font-medium text-zinc-700">Line diff</h2><div className="max-h-96 overflow-auto rounded-lg border border-zinc-300 font-mono text-sm">{lines.map((line, index) => <div key={`${line.type}-${index}`} className={`flex min-h-7 whitespace-pre-wrap px-3 py-1 ${lineStyles[line.type]}`}><span className="mr-3 select-none font-bold" aria-hidden="true">{markers[line.type]}</span><span>{line.value || " "}</span></div>)}</div></div></div>;
}

function TextInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700">{label}</label><textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} placeholder="Type or paste text here..." className="h-64 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>;
}

export default TextDiffChecker;
