import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { PostCard } from "@/components/PostCard";
import { tools } from "@/lib/tools";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const allTools = tools;
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* 工具区 */}
      <section>
        <Container className="py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              All Tools
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Free online utilities that run entirely in your browser. No sign-up, no data sent to servers.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* 广告位 */}
      <Container className="py-6">
        <AdSlot slot="home-middle" />
      </Container>

      {/* 博客区 */}
      <section>
        <Container className="py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                From the Blog
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Guides and articles for builders and creators.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-primary hover:text-primary-hover sm:inline"
            >
              Read all &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>

      {/* 广告位 */}
      <Container className="py-10">
        <AdSlot slot="home-bottom" />
      </Container>

      <div hidden>
        Impact-Site-Verification: 6b20d6d2-af7d-4ead-9d35-57e9e580efee
      </div>
    </>
  );
}
