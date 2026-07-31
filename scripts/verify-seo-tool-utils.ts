import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  contrastRatio,
  cleanJavaScript,
  csvToJson,
  decodeHtmlEntities,
  decodeJwt,
  diffLines,
  encodeHtmlEntities,
  generateRobotsTxt,
  isNonEmptyPlainObjectArray,
  jsonToCsv,
  jsonToTypescript,
  minifyCss,
  simpleYamlToJson,
  testRegex,
} from "../src/lib/seo-tool-utils.ts";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSmFuZSJ9.signature";
assert.deepEqual(decodeJwt(token).payload, { sub: "123", name: "Jane" });

assert.equal(testRegex("(foo)", "gi", "Foo bar foo").matches.length, 2);
assert.equal(testRegex("foo", "y", "foofoo xfoo").matches.length, 2);
assert.equal(testRegex("foo", "y", "xfoo foo").matches.length, 0);
assert.equal(testRegex("", "", "x").error?.includes("empty"), true);
assert.deepEqual(testRegex("a", "", "aaaa", { maxMatches: 2 }), {
  matches: [
    { match: "a", index: 0, groups: [] },
    { match: "a", index: 1, groups: [] },
  ],
  truncated: true,
});
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
assert.equal(
  jsonToCsv(
    [{ value: "=1+1" }, { value: "+cmd" }, { value: "-1" }, { value: "@name" }],
    { spreadsheetSafe: true },
  ),
  "value\n'=1+1\n'+cmd\n'-1\n'@name",
);
assert.equal(
  jsonToCsv([{ value: "\t=1+1" }, { value: "\r=1+1" }], { spreadsheetSafe: true }),
  "value\n'\t=1+1\n\"'\r=1+1\"",
);
assert.equal(jsonToCsv([{ value: "=1+1" }]), "value\n=1+1");
assert.equal(
  jsonToCsv([{ value: "\t=1+1" }, { value: "\r=1+1" }]),
  "value\n\t=1+1\n\"\r=1+1\"",
);
assert.equal(isNonEmptyPlainObjectArray({ name: "Jane" }), false);
assert.equal(isNonEmptyPlainObjectArray([]), false);
assert.equal(isNonEmptyPlainObjectArray([1]), false);
assert.equal(isNonEmptyPlainObjectArray([{ name: "Jane" }]), true);

assert.deepEqual(simpleYamlToJson("name: Jane\nenabled: true\ncount: 3"), {
  name: "Jane",
  enabled: true,
  count: 3,
});

assert.equal(
  jsonToTypescript({ id: 1, name: "Jane", tags: ["dev"] }, "User").includes("interface User"),
  true,
);
assert.equal(
  jsonToTypescript([{ id: 1 }, { id: "x", name: "Jane" }], "User"),
  "type User = { id: number | string; name?: string; }[];",
);

assert.equal(encodeHtmlEntities('<a href="x">'), "&lt;a href=&quot;x&quot;&gt;");
assert.equal(decodeHtmlEntities("&lt;strong&gt;Hi&lt;/strong&gt;"), "<strong>Hi</strong>");
assert.equal(decodeHtmlEntities("&#X41;"), "A");

