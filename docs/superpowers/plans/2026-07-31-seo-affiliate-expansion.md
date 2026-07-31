# SEO Affiliate Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 12 browser-based developer/SEO tools and 20 supporting English SEO articles to SundayChaos / FreeToolsHub.

**Architecture:** Keep the site static and client-side. Put parsing/conversion logic in pure TypeScript helpers under `src/lib/seo-tool-utils.ts`, expose each tool as a focused React client component under `src/components/tools/`, register all new tools through the existing dynamic tool route, and add article data to `src/lib/posts.ts`.

**Tech Stack:** Next.js App Router, React client components, TypeScript, static export, Node 24 TypeScript execution for helper verification, no new runtime dependencies.

## Global Constraints

- Build 12 real tools and add 20 English articles.
- All tools must run in the browser.
- Inputs entered by users must not be sent to a server.
- No database, CMS, account system, server API, or user-data upload flow will be added.
- Preserve existing canonical behavior and trailing-slash sitemap URLs.
- The implementation must pass `npm.cmd run build`.
- The first batch will not add affiliate link management, ad placement changes, or a full-site visual redesign.

---

## File Structure

- Create `src/lib/seo-tool-utils.ts`: pure utility functions used by the new tools.
- Create `scripts/verify-seo-tool-utils.ts`: lightweight Node assertions for helper behavior.
- Modify `package.json`: add `verify:seo-tools` script.
- Create `src/components/tools/JwtDecoder.tsx`
- Create `src/components/tools/RegexTester.tsx`
- Create `src/components/tools/TextDiffChecker.tsx`
- Create `src/components/tools/CsvToJsonConverter.tsx`
- Create `src/components/tools/JsonToCsvConverter.tsx`
- Create `src/components/tools/YamlToJsonConverter.tsx`
- Create `src/components/tools/JsonToTypescriptConverter.tsx`
- Create `src/components/tools/HtmlEntityEncoder.tsx`
- Create `src/components/tools/CssMinifier.tsx`
- Create `src/components/tools/JavaScriptMinifier.tsx`
- Create `src/components/tools/ColorContrastChecker.tsx`
- Create `src/components/tools/RobotsTxtGenerator.tsx`
- Modify `src/lib/tools.ts`: add 12 tool metadata entries and include them in `implementedTools`.
- Modify `src/app/tools/[slug]/page.tsx`: import and register 12 new components.
- Modify `src/lib/posts.ts`: append 20 post objects.

---

### Task 1: Shared Tool Utility Functions

**Files:**
- Create: `src/lib/seo-tool-utils.ts`
- Create: `scripts/verify-seo-tool-utils.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `decodeJwt(token: string): { header: unknown; payload: unknown; signature: string }`
- Produces: `testRegex(pattern: string, flags: string, text: string): { matches: RegexMatch[]; error?: string }`
- Produces: `diffLines(left: string, right: string): DiffLine[]`
- Produces: `csvToJson(input: string): Record<string, string>[]`
- Produces: `jsonToCsv(input: unknown): string`
- Produces: `simpleYamlToJson(input: string): unknown`
- Produces: `jsonToTypescript(input: unknown, rootName?: string): string`
- Produces: `encodeHtmlEntities(input: string): string`
- Produces: `decodeHtmlEntities(input: string): string`
- Produces: `minifyCss(input: string): string`
- Produces: `minifyJavaScript(input: string): string`
- Produces: `contrastRatio(foreground: string, background: string): number`
- Produces: `generateRobotsTxt(options: RobotsOptions): string`

- [ ] **Step 1: Add failing helper verification script**

Create `scripts/verify-seo-tool-utils.ts` with Node assertions that import all functions from `../src/lib/seo-tool-utils.ts`. Include concrete checks:

```ts
import assert from "node:assert/strict";
import {
  contrastRatio,
  csvToJson,
  decodeHtmlEntities,
  decodeJwt,
  diffLines,
  encodeHtmlEntities,
  generateRobotsTxt,
  jsonToCsv,
  jsonToTypescript,
  minifyCss,
  minifyJavaScript,
  simpleYamlToJson,
  testRegex,
} from "../src/lib/seo-tool-utils.ts";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSmFuZSJ9.signature";
assert.deepEqual(decodeJwt(token).payload, { sub: "123", name: "Jane" });

assert.equal(testRegex("(foo)", "gi", "Foo bar foo").matches.length, 2);
assert.equal(testRegex("(", "", "x").error?.includes("Invalid"), true);

assert.deepEqual(diffLines("a\nb", "a\nc").map((line) => line.type), [
  "unchanged",
  "removed",
  "added",
]);

