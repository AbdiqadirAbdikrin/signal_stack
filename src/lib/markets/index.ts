export * from "@/lib/markets/types";
export * from "@/lib/markets/utils";
export * from "@/lib/markets/news";
export * from "@/lib/markets/providers/history";

import { fetchCryptoQuote } from "./providers/crypto";
import { fetchForexPair } from "./providers/forex";
import { fetchStockQuote } from "./providers/stocks";

import type { MarketAsset, MarketType } from "@/lib/markets/types";

export async function getMarketAsset(type: MarketType, symbol: string): Promise<MarketAsset> {
    const normalized = symbol.trim().toLowerCase();

    switch (type) {
        case "stocks":
            return fetchStockQuote(normalized);
        case "crypto":
            return fetchCryptoQuote(normalized);
        case "forex":
            return fetchForexPair(normalized);
        default:
            throw new Error(`Unsupported market type: ${type}`);
    }
}
