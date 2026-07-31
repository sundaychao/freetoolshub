"use client";

import { useState } from "react";
import { decodeHtmlEntities, encodeHtmlEntities } from "@/lib/seo-tool-utils";

type Mode = "encode" | "decode";

export function HtmlEntityEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState("");

  function convert(nextMode: Mode) {
    setMode(nextMode);
    try {
      if (!input) throw new Error("Type or paste text to convert.");
      setOutput(nextMode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
      setError("");
    } catch (error) {
      setOutput("");
      setError(error instanceof Error ? error.message : "Unable to convert the text.");
    }
  }

  return <div className="grid gap-6 lg:grid-cols-2"><div><label htmlFor="entity-input" className="mb-2 block text-sm font-medium text-zinc-700">Input</label><textarea id="entity-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} placeholder="Type or paste HTML or text..." className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /><div className="mt-3 flex gap-2"><button type="button" onClick={() => convert("encode")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "encode" ? "bg-primary text-white hover:bg-primary-hover" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}>Encode</button><button type="button" onClick={() => convert("decode")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "decode" ? "bg-primary text-white hover:bg-primary-hover" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}>Decode</button></div>{error && <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}</div><div><label htmlFor="entity-output" className="mb-2 block text-sm font-medium text-zinc-700">Output</label><textarea id="entity-output" value={output} readOnly spellCheck={false} placeholder="Converted text will appear here." className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none" /></div></div>;
}

export default HtmlEntityEncoder;
