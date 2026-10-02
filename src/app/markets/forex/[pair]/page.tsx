import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketAssetDetail } from "@/components/MarketAssetDetail";
import { getMarketAsset } from "@/lib/markets";

const supportedPairs = ["eur-usd", "usd-jpy", "gbp-usd"];

export async function generateStaticParams() {
    return supportedPairs.map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
    const { pair } = await params;
    const asset = await getMarketAsset("forex", pair);

    return {
        title: `${asset.name} (${asset.symbol})`,
        description: asset.description,
    };
}

export default async function ForexPairPage({ params }: { params: Promise<{ pair: string }> }) {
    const { pair } = await params;

    if (!supportedPairs.includes(pair.toLowerCase())) {
        notFound();
    }

    const asset = await getMarketAsset("forex", pair);
    return <MarketAssetDetail asset={asset} />;
}
