export type RegexMatch = {
  match: string;
  index: number;
  groups: string[];
};

export type RegexTestOptions = {
  maxMatches?: number;
};

export type RegexTestResult = {
  matches: RegexMatch[];
  error?: string;
  truncated?: boolean;
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

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const decoded = typeof atob === "function" ? atob(base64) : decodeBase64(base64);
  const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeBase64(value: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  let buffer = 0;
  let bits = 0;

  for (const character of value.replace(/=+$/, "")) {
    const index = alphabet.indexOf(character);
    if (index === -1) throw new Error("Invalid Base64 value");
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return output;
}

export function decodeJwt(token: string): { header: unknown; payload: unknown; signature: string } {
  const [encodedHeader, encodedPayload, signature = ""] = token.split(".");
  if (!encodedHeader || !encodedPayload) throw new Error("JWT must contain header and payload segments");

  return {
    header: JSON.parse(decodeBase64Url(encodedHeader)),
    payload: JSON.parse(decodeBase64Url(encodedPayload)),
    signature,
  };
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string,
  options: RegexTestOptions = {},
): RegexTestResult {
  try {
    if (pattern.length === 0) throw new Error("Pattern cannot be empty");
    const maxMatches = options.maxMatches ?? 100;
    if (!Number.isInteger(maxMatches) || maxMatches < 1) throw new Error("Maximum matches must be a positive integer");

    const normalizedFlags = flags.includes("g") ? flags : `${flags}g`;
    const regex = new RegExp(pattern, normalizedFlags);
    const matches: RegexMatch[] = [];
    for (const match of text.matchAll(regex)) {
      if (matches.length === maxMatches) return { matches, truncated: true };
      matches.push({ match: match[0], index: match.index ?? 0, groups: match.slice(1).map((group) => group ?? "") });
    }
    return { matches };
  } catch (error) {
    return { matches: [], error: error instanceof Error ? error.message : "Invalid regular expression" };
  }
}

export function diffLines(left: string, right: string): DiffLine[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const table = Array.from({ length: leftLines.length + 1 }, () => Array<number>(rightLines.length + 1).fill(0));

  for (let leftIndex = leftLines.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightLines.length - 1; rightIndex >= 0; rightIndex -= 1) {
      table[leftIndex][rightIndex] = leftLines[leftIndex] === rightLines[rightIndex]
        ? table[leftIndex + 1][rightIndex + 1] + 1
        : Math.max(table[leftIndex + 1][rightIndex], table[leftIndex][rightIndex + 1]);
    }
  }

  const result: DiffLine[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < leftLines.length && rightIndex < rightLines.length) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      result.push({ type: "unchanged", value: leftLines[leftIndex++] });
      rightIndex += 1;
    } else if (table[leftIndex + 1][rightIndex] >= table[leftIndex][rightIndex + 1]) {
      result.push({ type: "removed", value: leftLines[leftIndex++] });
    } else {
      result.push({ type: "added", value: rightLines[rightIndex++] });
    }
  }
  while (leftIndex < leftLines.length) result.push({ type: "removed", value: leftLines[leftIndex++] });
  while (rightIndex < rightLines.length) result.push({ type: "added", value: rightLines[rightIndex++] });
  return result;
}

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (quoted) throw new Error("Unterminated quoted CSV field");
  if (field.length > 0 || row.length > 0) rows.push([...row, field]);
  return rows.filter((currentRow) => currentRow.some((value) => value !== ""));
}

export function csvToJson(input: string): Record<string, string>[] {
  const [headers = [], ...rows] = parseCsvRows(input);
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

export type JsonToCsvOptions = {
  spreadsheetSafe?: boolean;
};

function csvCell(value: unknown, options: JsonToCsvOptions): string {
  const rawText = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  const text = options.spreadsheetSafe && /^[=+\-@\t\r]/.test(rawText) ? `'${rawText}` : rawText;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function isNonEmptyPlainObjectArray(input: unknown): input is Record<string, unknown>[] {
  return Array.isArray(input)
    && input.length > 0
    && input.every((item) => typeof item === "object" && item !== null && !Array.isArray(item));
}

export function jsonToCsv(input: unknown, options: JsonToCsvOptions = {}): string {
  if (!Array.isArray(input) || input.length === 0) return "";
  const records = input.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item));
  if (records.length === 0) return "";
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))];
  return [
    headers.map((header) => csvCell(header, options)).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header], options)).join(",")),
  ].join("\n");
}

function parseYamlValue(value: string): unknown {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export function simpleYamlToJson(input: string): unknown {
  const lines = input.replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim() && !line.trimStart().startsWith("#"));
  if (lines.some((line) => /^\s+/.test(line))) throw new Error("Unsupported YAML indentation");
  if (lines.length === 0) return {};

  if (lines.every((line) => line.startsWith("- "))) return lines.map((line) => parseYamlValue(line.slice(2)));
  const result: Record<string, unknown> = {};
  for (const line of lines) {
    const separator = line.indexOf(":");
    if (separator <= 0) throw new Error("Unsupported YAML syntax");
    result[line.slice(0, separator).trim()] = parseYamlValue(line.slice(separator + 1));
  }
  return result;
}

