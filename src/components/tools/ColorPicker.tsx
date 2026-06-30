"use client";

import { useMemo, useState } from "react";

// HEX -> { r, g, b }
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// RGB -> HSL
function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rN:
        h = (gN - bN) / delta + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / delta + 2;
        break;
      default:
        h = (rN - gN) / delta + 4;
        break;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// 颜色选择器，提供 HEX / RGB / HSL 三种格式
export function ColorPicker() {
  const [color, setColor] = useState("#3b82f6");
  // 各格式单独的复制状态
  const [copiedField, setCopiedField] = useState<
    null | "hex" | "rgb" | "hsl"
  >(null);

  const { hex, rgb, hsl } = useMemo(() => {
    const rgbVal = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    return {
      hex: color.toUpperCase(),
      rgb: `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`,
      hsl: `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`,
    };
  }, [color]);

  async function handleCopy(value: string, field: "hex" | "rgb" | "hsl") {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  const formats: {
    label: string;
    field: "hex" | "rgb" | "hsl";
    value: string;
  }[] = [
    { label: "HEX", field: "hex", value: hex },
    { label: "RGB", field: "rgb", value: rgb },
    { label: "HSL", field: "hsl", value: hsl },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 左侧：选色 */}
      <div className="flex flex-col">
        <label
          htmlFor="color-input-native"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Pick a color
        </label>
        <div className="flex items-center gap-4 rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
          <input
            id="color-input-native"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-16 w-16 cursor-pointer rounded-md border border-zinc-200 bg-white p-1"
          />
          <div>
            <p className="text-sm font-medium text-zinc-700">
              Selected color
            </p>
            <p className="font-mono text-sm text-zinc-500">{hex}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label
            htmlFor="color-hex-text"
            className="text-sm font-medium text-zinc-700"
          >
            HEX
          </label>
          <input
            id="color-hex-text"
            type="text"
            value={color}
            onChange={(event) => {
              const v = event.target.value;
              if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) {
                setColor(v.startsWith("#") ? v : `#${v}`);
              }
            }}
            className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* 右侧：三种格式 + 预览大色块 */}
      <div className="flex flex-col">
        <div
          className="h-32 w-full rounded-lg border border-zinc-200 shadow-sm"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <div className="mt-4 space-y-3">
          {formats.map((f) => (
            <div key={f.field}>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor={`color-${f.field}`}
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  {f.label}
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(f.value, f.field)}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  {copiedField === f.field ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                id={`color-${f.field}`}
                type="text"
                value={f.value}
                readOnly
                spellCheck={false}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
