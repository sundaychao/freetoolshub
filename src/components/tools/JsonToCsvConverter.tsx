"use client";

import { useState } from "react";
import { isNonEmptyPlainObjectArray, jsonToCsv } from "@/lib/seo-tool-utils";

const SAMPLE_JSON = `[
  { "name": "Jane", "role": "Developer" },
  { "name": "Alex", "role": "Designer" }
]`;

export function JsonToCsvConverter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [spreadsheetSafe, setSpreadsheetSafe] = useState(true);

  function handleConvert() {
    try {
      const parsedInput: unknown = JSON.parse(input);
      if (!isNonEmptyPlainObjectArray(parsedInput)) {
        throw new Error("JSON must be a non-empty array of objects.");
      }
      setOutput(jsonToCsv(parsedInput, { spreadsheetSafe }));
      setError("");
    } catch (error) {
      setOutput("");
      setError(error instanceof Error ? error.message : "Unable to convert JSON to CSV.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label htmlFor="json-to-csv-input" className="mb-2 block text-sm font-medium text-zinc-700">
          JSON input
        </label>
        <textarea
          id="json-to-csv-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <label className="mt-3 flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={spreadsheetSafe}
            onChange={(event) => {
              setSpreadsheetSafe(event.target.checked);
              setOutput("");
            }}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
          />
          Escape formula-leading cells for spreadsheet safety
        </label>
        {!spreadsheetSafe && (
          <p role="alert" className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Warning: spreadsheet formula-leading cells will be exported unchanged and may execute when the CSV is opened.
          </p>
        )}
        <button
          type="button"
          onClick={handleConvert}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Convert to CSV
        </button>
        {error && (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="json-to-csv-output" className="mb-2 block text-sm font-medium text-zinc-700">
          CSV output
        </label>
        <textarea
          id="json-to-csv-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Converted CSV will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default JsonToCsvConverter;
