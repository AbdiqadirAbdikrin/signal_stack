"use client";

import { useMemo, useState } from "react";

import type { MarketNewsItem } from "@/lib/markets/news";

type NewsFilter = "All News" | "Stocks" | "Crypto" | "Forex" | "Macro Economy";

const filters: NewsFilter[] = ["All News", "Stocks", "Crypto", "Forex", "Macro Economy"];

function formatRelativeTime(timestamp: string): string {
    const target = new Date(timestamp).getTime();
    const diffMinutes = Math.max(0, Math.round((Date.now() - target) / 60000));

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
}

function getCategoryLabel(filter: NewsFilter): MarketNewsItem["category"] | "All News" {
    switch (filter) {
        case "Stocks":
            return "Stocks";
        case "Crypto":
            return "Crypto";
        case "Forex":
            return "Forex";
        case "Macro Economy":
            return "Economy";
        default:
            return "All News";
    }
}

export function MarketNewsHub({ items }: { items: MarketNewsItem[] }) {
    const [activeFilter, setActiveFilter] = useState<NewsFilter>("All News");

    const filteredItems = useMemo(() => {
        const filterValue = getCategoryLabel(activeFilter);

        if (filterValue === "All News") {
            return items;
        }

        return items.filter((item) => item.category === filterValue);
    }, [activeFilter, items]);

    const featuredStory = filteredItems[0] ?? items[0];
    const sideRail = filteredItems.slice(1, 6);
    const mainGrid = filteredItems.slice(6);

    return (
        <section className="mt-10 rounded-3xl border border-slate-800 bg-[#0d1117] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.5)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${activeFilter === filter
                                ? "border-sky-500 bg-sky-500/10 text-sky-300"
                                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {featuredStory ? (
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
                    <a
                        href={featuredStory.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
                    >
                        <div
                            className="relative h-72 w-full bg-cover bg-center bg-slate-800 sm:h-80 lg:h-[420px]"
                            style={{
                                backgroundImage: featuredStory.imageUrl
                                    ? `linear-gradient(135deg, rgba(2,6,23,0.35), rgba(2,6,23,0.72)), url(${featuredStory.imageUrl})`
                                    : "linear-gradient(135deg, rgba(14,116,144,0.6), rgba(15,23,42,0.9))",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-slate-950/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200">
                                    <span className="rounded-full border border-sky-500/60 bg-sky-500/10 px-2 py-1">{featuredStory.category}</span>
                                    <span className="text-slate-300">{featuredStory.source}</span>
                                </div>
                                <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white transition group-hover:text-sky-300 sm:text-3xl xl:text-4xl">
                                    {featuredStory.title}
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">{featuredStory.summary}</p>
                                <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-slate-300">
                                    <span>{formatRelativeTime(featuredStory.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    <aside className="space-y-3">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Trending</p>
                        </div>

                        {sideRail.length > 0 ? (
                            sideRail.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-2xl border border-slate-800 bg-[#101821] p-4 transition hover:-translate-y-0.5 hover:border-sky-600 hover:bg-slate-900"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{item.category}</p>
                                            <h3 className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-slate-100 group-hover:text-sky-300">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-slate-500">{formatRelativeTime(item.publishedAt)}</span>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-400">
                                No stories for this filter yet.
                            </div>
                        )}
                    </aside>
                </div>
            ) : null}

            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest coverage</p>
                </div>

                {mainGrid.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {mainGrid.map((item) => (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block overflow-hidden rounded-2xl border border-slate-800 bg-[#101821] transition duration-200 hover:-translate-y-1 hover:border-sky-600 hover:shadow-[0_18px_40px_rgba(14,165,233,0.15)]"
                            >
                                <div
                                    className="h-44 w-full bg-cover bg-center bg-slate-800"
                                    style={{
                                        backgroundImage: item.imageUrl
                                            ? `linear-gradient(180deg, rgba(15,23,42,0.15), rgba(15,23,42,0.4)), url(${item.imageUrl})`
                                            : "linear-gradient(135deg, rgba(14,116,144,0.7), rgba(2,6,23,0.95))",
                                    }}
                                />
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sky-300">
                                            {item.category}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.source}</span>
                                    </div>
                                    <h3 className="mt-3 line-clamp-3 text-lg font-semibold leading-7 text-white group-hover:text-sky-300">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                                    <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
                                        <span>{formatRelativeTime(item.publishedAt)}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-400">
                        No market news is available for this filter right now.
                    </div>
                )}
            </div>
        </section>
    );
}
