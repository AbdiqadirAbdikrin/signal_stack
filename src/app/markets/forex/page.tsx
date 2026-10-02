import type { Metadata } from "next";
import Link from "next/link";

import { TradingViewChart } from "@/components/markets/TradingViewChart";
import { getMarketAsset } from "@/lib/markets";

export const metadata: Metadata = {
    title: "Forex",
    description: "Forex market data, FX infrastructure, liquidity networks, and exchange-rate systems.",
};

function formatPrice(value: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
        currency,
    }).format(value);
}

export default async function ForexPage() {
    const pairs = await Promise.all([
        getMarketAsset("forex", "eur-usd"),
        getMarketAsset("forex", "usd-jpy"),
        getMarketAsset("forex", "gbp-usd"),
    ]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Forex</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Foreign exchange infrastructure and pricing data</h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                    FX coverage covers the architecture of liquidity, execution systems, pricing feeds, and the macroeconomic forces that influence currency movement.
                </p>
            </div>

            <div className="mt-8">
                <TradingViewChart
                    marketType="forex"
                    title="Forex market chart"
                    symbols={["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY"]}
                    defaultSymbol="FX:EURUSD"
                />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pairs.map((pair) => (
                    <Link key={pair.symbol} href={`/markets/forex/${pair.symbol.toLowerCase().replace("/", "-")}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Pair</p>
                                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{pair.symbol}</h2>
                            </div>
                            {pair.percentChange !== null && (
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pair.percentChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {pair.percentChange >= 0 ? "+" : ""}{pair.percentChange.toFixed(2)}%
                                </span>
                            )}
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{pair.name}</p>
                        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            {pair.price === null ? "Market data unavailable" : formatPrice(pair.price, pair.currency)}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-slate-500">
                            <span>{pair.dataStatus ?? pair.dataState}</span>
                            <span>{pair.updatedAt ? new Date(pair.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "N/A"}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Source: {pair.source}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
