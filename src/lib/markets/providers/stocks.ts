import type { MarketAsset } from "@/lib/markets/types";
import { buildUnavailableAsset, createHistory, normalizeMarketSymbol } from "@/lib/markets/utils";

const stockMap: Record<string, { symbol: string; name: string; description: string }> = {
    aapl: { symbol: "AAPL", name: "Apple Inc.", description: "Consumer electronics and digital services company." },
    msft: { symbol: "MSFT", name: "Microsoft Corporation", description: "Enterprise software and cloud platform provider." },
    nvda: { symbol: "NVDA", name: "NVIDIA Corporation", description: "Semiconductor and AI infrastructure company." },
};

export async function fetchStockQuote(symbol: string): Promise<MarketAsset> {
    const normalized = normalizeMarketSymbol(symbol);
    const match = stockMap[normalized];

    if (!match) {
        return buildUnavailableAsset(
            "stocks",
            symbol,
            "Unknown stock",
            "Stocks",
            "Market data unavailable",
            "Market data unavailable for this symbol.",
        );
    }

    const alphaVantageKey = process.env.STOCKS_API_KEY || process.env.ALPHA_VANTAGE_API_KEY;

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

        if (alphaVantageKey) {
            const url = new URL("https://www.alphavantage.co/query");
            url.searchParams.set("function", "GLOBAL_QUOTE");
            url.searchParams.set("symbol", match.symbol);
            url.searchParams.set("apikey", alphaVantageKey);

            const response = await fetch(url.toString(), {
                headers: { accept: "application/json" },
                next: { revalidate: 180 },
            });

            if (!response.ok) {
                throw new Error(`Alpha Vantage error: ${response.status}`);
            }

            const payload = (await response.json()) as { "Global Quote"?: Record<string, string> };
            const quote = payload["Global Quote"];

            if (!quote || !quote["05. price"] || !quote["08. previous close"]) {
                throw new Error(`No stock quote returned for ${match.symbol}`);
            }

            price = Number(quote["05. price"]);
            previousClose = Number(quote["08. previous close"]);
            change = price - previousClose;
            percentChange = previousClose ? (change / previousClose) * 100 : 0;
            updatedAt = new Date().toISOString();
            source = "Alpha Vantage";
            dataState = "real-time";
            dataStatus = "Real-time";
            marketStatus = "open";
        } else {
            const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${match.symbol}`);
            url.searchParams.set("range", "1mo");
            url.searchParams.set("interval", "1d");

            const response = await fetch(url.toString(), {
                headers: {
                    accept: "application/json",
                    "user-agent": "Mozilla/5.0",
                },
                next: { revalidate: 300 },
            });

            if (!response.ok) {
                throw new Error(`Yahoo Finance error: ${response.status}`);
            }

            const payload = (await response.json()) as {
                chart?: {
                    result?: Array<{
                        meta?: {
                            regularMarketPrice?: number;
                            previousClose?: number;
                            regularMarketTime?: number;
                            currency?: string;
                        };
                    }>;
                };
            };

            const result = payload.chart?.result?.[0];
            const meta = result?.meta ?? {};

            if (typeof meta.regularMarketPrice !== "number") {
                throw new Error(`No quote returned from Yahoo Finance for ${match.symbol}`);
            }

            price = Number(meta.regularMarketPrice);
            previousClose = Number(meta.previousClose ?? price);
            change = price - previousClose;
            percentChange = previousClose ? (change / previousClose) * 100 : 0;
            updatedAt = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString();
            source = "Yahoo Finance";
            dataState = "cached";
            dataStatus = "Cached";
            marketStatus = "delayed";
        }

        return {
            type: "stocks",
            symbol: match.symbol,
            name: match.name,
            category: "Stocks",
            price,
            previousClose,
            change,
            percentChange,
            currency: "USD",
            marketStatus,
            timestamp: updatedAt,
            updatedAt,
            source,
            description: match.description,
            supportedRanges: ["1D", "1W", "1M", "3M", "1Y", "5Y"],
            historical: createHistory(price, 36),
            metadata: {
                exchange: "NASDAQ",
                sector: "Technology",
                marketCap: "Not available",
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
            console.warn("[markets] Stock data failed", error);
        }

        return buildUnavailableAsset(
            "stocks",
            match.symbol,
            match.name,
            "Stocks",
            "Demo data — development only",
            "Demo data — development only. Public market data is temporarily unavailable.",
            "USD",
            "demo",
            "demo",
            "Demo data — development only",
            true,
        );
    }
}
