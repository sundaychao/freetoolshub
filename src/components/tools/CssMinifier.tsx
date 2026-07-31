"use client";

import { useMemo, useState } from "react";
import { minifyCss } from "@/lib/seo-tool-utils";

const SAMPLE_CSS = `/* Card styles */
.card {
  color: #1f2937;
  padding: 1rem;
  background: white;
}`;

export function CssMinifier() {
  const [input, setInput] = useState(SAMPLE_CSS);
  const output = useMemo(() => minifyCss(input), [input]);

  return (
    <div className="space-y-4">
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
