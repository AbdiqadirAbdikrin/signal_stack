import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { articleToPost, getPublicArticleList } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

const categoryFilters = [
    "All",
    "AI",
    "Cloud",
    "DevOps",
    "Development",
    "Cybersecurity",
    "Software & Gadgets",
    "Markets",
    "Business",
] as const;

const pageSize = 9;

function buildBlogHref(category: string, query: string, page = 1) {
    const params = new URLSearchParams();

    if (category !== "All") {
        params.set("category", category);
    }

    if (query.trim()) {
        params.set("search", query.trim());
    }

    if (page > 1) {
        params.set("page", String(page));
    }

    const search = params.toString();
    return search ? `/blog?${search}` : "/blog";
}

export const metadata = {
    title: "Signal Stack | Technology, AI, Cloud & Markets",
    description: "Signal Stack publishes analysis on AI, cloud infrastructure, software engineering, cybersecurity, and market technology.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Signal Stack",
        description: "Technology, AI, Cloud, Markets & the Future of Software",
        url: `${siteConfig.url}/blog`,
    },
    twitter: {
        card: "summary_large_image",
        title: "Signal Stack",
        description: "Technology, AI, Cloud, Markets & the Future of Software",
    },
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
    const params = await searchParams;
    const category: string = categoryFilters.includes((params.category ?? "") as (typeof categoryFilters)[number])
        ? (params.category ?? "All")
        : "All";
    const query = params.search ?? "";
    const currentPage = Number(params.page ?? "1");

    const result = await getPublicArticleList({
        category: category === "All" ? undefined : category,
        search: query.trim() || undefined,
        page: currentPage,
        pageSize,
    });

    const posts = result.articles.map((article) => articleToPost(article));
    const featured = posts.slice(0, 1);
    const supporting = posts.slice(1, 4);
    const latest = posts.slice(4);
    const totalPages = Math.max(1, Math.ceil(result.count / result.pageSize));

    return (
        <main className="min-h-screen bg-[#020817] text-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 rounded-[32px] border border-slate-800 bg-slate-950/70 px-5 py-6 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">Blog</p>
                                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl xl:text-6xl">
                                    Signal Stack
                                </h1>
                            </div>

                            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
                                Technology, AI, Cloud, Markets & the Future of Software
                            </p>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                Signal Stack delivers practical reporting on software, AI systems, infrastructure, cybersecurity, and the forces shaping modern digital business.
                            </p>
                        </div>

                        <form action="/blog" method="get" className="w-full max-w-xl">
                            {category !== "All" ? <input type="hidden" name="category" value={category} /> : null}
                            <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 shadow-lg shadow-slate-950/30">
                                <input
                                    type="search"
                                    name="search"
                                    defaultValue={query}
                                    aria-label="Search blog articles"
                                    placeholder="Search stories, topics, trends..."
                                    className="w-full border-0 bg-transparent px-2 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </header>

                {result.count > 0 ? (
                    <>
                        <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {categoryFilters.map((filter) => {
                                    const isActive = filter === category;
                                    const href = buildBlogHref(filter, query);

                                    return (
                                        <Link
                                            key={filter}
                                            href={href}
                                            className={`rounded-full border px-3 py-1.5 text-sm transition ${isActive
                                                ? "border-sky-500 bg-sky-500/15 text-sky-300"
                                                : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:text-white"
                                                }`}
                                        >
                                            {filter}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                {result.count} stories published
                            </div>
                        </div>

                        {featured.length ? (
                            <section className="mb-10 grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
                                <ArticleCard post={featured[0]} featured />

                                {supporting.length ? (
                                    <div className="space-y-5">
                                        {supporting.map((post) => (
                                            <ArticleCard key={post.slug} post={post} />
                                        ))}
                                    </div>
                                ) : null}
                            </section>
                        ) : null}

                        <section className="space-y-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">Latest articles</h2>
                                <Link href="/search" className="text-sm font-medium text-sky-300 transition hover:text-sky-200">
                                    Search archive
                                </Link>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {latest.length ? latest.map((post) => <ArticleCard key={post.slug} post={post} />) : posts.map((post) => <ArticleCard key={post.slug} post={post} />)}
                            </div>
                        </section>

                        {totalPages > 1 ? (
                            <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                {currentPage > 1 ? (
                                    <Link href={buildBlogHref(category, query, currentPage - 1)} className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white">
                                        Previous
                                    </Link>
                                ) : null}

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                                    const isCurrent = pageNumber === currentPage;

                                    return (
                                        <Link
                                            key={pageNumber}
                                            href={buildBlogHref(category, query, pageNumber)}
                                            className={`rounded-full px-3.5 py-2 text-sm ${isCurrent
                                                ? "bg-sky-500 text-slate-950"
                                                : "border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:text-white"
                                                }`}
                                            aria-current={isCurrent ? "page" : undefined}
                                        >
                                            {pageNumber}
                                        </Link>
                                    );
                                })}

                                {currentPage < totalPages ? (
                                    <Link href={buildBlogHref(category, query, currentPage + 1)} className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white">
                                        Next
                                    </Link>
                                ) : null}
                            </nav>
                        ) : null}
                    </>
                ) : (
                    <div className="mt-8 rounded-[32px] border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center text-slate-300 sm:p-16">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">No stories yet</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Signal Stack is preparing its next story.</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
                            No published articles are available right now. Check back soon for the latest thinking on AI, infrastructure, software, and market technology.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