assert.deepEqual(csvToJson('name,role\n"Jane, Q",dev'), [
  { name: "Jane, Q", role: "dev" },
]);
assert.equal(jsonToCsv([{ name: "Jane, Q", role: "dev" }]), 'name,role\n"Jane, Q",dev');

assert.deepEqual(simpleYamlToJson("name: Jane\nenabled: true\ncount: 3"), {
  name: "Jane",
  enabled: true,
  count: 3,
});

assert.equal(
  jsonToTypescript({ id: 1, name: "Jane", tags: ["dev"] }, "User").includes("interface User"),
  true,
);

assert.equal(encodeHtmlEntities('<a href="x">'), "&lt;a href=&quot;x&quot;&gt;");
assert.equal(decodeHtmlEntities("&lt;strong&gt;Hi&lt;/strong&gt;"), "<strong>Hi</strong>");

assert.equal(minifyCss("/*x*/\n.card { color: red; }"), ".card{color:red}");
assert.equal(minifyJavaScript("// x\nconst a = 1;"), "const a = 1;");
assert.equal(contrastRatio("#000000", "#ffffff"), 21);
assert.equal(
  generateRobotsTxt({
    userAgent: "*",
    allowAll: true,
    disallowPaths: ["/admin"],
    sitemapUrl: "https://sundaychaos.com/sitemap.xml",
    host: "https://sundaychaos.com",
  }),
  "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://sundaychaos.com/sitemap.xml\nHost: https://sundaychaos.com",
);

console.log("seo tool utilities verified");
```

- [ ] **Step 2: Run script to verify it fails**

Run: `node --experimental-strip-types scripts/verify-seo-tool-utils.ts`

Expected: FAIL because `src/lib/seo-tool-utils.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/seo-tool-utils.ts`**

Create the exported functions listed in the Interfaces section. Keep them DOM-free except `decodeHtmlEntities`, which can use a small named-entity map instead of `document` so the Node verification script works.

Core types:

```ts
export type RegexMatch = {
  match: string;
  index: number;
  groups: string[];
};

export type DiffLine = {
  type: "unchanged" | "added" | "removed";
  value: string;
};

export type RobotsOptions = {
  userAgent: string;
  allowAll: boolean;
  disallowPaths: string[];
  sitemapUrl: string;
  host: string;
};
```

Implementation requirements:

- Base64URL decode JWT header and payload with `atob` fallback compatible code.
- Force regex global matching internally so multiple matches are found.
- CSV parser must handle quoted fields, escaped quotes, CRLF, commas inside quotes, and blank trailing lines.
- YAML parser must support simple top-level objects and simple lists; it must throw `Error` for unsupported indentation.
- TypeScript generator must sanitize property names that are not valid identifiers by quoting them.
- Minifiers must be conservative and avoid changing string literal contents.
- Contrast ratio must parse 3-digit and 6-digit hex.

- [ ] **Step 4: Add npm verification script**

Modify `package.json` scripts:

```json
"verify:seo-tools": "node --experimental-strip-types scripts/verify-seo-tool-utils.ts"
```

- [ ] **Step 5: Run utility verification**

Run: `npm.cmd run verify:seo-tools`

Expected: PASS with `seo tool utilities verified`.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json src/lib/seo-tool-utils.ts scripts/verify-seo-tool-utils.ts
git commit -m "feat: add SEO tool utility helpers"
```

---

### Task 2: Decoder, Regex, Diff, and Entity Tools

**Files:**
- Create: `src/components/tools/JwtDecoder.tsx`
- Create: `src/components/tools/RegexTester.tsx`
- Create: `src/components/tools/TextDiffChecker.tsx`
- Create: `src/components/tools/HtmlEntityEncoder.tsx`
- Modify: `src/lib/tools.ts`
- Modify: `src/app/tools/[slug]/page.tsx`

**Interfaces:**
- Consumes: `decodeJwt`, `testRegex`, `diffLines`, `encodeHtmlEntities`, `decodeHtmlEntities` from `src/lib/seo-tool-utils.ts`.
- Produces: implemented tools registered for slugs `jwt-decoder`, `regex-tester`, `text-diff-checker`, and `html-entity-encoder`.

- [ ] **Step 1: Add tool metadata**

Append these entries to `tools` in `src/lib/tools.ts`:

```ts
{
  slug: "jwt-decoder",
  title: "JWT Decoder",
  description: "Decode JWT headers and payloads locally in your browser without sending tokens to a server.",
  category: "Security",
  icon: "JWT",
}
```

Also add `regex-tester`, `text-diff-checker`, and `html-entity-encoder` with matching titles, descriptions, categories, and short icons. Add all four slugs to `implementedTools`.

- [ ] **Step 2: Create four client components**

Each file starts with `"use client";`, imports needed helpers, uses existing Tailwind utility style, and shows inline error messages.

Required behaviors:

