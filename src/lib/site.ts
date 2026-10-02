export const siteConfig = {
    name: "Signal Stack",
    shortName: "Signal Stack",
    description:
        "A technology publication covering AI, cloud, DevOps, and software engineering with practical guidance for developers.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
    defaultImage:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    email: "hello@signalstack.dev",
    social: {
        x: "https://x.com/signalstack",
        github: "https://github.com/signalstack",
        linkedin: "https://www.linkedin.com/company/signalstack",
    },
};

export const categoryOrder = ["AI", "Cloud", "DevOps", "Development"] as const;

export const techNavigation = [
    { href: "/tech/ai", label: "AI" },
    { href: "/tech/cloud", label: "Cloud" },
    { href: "/tech/devops", label: "DevOps" },
    { href: "/tech/development", label: "Development" },
    { href: "/tech/cybersecurity", label: "Cybersecurity" },
    { href: "/tech/software-gadgets", label: "Software & Gadgets" },
] as const;

export const marketNavigation = [
    { href: "/markets/stocks", label: "Stocks" },
    { href: "/markets/crypto", label: "Crypto" },
    { href: "/markets/forex", label: "Forex" },
    { href: "/markets/fintech", label: "FinTech" },
    { href: "/markets/trading-technology", label: "Trading Technology" },
    { href: "/markets/market-data", label: "Market Data" },
] as const;

export function normalizeSlug(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function getCategoryBySlug(slug: string): string | undefined {
    const normalized = normalizeSlug(slug);
    const categoryMap: Record<string, string> = {
        ai: "AI",
        cloud: "Cloud",
        devops: "DevOps",
        development: "Development",
        markets: "Markets",
    };

    return categoryMap[normalized];
}

export function formatDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export function readingTimeForContent(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.ceil(words / 220));
}

export function createSeoDescription(description: string): string {
    return description.length > 160
        ? `${description.slice(0, 157).trim()}...`
        : description;
}

export function buildArticleUrl(slug: string): string {
    return `/blog/${slug}`;
}
