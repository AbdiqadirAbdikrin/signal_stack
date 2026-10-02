import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleActions } from "@/components/ArticleActions";
import { ArticleContent } from "@/components/ArticleContent";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CommentThread } from "@/components/CommentThread";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import { extractToc, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { formatDate, siteConfig } from "@/lib/site";
import { buildArticleMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

/**
 * Serializes a value as JSON for embedding inside a `<script>` element.
 *
 * A raw `JSON.stringify` is unsafe here because it does not escape `<`, so a value
 * containing `</script>` would terminate the element early and let the remainder be
 * parsed as live markup. Escaping every `<` as the equivalent JSON escape keeps the
 * payload valid JSON for consumers while guaranteeing no `<` can appear literally in
 * the output, so the script element cannot be closed from within the data.
 */
function serializeJsonLdForScript(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {};
    }

    return buildArticleMetadata(post);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const toc = extractToc(post.content);
    const relatedPosts = await getRelatedPosts(post);
    const articleUrl = `${siteConfig.url}/blog/${post.slug}`;

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.category },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: post.image,
        author: {
            "@type": "Person",
            name: "Signal Stack Editorial",
        },
        publisher: {
            "@type": "Organization",
            name: "Signal Stack",
        },
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        articleSection: post.category,
        keywords: post.tags.join(", "),
        breadcrumb: buildBreadcrumbJsonLd(
            breadcrumbs.map((item) => ({ label: item.label, url: item.href ?? articleUrl })),
        ),
    };

    return (
        <article className="min-h-screen bg-[#020817] text-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLdForScript(jsonLd) }}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                        {breadcrumbs.map((item, index) => (
                            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                                {index > 0 ? <span aria-hidden="true">/</span> : null}
                                {item.href ? (
                                    <Link href={item.href} className="transition hover:text-sky-300">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-slate-200">{item.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <CategoryBadge category={post.category} />
                    </div>

                    <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{post.description}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
                        <span>Signal Stack Editorial</span>
                        <span>{formatDate(post.date)}</span>
                        <span>{post.readingTime} min read</span>
                    </div>
                </div>

                <div className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950/80">
                    <div className="relative aspect-[16/9]">
                        <Image
                            src={post.image}
                            alt={post.imageAlt ?? post.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
                    <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">In this story</p>
                            <div className="mt-4">
                                <TableOfContents items={toc} />
                            </div>
                        </div>
                    </aside>

                    <div className="order-1 max-w-none lg:order-2">
                        <div className="article-shell rounded-[28px] border border-slate-800 bg-slate-950/60 p-4 sm:p-6 lg:p-8">
                            <div className="article-prose mx-auto max-w-3xl">
                                <ArticleContent source={post.content} />
                            </div>
                        </div>
                    </div>

                    <aside className="order-3 space-y-5 lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Story details</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                <li><span className="font-medium text-white">Published:</span> {formatDate(post.date)}</li>
                                <li><span className="font-medium text-white">Updated:</span> {post.updated ? formatDate(post.updated) : "Not yet updated"}</li>
                                <li><span className="font-medium text-white">Read time:</span> {post.readingTime} min</li>
                                <li><span className="font-medium text-white">Category:</span> {post.category}</li>
                            </ul>
                        </div>

                        <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Topics</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-500 hover:text-sky-300">
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <ShareButtons title={post.title} url={articleUrl} />
                        <ArticleActions slug={post.slug} title={post.title} />
                    </aside>
                </div>

                <div className="mx-auto mt-16 max-w-7xl space-y-10">
                    <RelatedPosts posts={relatedPosts} />
                    <CommentThread slug={post.slug} title={post.title} />
                </div>
            </div>
        </article>
    );
}
