import { getMarketAsset } from "@/lib/markets";
import type { MarketType } from "@/lib/markets/types";

export type MarketHistoryRange = "1D" | "7D" | "1M" | "1Y";

export interface MarketHistoryPoint {
    timestamp: string;
    price: number;
    label: string;
}

const RANGE_TO_POINTS: Record<MarketHistoryRange, number> = {
    "1D": 12,
    "7D": 18,
    "1M": 30,
    "1Y": 48,
};

function generateSyntheticHistory(basePrice: number, points: number): MarketHistoryPoint[] {
    const now = Date.now();

    return Array.from({ length: points }, (_, index) => {
        const offset = points - index - 1;
        const timestamp = new Date(now - offset * 24 * 60 * 60 * 1000);
        const wave = Math.sin(index / 3.2) * 0.025;
        const drift = (index - points / 2) * 0.0045;
        const price = Number((basePrice * (1 + wave + drift)).toFixed(4));

        return {
            timestamp: timestamp.toISOString(),
            price,
            label: timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        };
    });
}

export async function getMarketHistory(type: MarketType, symbol: string, range: MarketHistoryRange = "1M"): Promise<MarketHistoryPoint[]> {
    const asset = await getMarketAsset(type, symbol);
    const points = asset.historical?.length
        ? asset.historical.map((point) => ({
            timestamp: point.date,
            price: Number(point.value),
            label: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }))
        : [];

    if (points.length === 0 && asset.price !== null) {
        return generateSyntheticHistory(asset.price, RANGE_TO_POINTS[range]);
    }

    if (points.length <= 2) {
        const fallbackBase = asset.price ?? 100;
        return generateSyntheticHistory(fallbackBase, RANGE_TO_POINTS[range]);
    }

    return points.slice(-RANGE_TO_POINTS[range]);
}
