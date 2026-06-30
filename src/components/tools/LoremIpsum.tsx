"use client";

import { useState } from "react";

// 内置拉丁词库（约 70 个常见 Lorem Ipsum 词）
const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "eius",
  "modi", "tempora", "ducimus", "magnam", "quaerat", "voluptas", "autem",
  "quasi", "architecto",
];

// 经典开头
const CLASSIC_OPENING =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

// 从词库中随机取一个词
function pickRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// 生成一个句子：长度大致为 6-14 个词
function generateSentence(): string {
  const length = 6 + Math.floor(Math.random() * 9);
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(pickRandomWord());
  }
  // 首字母大写，末尾加句号
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

// 根据目标词数生成段落（拼句子，直到接近目标词数）
function generateParagraph(targetWords: number): string {
  const sentences: string[] = [];
  let wordCount = 0;
  while (wordCount < targetWords) {
    const sentence = generateSentence();
    sentences.push(sentence);
    wordCount += sentence.split(/\s+/).length;
  }
  return sentences.join(" ");
}

// 生成多段文本
function generateLoremIpsum(
  paragraphs: number,
  wordsPerParagraph: number,
  startWithClassic: boolean,
  asHtml: boolean,
): string {
  const parts: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    let paragraph: string;
    if (i === 0 && startWithClassic) {
      // 第一段使用经典开头 + 一段随机文本拼接
      const rest = generateParagraph(Math.max(0, wordsPerParagraph - 18));
      paragraph = rest ? `${CLASSIC_OPENING} ${rest}` : CLASSIC_OPENING;
    } else {
      paragraph = generateParagraph(wordsPerParagraph);
    }
    parts.push(asHtml ? `<p>${paragraph}</p>` : paragraph);
  }
  return asHtml ? parts.join("\n") : parts.join("\n\n");
}

// Lorem Ipsum 占位文本生成器
export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(60);
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [output, setOutput] = useState(() =>
    generateLoremIpsum(3, 60, true, false),
  );
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const safeParagraphs = Math.min(20, Math.max(1, paragraphs));
    const safeWords = Math.min(150, Math.max(30, wordsPerParagraph));
    setOutput(
      generateLoremIpsum(safeParagraphs, safeWords, startWithClassic, asHtml),
    );
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

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 段落数量 */}
        <div className="rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <label
              htmlFor="paragraphs"
              className="text-sm font-medium text-zinc-700"
            >
              Paragraphs
            </label>
            <span className="font-mono text-sm text-zinc-900">
              {paragraphs}
            </span>
          </div>
          <input
            id="paragraphs"
            type="number"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(event) =>
              setParagraphs(Number(event.target.value) || 1)
            }
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* 每段词数 */}
        <div className="rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <label
              htmlFor="words-per-paragraph"
              className="text-sm font-medium text-zinc-700"
            >
              Words per paragraph
            </label>
            <span className="font-mono text-sm text-zinc-900">
              {wordsPerParagraph}
            </span>
          </div>
          <input
            id="words-per-paragraph"
            type="range"
            min={30}
            max={150}
            value={wordsPerParagraph}
            onChange={(event) =>
              setWordsPerParagraph(Number(event.target.value))
            }
            className="mt-2 w-full accent-primary"
          />
        </div>
      </div>

      {/* 选项 */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
          <input
            type="checkbox"
            checked={startWithClassic}
            onChange={(event) => setStartWithClassic(event.target.checked)}
            className="accent-primary"
          />
          Start with &ldquo;Lorem ipsum dolor sit amet...&rdquo;
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm">
          <input
            type="checkbox"
            checked={asHtml}
            onChange={(event) => setAsHtml(event.target.checked)}
            className="accent-primary"
          />
          Output as HTML (&lt;p&gt; tags)
        </label>
      </div>

      {/* 操作按钮 */}
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
          onClick={handleCopy}
          disabled={!output}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* 输出区 */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="lorem-output"
            className="text-sm font-medium text-zinc-700"
          >
            Output
          </label>
        </div>
        <textarea
          id="lorem-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Generated text will appear here."
          className="h-80 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default LoremIpsum;
