"use client";

import { useState } from "react";

// 生成单个 UUID v4：使用 crypto.getRandomValues 实现 RFC 4122 兼容
function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // RFC 4122 v4：第 6 字节高 4 位为 0100，第 8 字节高 2 位为 10
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex: string[] = [];
  bytes.forEach((b) => hex.push(b.toString(16).padStart(2, "0")));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

function formatUuid(uuid: string, opts: {
  uppercase: boolean;
  hyphens: boolean;
}): string {
  let result = opts.hyphens ? uuid : uuid.replace(/-/g, "");
  if (opts.uppercase) result = result.toUpperCase();
  return result;
}

// 批量生成 UUID（纯函数，便于 useState 初始化使用）
function generateUuidList(count: number, uppercase: boolean, hyphens: boolean): string[] {
  const safeCount = Math.min(100, Math.max(1, count || 1));
  const list: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    list.push(formatUuid(generateUuidV4(), { uppercase, hyphens }));
  }
  return list;
}

// UUID 批量生成器
export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>(() =>
    generateUuidList(5, false, true),
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function generate(): void {
    setUuids(generateUuidList(count, uppercase, hyphens));
    setCopiedIndex(null);
    setCopiedAll(false);
  }

  async function handleCopy(value: string, index: number) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  async function handleCopyAll() {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 选项 */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
        <div className="flex flex-col">
          <label
            htmlFor="uuid-count"
            className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500"
          >
            Count
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="w-24 rounded-lg border border-zinc-300 bg-white p-2 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(event) => setUppercase(event.target.checked)}
            className="accent-primary"
          />
          Uppercase
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(event) => setHyphens(event.target.checked)}
            className="accent-primary"
          />
          Hyphens
        </label>
        <button
          type="button"
          onClick={generate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={handleCopyAll}
          disabled={uuids.length === 0}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copiedAll ? "Copied!" : "Copy All"}
        </button>
      </div>

      {/* 列表 */}
      <div className="rounded-lg border border-zinc-300 bg-zinc-50 shadow-sm">
        {uuids.length === 0 ? (
          <p className="p-6 text-center text-sm text-zinc-500">
            Click Generate to create UUIDs.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {uuids.map((uuid, index) => (
              <li
                key={`${uuid}-${index}`}
                className="flex items-center justify-between gap-3 px-4 py-2"
              >
                <span className="break-all font-mono text-sm text-zinc-900">
                  {uuid}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(uuid, index)}
                  className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UuidGenerator;
