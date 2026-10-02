import Parser from "rss-parser";

export interface MarketNewsItem {
    id: string;
    title: string;
    summary: string;
    link: string;
    source: string;
    publishedAt: string;
    category: "Stocks" | "Crypto" | "Forex" | "Economy";
    imageUrl?: string;
}

export const revalidate = 300;

type FeedCategory = Exclude<MarketNewsItem["category"], "Economy">;

const FEED_CONFIG: Array<{ category: FeedCategory; url: string }> = [
    { category: "Stocks", url: "https://finance.yahoo.com/news/rssindex" },
    { category: "Crypto", url: "https://finance.yahoo.com/news/crypto/rss" },
    { category: "Forex", url: "https://finance.yahoo.com/news/forex/rss" },
];

const parser = new Parser({
    customFields: {
        item: ["media:content", "media:thumbnail", "enclosure", "description", "content:encoded", "pubDate"],
    },
});

function stripHtml(value?: string): string {
    if (!value) {
        return "";
    }

    return value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function getArticleLink(item: { link?: string | string[]; guid?: string }): string {
    if (Array.isArray(item.link)) {
        return item.link[0] ?? "#";
    }

    return item.link ?? item.guid ?? "#";
}

function getArticleSource(item: Record<string, unknown>): string {
    const directSource =
        (item.source as { title?: string } | undefined)?.title ??
        (item.creator as string | undefined) ??
        (item["dc:creator"] as string | undefined) ??
        "Yahoo Finance";

    if (typeof directSource === "string" && directSource.trim()) {
        return directSource.trim();
    }

    try {
        const parsed = new URL(getArticleLink(item as { link?: string | string[]; guid?: string }));
        return parsed.hostname.replace(/^www\./, "");
    } catch {
        return "Yahoo Finance";
    }
}

function getImageUrl(item: Record<string, unknown>): string | undefined {
    const mediaContent = item["media:content"] as { $?: { url?: string }; url?: string } | undefined;
    const mediaThumbnail = item["media:thumbnail"] as { $?: { url?: string }; url?: string } | undefined;
    const enclosure = item.enclosure as { url?: string } | undefined;

    const candidates = [
        mediaContent?.$?.url,
        mediaContent?.url,
        mediaThumbnail?.$?.url,
        mediaThumbnail?.url,
        enclosure?.url,
    ];

    const imageUrl = candidates.find((candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0);

    return imageUrl;
}

function inferCategory(title: string, fallbackCategory: FeedCategory): MarketNewsItem["category"] {
    const normalized = title.toLowerCase();
    const economyKeywords = /fed|inflation|rate|rates|treasury|gdp|jobs|recession|economy|macro|central bank|consumer|labour/i;

    if (economyKeywords.test(normalized)) {
        return "Economy";
    }

    return fallbackCategory;
}

function normalizeItem(item: Record<string, unknown>, fallbackCategory: FeedCategory): MarketNewsItem {
    const title = stripHtml((item.title as string | undefined) ?? "Market update");
    const description = stripHtml(
        (item.contentSnippet as string | undefined) ??
        (item.summary as string | undefined) ??
        (item.description as string | undefined) ??
        (item["content:encoded"] as string | undefined) ??
        "Latest market coverage and analysis.",
    );

    const publishedAt = new Date(
        (item.isoDate as string | undefined) ??
        (item.pubDate as string | undefined) ??
        new Date().toISOString(),
    );

    const link = getArticleLink(item as { link?: string | string[]; guid?: string });

    return {
        id: `${fallbackCategory}-${link}-${publishedAt.toISOString()}`,
        title,
        summary: description || "Latest market coverage and analysis.",
        link,
        source: getArticleSource(item),
        publishedAt: publishedAt.toISOString(),
        category: inferCategory(title, fallbackCategory),
        imageUrl: getImageUrl(item),
    };
}

async function fetchFeedItems(category: FeedCategory, url: string): Promise<MarketNewsItem[]> {
    try {
        const response = await fetch(url, {
            next: { revalidate },
            headers: {
                Accept: "application/rss+xml, application/xml, text/xml, */*",
                "User-Agent": "Mozilla/5.0",
            },
        });

        if (!response.ok) {
            return [];
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);

        return (feed.items ?? [])
            .slice(0, 12)
            .map((item) => normalizeItem(item as unknown as Record<string, unknown>, category));
    } catch {
        return [];
    }
}

export async function getMarketNews(): Promise<MarketNewsItem[]> {
    const results = await Promise.all(FEED_CONFIG.map(({ category, url }) => fetchFeedItems(category, url)));

    return results
        .flat()
        .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
        .slice(0, 24);
}

export async function getMarketNewsByCategory(category: MarketNewsItem["category"]): Promise<MarketNewsItem[]> {
    const allNews = await getMarketNews();

    if (category === "Economy") {
        return allNews.filter((item) => item.category === "Economy");
    }

    return allNews.filter((item) => item.category === category);
}
