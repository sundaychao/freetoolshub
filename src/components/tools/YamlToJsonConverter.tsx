"use client";

import { useState } from "react";
import { simpleYamlToJson } from "@/lib/seo-tool-utils";

const SAMPLE_YAML = `name: SundayChaos
enabled: true
count: 3`;

export function YamlToJsonConverter() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleConvert() {
    try {
      setOutput(JSON.stringify(simpleYamlToJson(input), null, 2));
      setError("");
    } catch (error) {
      setOutput("");
      setError(error instanceof Error ? error.message : "Unable to convert YAML to JSON.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label htmlFor="yaml-to-json-input" className="mb-2 block text-sm font-medium text-zinc-700">
          YAML input
        </label>
        <p className="mb-2 text-xs text-zinc-500">Supports top-level key/value objects and simple lists only. Nested or indented YAML is not supported.</p>
        <textarea
          id="yaml-to-json-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={handleConvert}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Convert to JSON
        </button>
        {error && (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="yaml-to-json-output" className="mb-2 block text-sm font-medium text-zinc-700">
          JSON output
        </label>
        <textarea
          id="yaml-to-json-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Converted JSON will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default YamlToJsonConverter;
