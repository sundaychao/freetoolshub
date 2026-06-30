"use client";

import { useState } from "react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

type Options = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

type Strength = "weak" | "medium" | "strong";

// 根据选项构造字符池
function buildPool(opts: Options): string {
  let pool = "";
  if (opts.uppercase) pool += UPPER;
  if (opts.lowercase) pool += LOWER;
  if (opts.numbers) pool += NUMBERS;
  if (opts.symbols) pool += SYMBOLS;
  return pool;
}

// 从字符池中安全随机地选取一个字符
function pickSecureChar(pool: string): string {
  if (pool.length === 0) return "";
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  // 拒绝采样以避免模偏差（池长度 < 2^32，偏差极小但保持严谨）
  const max = Math.floor(0xffffffff / pool.length) * pool.length;
  let r = buffer[0];
  while (r >= max) {
    crypto.getRandomValues(buffer);
    r = buffer[0];
  }
  return pool[r % pool.length];
}

// 根据长度与选项生成密码（纯函数，便于 useState 初始化使用）
function generatePassword(length: number, opts: Options): string {
  const pool = buildPool(opts);
  if (pool.length === 0) return "";
  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    chars.push(pickSecureChar(pool));
  }
  return chars.join("");
}

// 估算密码强度
function estimateStrength(
  password: string,
  opts: Options,
): Strength {
  const pool = buildPool(opts);
  if (!pool || password.length === 0) return "weak";
  let charsetBits = 0;
  if (opts.uppercase) charsetBits += 26;
  if (opts.lowercase) charsetBits += 26;
  if (opts.numbers) charsetBits += 10;
  if (opts.symbols) charsetBits += 26;
  // 熵估算 = log2(charsetBits) * length
  const entropy = Math.log2(charsetBits || 1) * password.length;
  if (entropy < 40) return "weak";
  if (entropy < 70) return "medium";
  return "strong";
}

// 密码生成器：使用 crypto.getRandomValues 保证安全随机
export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState(() =>
    generatePassword(16, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    }),
  );
  const [copied, setCopied] = useState(false);

  const currentOpts: Options = { uppercase, lowercase, numbers, symbols };

  function generate(): void {
    const next = generatePassword(length, currentOpts);
    setPassword(next);
    setCopied(false);
  }

  async function handleCopy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  const strength = estimateStrength(password, currentOpts);
  const strengthColor =
    strength === "weak"
      ? "bg-red-100 text-red-700"
      : strength === "medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  const noCharsetSelected =
    !uppercase && !lowercase && !numbers && !symbols;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 左侧：选项 */}
      <div className="flex flex-col">
        <div className="rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-length"
              className="text-sm font-medium text-zinc-700"
            >
              Length
            </label>
            <span className="font-mono text-sm text-zinc-900">{length}</span>
          </div>
          <input
            id="password-length"
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(event) => setUppercase(event.target.checked)}
              className="accent-primary"
            />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(event) => setLowercase(event.target.checked)}
              className="accent-primary"
            />
            Lowercase (a-z)
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
            <input
              type="checkbox"
              checked={numbers}
              onChange={(event) => setNumbers(event.target.checked)}
              className="accent-primary"
            />
            Numbers (0-9)
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
            <input
              type="checkbox"
              checked={symbols}
              onChange={(event) => setSymbols(event.target.checked)}
              className="accent-primary"
            />
            Symbols (!@#)
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generate}
            disabled={noCharsetSelected}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!password}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* 右侧：结果展示 */}
      <div className="flex flex-col">
        <label
          htmlFor="password-output"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Generated password
        </label>
        <div
          id="password-output"
          className="min-h-[120px] w-full break-all rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-2xl text-zinc-900 shadow-sm"
        >
          {password || "Click Generate to create a password."}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-700">Strength:</span>
          <span
            className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide ${strengthColor}`}
          >
            {strength}
          </span>
        </div>
        {noCharsetSelected && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Select at least one character set.
          </p>
        )}
      </div>
    </div>
  );
}

export default PasswordGenerator;
