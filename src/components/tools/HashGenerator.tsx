"use client";

import { useState } from "react";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-512";

// 将 ArrayBuffer 转为 hex 字符串
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

// Hash 生成器：基于 Web Crypto API
export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!input) {
      setError("Input is empty. Type something to hash.");
      setHash("");
      return;
    }
    setError(null);
    setLoading(true);
    setCopied(false);
    try {
      const data = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algorithm, data);
      setHash(bufferToHex(digest));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compute hash.");
      setHash("");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput("");
    setHash("");
    setError(null);
    setCopied(false);
  }

  async function handleCopy() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  const algorithms: Algorithm[] = ["SHA-1", "SHA-256", "SHA-512"];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 输入区 */}
      <div className="flex flex-col">
        <label
          htmlFor="hash-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Input
        </label>
        <textarea
          id="hash-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Type text to hash..."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {algorithms.map((algo) => (
              <button
                key={algo}
                type="button"
                onClick={() => setAlgorithm(algo)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  algorithm === algo
                    ? "bg-primary text-white"
                    : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Hashing..." : "Generate"}
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
            htmlFor="hash-output"
            className="text-sm font-medium text-zinc-700"
          >
            Hash ({algorithm})
          </label>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hash}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          id="hash-output"
          value={hash}
          readOnly
          spellCheck={false}
          placeholder="Hash will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-xs break-all text-zinc-900 shadow-sm focus:outline-none"
        />
        {error && (
          <p
            role="status"
            className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default HashGenerator;
