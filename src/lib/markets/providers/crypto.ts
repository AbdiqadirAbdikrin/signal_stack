import type { MarketAsset } from "@/lib/markets/types";
import { buildUnavailableAsset, createHistory, normalizeMarketSymbol } from "@/lib/markets/utils";

const cryptoMap: Record<string, { symbol: string; name: string; id: string }> = {
    btc: { symbol: "BTC", name: "Bitcoin", id: "bitcoin" },
    eth: { symbol: "ETH", name: "Ethereum", id: "ethereum" },
    sol: { symbol: "SOL", name: "Solana", id: "solana" },
};

export async function fetchCryptoQuote(symbol: string): Promise<MarketAsset> {
    const normalized = normalizeMarketSymbol(symbol);
    const match = cryptoMap[normalized];

    if (!match) {
        return buildUnavailableAsset(
            "crypto",
            symbol,
            "Unknown crypto",
            "Crypto",
            "CoinGecko",
            "Market data unavailable for this symbol.",
        );
    }

    try {
        const url = new URL("https://api.coingecko.com/api/v3/simple/price");
        url.searchParams.set("ids", match.id);
        url.searchParams.set("vs_currencies", "usd");
        url.searchParams.set("include_24hr_change", "true");
        url.searchParams.set("include_last_updated_at", "true");

        const response = await fetch(url.toString(), {
            headers: { accept: "application/json" },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new Error(`CoinGecko error: ${response.status}`);
        }

        const payload = (await response.json()) as Record<string, {
            usd?: number;
            usd_24h_change?: number;
            last_updated_at?: number;
        }>;

        const raw = payload[match.id];

        if (!raw || typeof raw.usd !== "number") {
            throw new Error(`No price returned for ${match.id}`);
        }

        const price = Number(raw.usd);
        const change24h = typeof raw.usd_24h_change === "number" ? Number(raw.usd_24h_change) : 0;
        const previousClose = price / (1 + change24h / 100);
        const change = price - previousClose;
        const updatedAt = raw.last_updated_at ? new Date(raw.last_updated_at * 1000).toISOString() : new Date().toISOString();

        return {
            type: "crypto",
            symbol: match.symbol,
            name: match.name,
            category: "Crypto",
            price,
            previousClose,
            change,
            percentChange: change24h,
            currency: "USD",
            marketStatus: "open",
            timestamp: updatedAt,
            source: "CoinGecko",
            description: `${match.name} market data from the public CoinGecko price API.`,
            supportedRanges: ["1D", "1W", "1M", "3M", "1Y", "5Y"],
            historical: createHistory(price, 30),
            metadata: {
                exchange: "Global spot markets",
                sector: "Digital Assets",
                marketCap: "Not available",
                network: match.name,
            },
            dataState: "real-time",
            isAvailable: true,
        };
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[markets] Crypto API call failed", error);
        }

        return buildUnavailableAsset(
            "crypto",
            match.symbol,
            match.name,
            "Crypto",
            "Market data unavailable",
            "Unable to load market data. Try again.",
        );
    }
}
