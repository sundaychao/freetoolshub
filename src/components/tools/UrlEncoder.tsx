"use client";

import { useState } from "react";

type Status = {
  type: "ok" | "error" | null;
  message: string;
};

// URL 编码 / 解码工具（encodeURIComponent / decodeURIComponent）
export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>({ type: null, message: "" });
  const [copied, setCopied] = useState(false);

  function handleEncode() {
    try {
      if (!input) {
        throw new Error("Input is empty. Type something to encode.");
      }
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setStatus({ type: "ok", message: "Encoded successfully." });
      setCopied(false);
    } catch (error) {
      setOutput("");
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to encode text.",
      });
    }
  }

  function handleDecode() {
    try {
      if (!input) {
        throw new Error("Input is empty. Paste an encoded URL to decode.");
      }
      const decoded = decodeURIComponent(input.trim());
      setOutput(decoded);
      setStatus({ type: "ok", message: "Decoded successfully." });
      setCopied(false);
    } catch (error) {
      setOutput("");
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Invalid URL-encoded input.",
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
          htmlFor="url-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Input
        </label>
        <textarea
          id="url-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Type a URL or text to encode / decode..."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleEncode}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Encode
          </button>
          <button
            type="button"
            onClick={handleDecode}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Decode
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
            htmlFor="url-output"
            className="text-sm font-medium text-zinc-700"
          >
            Output
          </label>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          id="url-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Result will appear here."
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

export default UrlEncoder;
