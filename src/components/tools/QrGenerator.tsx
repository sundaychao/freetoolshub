"use client";

import { useMemo, useState } from "react";

type Status = {
  type: "ok" | "error" | null;
  message: string;
};

// 可选尺寸列表
const SIZES = [100, 200, 300, 500] as const;
type Size = (typeof SIZES)[number];

// QR Code 生成器
// 注意：当前使用外部公开 API（api.qrserver.com）作为图像源，
// 避免引入第三方 npm 库；后续可替换为本地实现的 QR 算法。
export function QrGenerator() {
  const [input, setInput] = useState("https://example.com");
  const [size, setSize] = useState<Size>(300);
  const [flash, setFlash] = useState<Status>({ type: null, message: "" });
  const [downloading, setDownloading] = useState(false);

  // 自动生成：输入或尺寸变化时刷新 URL
  const trimmed = input.trim();
  const qrUrl = useMemo(() => {
    if (!trimmed) return "";
    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: trimmed,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  }, [trimmed, size]);

  // 直接从输入派生状态，避免在 effect 中调用 setState
  const status: Status = !trimmed
    ? { type: "error", message: "Input is empty. Type text or a URL to encode." }
    : flash;

  function handleGenerate() {
    if (!trimmed) {
      setFlash({ type: "error", message: "Input is empty. Type text or a URL to encode." });
      return;
    }
    setFlash({ type: "ok", message: "QR code generated." });
  }

  // 下载 PNG：fetch 图片二进制后转 blob 触发下载
  async function handleDownloadPng() {
    if (!qrUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image (HTTP ${response.status}).`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `qr-${size}x${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      setFlash({ type: "ok", message: "PNG downloaded." });
    } catch (error) {
      setFlash({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to download image. The QR service may be unavailable.",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 左侧：输入与尺寸选择 */}
      <div className="flex flex-col">
        <label
          htmlFor="qr-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Content
        </label>
        <textarea
          id="qr-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Enter a URL, text, or any data to encode..."
          className="h-40 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Size
          </span>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  s === size
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!qrUrl || downloading}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? "Downloading..." : "Download PNG"}
          </button>
          {qrUrl && (
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Open in new tab
            </a>
          )}
        </div>

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

      {/* 右侧：预览 */}
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-zinc-700">
          Preview
        </label>
        <div className="flex min-h-[300px] w-full items-center justify-center rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt="Generated QR code"
              width={size}
              height={size}
              className="h-auto max-w-full"
              style={{ maxWidth: `${size}px` }}
            />
          ) : (
            <p className="text-sm text-zinc-400">
              Your QR code will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrGenerator;
