"use client";

import { useState } from "react";
import { decodeJwt } from "@/lib/seo-tool-utils";

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  function handleDecode() {
    try {
      if (!token.trim()) throw new Error("Paste a JWT to decode.");
      const decoded = decodeJwt(token.trim());
      setHeader(JSON.stringify(decoded.header, null, 2));
      setPayload(JSON.stringify(decoded.payload, null, 2));
      setSignature(decoded.signature || "No signature segment provided.");
      setError("");
    } catch (error) {
      setHeader("");
      setPayload("");
      setSignature("");
      setError(error instanceof Error ? error.message : "Unable to decode this JWT.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="jwt-input" className="mb-2 block text-sm font-medium text-zinc-700">JWT token</label>
        <textarea id="jwt-input" value={token} onChange={(event) => setToken(event.target.value)} spellCheck={false} placeholder="eyJ..." className="h-36 w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button type="button" onClick={handleDecode} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">Decode JWT</button>
        {error && <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <JsonOutput id="jwt-header" label="Header" value={header} />
        <JsonOutput id="jwt-payload" label="Payload" value={payload} />
      </div>
      <div>
        <label htmlFor="jwt-signature" className="mb-2 block text-sm font-medium text-zinc-700">Signature preview</label>
        <textarea id="jwt-signature" value={signature} readOnly spellCheck={false} placeholder="The signature segment will appear here." className="h-24 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none" />
      </div>
    </div>
  );
}

function JsonOutput({ id, label, value }: { id: string; label: string; value: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700">{label}</label><textarea id={id} value={value} readOnly spellCheck={false} placeholder={`${label} JSON will appear here.`} className="h-64 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 shadow-sm focus:outline-none" /></div>;
}

export default JwtDecoder;
