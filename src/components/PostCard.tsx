import Link from "next/link";
import type { Post } from "@/lib/posts";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&bull;</span>
        <span>{post.author}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-zinc-900 group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
        {post.excerpt}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default PostCard;
