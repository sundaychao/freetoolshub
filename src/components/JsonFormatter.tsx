"use client";

import { useMemo, useState } from "react";

type Status = {
  type: "ok" | "error" | null;
  message: string;
};

// JSON 格式化 / 压缩 / 校验工具
export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>({ type: null, message: "" });
  const [copied, setCopied] = useState(false);

  const lineCount = useMemo(
    () => (output ? output.split("\n").length : 0),
    [output],
  );

  function parseInput(): unknown {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error("Input is empty. Paste some JSON to get started.");
    }
    return JSON.parse(trimmed);
  }

  function handleFormat() {
    try {
      const parsed = parseInput();
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setStatus({ type: "ok", message: "Valid JSON. Formatted successfully." });
      setCopied(false);
    } catch (error) {
      setOutput("");
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to parse JSON.",
      });
    }
  }

  function handleMinify() {
    try {
      const parsed = parseInput();
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStatus({ type: "ok", message: "Valid JSON. Minified successfully." });
      setCopied(false);
    } catch (error) {
      setOutput("");
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to parse JSON.",
      });
    }
  }

  function handleValidate() {
    try {
      parseInput();
      setStatus({ type: "ok", message: "Valid JSON. No errors found." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Invalid JSON.",
      });
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setStatus({ type: null, message: "" });
    setCopied(false);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 输入区 */}
      <div className="flex flex-col">
        <label
          htmlFor="json-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Input
        </label>
        <textarea
          id="json-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder='{"hello": "world", "items": [1, 2, 3]}'
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 输出区 */}
      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="json-output"
            className="text-sm font-medium text-zinc-700"
          >
            Output
          </label>
          <div className="flex items-center gap-3">
            {lineCount > 0 && (
              <span className="text-xs text-zinc-400">{lineCount} lines</span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <textarea
          id="json-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Formatted JSON will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
        />
        {status.type && (
          <p
            role="status"
            className={`mt-3 rounded-md px-3 py-2 text-sm ${
              status.type === "ok"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default JsonFormatter;
