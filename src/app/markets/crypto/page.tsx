import type { Metadata } from "next";
import Link from "next/link";

import { TradingViewChart } from "@/components/markets/TradingViewChart";
import { getMarketAsset } from "@/lib/markets";

export const metadata: Metadata = {
    title: "Crypto",
    description: "Crypto market technology, digital asset infrastructure, exchange systems, and market data coverage.",
};

function formatCurrency(value: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 1000 ? 0 : 4,
    }).format(value);
}

export default async function CryptoMarketPage() {
    const cryptoAssets = await Promise.all([
        getMarketAsset("crypto", "btc"),
        getMarketAsset("crypto", "eth"),
        getMarketAsset("crypto", "sol"),
    ]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Crypto</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Digital assets and market data systems</h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Modern crypto coverage includes exchange mechanics, digital asset infrastructure, custody, smart-contract platforms, and the API layers that deliver prices and liquidity.
                </p>
            </div>

            <div className="mt-8">
                <TradingViewChart
                    marketType="crypto"
                    title="Crypto market chart"
                    symbols={["BINANCE:BTCUSD", "BINANCE:ETHUSD", "BINANCE:SOLUSD"]}
                    defaultSymbol="BINANCE:BTCUSD"
                />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cryptoAssets.map((asset) => (
                    <Link key={asset.symbol} href={`/markets/crypto/${asset.symbol.toLowerCase()}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Ticker</p>
                                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{asset.symbol}</h2>
                            </div>
                            {asset.percentChange !== null && (
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${asset.percentChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {asset.percentChange >= 0 ? "+" : ""}{asset.percentChange.toFixed(2)}%
                                </span>
                            )}
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{asset.name}</p>
                        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            {asset.price === null ? "Market data unavailable" : formatCurrency(asset.price, asset.currency)}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-slate-500">
                            <span>{asset.dataStatus ?? asset.dataState}</span>
                            <span>{asset.updatedAt ? new Date(asset.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "N/A"}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Source: {asset.source}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
