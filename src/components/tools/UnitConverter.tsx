"use client";

import { useState } from "react";

type CategoryKey = "length" | "weight" | "temperature" | "data";

type UnitDef = {
  key: string;
  label: string;
};

// 各类别下的单位列表
const UNITS: Record<CategoryKey, UnitDef[]> = {
  length: [
    { key: "mm", label: "Millimeter (mm)" },
    { key: "cm", label: "Centimeter (cm)" },
    { key: "m", label: "Meter (m)" },
    { key: "km", label: "Kilometer (km)" },
    { key: "in", label: "Inch (in)" },
    { key: "ft", label: "Foot (ft)" },
    { key: "yd", label: "Yard (yd)" },
    { key: "mile", label: "Mile (mi)" },
  ],
  weight: [
    { key: "mg", label: "Milligram (mg)" },
    { key: "g", label: "Gram (g)" },
    { key: "kg", label: "Kilogram (kg)" },
    { key: "oz", label: "Ounce (oz)" },
    { key: "lb", label: "Pound (lb)" },
  ],
  temperature: [
    { key: "C", label: "Celsius (°C)" },
    { key: "F", label: "Fahrenheit (°F)" },
    { key: "K", label: "Kelvin (K)" },
  ],
  data: [
    { key: "B", label: "Byte (B)" },
    { key: "KB", label: "Kilobyte (KB)" },
    { key: "MB", label: "Megabyte (MB)" },
    { key: "GB", label: "Gigabyte (GB)" },
    { key: "TB", label: "Terabyte (TB)" },
  ],
};

// 各类别标签
const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "length", label: "Length" },
  { key: "weight", label: "Weight" },
  { key: "temperature", label: "Temperature" },
  { key: "data", label: "Data" },
];

// Length 单位换算到 meter（基准）的因子
const LENGTH_TO_METER: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mile: 1609.344,
};

// Weight 单位换算到 gram（基准）的因子
const WEIGHT_TO_GRAM: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

// Data 单位换算到 byte（基准）的因子（1024 进制）
const DATA_TO_BYTE: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

// 将任意温度单位转为 Celsius（中间值）
function temperatureToCelsius(value: number, from: string): number {
  switch (from) {
    case "C":
      return value;
    case "F":
      return (value - 32) * (5 / 9);
    case "K":
      return value - 273.15;
    default:
      return value;
  }
}

// 将 Celsius 转为任意目标单位
function celsiusToUnit(celsius: number, to: string): number {
  switch (to) {
    case "C":
      return celsius;
    case "F":
      return celsius * (9 / 5) + 32;
    case "K":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

// 通用转换：在非温度类别下，先把 from 转为基准值，再转为 to 单位
function convertLinear(
  value: number,
  from: string,
  to: string,
  factorMap: Record<string, number>,
): number {
  const fromFactor = factorMap[from];
  const toFactor = factorMap[to];
  if (fromFactor === undefined || toFactor === undefined) return NaN;
  const base = value * fromFactor;
  return base / toFactor;
}

// 顶层转换函数：根据类别分派
function convert(
  value: number,
  from: string,
  to: string,
  category: CategoryKey,
): number {
  if (Number.isNaN(value)) return NaN;
  if (category === "temperature") {
    const celsius = temperatureToCelsius(value, from);
    return celsiusToUnit(celsius, to);
  }
  if (category === "length") {
    return convertLinear(value, from, to, LENGTH_TO_METER);
  }
  if (category === "weight") {
    return convertLinear(value, from, to, WEIGHT_TO_GRAM);
  }
  return convertLinear(value, from, to, DATA_TO_BYTE);
}

// 把数字格式化为友好显示：去掉无意义尾零
function formatNumber(num: number): string {
  if (!Number.isFinite(num)) return "—";
  // 极大或极小数用科学计数法
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  // 普通数：保留至多 8 位有效数字，再去除尾随 0
  const fixed = num.toFixed(8);
  const trimmed = fixed.replace(/\.?0+$/, "");
  return trimmed;
}

// 单位转换器：覆盖长度、重量、温度、数据四类
export function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [fromValue, setFromValue] = useState("1");

  // 切换类别时同步默认的 from/to 单位
  function handleCategoryChange(next: CategoryKey) {
    setCategory(next);
    const units = UNITS[next];
    setFromUnit(units[0].key);
    setToUnit(units[1].key);
    setFromValue("1");
  }

  // 交换 from / to 单位（同时把当前结果填回 from 输入框）
  function handleSwap() {
    const result = computeResult.result;
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null && Number.isFinite(result)) {
      setFromValue(String(result));
    }
  }

  // 输入数值解析（直接派生，让 React Compiler 自动优化）
  const trimmedValue = fromValue.trim();
  const parsedValue =
    trimmedValue === "" || Number.isNaN(Number(trimmedValue))
      ? null
      : Number(trimmedValue);

  // 计算结果（修改任意一侧都实时计算）
  const computeResult = (() => {
    if (parsedValue === null) {
      return { result: null as number | null, error: "Enter a number to convert." };
    }
    const result = convert(parsedValue, fromUnit, toUnit, category);
    if (!Number.isFinite(result)) {
      return { result: null, error: "Conversion failed." };
    }
    return { result, error: null as string | null };
  })();

  // 复制结果
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    if (computeResult.result === null) return;
    try {
      await navigator.clipboard.writeText(String(computeResult.result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <div>
      {/* 类别选择 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => handleCategoryChange(cat.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              cat.key === category
                ? "bg-primary text-white hover:bg-primary-hover"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左侧：from */}
        <div className="flex flex-col">
          <label
            htmlFor="from-unit"
            className="mb-2 text-sm font-medium text-zinc-700"
          >
            From
          </label>
          <select
            id="from-unit"
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {UNITS[category].map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>

          <label
            htmlFor="from-value"
            className="mb-2 mt-4 text-sm font-medium text-zinc-700"
          >
            Value
          </label>
          <input
            id="from-value"
            type="number"
            value={fromValue}
            onChange={(event) => setFromValue(event.target.value)}
            placeholder="Enter a value"
            className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="mt-3">
            <button
              type="button"
              onClick={handleSwap}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Swap ↑↓
            </button>
          </div>
        </div>

        {/* 右侧：to + 结果 */}
        <div className="flex flex-col">
          <label
            htmlFor="to-unit"
            className="mb-2 text-sm font-medium text-zinc-700"
          >
            To
          </label>
          <select
            id="to-unit"
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {UNITS[category].map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>

          <label
            htmlFor="to-value"
            className="mb-2 mt-4 text-sm font-medium text-zinc-700"
          >
            Result
          </label>
          <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-900 shadow-sm">
            <span className="font-mono break-all">
              {computeResult.result === null
                ? "—"
                : formatNumber(computeResult.result)}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              disabled={computeResult.result === null}
              className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {computeResult.error && (
            <p
              role="status"
              className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {computeResult.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnitConverter;
