import type { MarketAsset, MarketDataPoint, MarketRange, MarketType } from "@/lib/markets/types";

export const marketRanges: MarketRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export function normalizeMarketSymbol(value: string): string {
    return value.trim().toLowerCase();
}

export function buildUnavailableAsset(
    type: MarketType,
    symbol: string,
    name: string,
    category: string,
    source: string,
    description: string,
    currency = "USD",
    dataState: MarketAsset["dataState"] = "unavailable",
    status: MarketAsset["marketStatus"] = "unavailable",
    dataStatus = "Market data unavailable",
    isDemo = false,
): MarketAsset {
    const timestamp = new Date().toISOString();

    return {
        type,
        symbol: symbol.toUpperCase(),
        name,
        category,
        price: null,
        previousClose: null,
        change: null,
        percentChange: null,
        currency,
        marketStatus: status,
        timestamp,
        updatedAt: timestamp,
        source,
        description,
        supportedRanges: marketRanges,
        historical: [],
        metadata: {
            status: dataStatus,
        },
        dataState,
        dataStatus,
        isAvailable: false,
        isDemo,
        change24h: null,
    };
}

export function formatMarketPrice(value: number | null, currency: string): string {
    if (value === null || Number.isNaN(value)) {
        return "Market data unavailable";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: currency === "JPY" ? 2 : 2,
        maximumFractionDigits: currency === "JPY" ? 2 : 2,
    }).format(value);
}

export function formatSignedPercent(value: number | null): string {
    if (value === null || Number.isNaN(value)) {
        return "--";
    }

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatRelativeTime(timestamp: string | null): string {
    if (!timestamp) {
        return "Timestamp unavailable";
    }

    const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 60000));

    if (diffMinutes < 1) {
        return "Updated just now";
    }

    return `Updated ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
}

export function createHistory(basePrice: number, points = 30): MarketDataPoint[] {
    const now = Date.now();

    return Array.from({ length: points }, (_, index) => {
        const date = new Date(now - (points - index - 1) * 24 * 60 * 60 * 1000);
        const variation = Math.sin(index / 4) * 0.04 + (index - (points / 2)) * 0.0015;
        const value = Number((basePrice * (1 + variation)).toFixed(4));

        return {
            date: date.toISOString(),
            value,
        };
    });
}
