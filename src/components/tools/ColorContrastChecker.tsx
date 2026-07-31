"use client";

import { useMemo, useState } from "react";
import { contrastRatio } from "@/lib/seo-tool-utils";

type ContrastResult = { ratio: number; error: "" } | { ratio: null; error: string };

function getContrastResult(foreground: string, background: string): ContrastResult {
  try {
    return { ratio: contrastRatio(foreground, background), error: "" };
  } catch (error) {
    return { ratio: null, error: error instanceof Error ? error.message : "Enter valid hex colors." };
  }
}

export function ColorContrastChecker() {
  const [foreground, setForeground] = useState("#1f2937");
  const [background, setBackground] = useState("#ffffff");
  const result = useMemo(() => getContrastResult(foreground, background), [foreground, background]);
  const aaNormalPasses = result.ratio !== null && result.ratio >= 4.5;
  const aaLargePasses = result.ratio !== null && result.ratio >= 3;
  const aaaNormalPasses = result.ratio !== null && result.ratio >= 7;
  const aaaLargePasses = result.ratio !== null && result.ratio >= 4.5;
  const displayRatio = result.ratio === null ? null : result.ratio.toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contrast-foreground" className="mb-2 block text-sm font-medium text-zinc-700">Foreground hex</label>
          <div className="flex gap-3">
            <input id="contrast-foreground" value={foreground} onChange={(event) => setForeground(event.target.value)} spellCheck={false} className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="h-10 w-10 shrink-0 rounded-md border border-zinc-300" style={{ backgroundColor: foreground }} aria-label={`Foreground color ${foreground}`} />
          </div>
        </div>
        <div>
          <label htmlFor="contrast-background" className="mb-2 block text-sm font-medium text-zinc-700">Background hex</label>
          <div className="flex gap-3">
            <input id="contrast-background" value={background} onChange={(event) => setBackground(event.target.value)} spellCheck={false} className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="h-10 w-10 shrink-0 rounded-md border border-zinc-300" style={{ backgroundColor: background }} aria-label={`Background color ${background}`} />
          </div>
        </div>
      </div>

      {result.error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>
      ) : (
        <>
          <div className="rounded-lg border border-zinc-300 p-6" style={{ backgroundColor: background, color: foreground }}>
            <p className="text-2xl font-semibold">Sample text</p>
            <p className="mt-2 text-sm">This preview uses your selected foreground and background colors.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">Ratio: <strong className="font-mono text-zinc-900">{displayRatio}:1</strong></p>
            <p className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">AA normal: <strong className={aaNormalPasses ? "text-emerald-700" : "text-red-700"}>{aaNormalPasses ? "Pass" : "Fail"}</strong></p>
            <p className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">AAA normal: <strong className={aaaNormalPasses ? "text-emerald-700" : "text-red-700"}>{aaaNormalPasses ? "Pass" : "Fail"}</strong></p>
            <p className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">Large text: <strong className={aaaLargePasses ? "text-emerald-700" : aaLargePasses ? "text-amber-700" : "text-red-700"}>{aaaLargePasses ? "AAA Pass" : aaLargePasses ? "AA Pass" : "Fail"}</strong></p>
          </div>
        </>
      )}
    </div>
  );
}

export default ColorContrastChecker;
