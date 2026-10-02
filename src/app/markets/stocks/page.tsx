import type { Metadata } from "next";
import Link from "next/link";

import { TradingViewChart } from "@/components/markets/TradingViewChart";
import { getMarketAsset } from "@/lib/markets";

export const metadata: Metadata = {
    title: "Stocks",
    description: "Stock market technology, market structure, exchange infrastructure, and public-equity data systems.",
};

function formatCurrency(value: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 1000 ? 0 : 4,
    }).format(value);
}

export default async function StocksMarketPage() {
    const stocks = await Promise.all([
        getMarketAsset("stocks", "aapl"),
        getMarketAsset("stocks", "msft"),
        getMarketAsset("stocks", "nvda"),
    ]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Stocks</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Public markets and exchange technology</h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Coverage includes exchange infrastructure, market structure, public equity software, and the systems that power modern trading and company data delivery.
                </p>
            </div>

            <div className="mt-8">
                <TradingViewChart
                    marketType="stocks"
                    title="Stocks market chart"
                    symbols={["NASDAQ:AAPL", "NASDAQ:MSFT", "NASDAQ:NVDA"]}
                    defaultSymbol="NASDAQ:AAPL"
                />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {stocks.map((stock) => (
                    <Link key={stock.symbol} href={`/markets/stocks/${stock.symbol.toLowerCase()}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Ticker</p>
                                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{stock.symbol}</h2>
                            </div>
                            {stock.percentChange !== null && (
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stock.percentChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {stock.percentChange >= 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%
                                </span>
                            )}
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{stock.name}</p>
                        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            {stock.price === null ? "Market data unavailable" : formatCurrency(stock.price, stock.currency)}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-slate-500">
                            <span>{stock.dataStatus ?? stock.dataState}</span>
                            <span>{stock.updatedAt ? new Date(stock.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "N/A"}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Source: {stock.source}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
