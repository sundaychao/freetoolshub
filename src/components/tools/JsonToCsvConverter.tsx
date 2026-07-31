"use client";

import { useState } from "react";
import { jsonToCsv } from "@/lib/seo-tool-utils";

const SAMPLE_JSON = `[
  { "name": "Jane", "role": "Developer" },
  { "name": "Alex", "role": "Designer" }
]`;

export function JsonToCsvConverter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleConvert() {
    try {
      setOutput(jsonToCsv(JSON.parse(input)));
      setError("");
    } catch (error) {
      setOutput("");
      setError(error instanceof Error ? error.message : "Unable to convert JSON to CSV.");
    }
  }

  return <div className="grid gap-6 lg:grid-cols-2"><div><label htmlFor="json-to-csv-input" className="mb-2 block text-sm font-medium text-zinc-700">JSON input</label><textarea id="json-to-csv-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /><button type="button" onClick={handleConvert} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">Convert to CSV</button>{error && <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}</div><div><label htmlFor="json-to-csv-output" className="mb-2 block text-sm font-medium text-zinc-700">CSV output</label><textarea id="json-to-csv-output" value={output} readOnly spellCheck={false} placeholder="Converted CSV will appear here." className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none" /></div></div>;
}

export default JsonToCsvConverter;
