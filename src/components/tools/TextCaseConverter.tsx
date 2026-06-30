"use client";

import { useState } from "react";

type ConvertType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab";

// 将文本切分为「单词」token（保留分隔符位置），便于 camel/snake/kebab 等转换
function splitWords(text: string): string[] {
  // 先把常见分隔符（空格 / 下划线 / 中划线）以及大小写边界转为统一分隔
  const normalized = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

function toSentenceCase(text: string): string {
  // 按句子切分（以 . ! ? 结尾），仅首字母大写
  return text.replace(
    /(^\s*[a-z])|([.!?]\s+[a-z])/g,
    (match) => match.toUpperCase(),
  );
}

function toCamelCase(text: string): string {
  const words = splitWords(text).map((w) => w.toLowerCase());
  if (words.length === 0) return "";
  return (
    words[0] +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  );
}

function toSnakeCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("_");
}

function toKebabCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("-");
}

// 文本大小写转换器
export function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function convert(type: ConvertType) {
    let result = "";
    switch (type) {
      case "upper":
        result = input.toUpperCase();
        break;
      case "lower":
        result = input.toLowerCase();
        break;
      case "title":
        result = toTitleCase(input);
        break;
      case "sentence":
        result = toSentenceCase(input);
        break;
      case "camel":
        result = toCamelCase(input);
        break;
      case "snake":
        result = toSnakeCase(input);
        break;
      case "kebab":
        result = toKebabCase(input);
        break;
    }
    setOutput(result);
    setCopied(false);
  }

  function handleClear() {
    setInput("");
    setOutput("");
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

  const buttons: { type: ConvertType; label: string }[] = [
    { type: "upper", label: "UPPERCASE" },
    { type: "lower", label: "lowercase" },
    { type: "title", label: "Title Case" },
    { type: "sentence", label: "Sentence case" },
    { type: "camel", label: "camelCase" },
    { type: "snake", label: "snake_case" },
    { type: "kebab", label: "kebab-case" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 输入区 */}
      <div className="flex flex-col">
        <label
          htmlFor="case-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Input
        </label>
        <textarea
          id="case-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Type or paste text here..."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {buttons.map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => convert(btn.type)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 输出区 */}
      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="case-output"
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
          id="case-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Converted text will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-900 shadow-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default TextCaseConverter;
