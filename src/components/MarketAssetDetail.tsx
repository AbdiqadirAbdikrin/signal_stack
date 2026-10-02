"use client";

import Link from "next/link";

import { MarketChart } from "@/components/markets/MarketChart";
import type { MarketAsset } from "@/lib/markets";
import { formatRelativeTime, formatSignedPercent } from "@/lib/markets/utils";

function formatCurrency(value: number | null, currency: string) {
    if (value === null) {
        return "Market data unavailable";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 1000 ? 0 : 4,
    }).format(value);
}

export function MarketAssetDetail({ asset }: { asset: MarketAsset }) {
    const backHref = asset.type === "stocks" ? "/markets/stocks" : asset.type === "crypto" ? "/markets/crypto" : "/markets/forex";

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <Link href="/markets" className="text-sm font-medium text-sky-700">Markets overview</Link>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">{asset.category}</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    {asset.name} <span className="text-slate-500">{asset.symbol}</span>
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">{asset.description}</p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.75fr]">
                <MarketChart
                    data={asset.historical.map((point) => ({
                        timestamp: point.date,
                        price: point.value,
                    }))}
                    symbol={asset.symbol}
                    name={asset.name}
                    currency={asset.currency}
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Current price</p>

                    {asset.isAvailable && asset.price !== null ? (
                        <>
                            <div className="mt-3 flex items-baseline gap-3">
                                <span className="text-4xl font-bold tracking-tight text-slate-900">
                                    {formatCurrency(asset.price, asset.currency)}
                                </span>
                                {asset.change !== null && (
                                    <span className={`text-sm font-semibold ${asset.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                        {asset.change >= 0 ? "+" : "-"}{formatCurrency(Math.abs(asset.change), asset.currency)}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-3 text-sm">
                                <span className={`rounded-full px-2.5 py-1 font-medium ${asset.percentChange !== null && asset.percentChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {asset.percentChange !== null ? formatSignedPercent(asset.percentChange) : "--"}
                                </span>
                                {asset.previousClose !== null && (
                                    <span className="text-slate-500">Previous close: {formatCurrency(asset.previousClose, asset.currency)}</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-4 text-sm text-amber-900">
                            Unable to load market data. Try again.
                        </div>
                    )}

                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-900">Status:</span> {asset.marketStatus}</p>
                        <p><span className="font-medium text-slate-900">Data status:</span> {asset.dataState}</p>
                        <p><span className="font-medium text-slate-900">Last updated:</span> {formatRelativeTime(asset.timestamp)}</p>
                        <p><span className="font-medium text-slate-900">Data provided by:</span> {asset.source}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                        >
                            Refresh data
                        </button>
                        <Link href={backHref} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                            View more {asset.category}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(asset.metadata).map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                        <p className="mt-2 text-base font-medium text-slate-900">{String(value ?? "Not available")}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Educational note</p>
                <p className="mt-3 text-base leading-7 text-slate-700">
                    This page is meant for technical, educational context and market infrastructure analysis. It does not provide personalized financial advice, and it should not be treated as a recommendation to buy, sell, or hold any asset.
                </p>
            </div>
        </main>
    );
}
