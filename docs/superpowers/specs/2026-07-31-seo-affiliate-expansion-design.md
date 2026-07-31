# SEO and Affiliate Expansion Design

## Goal

Expand SundayChaos / FreeToolsHub with a meaningful batch of useful browser-based tools and supporting English SEO articles. The expansion should improve crawlable site depth, create stronger internal-link opportunities, and prepare the site for developer, productivity, privacy, security, hosting, and software affiliate programs without turning the site into a thin-content directory.

## Approved Scope

Build 12 real tools and add 20 English articles.

The first implementation batch will keep the site fully static and client-side. No database, CMS, account system, server API, or user-data upload flow will be added.

## New Tools

The following tools will be added as implemented tools:

- JWT Decoder
- Regex Tester
- Text Diff Checker
- CSV to JSON Converter
- JSON to CSV Converter
- YAML to JSON Converter
- JSON to TypeScript Converter
- HTML Entity Encoder / Decoder
- CSS Minifier
- JavaScript Minifier
- Color Contrast Checker
- Robots.txt Generator

All tools must run in the browser. Inputs entered by users must not be sent to a server.

## Tool Behavior

JWT Decoder will decode header and payload sections locally and show invalid-token errors without verifying signatures.

Regex Tester will accept a pattern, flags, and test text, then show matches and capture groups. It must handle invalid patterns without crashing the page.

Text Diff Checker will compare two text blocks line-by-line and show added, removed, changed, and unchanged lines.

CSV to JSON Converter will parse a header row and convert rows into JSON objects. It must support quoted fields and commas inside quoted values.

JSON to CSV Converter will accept an array of objects and convert it to CSV with escaped quotes and commas.

YAML to JSON Converter will support a practical subset of YAML suitable for common configuration snippets: indentation-based objects, lists, strings, booleans, nulls, and numbers. It will not claim full YAML 1.2 compliance.

JSON to TypeScript Converter will infer TypeScript interfaces from JSON objects and arrays using conservative union types where needed.

HTML Entity Encoder / Decoder will encode reserved HTML characters and decode common named and numeric entities.

CSS Minifier will remove comments and unnecessary whitespace while preserving basic CSS syntax.

JavaScript Minifier will provide a lightweight whitespace/comment minifier. It will be positioned as a quick utility, not a production-grade replacement for Terser or esbuild.

Color Contrast Checker will compute WCAG contrast ratio and show AA/AAA pass status for normal and large text.

Robots.txt Generator will let users choose common crawl rules, sitemap URL, and host, then output a robots.txt file.

## New Articles

Add 20 English posts aligned with the new tools and affiliate-friendly topics:

- How to Decode a JWT Safely in Your Browser
- Regex Testing for Beginners: Patterns, Flags, and Capture Groups
- Text Diff Tools: How Developers Compare Changes Quickly
- CSV to JSON: A Practical Guide for Clean Data Conversion
- JSON to CSV: Turning API Data into Spreadsheet-Friendly Files
- YAML vs JSON: Choosing the Right Format for Configuration
- How to Generate TypeScript Types from JSON API Responses
- HTML Entities Explained: Escaping Text Safely for the Web
- Why Minifying CSS Still Matters for Fast Websites
- JavaScript Minification: What It Does and When to Use It
- Color Contrast and Accessibility: A Practical WCAG Guide
- Robots.txt for Small Websites: What to Allow and Block
- Sitemaps and Robots.txt: How They Work Together for SEO
- A Developer's Checklist for Launching a New Website
- Privacy-Friendly Online Tools: What to Look For
- Essential Browser-Based Tools for Web Developers
- How to Debug API Responses Without Leaving Your Browser
- Secure Client-Side Utilities: What Should Stay Local
- Productivity Workflows for Indie Developers and Creators
- Choosing Developer Tools Worth Paying For

Each article must have a unique slug, title, excerpt, date, author, tags, and substantial paragraph content. Articles should naturally reference related tool topics but should not contain placeholder affiliate links yet.

## Architecture

Use the existing app structure:

- Add tool metadata to `src/lib/tools.ts`.
- Add tool components under `src/components/tools/`.
- Register implemented tool components in `src/app/tools/[slug]/page.tsx`.
- Add post data to `src/lib/posts.ts`.
- Rely on the existing sitemap generator to include new tools and posts.
- Preserve existing canonical behavior and trailing-slash sitemap URLs.

No broad redesign is part of this work.

## SEO Requirements

New tools must have descriptive titles and descriptions. The generated sitemap must contain the final trailing-slash URLs for new tools and posts.

Dynamic metadata for tool and blog pages already generates canonical URLs. The implementation must not remove or weaken that behavior.

New article content should be useful on its own and not simply describe the UI. Avoid thin pages with only a few sentences.

## Error Handling

Invalid user input should produce clear inline messages inside each tool instead of throwing runtime errors.

Input parsing should favor understandable failure modes over silent incorrect output.

## Testing and Verification

The implementation must pass `npm.cmd run build`.

After build, verify:

- New tool routes are generated.
- New blog routes are generated.
- `out/sitemap.xml` includes new trailing-slash URLs.
- Representative pages include canonical links.
- Existing tools still build.

Manual browser testing is desirable for the most interactive tools, especially Regex Tester, CSV/JSON converters, JSON to TypeScript, and Color Contrast Checker.

## Out of Scope

The first batch will not add:

- CMS integration
- User accounts
- Server-side parsing APIs
- Full YAML specification compliance
- Production-grade JavaScript parsing or minification
- Affiliate link management
- Ad placement changes
- Visual redesign of the full site
