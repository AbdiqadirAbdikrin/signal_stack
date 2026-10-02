import type { MetadataRoute } from "next";

import { authorMap } from "@/content/authors";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts();
    const marketRoutes = [
        "/markets",
        "/markets/stocks",
        "/markets/crypto",
        "/markets/forex",
        "/markets/fintech",
        "/markets/trading-technology",
        "/markets/market-data",
        "/markets/stocks/aapl",
        "/markets/crypto/btc",
        "/markets/forex/eur-usd",
    ];
    const tagSet = new Set(posts.flatMap((post) => post.tags));
    const authorRoutes = Object.values(authorMap).map((author) => `/authors/${author.slug}`);

    const staticRoutes = ["", "/blog", "/about", "/search", ...marketRoutes, ...authorRoutes].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: route.includes("markets") ? ("weekly" as const) : ("daily" as const),
        priority: route === "" ? 1 : 0.8,
    }));

    const categoryRoutes = ["ai", "cloud", "devops", "development"].map((category) => ({
        url: `${siteConfig.url}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const tagRoutes = [...tagSet].map((tag) => ({
        url: `${siteConfig.url}/tags/${tag.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    const articleRoutes = posts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "weekly" as const,
        priority: post.featured ? 0.9 : 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...articleRoutes];
}