- `JwtDecoder` textarea -> formatted JSON header and payload -> signature preview.
- `RegexTester` pattern input + flags input + text textarea -> match list with indexes and capture groups.
- `TextDiffChecker` two textareas -> line diff with added/removed/unchanged styling.
- `HtmlEntityEncoder` textarea -> mode buttons for encode/decode -> output textarea.

- [ ] **Step 3: Register components in dynamic tool route**

Modify `src/app/tools/[slug]/page.tsx`:

```ts
import { JwtDecoder } from "@/components/tools/JwtDecoder";
import { RegexTester } from "@/components/tools/RegexTester";
import { TextDiffChecker } from "@/components/tools/TextDiffChecker";
import { HtmlEntityEncoder } from "@/components/tools/HtmlEntityEncoder";
```

Add mapping:

```ts
"jwt-decoder": JwtDecoder,
"regex-tester": RegexTester,
"text-diff-checker": TextDiffChecker,
"html-entity-encoder": HtmlEntityEncoder,
```

- [ ] **Step 4: Verify helper and build**

Run:

```bash
npm.cmd run verify:seo-tools
npm.cmd run build
```

Expected: both commands pass; build output lists the new tool routes.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/tools/JwtDecoder.tsx src/components/tools/RegexTester.tsx src/components/tools/TextDiffChecker.tsx src/components/tools/HtmlEntityEncoder.tsx src/lib/tools.ts src/app/tools/[slug]/page.tsx
git commit -m "feat: add decoder regex diff and entity tools"
```

---

### Task 3: Data Conversion Tools

**Files:**
- Create: `src/components/tools/CsvToJsonConverter.tsx`
- Create: `src/components/tools/JsonToCsvConverter.tsx`
- Create: `src/components/tools/YamlToJsonConverter.tsx`
- Create: `src/components/tools/JsonToTypescriptConverter.tsx`
- Modify: `src/lib/tools.ts`
- Modify: `src/app/tools/[slug]/page.tsx`

**Interfaces:**
- Consumes: `csvToJson`, `jsonToCsv`, `simpleYamlToJson`, `jsonToTypescript`.
- Produces: implemented tools registered for slugs `csv-to-json`, `json-to-csv`, `yaml-to-json`, and `json-to-typescript`.

- [ ] **Step 1: Add four tool metadata entries**

Add metadata for:

- `csv-to-json`
- `json-to-csv`
- `yaml-to-json`
- `json-to-typescript`

Categories should be `Data` or `Web`. Descriptions must mention local browser processing.

- [ ] **Step 2: Create converter components**

Each component must include:

- Input textarea with a useful default sample.
- Convert action or live conversion.
- Read-only output textarea or `<pre>`.
- Inline error text when parsing fails.

Component-specific samples:

CSV sample:

```csv
name,role
Jane,Developer
Alex,Designer
```

JSON array sample:

```json
[
  { "name": "Jane", "role": "Developer" },
  { "name": "Alex", "role": "Designer" }
]
```

YAML sample:

```yaml
name: SundayChaos
enabled: true
count: 3
```

JSON to TypeScript sample:

```json
{
  "id": 1,
  "name": "Jane",
  "tags": ["developer", "creator"]
}
```

- [ ] **Step 3: Register components**

Import and add mappings in `src/app/tools/[slug]/page.tsx`.

- [ ] **Step 4: Verify**

Run:

```bash
npm.cmd run verify:seo-tools
npm.cmd run build
```

Expected: pass and show generated static routes for the four new tools.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/tools/CsvToJsonConverter.tsx src/components/tools/JsonToCsvConverter.tsx src/components/tools/YamlToJsonConverter.tsx src/components/tools/JsonToTypescriptConverter.tsx src/lib/tools.ts src/app/tools/[slug]/page.tsx
git commit -m "feat: add data conversion tools"
```

---

### Task 4: Minifier, Contrast, and Robots Tools

**Files:**
- Create: `src/components/tools/CssMinifier.tsx`
- Create: `src/components/tools/JavaScriptMinifier.tsx`
- Create: `src/components/tools/ColorContrastChecker.tsx`
- Create: `src/components/tools/RobotsTxtGenerator.tsx`
- Modify: `src/lib/tools.ts`
- Modify: `src/app/tools/[slug]/page.tsx`

**Interfaces:**
- Consumes: `minifyCss`, `minifyJavaScript`, `contrastRatio`, and `generateRobotsTxt`.
- Produces: implemented tools registered for slugs `css-minifier`, `javascript-minifier`, `color-contrast-checker`, and `robots-txt-generator`.

- [ ] **Step 1: Add metadata entries**

Add metadata for:

- `css-minifier`
- `javascript-minifier`
- `color-contrast-checker`
- `robots-txt-generator`

