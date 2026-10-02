import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDate } from "@/lib/site";
import type { Author, Post } from "@/types/blog";

export function ArticleHeader({ post, author }: { post: Post; author: Author | null }) {
    return (
        <header className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge category={post.category} />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{post.readingTime} min read</span>
            </div>

            <div className="space-y-5">
                <h1 className="text-[clamp(2.5rem,3vw+1.2rem,3.1rem)] font-bold tracking-[-0.06em] text-[var(--heading)]">{post.title}</h1>
                <p className="max-w-3xl text-[1.125rem] leading-8 text-[var(--text-secondary)]">{post.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--page-border)] py-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-3">
                    {author ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-[var(--page-border)]">
                            <Image src={author.avatar} alt={author.name} fill sizes="40px" className="object-cover" />
                        </div>
                    ) : null}
                    <div>
                        <p className="font-medium text-[var(--heading)]">
                            {author ? (
                                <Link href={`/authors/${author.slug}`} className="hover:text-[var(--link)]">
                                    {author.name}
                                </Link>
                            ) : (
                                "Staff writer"
                            )}
                        </p>
                        <p>{formatDate(post.date)}</p>
                    </div>
                </div>

                {post.updated ? (
                    <p className="text-[var(--text-secondary)]">Updated {formatDate(post.updated)}</p>
                ) : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface-alt)] shadow-sm">
                <div className="relative aspect-[16/9]">
                    <Image src={post.image} alt={post.imageAlt} fill sizes="100vw" className="object-cover" priority />
                </div>
            </div>
        </header>
    );
}
