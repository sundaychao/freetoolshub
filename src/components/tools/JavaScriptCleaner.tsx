"use client";

import { useState } from "react";
import { cleanJavaScript } from "@/lib/seo-tool-utils";

const SAMPLE_JAVASCRIPT = `// Display a greeting
const greeting = "Hello, world";
console.log(greeting);`;
const MAX_INPUT_CHARACTERS = 100_000;

export function JavaScriptCleaner() {
  const [input, setInput] = useState(SAMPLE_JAVASCRIPT);
  const [output, setOutput] = useState(() => cleanJavaScript(SAMPLE_JAVASCRIPT));
  const inputTooLarge = input.length > MAX_INPUT_CHARACTERS;

  function handleClean() {
    if (!inputTooLarge) setOutput(cleanJavaScript(input));
  }

  return (
    <div className="space-y-4">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        This is a quick cleanup utility, not a production-grade minifier or bundler. Review the output before using it in production.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleClean}
          disabled={inputTooLarge}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clean JavaScript
        </button>
        <p className="text-sm text-zinc-600">
          Clean up to {MAX_INPUT_CHARACTERS.toLocaleString()} characters at a time.
          {inputTooLarge ? " Shorten the input before cleaning." : ""}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="javascript-cleaner-input" className="mb-2 block text-sm font-medium text-zinc-700">
            JavaScript input
          </label>
          <textarea
            id="javascript-cleaner-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="javascript-cleaner-output" className="mb-2 block text-sm font-medium text-zinc-700">
            Cleaned JavaScript
          </label>
          <textarea
            id="javascript-cleaner-output"
            value={output}
            readOnly
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default JavaScriptCleaner;