function typeForValue(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const elementTypes = typesForValues(value);
    const elementType = elementTypes.join(" | ");
    return elementTypes.length > 1 ? `(${elementType})[]` : `${elementType}[]`;
  }
  if (typeof value === "object") return objectType(value as Record<string, unknown>);
  return typeof value;
}

function typesForValues(values: unknown[]): string[] {
  const objectValues = values.filter(isPlainObject);
  const types = objectValues.length > 0 ? [objectTypeFromSamples(objectValues)] : [];

  for (const value of values) {
    if (!isPlainObject(value)) types.push(typeForValue(value));
  }

  return [...new Set(types)];
}

function typeForValues(values: unknown[]): string {
  return typesForValues(values).join(" | ") || "unknown";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function propertyName(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function objectType(value: Record<string, unknown>): string {
  return objectTypeFromSamples([value]);
}

function objectTypeFromSamples(values: Record<string, unknown>[]): string {
  const keys = [...new Set(values.flatMap((value) => Object.keys(value)))];
  if (keys.length === 0) return "Record<string, unknown>";

  const properties = keys.map((key) => {
    const samples = values.filter((value) => Object.hasOwn(value, key)).map((value) => value[key]);
    const optional = samples.length < values.length ? "?" : "";
    return `${propertyName(key)}${optional}: ${typeForValues(samples)};`;
  });
  return `{ ${properties.join(" ")} }`;
}

export function jsonToTypescript(input: unknown, rootName = "Root"): string {
  const name = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(rootName) ? rootName : "Root";
  if (typeof input !== "object" || input === null || Array.isArray(input)) return `type ${name} = ${typeForValue(input)};`;
  return `interface ${name} ${objectType(input as Record<string, unknown>)}`;
}

const htmlEntities: Record<string, string> = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: "\u00a0", quot: '"' };

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] as string);
}

export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, value: string) => {
    if (value.toLowerCase().startsWith("#x")) return String.fromCodePoint(Number.parseInt(value.slice(2), 16));
    if (value.startsWith("#")) return String.fromCodePoint(Number.parseInt(value.slice(1), 10));
    return htmlEntities[value.toLowerCase()] ?? entity;
  });
}

function stripComments(input: string, lineComments: boolean): string {
  let output = "";
  let quote = "";
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quote) {
      output += character;
      if (character === "\\") output += input[++index] ?? "";
      else if (character === quote) quote = "";
    } else if (character === '"' || character === "'" || character === "`") {
      quote = character;
      output += character;
    } else if (input.slice(index, index + 4).toLowerCase() === "url(") {
      const end = readCssUrl(input, index);
      output += input.slice(index, end);
      index = end - 1;
    } else if (character === "/" && input[index + 1] === "*") {
      const end = input.indexOf("*/", index + 2);
      const commentEnd = end === -1 ? input.length : end + 2;
      if (cssCommentNeedsSeparator(output.at(-1), input[commentEnd])) output += " ";
      index = commentEnd - 1;
    } else if (lineComments && character === "/" && input[index + 1] === "/") {
      const end = input.indexOf("\n", index + 2);
      index = end === -1 ? input.length : end;
    } else {
      output += character;
    }
  }
  return output;
}

function cssCommentNeedsSeparator(before: string | undefined, after: string | undefined): boolean {
  return isCssIdentifierCharacter(before) && isCssIdentifierCharacter(after);
}

function isCssIdentifierCharacter(character: string | undefined): boolean {
  if (!character) return false;
  return character === "\\" || /[A-Za-z0-9_-]/.test(character) || character.codePointAt(0)! >= 0x80;
}

function readCssUrl(input: string, start: number): number {
  let depth = 0;
  let quote = "";

  for (let index = start + 3; index < input.length; index += 1) {
    const character = input[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = "";
    } else if (character === "\\") {
      index += 1;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }

  return input.length;
}

export function minifyCss(input: string): string {
  return compactWhitespace(stripComments(input, false), true).replace(/;}/g, "}");
}

export function cleanJavaScript(input: string): string {
  let output = "";
  let lineOutputStart = 0;
  let outputLine = 0;
  const literalLines = new Set<number>();

  const append = (value: string, isLiteral = false) => {
    if (isLiteral) literalLines.add(outputLine);
    for (const character of value) {
      if (character === "\n") {
        outputLine += 1;
        if (isLiteral) literalLines.add(outputLine);
      }
    }
    output += value;
  };

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (character === "\"" || character === "'" || character === "`") {
      const end = readJavaScriptString(input, index, character);
      append(input.slice(index, end), true);
      index = end - 1;
      continue;
    }

    if (character === "/" && nextCharacter === "/" && isStandaloneJavaScriptComment(input, index)) {
      const end = input.indexOf("\n", index + 2);
      output = output.slice(0, lineOutputStart);
      if (end === -1) break;
      index = end;
      lineOutputStart = output.length;
      continue;
    }

    if (character === "/" && nextCharacter === "*" && isObviousJavaScriptBlockComment(input, index)) {
      const end = input.indexOf("*/", index + 2);
      if (end === -1) {
        output += character;
        continue;
      }
      const commentEnd = end + 2;
      const comment = input.slice(index, commentEnd);
      append(comment.replace(/[^\r\n]/g, " "));
      index = commentEnd - 1;
      continue;
    }

    append(character);
    if (character === "\n") lineOutputStart = output.length;
  }

  return normalizeJavaScriptWhitespace(output, literalLines);
}

