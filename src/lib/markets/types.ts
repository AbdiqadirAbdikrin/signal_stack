export type MarketType = "stocks" | "crypto" | "forex";
export type MarketRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";
export type MarketStatus = "open" | "closed" | "delayed" | "demo" | "unavailable";
export type MarketDataState = "real-time" | "delayed" | "cached" | "demo" | "unavailable";

export interface MarketDataPoint {
    date: string;
    value: number;
}

export interface MarketAsset {
    type: MarketType;
    symbol: string;
    name: string;
    category: string;
    price: number | null;
    previousClose: number | null;
    change: number | null;
    percentChange: number | null;
    currency: string;
    marketStatus: MarketStatus;
    timestamp: string | null;
    updatedAt?: string | null;
    source: string;
    description: string;
    supportedRanges: MarketRange[];
    historical: MarketDataPoint[];
    metadata: Record<string, string | number | undefined>;
    dataState: MarketDataState;
    dataStatus?: string;
    isAvailable: boolean;
    isDemo?: boolean;
    change24h?: number | null;
}
