import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { PostCard } from "@/components/PostCard";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and guides for developers and creators.",
  alternates: {
    canonical: "/blog/",
  },
};

export default function BlogPage() {
  return (
    <Container className="py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Blog
        </h1>
        <p className="mt-3 text-zinc-600">
          Practical articles on web development, performance, and getting the
          most out of online tools.
        </p>
      </header>

      <div className="mt-10">
        <AdSlot slot="blog-top" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-10">
        <AdSlot slot="blog-bottom" />
      </div>
    </Container>
  );
}