function normalizeJavaScriptWhitespace(input: string, literalLines: Set<number>): string {
  const lineEnding = input.includes("\r\n") ? "\r\n" : "\n";
  const lines = input.split(/\r?\n/).map((line, index) => ({
    value: literalLines.has(index) ? line : line.replace(/[ \t]+$/g, ""),
    hasLiteral: literalLines.has(index),
  }));

  while (lines[0] && !lines[0].hasLiteral && lines[0].value.trim() === "") lines.shift();
  while (lines.at(-1) && !lines.at(-1)?.hasLiteral && lines.at(-1)?.value.trim() === "") lines.pop();

  const normalizedLines: string[] = [];
  let blankLineCount = 0;
  for (const line of lines) {
    if (line.hasLiteral) {
      blankLineCount = 0;
      normalizedLines.push(line.value);
    } else if (line.value.trim() === "") {
      blankLineCount += 1;
      if (blankLineCount <= 2) normalizedLines.push("");
    } else {
      blankLineCount = 0;
      normalizedLines.push(line.value);
    }
  }

  return normalizedLines.join(lineEnding);
}

function isStandaloneJavaScriptComment(input: string, index: number): boolean {
  const lineStart = Math.max(input.lastIndexOf("\n", index - 1), input.lastIndexOf("\r", index - 1)) + 1;
  return /^\s*$/.test(input.slice(lineStart, index));
}

function isObviousJavaScriptBlockComment(input: string, index: number): boolean {
  const end = input.indexOf("*/", index + 2);
  if (end === -1) return false;
  const lineStart = Math.max(input.lastIndexOf("\n", index - 1), input.lastIndexOf("\r", index - 1)) + 1;
  const lineBreak = input.slice(end + 2).search(/[\r\n]/);
  const lineEnd = lineBreak === -1 ? input.length : end + 2 + lineBreak;
  const before = input.slice(lineStart, index);
  const after = input.slice(end + 2, lineEnd);

  return /^\s*$/.test(before) && /^\s*$/.test(after)
    || /;\s*$/.test(before) && /^\s*$/.test(after);
}

function readJavaScriptString(input: string, start: number, quote: string): number {
  let index = start + 1;
  while (index < input.length) {
    if (input[index] === "\\") index += 2;
    else if (input[index++] === quote) break;
  }
  return index;
}

function compactWhitespace(input: string, removeAroundPunctuation: boolean): string {
  let output = "";
  let quote = "";
  let pendingWhitespace = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quote) {
      output += character;
      if (character === "\\") output += input[++index] ?? "";
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      if (pendingWhitespace) {
        output += " ";
        pendingWhitespace = false;
      }
      quote = character;
      output += character;
      continue;
    }
    if (/\s/.test(character)) {
      pendingWhitespace = output.length > 0;
      continue;
    }
    const punctuationAfterWhitespace = /[{};,>]/.test(character);
    if (pendingWhitespace && !(removeAroundPunctuation && punctuationAfterWhitespace) && !(removeAroundPunctuation && /[{}:;,>]/.test(output.at(-1) ?? ""))) {
      output += " ";
    }
    pendingWhitespace = false;
    output += character;
  }
  return output.trim();
}

function hexToRgb(value: string): [number, number, number] {
  const hex = value.trim().replace(/^#/, "");
  const expanded = hex.length === 3 ? [...hex].map((character) => character.repeat(2)).join("") : hex;
  if (!/^[\da-f]{6}$/i.test(expanded)) throw new Error("Color must be a 3-digit or 6-digit hex value");
  return [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16)) as [number, number, number];
}

function luminance(color: string): number {
  const components = hexToRgb(color).map((component) => {
    const normalized = component / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * components[0] + 0.7152 * components[1] + 0.0722 * components[2];
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

export function generateRobotsTxt(options: RobotsOptions): string {
  const lines = [`User-agent: ${options.userAgent}`];
  if (options.allowAll) lines.push("Allow: /");
  lines.push(...options.disallowPaths.map((path) => `Disallow: ${path}`));
  if (options.sitemapUrl) lines.push(`Sitemap: ${options.sitemapUrl}`);
  if (options.host) lines.push(`Host: ${options.host}`);
  return lines.join("\n");
}
