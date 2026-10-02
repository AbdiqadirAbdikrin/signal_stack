import type { Metadata } from "next";

import { MarketNewsHub } from "@/components/markets/MarketNewsHub";
import { getMarketNews } from "@/lib/markets/news";

export const metadata: Metadata = {
    title: "Market Data & Financial News",
    description: "Live coverage of equities, foreign exchange, cryptocurrencies, and macroeconomic movements.",
};

export default async function MarketDataPage() {
    const items = await getMarketNews();

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Market Data</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Market Data &amp; Financial News</h1>
                <p className="mt-4 text-lg leading-8 text-slate-300">
                    Live coverage of equities, foreign exchange, cryptocurrencies, and macroeconomic movements.
                </p>
            </header>

            <MarketNewsHub items={items} />
        </main>
    );
}
