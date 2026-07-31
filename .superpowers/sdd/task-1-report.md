# Task 1 Report: Shared Tool Utility Functions

## Status

Completed.

## Changes

- Added `src/lib/seo-tool-utils.ts` with browser-safe, dependency-free helpers for JWT decoding, regex matching, line diffs, CSV/JSON conversion, simple YAML conversion, TypeScript type generation, HTML entities, conservative CSS/JavaScript minification, color contrast, and robots.txt generation.
- Added `scripts/verify-seo-tool-utils.ts` with the required Node assertions.
- Added `verify:seo-tools` to `package.json`.
- Enabled `allowImportingTsExtensions` in `tsconfig.json` so Next.js type checking accepts the task-required `.ts` import in the Node verification script.

## Verification

1. Confirmed the verification script failed before implementation with `ERR_MODULE_NOT_FOUND` for `src/lib/seo-tool-utils.ts`.
2. `npm.cmd run verify:seo-tools` passed and printed `seo tool utilities verified`.
3. `npm.cmd run build` passed, including TypeScript checks and static export generation.

## Notes

The successful build prints non-blocking warnings about a typeless Node verification script and multiple workspace lockfiles. No runtime dependencies or server APIs were added.

## Second Review Fix: CSS and JavaScript Comment Handling

### Changes

- Preserved a separating space when removing a CSS block comment between identifier-like characters, preventing selectors such as `a/* separator */b` from changing to `ab`.
- Classified JavaScript slash tokens by their preceding context, so division expressions no longer consume following block comments as regex literals.
- Added regression assertions for both behaviors while retaining the existing ASI and regex literal assertions.

### Verification

1. `npm.cmd run verify:seo-tools`
   - Exit code: 0
   - Output: `seo tool utilities verified`
   - Note: Node prints its existing typeless TypeScript module warning.
2. `npm.cmd run build`
   - Exit code: 0
   - Output: `Compiled successfully`, TypeScript completed, and all 36 static pages generated.
   - Note: Next.js prints its existing multiple-lockfile workspace-root warning.

## Review Fix: JavaScript Minifier Safety

### Changes

- Reworked `minifyJavaScript` into a conservative scanner that removes comments without compacting JavaScript whitespace.
- Preserved all line terminators and replaced block-comment characters with spaces so adjacent tokens cannot merge.
- Added literal-aware scanning for quoted strings, template literals, regular expression literals, escaped characters, and regular expression character classes.
- Added regression assertions for ASI-sensitive `return` line breaks and `/[//]/` regular expressions.

### Verification

1. `npm.cmd run verify:seo-tools` passed.
2. `npm.cmd run build` passed after allowing the Next.js build to fetch its configured Google Font.

## Third Review Fix: Regex and CSS Escape Boundaries

### Changes

- Treated a slash after a closing parenthesis as regex-capable so `if (ready) /[//]/.test(value);` retains its regular expression literal instead of scanning `//` in its character class as a line comment.
- Preserved a CSS separator when a removed block comment precedes a CSS escape, preventing `a/* comment */\\62` from merging into a different escaped identifier.
- Added focused regression assertions for both inputs.

### Verification

1. `npm.cmd run verify:seo-tools`
   - Exit code: 0
   - Output: `seo tool utilities verified`.
   - Note: Node prints the existing typeless TypeScript module warning.
2. `npm.cmd run build`
   - Initial sandboxed run failed only because it could not fetch the configured Google Font.
   - Escalated run exit code: 0.
   - Output: compiled successfully, TypeScript completed, and all 36 static pages generated.
   - Note: Next.js prints the existing multiple-lockfile workspace-root warning.

## Approved Scope Change: JavaScript Comment & Whitespace Cleaner

### Changes

- Renamed the plan-facing JavaScript utility export from `minifyJavaScript` to `cleanJavaScript` and removed the former export.
- Replaced regex/division classification with a conservative comment-only scanner. It removes standalone line comments and clearly bounded, closed block comments while preserving all other ambiguous slash-containing source.
- Preserved line terminators affecting automatic semicolon insertion and retained CSS minifier behavior and its regression assertions.
- Updated the Node verification script to import and test `cleanJavaScript`, including an ambiguous regex character-class case that must remain unchanged.

### Verification

1. `npm.cmd run verify:seo-tools`
   - Exit code: 0
   - Output: `seo tool utilities verified`
   - Note: Node prints the existing typeless TypeScript module warning.
2. `npm.cmd run build`
   - Initial sandboxed attempt failed only while fetching the configured Google Font.
   - Network-enabled retry exit code: 0.
   - Output: compiled successfully, TypeScript completed, and all 36 static pages generated.
   - Note: Next.js prints the existing multiple-lockfile workspace-root warning.

## Final Review Fix: Sticky Regex Flags and CSS URLs

### Changes

- Removed the sticky `y` flag before forcing global matching in `testRegex`, allowing a pattern supplied with `y` to find all global matches.
- Preserved complete `url(...)` tokens while scanning CSS comments, including comment-like text within unquoted URL values.
- Added focused regression assertions for both reviewed cases.

### Verification

1. `npm.cmd run verify:seo-tools`
   - Exit code: 0.
   - Output: `seo tool utilities verified`.
2. `npm.cmd run build`
   - Initial sandboxed attempt failed only because the configured Google Font could not be fetched.
   - Network-enabled retry exit code: 0.
   - Output: compiled successfully, TypeScript completed, and all 36 static pages generated.
   - Note: Next.js prints the existing multiple-lockfile workspace-root warning.
