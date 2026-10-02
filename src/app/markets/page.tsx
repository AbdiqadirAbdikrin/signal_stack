import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "@/lib/content";
import { getMarketAsset } from "@/lib/markets";
import { marketNavigation } from "@/lib/site";

export const metadata: Metadata = {
    title: "Markets",
    description: "Market technology, trading infrastructure, financial APIs, market data, and educational coverage of stocks, crypto, forex, fintech, and execution systems.",
};

function formatCurrency(value: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 1000 ? 0 : 4,
    }).format(value);
}

export default async function MarketsPage() {
    const [aapl, msft, nvda, btc, eth, sol, eurUsd, usdJpy] = await Promise.all([
        getMarketAsset("stocks", "aapl"),
        getMarketAsset("stocks", "msft"),
        getMarketAsset("stocks", "nvda"),
        getMarketAsset("crypto", "btc"),
        getMarketAsset("crypto", "eth"),
        getMarketAsset("crypto", "sol"),
        getMarketAsset("forex", "eur-usd"),
        getMarketAsset("forex", "usd-jpy"),
    ]);

    const featuredAssets = [aapl, msft, nvda, btc, eth, sol, eurUsd, usdJpy];
    const posts = (await getAllPosts()).slice(0, 3);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <section className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Markets</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Financial infrastructure, market data, and the software behind modern markets.
                </h1>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                    Signal Stack covers the technology, data pipelines, and systems architecture that power public markets, digital assets, FX, fintech platforms, and trading operations.
                </p>
            </section>

            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {marketNavigation.map((market) => (
                    <Link key={market.href} href={market.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">Sector</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{market.label}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {market.label === "Stocks" && "Exchange infrastructure, market structure, and public-equity data systems."}
                            {market.label === "Crypto" && "Digital asset infrastructure, custody systems, and crypto market data."}
                            {market.label === "Forex" && "FX pricing, liquidity networks, and macro market infrastructure."}
                            {market.label === "FinTech" && "Payments, banking software, fraud prevention, and platform design."}
                            {market.label === "Trading Technology" && "Execution systems, latency, order routing, and strategy tooling."}
                            {market.label === "Market Data" && "Feeds, APIs, event streams, and the plumbing behind price discovery."}
                        </p>
                    </Link>
                ))}
            </section>

            <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Market snapshot</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Live-style data, clearly labeled as demo or informational</h2>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {featuredAssets.map((asset) => (
                        <Link key={`${asset.type}-${asset.symbol}`} href={asset.type === "stocks" ? `/markets/stocks/${asset.symbol.toLowerCase()}` : asset.type === "crypto" ? `/markets/crypto/${asset.symbol.toLowerCase()}` : `/markets/forex/${asset.symbol.toLowerCase().replace("/", "-")}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{asset.category}</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{asset.symbol}</h3>
                                </div>
                                {asset.percentChange !== null && (
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${asset.percentChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                        {asset.percentChange >= 0 ? "+" : ""}{asset.percentChange.toFixed(2)}%
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm text-slate-600">{asset.name}</p>
                            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                {asset.price === null ? "Market data unavailable" : formatCurrency(asset.price, asset.currency)}
                            </p>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                                <span>{asset.dataStatus ?? asset.dataState}</span>
                                <span>{asset.updatedAt ? new Date(asset.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "N/A"}</span>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Source: {asset.source}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Latest reads</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Market infrastructure and adjacent technology coverage</h2>
                    <div className="mt-6 space-y-4">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{post.category}</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-900">{post.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Editorial note</p>
                    <p className="mt-3 text-base leading-7 text-slate-700">
                        This section is for technical and educational context. Market prices and charts are informational only and should not be treated as personalized financial advice.
                    </p>
                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-900">Source:</span> demo or configured supplier feed</p>
                        <p><span className="font-medium text-slate-900">Timestamp:</span> displayed alongside each market card</p>
                        <p><span className="font-medium text-slate-900">Purpose:</span> architecture and publishing context</p>
                    </div>
                </aside>
            </section>
        </main>
    );
}
