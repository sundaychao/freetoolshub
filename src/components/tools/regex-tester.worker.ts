import { testRegex } from "@/lib/seo-tool-utils";

type RegexWorkerRequest = {
  pattern: string;
  flags: string;
  text: string;
  maxMatches: number;
};

self.onmessage = (event: MessageEvent<RegexWorkerRequest>) => {
  const { pattern, flags, text, maxMatches } = event.data;
  self.postMessage(testRegex(pattern, flags, text, { maxMatches }));
};

export {};
