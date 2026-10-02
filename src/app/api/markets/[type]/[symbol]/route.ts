import { type NextRequest, NextResponse } from "next/server";

import { getMarketAsset, normalizeMarketSymbol } from "@/lib/markets";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ type: string; symbol: string }> },
) {
    const { type, symbol } = await params;

    if (!type || !symbol) {
        return NextResponse.json({ error: "Market type and symbol are required." }, { status: 400 });
    }

    const normalizedType = type.toLowerCase();
    if (!['stocks', 'crypto', 'forex'].includes(normalizedType)) {
        return NextResponse.json({ error: "Unsupported market type." }, { status: 400 });
    }

    try {
        const asset = await getMarketAsset(normalizedType as "stocks" | "crypto" | "forex", normalizeMarketSymbol(symbol));
        return NextResponse.json(asset, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unable to load market data." },
            { status: 500 },
        );
    }
}
