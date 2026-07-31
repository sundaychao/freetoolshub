"use client";

import { useState } from "react";
import { minifyCss } from "@/lib/seo-tool-utils";

const SAMPLE_CSS = `/* Card styles */
.card {
  color: #1f2937;
  padding: 1rem;
  background: white;
}`;
const MAX_INPUT_CHARACTERS = 100_000;

export function CssMinifier() {
  const [input, setInput] = useState(SAMPLE_CSS);
  const [output, setOutput] = useState(() => minifyCss(SAMPLE_CSS));
  const inputTooLarge = input.length > MAX_INPUT_CHARACTERS;

  function handleMinify() {
    if (!inputTooLarge) setOutput(minifyCss(input));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleMinify}
          disabled={inputTooLarge}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Minify CSS
        </button>
        <p className="text-sm text-zinc-600">
          Minify up to {MAX_INPUT_CHARACTERS.toLocaleString()} characters at a time.
          {inputTooLarge ? " Shorten the input before minifying." : ""}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="css-minifier-input" className="mb-2 block text-sm font-medium text-zinc-700">
            CSS input
          </label>
          <textarea
            id="css-minifier-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="css-minifier-output" className="mb-2 block text-sm font-medium text-zinc-700">
            Minified CSS
          </label>
          <textarea
            id="css-minifier-output"
            value={output}
            readOnly
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
          />
        </div>
      </div>
      <p className="text-sm text-zinc-600">
        Input: <span className="font-mono text-zinc-900">{input.length}</span> characters. Output: <span className="font-mono text-zinc-900">{output.length}</span> characters.
      </p>
    </div>
  );
}

export default CssMinifier;
