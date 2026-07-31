# Task 4 Implementation Report

Status: DONE

Commit: `7b7f21f feat: add minifier contrast and robots tools`

## Implemented

- Added `CssMinifier`, using `minifyCss` for live CSS output and before/after character counts.
- Added `JavaScriptCleaner`, using `cleanJavaScript` with the required conservative-cleanup warning.
- Added `ColorContrastChecker`, using `contrastRatio` with color swatches, preview, and WCAG AA/AAA status.
- Added `RobotsTxtGenerator`, using `generateRobotsTxt` with user-agent, allow-all, disallow paths, sitemap, and host controls.
- Registered all four tools in metadata, the implemented tool set, and the dynamic tool component map.

## Verification

- `npm.cmd run verify:seo-tools`: passed (`seo tool utilities verified`).
- `npm.cmd run build`: initially failed in the sandbox while fetching Inter from `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap`.
- Retried the unchanged production build with approved network escalation: passed. TypeScript completed and 48 static pages were generated, including the dynamic `/tools/[slug]` routes.

## Concerns

- Next.js reports an existing workspace-root warning because the repository and this worktree each contain a lockfile. This warning predates and is unrelated to Task 4.

## Review Fix

Status: DONE

### Changed files

- `src/lib/seo-tool-utils.ts`: added conservative JavaScript whitespace normalization after comment removal. It trims trailing spaces and tabs, removes leading/trailing blank lines, and collapses runs to at most two blank lines while preserving line breaks.
- `src/components/tools/JavaScriptCleaner.tsx`: changed cleanup to an explicit action and added a 100,000-character input limit.
- `src/components/tools/CssMinifier.tsx`: changed minification to an explicit action and added the same 100,000-character input limit.
- `scripts/verify-seo-tool-utils.ts`: added JavaScript whitespace and ASI-sensitive newline regression coverage plus checks for the explicit-action input guards.

### Verification

- `npm.cmd run verify:seo-tools`: passed (`seo tool utilities verified`).
- `npm.cmd run build`: passed after an initial sandbox-only Google Fonts fetch failure. TypeScript passed and 48 static pages were generated.

### Concerns

- The existing Next.js multiple-lockfile workspace-root warning remains unrelated to this fix.
