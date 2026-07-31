"use client";

import { useEffect, useRef, useState } from "react";
import type { RegexTestResult } from "@/lib/seo-tool-utils";

const MAX_PATTERN_CHARACTERS = 500;
const MAX_FLAGS_CHARACTERS = 8;
const MAX_TEXT_CHARACTERS = 100_000;
const MAX_MATCHES = 100;
const REGEX_TIMEOUT_MS = 1_500;

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("");
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function stopWorker() {
    workerRef.current?.terminate();
    workerRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  useEffect(() => () => stopWorker(), []);

  function handleTest() {
    stopWorker();
    setResult(null);

    if (pattern.length === 0) {
      setError("Enter a pattern before testing.");
      return;
    }
    if (pattern.length > MAX_PATTERN_CHARACTERS) {
      setError(`Pattern must be ${MAX_PATTERN_CHARACTERS.toLocaleString()} characters or fewer.`);
      return;
    }
    if (flags.length > MAX_FLAGS_CHARACTERS) {
      setError(`Flags must be ${MAX_FLAGS_CHARACTERS} characters or fewer.`);
      return;
    }
    if (text.length > MAX_TEXT_CHARACTERS) {
      setError(`Test text must be ${MAX_TEXT_CHARACTERS.toLocaleString()} characters or fewer.`);
      return;
    }

    setError("");
    setIsRunning(true);
    const worker = new Worker(new URL("./regex-tester.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<RegexTestResult>) => {
      if (workerRef.current !== worker) return;
      stopWorker();
      setResult(event.data);
      setIsRunning(false);
    };
    worker.onerror = () => {
      if (workerRef.current !== worker) return;
      stopWorker();
      setError("The regex worker could not complete the test.");
      setIsRunning(false);
    };
    timeoutRef.current = setTimeout(() => {
      if (workerRef.current !== worker) return;
      stopWorker();
      setError(`Testing stopped after ${REGEX_TIMEOUT_MS / 1_000} seconds. The pattern may require excessive backtracking.`);
      setIsRunning(false);
    }, REGEX_TIMEOUT_MS);

    worker.postMessage({ pattern, flags, text, maxMatches: MAX_MATCHES });
  }

  const resultError = result?.error;
  const matches = result?.matches ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <div>
          <label htmlFor="regex-pattern" className="mb-2 block text-sm font-medium text-zinc-700">Pattern</label>
          <input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} maxLength={MAX_PATTERN_CHARACTERS} spellCheck={false} placeholder="(hello)" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label htmlFor="regex-flags" className="mb-2 block text-sm font-medium text-zinc-700">Flags</label>
          <input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} maxLength={MAX_FLAGS_CHARACTERS} spellCheck={false} placeholder="gi" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>
      <div>
        <label htmlFor="regex-text" className="mb-2 block text-sm font-medium text-zinc-700">Test text</label>
        <textarea id="regex-text" value={text} onChange={(event) => setText(event.target.value)} maxLength={MAX_TEXT_CHARACTERS} spellCheck={false} placeholder="Type or paste text to test..." className="h-48 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={handleTest} disabled={isRunning} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60">
            {isRunning ? "Testing..." : "Test regex"}
          </button>
          <span className="text-xs text-zinc-500">{text.length.toLocaleString()} / {MAX_TEXT_CHARACTERS.toLocaleString()} characters</span>
        </div>
      </div>
      {(error || resultError) && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error || resultError}</p>}
      {!error && !resultError && (
        <div>
          <h2 className="text-sm font-medium text-zinc-700">Matches ({matches.length})</h2>
          {result?.truncated && <p role="status" className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">Showing the first {MAX_MATCHES} matches. Refine the pattern to inspect later matches.</p>}
          <div className="mt-2 overflow-hidden rounded-lg border border-zinc-300">
            {result === null ? (
              <p className="bg-zinc-50 px-4 py-3 text-sm text-zinc-600">Choose Test regex to run the pattern.</p>
            ) : matches.length === 0 ? (
              <p className="bg-zinc-50 px-4 py-3 text-sm text-zinc-600">No matches found.</p>
            ) : matches.map((match, index) => (
              <div key={`${match.index}-${index}`} className="border-b border-zinc-200 p-4 last:border-b-0">
                <p className="break-all font-mono text-sm text-zinc-900"><span className="text-zinc-500">{match.index}: </span>{match.match}</p>
                {match.groups.length > 0 && <p className="mt-2 break-all font-mono text-xs text-zinc-600">Groups: {match.groups.map((group, groupIndex) => `$${groupIndex + 1}=${JSON.stringify(group)}`).join(", ")}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RegexTester;