assert.equal(minifyCss("/*x*/\n.card { color: red; }"), ".card{color:red}");
assert.equal(minifyCss("nav :hover { color: red; }"), "nav :hover{color:red}");
assert.equal(minifyCss("nav /* comment */:hover { color: red; }"), "nav :hover{color:red}");
assert.equal(minifyCss("a/* separator */b { color: red; }"), "a b{color:red}");
assert.equal(minifyCss("a/*c*/.child{color:red}"), "a.child{color:red}");
assert.equal(minifyCss("a/*c*/#state{color:red}"), "a#state{color:red}");
assert.equal(minifyCss("a/* comment */\\62 { color: red; }"), "a \\62{color:red}");
assert.equal(minifyCss("a{background:url(foo/*keep*/bar)}"), "a{background:url(foo/*keep*/bar)}");
assert.equal(minifyCss("a{background:url(foo\\)bar/*keep*/baz)}"), "a{background:url(foo\\)bar/*keep*/baz)}");
assert.equal(minifyCss("a/*comment*/é{color:red}"), "a é{color:red}");
assert.equal(cleanJavaScript("// x\nconst a = 1;"), "const a = 1;");
assert.equal(
  cleanJavaScript("\n\nconst a = 1;  \t\n\n\n\nconst b = 2;\t \n\n"),
  "const a = 1;\n\n\nconst b = 2;",
);
const asiSensitiveJavaScript = cleanJavaScript("function f(){ return\n1; }");
assert.equal(/return\s*\n\s*1/.test(asiSensitiveJavaScript), true);
assert.equal(asiSensitiveJavaScript.includes("return 1"), false);
const multilineTemplateLiteral = "const message = `first line  \n\nthird line  \n`;";
assert.equal(cleanJavaScript(multilineTemplateLiteral), multilineTemplateLiteral);
assert.equal(cleanJavaScript("const slash = /[//]/;"), "const slash = /[//]/;");
assert.equal(cleanJavaScript("const matcher = /[/*]/;"), "const matcher = /[/*]/;");
assert.equal(cleanJavaScript("const matcher = /[;/* comment */ ]/;"), "const matcher = /[;/* comment */ ]/;");
assert.equal(cleanJavaScript("const ratio = total / count; /* remove me */"), "const ratio = total / count;");
assert.equal(contrastRatio("#000000", "#ffffff"), 21);
assert.equal(contrastRatio("#070707", "#777777") < 4.5, true);
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

const textDiffChecker = readFileSync(new URL("../src/components/tools/TextDiffChecker.tsx", import.meta.url), "utf8");
assert.match(textDiffChecker, /const MAX_DIFF_LINES = \d+;/);
assert.match(textDiffChecker, /onClick=\{handleCompare\}/);
assert.match(textDiffChecker, /lineCount\(left\) > MAX_DIFF_LINES \|\| lineCount\(right\) > MAX_DIFF_LINES/);
assert.doesNotMatch(textDiffChecker, /useMemo\(/);

const regexTester = readFileSync(new URL("../src/components/tools/RegexTester.tsx", import.meta.url), "utf8");
assert.match(regexTester, /const MAX_PATTERN_CHARACTERS = \d+;/);
assert.match(regexTester, /const MAX_TEXT_CHARACTERS = [\d_]+;/);
assert.match(regexTester, /const MAX_MATCHES = \d+;/);
assert.match(regexTester, /onClick=\{handleTest\}/);
assert.match(regexTester, /new Worker\(/);
assert.match(regexTester, /terminate\(\)/);
assert.doesNotMatch(regexTester, /useMemo\(/);

const jsonToCsvConverter = readFileSync(new URL("../src/components/tools/JsonToCsvConverter.tsx", import.meta.url), "utf8");
assert.match(jsonToCsvConverter, /spreadsheetSafe/);
assert.match(jsonToCsvConverter, /spreadsheet formula/);

const yamlToJsonConverter = readFileSync(new URL("../src/components/tools/YamlToJsonConverter.tsx", import.meta.url), "utf8");
assert.match(yamlToJsonConverter, /top-level key\/value objects and simple lists only/);

const cssMinifier = readFileSync(new URL("../src/components/tools/CssMinifier.tsx", import.meta.url), "utf8");
const javascriptCleaner = readFileSync(new URL("../src/components/tools/JavaScriptCleaner.tsx", import.meta.url), "utf8");
for (const toolComponent of [cssMinifier, javascriptCleaner]) {
  assert.match(toolComponent, /const MAX_INPUT_CHARACTERS = 100_000;/);
  assert.match(toolComponent, /onClick=\{handle(?:Minify|Clean)\}/);
  assert.doesNotMatch(toolComponent, /useMemo\(/);
}

console.log("seo tool utilities verified");
