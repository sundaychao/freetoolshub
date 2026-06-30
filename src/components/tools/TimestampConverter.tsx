"use client";

import { useEffect, useMemo, useState } from "react";

// 将时间戳格式化为 YYYY-MM-DD HH:mm:ss
function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

// 将 datetime-local 输入框的本地值转回 Date
function parseLocalInput(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

// 计算时间戳 → 日期结果（纯函数，避免在 useMemo 中调用 setState）
function computeTsResult(input: string): {
  error?: string;
  ms?: number;
  unit?: string;
  utc?: string;
  local?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: "Enter a Unix timestamp." };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { error: "Timestamp must be a positive integer." };
  }
  const num = Number(trimmed);
  // 自动检测秒/毫秒：阈值 10_000_000_000（约 2286 年的秒数）
  const ms = num < 10_000_000_000 ? num * 1000 : num;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    return { error: "Invalid timestamp." };
  }
  // local：直接用本地时区方法格式化
  // utc：将时间偏移到本地时区后再用本地方法格式化，得到 UTC 表示
  return {
    ms,
    unit: num < 10_000_000_000 ? "seconds" : "milliseconds",
    local: formatDateTime(date),
    utc: formatDateTime(
      new Date(ms + date.getTimezoneOffset() * 60000),
    ),
  };
}

// 计算日期 → 时间戳结果（纯函数）
function computeDateResult(input: string): {
  error?: string;
  seconds?: number;
  milliseconds?: number;
} {
  const date = parseLocalInput(input);
  if (!date) {
    return { error: "Pick a valid date and time." };
  }
  const ms = date.getTime();
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  };
}

// 获取当前本地 datetime 字符串（用于 datetime-local 输入框）
function currentLocalInput(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

// Unix 时间戳转换器
export function TimestampConverter() {
  // 实时当前时间戳
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timestamp -> Date 方向
  const [tsInput, setTsInput] = useState(() =>
    String(Math.floor(Date.now() / 1000)),
  );

  const tsResult = useMemo(() => computeTsResult(tsInput), [tsInput]);

  // Date -> Timestamp 方向
  const [dateInput, setDateInput] = useState(() => currentLocalInput());

  const dateResult = useMemo(() => computeDateResult(dateInput), [dateInput]);

  // 复制相关状态
  const [copiedField, setCopiedField] = useState<string | null>(null);
  async function copyText(text: string, field: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  // 将当前时间戳填入 Timestamp -> Date 输入框
  function useCurrentTime() {
    setTsInput(String(Math.floor(Date.now() / 1000)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 当前时间戳展示 */}
      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-zinc-50 p-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current Unix Timestamp
            </p>
            <p className="mt-1 font-mono text-xl text-zinc-900">
              {Math.floor(now / 1000)}
              <span className="ml-2 text-sm text-zinc-500">seconds</span>
            </p>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              {now} milliseconds
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                copyText(String(Math.floor(now / 1000)), "now-sec")
              }
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {copiedField === "now-sec" ? "Copied!" : "Copy sec"}
            </button>
            <button
              type="button"
              onClick={() => copyText(String(now), "now-ms")}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {copiedField === "now-ms" ? "Copied!" : "Copy ms"}
            </button>
          </div>
        </div>
      </div>

      {/* Timestamp -> Date */}
      <div className="flex flex-col">
        <label
          htmlFor="ts-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Timestamp → Date
        </label>
        <input
          id="ts-input"
          type="text"
          value={tsInput}
          onChange={(event) => setTsInput(event.target.value)}
          spellCheck={false}
          placeholder="e.g. 1700000000"
          className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={useCurrentTime}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Use Current Time
          </button>
          <button
            type="button"
            onClick={() => setTsInput("")}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 space-y-3 rounded-lg border border-zinc-300 bg-zinc-50 p-4 shadow-sm">
          {tsResult.error ? (
            <p className="text-sm text-red-600">{tsResult.error}</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  Detected unit
                </span>
                <span className="font-mono text-sm text-zinc-900">
                  {tsResult.unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  Local time
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-900">
                    {tsResult.local}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(tsResult.local ?? "", "ts-local")}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    {copiedField === "ts-local" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  UTC time
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-900">
                    {tsResult.utc}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(tsResult.utc ?? "", "ts-utc")}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    {copiedField === "ts-utc" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Date -> Timestamp */}
      <div className="flex flex-col">
        <label
          htmlFor="date-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Date → Timestamp
        </label>
        <input
          id="date-input"
          type="datetime-local"
          step="1"
          value={dateInput}
          onChange={(event) => setDateInput(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDateInput(currentLocalInput())}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Use Current Time
          </button>
        </div>

        <div className="mt-4 space-y-3 rounded-lg border border-zinc-300 bg-zinc-50 p-4 shadow-sm">
          {dateResult.error ? (
            <p className="text-sm text-red-600">{dateResult.error}</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  Unix seconds
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-900">
                    {dateResult.seconds}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(String(dateResult.seconds ?? ""), "date-sec")
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    {copiedField === "date-sec" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  Unix milliseconds
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-900">
                    {dateResult.milliseconds}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        String(dateResult.milliseconds ?? ""),
                        "date-ms",
                      )
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    {copiedField === "date-ms" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimestampConverter;
