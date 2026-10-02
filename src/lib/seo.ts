import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import type { Post } from "@/types/blog";

export function absoluteUrl(pathname: string): string {
    return new URL(pathname, siteConfig.url).toString();
}

export function buildArticleMetadata(post: Post): Metadata {
    const url = absoluteUrl(`/blog/${post.slug}`);

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url,
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.updated ?? post.date,
            images: [{ url: post.image, alt: post.imageAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [post.image],
        },
    };
}

export function buildOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: Object.values(siteConfig.social),
    };
}

export function buildWebSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
    };
}

export function buildBreadcrumbJsonLd(items: { label: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: item.url,
        })),
    };
}
