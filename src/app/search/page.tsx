"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import type { Post } from "@/types/blog";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") ?? "";
    const [query, setQuery] = useState(initialQuery);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        void fetch("/api/posts")
            .then((response) => response.json())
            .then((allPosts) => {
                if (active) {
                    setPosts(allPosts as Post[]);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) {
                    setPosts([]);
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const filteredPosts = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return posts;
        }

        return posts.filter((post) => {
            const source = `${post.title} ${post.description} ${post.category} ${post.tags.join(" ")}`.toLowerCase();
            return source.includes(normalized);
        });
    }, [posts, query]);

    return (
        <main className="min-h-screen bg-[#020817] px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">Search</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Find an article</h1>
                </header>

                <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
                    <label htmlFor="search" className="mb-3 block text-sm font-medium text-slate-300">
                        Search by title, summary, category, or tag
                    </label>
                    <form method="get" action="/search" className="flex flex-col gap-3 sm:flex-row">
                        <input
                            id="search"
                            type="search"
                            name="q"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search AI, Cloud, security..."
                            className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                        <button type="submit" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-400">
                            Search
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-sm text-slate-300">
                    {loading ? "Loading articles..." : `${filteredPosts.length} result${filteredPosts.length === 1 ? "" : "s"}`}
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        <div className="rounded-[28px] border border-dashed border-slate-700 bg-slate-950/60 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                            Loading the latest reporting and analysis...
                        </div>
                    ) : filteredPosts.length ? (
                        filteredPosts.map((post) => <ArticleCard key={post.slug} post={post} />)
                    ) : (
                        <div className="rounded-[28px] border border-dashed border-slate-700 bg-slate-950/60 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                            No articles match your search. Try a broader keyword like AI, Cloud, or security.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
