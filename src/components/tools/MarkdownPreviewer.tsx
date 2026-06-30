"use client";

import { useMemo, useState } from "react";

const DEFAULT_MARKDOWN = `# Markdown Preview

Welcome to the **Markdown Previewer**. Write on the left, see the result on the right.

## Features

- Headings (h1-h6)
- **Bold** and *italic* text
- \`inline code\` and code blocks
- [Links](https://nextjs.org)
- Lists, quotes and dividers

### Code block example

\`\`\`
function hello(name) {
  return "Hello, " + name;
}
\`\`\`

> Tip: Try editing this text to see live updates.

1. First step
2. Second step
3. Third step

---

Happy writing!`;

// 转义 HTML 特殊字符
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 处理行内 markdown：bold / italic / inline code / link
// 输入必须是已经 escapeHtml 过的字符串
function parseInline(text: string): string {
  // 先抽出 inline code，避免其内部被再次处理
  const codes: string[] = [];
  let html = text.replace(/`([^`]+)`/g, (_m, code: string) => {
    const placeholder = `\u0000CODE${codes.length}\u0000`;
    codes.push(`<code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-primary-dark">${code}</code>`);
    return placeholder;
  });

  // 加粗
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 斜体
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // 链接
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary-hover">$1</a>',
  );

  // 还原 inline code
  codes.forEach((code, i) => {
    html = html.split(`\u0000CODE${i}\u0000`).join(code);
  });
  return html;
}

// 简化版 markdown 解析器（不依赖外部库）
function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块 ``` ... ```
    if (/^```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // 跳过结束的 ```
      out.push(
        `<pre class="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100"><code>${code.join("\n")}</code></pre>`,
      );
      continue;
    }

    // 分隔线 ---
    if (/^---+\s*$/.test(line)) {
      out.push('<hr class="my-4 border-zinc-200" />');
      i++;
      continue;
    }

    // 标题 h1-h6
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const sizes = [
        "text-3xl font-bold mt-6 mb-3",
        "text-2xl font-bold mt-5 mb-3",
        "text-xl font-semibold mt-5 mb-2",
        "text-lg font-semibold mt-4 mb-2",
        "text-base font-semibold mt-4 mb-2",
        "text-sm font-semibold mt-3 mb-1",
      ];
      const text = parseInline(escapeHtml(heading[2]));
      out.push(
        `<h${level} class="${sizes[level - 1]} text-zinc-900">${text}</h${level}>`,
      );
      i++;
      continue;
    }

    // 引用
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        `<blockquote class="my-4 border-l-4 border-primary bg-primary-light/40 py-2 pl-4 italic text-zinc-700">${parseInline(escapeHtml(quote.join(" ")))}</blockquote>`,
      );
      continue;
    }

    // 无序列表
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(
          `<li class="ml-6 list-disc">${parseInline(escapeHtml(lines[i].replace(/^[-*]\s+/, "")))}</li>`,
        );
        i++;
      }
      out.push(`<ul class="my-3 space-y-1">${items.join("")}</ul>`);
      continue;
    }

    // 有序列表
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(
          `<li class="ml-6 list-decimal">${parseInline(escapeHtml(lines[i].replace(/^\d+\.\s+/, "")))}</li>`,
        );
        i++;
      }
      out.push(`<ol class="my-3 space-y-1">${items.join("")}</ol>`);
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 段落
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6}\s|>|[-*]\s|\d+\.\s|```|---+\s*$)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      `<p class="my-3 leading-relaxed text-zinc-700">${parseInline(escapeHtml(para.join(" ")))}</p>`,
    );
  }

  return out.join("\n");
}

// Markdown 实时预览：左侧编辑，右侧渲染
export function MarkdownPreviewer() {
  const [input, setInput] = useState(DEFAULT_MARKDOWN);

  const html = useMemo(() => renderMarkdown(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 编辑区 */}
      <div className="flex flex-col">
        <label
          htmlFor="md-input"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Markdown
        </label>
        <textarea
          id="md-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="# Hello world"
          className="h-[480px] w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* 预览区 */}
      <div className="flex flex-col">
        <label
          htmlFor="md-output"
          className="mb-2 text-sm font-medium text-zinc-700"
        >
          Preview
        </label>
        <div
          id="md-output"
          className="h-[480px] w-full overflow-y-auto rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 shadow-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export default MarkdownPreviewer;
