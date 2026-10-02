import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketAssetDetail } from "@/components/MarketAssetDetail";
import { getMarketAsset } from "@/lib/markets";

const supportedSymbols = ["btc", "eth", "sol"];

export async function generateStaticParams() {
    return supportedSymbols.map((symbol) => ({ symbol }));
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
    const { symbol } = await params;
    const asset = await getMarketAsset("crypto", symbol);

    return {
        title: `${asset.name} (${asset.symbol})`,
        description: asset.description,
    };
}

export default async function CryptoSymbolPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;

    if (!supportedSymbols.includes(symbol.toLowerCase())) {
        notFound();
    }

    const asset = await getMarketAsset("crypto", symbol);
    return <MarketAssetDetail asset={asset} />;
}
