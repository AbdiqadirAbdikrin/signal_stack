import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedStoryCard } from "@/components/FeaturedStoryCard";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { getAllPosts, getFeaturedPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const [featuredPost, ...latestPosts] = await getFeaturedPosts(4);
  const allPosts = await getAllPosts();
  const heroPost = featuredPost ?? allPosts[0];
  const latestStories = latestPosts.slice(0, 6);
  const aiPosts = allPosts.filter((post) => post.category === "AI").slice(0, 3);
  const cloudPosts = allPosts.filter((post) => post.category === "Cloud").slice(0, 3);
  const devOpsPosts = allPosts.filter((post) => post.category === "DevOps").slice(0, 3);
  const developmentPosts = allPosts.filter((post) => post.category === "Development").slice(0, 3);
  const popularPosts = allPosts.slice(0, 4);
  const topicLinks = [
    { href: "/category/ai", label: "AI", description: "LLMs, RAG, agents, tooling" },
    { href: "/category/cloud", label: "Cloud", description: "Architecture, security, AWS and Azure" },
    { href: "/category/devops", label: "DevOps", description: "Kubernetes, GitOps, CI/CD" },
    { href: "/category/development", label: "Development", description: "APIs, Python, TypeScript, Linux" },
    { href: "/markets", label: "Markets", description: "Market data, APIs, financial infrastructure" },
  ];

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Technology publication</p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Practical technology and engineering insight.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Read the latest
              </Link>
              <Link href="/about" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                About Signal Stack
              </Link>
            </div>
          </div>

          {heroPost ? (
            <FeaturedStoryCard
              title={heroPost.title}
              description={heroPost.description}
              image={heroPost.image}
              imageAlt={heroPost.imageAlt}
              href={`/blog/${heroPost.slug}`}
              category={heroPost.category}
            />
          ) : null}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Browse topics:</span>
            {topicLinks.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Latest stories</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Fresh reporting and deep dives</h2>
          </div>
          <Link href="/blog" className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline-flex">
            View all articles →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestStories.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <SectionBlock title="AI" description="LLMs, retrieval, agents, and practical AI engineering." posts={aiPosts} />
      <SectionBlock title="Cloud & DevOps" description="Platform design, build systems, and operational reliability." posts={[...cloudPosts, ...devOpsPosts].slice(0, 3)} />
      <SectionBlock title="Development" description="APIs, languages, tooling, and engineering workflow decisions." posts={developmentPosts} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Markets</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Financial technology and market infrastructure</h2>
          </div>
          <Link href="/markets" className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline-flex">
            Explore markets →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { href: "/markets/stocks", label: "Stocks", description: "Market structure, APIs, and exchange technology" },
            { href: "/markets/crypto", label: "Crypto", description: "Digital asset infrastructure and market data systems" },
            { href: "/markets/forex", label: "Forex", description: "FX plumbing, execution architecture, and liquidity" },
            { href: "/markets/fintech", label: "FinTech", description: "Payments, fraud, banking, and platform design" },
            { href: "/markets/trading-technology", label: "Trading Technology", description: "Order routing, latency, and strategy tooling" },
            { href: "/markets/market-data", label: "Market Data", description: "Feeds, APIs, event streams, and latency" },
          ].map((market) => (
            <Link key={market.href} href={market.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-slate-300 hover:bg-white">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-700">Markets</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{market.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{market.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Popular articles</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Most read this week</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {popularPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <NewsletterCTA />
      </section>
    </div>
  );
}

function SectionBlock({ title, description, posts }: { title: string; description: string; posts: { slug: string; title: string; description: string; image: string; imageAlt: string; category: string; date: string; tags: string[] }[] }) {
  if (!posts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">{title}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{description}</h2>
        </div>
        <Link href={`/category/${title.toLowerCase() === "cloud & devops" ? "cloud" : title.toLowerCase()}`} className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline-flex">
          View all →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post as never} />
        ))}
      </div>
    </section>
  );
}
