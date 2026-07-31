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
assert.equal(minifyCss("a/* separator */b { color: red; }"), "a b{color:red}");
assert.equal(minifyJavaScript("// x\nconst a = 1;"), "const a = 1;");
const asiSensitiveJavaScript = minifyJavaScript("function f(){ return\n1; }");
assert.equal(/return\s*\n\s*1/.test(asiSensitiveJavaScript), true);
assert.equal(asiSensitiveJavaScript.includes("return 1"), false);
assert.equal(minifyJavaScript("const slash = /[//]/;"), "const slash = /[//]/;");
assert.equal(minifyJavaScript("const ratio = total / count; /* remove me */"), "const ratio = total / count;");
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
