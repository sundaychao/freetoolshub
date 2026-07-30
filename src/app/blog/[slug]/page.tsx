import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { getPostBySlug, posts } from "@/lib/posts";
import { getPostJsonLd } from "@/lib/jsonld";

// 为所有文章预生成静态路由
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

// 动态生成页面标题与描述
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = getPostJsonLd(post);

  return (
    <Container className="py-12">
      {/* 文章页结构化数据：Article + BreadcrumbList */}
      {jsonLd.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <nav className="text-sm text-zinc-500">
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{post.title}</span>
      </nav>

      <article className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">&bull;</span>
          <span>{post.author}</span>
        </div>
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

        <p className="mt-8 text-lg leading-relaxed text-zinc-700">
          {post.excerpt}
        </p>

        <div className="mt-8">
          <AdSlot slot={`blog-${post.slug}-inarticle`} />
        </div>

        <div className="mt-8 space-y-6">
          {post.content.map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-zinc-700">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-12 border-t border-zinc-200 pt-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          &larr; Back to all articles
        </Link>
      </div>
    </Container>
  );
}
