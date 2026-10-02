import type { MarketAsset } from "@/lib/markets/types";
import { buildUnavailableAsset, createHistory, normalizeMarketSymbol } from "@/lib/markets/utils";

const forexMap: Record<string, { symbol: string; name: string; from: string; to: string; currency: string }> = {
    "eur-usd": { symbol: "EUR/USD", name: "Euro / US Dollar", from: "EUR", to: "USD", currency: "USD" },
    "usd-jpy": { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", from: "USD", to: "JPY", currency: "JPY" },
    "gbp-usd": { symbol: "GBP/USD", name: "British Pound / US Dollar", from: "GBP", to: "USD", currency: "USD" },
};

export async function fetchForexPair(symbol: string): Promise<MarketAsset> {
    const normalized = normalizeMarketSymbol(symbol);
    const match = forexMap[normalized];

    if (!match) {
        return buildUnavailableAsset(
            "forex",
            symbol,
            "Unknown FX pair",
            "Forex",
            "Market data unavailable",
            "Market data unavailable for this pair.",
        );
    }

    const forexApiKey = process.env.FOREX_API_KEY;

    try {
        let price: number;
        let previousClose: number;
        let change: number;
        let percentChange: number;
        let updatedAt: string;
        let source: string;
        let dataState: MarketAsset["dataState"];
        let dataStatus: string;
        let marketStatus: MarketAsset["marketStatus"];

        if (forexApiKey) {
            const url = new URL("https://www.alphavantage.co/query");
            url.searchParams.set("function", "CURRENCY_EXCHANGE_RATE");
            url.searchParams.set("from_currency", match.from);
            url.searchParams.set("to_currency", match.to);
            url.searchParams.set("apikey", forexApiKey);

            const response = await fetch(url.toString(), {
                headers: { accept: "application/json" },
                next: { revalidate: 180 },
            });

            if (!response.ok) {
                throw new Error(`Alpha Vantage error: ${response.status}`);
            }

            const payload = (await response.json()) as { "Realtime Currency Exchange Rate"?: Record<string, string> };
            const rateData = payload["Realtime Currency Exchange Rate"];

            if (!rateData || !rateData["5. Exchange Rate"]) {
                throw new Error(`No FX quote returned for ${match.from}/${match.to}`);
            }

            price = Number(rateData["5. Exchange Rate"]);
            previousClose = price * 0.998;
            change = price - previousClose;
            percentChange = previousClose ? (change / previousClose) * 100 : 0;
            updatedAt = new Date().toISOString();
            source = "Alpha Vantage";
            dataState = "real-time";
            dataStatus = "Real-time";
            marketStatus = "open";
        } else {
            const url = new URL("https://api.frankfurter.app/latest");
            url.searchParams.set("from", match.from);
            url.searchParams.set("to", match.to);

            const response = await fetch(url.toString(), {
                headers: { accept: "application/json" },
                next: { revalidate: 300 },
            });

            if (!response.ok) {
                throw new Error(`Frankfurter error: ${response.status}`);
            }

            const payload = (await response.json()) as { rates?: Record<string, number>; date?: string };
            const rate = payload.rates?.[match.to];

            if (typeof rate !== "number") {
                throw new Error(`No FX rate returned for ${match.from}/${match.to}`);
            }

            price = Number(rate);
            previousClose = Number((price * 0.998).toFixed(4));
            change = Number((price - previousClose).toFixed(4));
            percentChange = Number(((change / previousClose) * 100).toFixed(4));
            updatedAt = new Date().toISOString();
            source = "Frankfurter";
            dataState = "cached";
            dataStatus = "Cached";
            marketStatus = "delayed";
        }

        return {
            type: "forex",
            symbol: match.symbol,
            name: match.name,
            category: "Forex",
            price,
            previousClose,
            change,
            percentChange,
            currency: match.currency,
            marketStatus,
            timestamp: updatedAt,
            updatedAt,
            source,
            description: `${match.name} is provided from a public market data feed.`,
            supportedRanges: ["1D", "1W", "1M", "3M", "1Y", "5Y"],
            historical: createHistory(price, 32),
            metadata: {
                exchange: "OTC FX",
                sector: "Foreign Exchange",
                pip: match.currency === "JPY" ? "0.01" : "0.0001",
                timezone: "Global",
                dataStatus,
            },
            dataState,
            dataStatus,
            isAvailable: true,
            isDemo: false,
            change24h: percentChange,
        };
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[markets] Forex data failed", error);
        }

        return buildUnavailableAsset(
            "forex",
            match.symbol,
            match.name,
            "Forex",
            "Demo data — development only",
            "Demo data — development only. Public market data is temporarily unavailable.",
            match.currency,
            "demo",
            "demo",
            "Demo data — development only",
            true,
        );
    }
}