Categories should be `Web`, `Design`, or `SEO`.

- [ ] **Step 2: Create four components**

Required behaviors:

- `CssMinifier`: input CSS -> minified output -> before/after character counts.
- `JavaScriptMinifier`: input JavaScript -> minified output -> warning that it is a lightweight browser utility, not a bundler.
- `ColorContrastChecker`: foreground/background hex inputs -> color swatches -> ratio -> WCAG AA/AAA status.
- `RobotsTxtGenerator`: user-agent input, allow all checkbox, disallow paths textarea, sitemap URL input, host input -> generated robots.txt output.

- [ ] **Step 3: Register components**

Import and map the four components in `src/app/tools/[slug]/page.tsx`.

- [ ] **Step 4: Verify**

Run:

```bash
npm.cmd run verify:seo-tools
npm.cmd run build
```

Expected: pass and routes generated.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/tools/CssMinifier.tsx src/components/tools/JavaScriptMinifier.tsx src/components/tools/ColorContrastChecker.tsx src/components/tools/RobotsTxtGenerator.tsx src/lib/tools.ts src/app/tools/[slug]/page.tsx
git commit -m "feat: add minifier contrast and robots tools"
```

---

### Task 5: Add 20 SEO Articles

**Files:**
- Modify: `src/lib/posts.ts`

**Interfaces:**
- Consumes: existing `Post` type.
- Produces: 20 new `Post` entries with unique slug, title, excerpt, date, author, tags, and content arrays.

- [ ] **Step 1: Append posts**

Append the 20 posts from the design spec after the existing post list. Use dates from `2026-06-01` through `2026-07-10`, ordered newest or oldest consistently with the existing list. Use `ToolHub Team` as author.

Each post must include 5-8 substantial paragraphs. Use tags aligned with its topic, for example:

```ts
tags: ["JWT", "Security", "Web"]
```

Article style requirements:

- Explain the problem first.
- Mention the related tool naturally where relevant.
- Include practical advice and common mistakes.
- Avoid unsupported claims about rankings, guaranteed traffic, or affiliate earnings.
- Do not add external affiliate links.

- [ ] **Step 2: Verify route generation**

Run:

```bash
npm.cmd run build
```

Expected: build passes and blog route output includes more generated paths.

- [ ] **Step 3: Spot-check generated sitemap**

Run:

```powershell
Select-String -Path out\sitemap.xml -Pattern "decode-jwt-safely|regex-testing-for-beginners|choosing-developer-tools-worth-paying-for"
```

Expected: the three post slugs are present with trailing slash URLs.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/lib/posts.ts
git commit -m "feat: add SEO article batch"
```

---

### Task 6: Final SEO and Build Verification

**Files:**
- Read: `out/sitemap.xml`
- Read: representative `out/**/index.html`

**Interfaces:**
- Consumes: outputs from all prior tasks.
- Produces: verified static build ready to deploy.

- [ ] **Step 1: Run complete verification**

Run:

```bash
npm.cmd run verify:seo-tools
npm.cmd run build
```

Expected: both pass.

- [ ] **Step 2: Verify sitemap includes new tool URLs**

Run:

```powershell
Select-String -Path out\sitemap.xml -Pattern "jwt-decoder/|regex-tester/|csv-to-json/|robots-txt-generator/"
```

Expected: all four patterns are present.

- [ ] **Step 3: Verify canonical on representative pages**

Run:

```powershell
Select-String -Path out\tools\jwt-decoder\index.html,out\tools\robots-txt-generator\index.html,out\blog\how-to-decode-a-jwt-safely-in-your-browser\index.html -Pattern 'rel="canonical"'
```

Expected: each file contains one canonical link pointing to the trailing-slash URL.

- [ ] **Step 4: Check git status**

Run:

```bash
git status --short
```

Expected: clean working tree except deployment artifacts intentionally left uncommitted by local workflow.

- [ ] **Step 5: Deploy guidance**

After deployment, resubmit `https://sundaychaos.com/sitemap.xml` in Search Console and request indexing for:

```text
https://sundaychaos.com/tools/jwt-decoder/
https://sundaychaos.com/tools/regex-tester/
https://sundaychaos.com/tools/csv-to-json/
https://sundaychaos.com/tools/robots-txt-generator/
```

Do not request indexing for non-trailing-slash versions.

---

## Self-Review Notes

- Spec coverage: all 12 tools are assigned to Tasks 2-4; all 20 articles are assigned to Task 5; static export and SEO checks are covered by Task 6.
- Placeholder scan: no unresolved markers are used.
- Type consistency: utility function names in Tasks 2-4 match Task 1 interfaces.
- Scope check: this is a large but single cohesive site expansion. It can be implemented task-by-task with commits after each group.
