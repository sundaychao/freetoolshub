"use client";

import { useState } from "react";
import { diffLines, type DiffLine } from "@/lib/seo-tool-utils";

const MAX_DIFF_LINES = 500;
const lineStyles = { unchanged: "bg-white text-zinc-700", added: "bg-green-50 text-green-800", removed: "bg-red-50 text-red-800" };
const markers = { unchanged: " ", added: "+", removed: "-" };

function lineCount(value: string) {
  return value === "" ? 0 : value.split("\n").length;
}

export function TextDiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [lines, setLines] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState("");

  function updateLeft(value: string) {
    setLeft(value);
    setLines(null);
    setError("");
  }

  function updateRight(value: string) {
    setRight(value);
    setLines(null);
    setError("");
  }

  function handleCompare() {
    if (lineCount(left) > MAX_DIFF_LINES || lineCount(right) > MAX_DIFF_LINES) {
      setLines(null);
      setError(`Each input must contain ${MAX_DIFF_LINES} lines or fewer.`);
      return;
    }

    setError("");
    setLines(diffLines(left, right));
  }

  return <div className="space-y-6"><div className="grid gap-6 lg:grid-cols-2"><TextInput id="diff-left" label="Original text" value={left} onChange={updateLeft} /><TextInput id="diff-right" label="Updated text" value={right} onChange={updateRight} /></div><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={handleCompare} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">Compare</button><p className="text-sm text-zinc-600">Up to {MAX_DIFF_LINES} lines per input.</p></div>{error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}<div><h2 className="mb-2 text-sm font-medium text-zinc-700">Line diff</h2><div className="max-h-96 overflow-auto rounded-lg border border-zinc-300 font-mono text-sm">{lines === null ? <p className="px-3 py-2 text-zinc-500">Enter text and compare when ready.</p> : lines.map((line, index) => <div key={`${line.type}-${index}`} className={`flex min-h-7 whitespace-pre-wrap px-3 py-1 ${lineStyles[line.type]}`}><span className="mr-3 select-none font-bold" aria-hidden="true">{markers[line.type]}</span><span>{line.value || " "}</span></div>)}</div></div></div>;
}

function TextInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700">{label}</label><textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} placeholder="Type or paste text here..." className="h-64 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>;
}

export default TextDiffChecker;
