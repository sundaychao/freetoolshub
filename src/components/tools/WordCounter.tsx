"use client";

import { useMemo, useState } from "react";

type WordStat = {
  word: string;
  count: number;
};

// 字数 / 句子 / 段落统计 + 阅读时间 + 关键词密度
export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    // 字符数（含空格）
    const characters = text.length;
    // 字符数（不含空格）
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // 单词数：以空白/标点分割后过滤空字符串
    const words = trimmed
      ? trimmed.split(/[\s,.!?;:()[\]{}"'\-]+/).filter(Boolean)
      : [];
    const wordCount = words.length;

    // 行数
    const lines = trimmed ? trimmed.split(/\r?\n/).length : 0;

    // 句子数：按 . ! ? 切分，过滤空
    const sentences = trimmed
      ? trimmed
          .split(/[.!?]+/)
          .map((s) => s.trim())
          .filter(Boolean).length
      : 0;

    // 段落数：按空行切分
    const paragraphs = trimmed
      ? trimmed
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean).length
      : 0;

    // 阅读时间（200 wpm），向上取整，至少 1 分钟（若有内容）
    const readingTimeMinutes =
      wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / 200));

    // 关键词密度 top 5：先转小写，过滤掉过短或常见停用词
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "of",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
      "as",
      "this",
      "that",
      "it",
      "i",
      "you",
      "he",
      "she",
      "we",
      "they",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "so",
      "if",
      "then",
      "than",
      "from",
    ]);
    const freqMap = new Map<string, number>();
    for (const w of words) {
      const lower = w.toLowerCase();
      if (lower.length < 3 || stopWords.has(lower)) continue;
      freqMap.set(lower, (freqMap.get(lower) ?? 0) + 1);
    }
    const topWords: WordStat[] = Array.from(freqMap.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      characters,
      charactersNoSpaces,
      wordCount,
      lines,
      sentences,
      paragraphs,
      readingTimeMinutes,
      topWords,
    };
  }, [text]);

  const statCards: { label: string; value: number | string }[] = [
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.wordCount },
    { label: "Lines", value: stats.lines },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 输入区 */}
      <div className="flex flex-col">
        <label
          htmlFor="word-counter-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Text
        </label>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
          placeholder="Paste or type your text here..."
          className="h-64 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* 阅读时间 */}
      <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700 shadow-sm">
        <span className="font-medium text-zinc-900">Reading time:</span>{" "}
        {stats.readingTimeMinutes === 0
          ? "—"
          : `~${stats.readingTimeMinutes} min (at 200 wpm)`}
      </div>

      {/* 关键词密度 */}
      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-700">
          Top 5 keywords
        </h2>
        {stats.topWords.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-center text-sm text-zinc-500">
            Start typing to see keyword density.
          </p>
        ) : (
          <ul className="space-y-2">
            {stats.topWords.map((item) => {
              const percent =
                stats.wordCount > 0
                  ? ((item.count / stats.wordCount) * 100).toFixed(1)
                  : "0";
              return (
                <li
                  key={item.word}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
                >
                  <span className="min-w-[8rem] font-mono text-sm text-zinc-900">
                    {item.word}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(100, (item.count / stats.wordCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs text-zinc-500">
                    {item.count}× ({percent}%)
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WordCounter;
