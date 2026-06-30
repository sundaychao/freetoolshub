import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light font-mono text-sm font-bold text-primary-dark">
        {tool.icon}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 group-hover:text-primary">
        {tool.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        {tool.description}
      </p>
      <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
        Open tool
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </Link>
  );
}

export default ToolCard;
