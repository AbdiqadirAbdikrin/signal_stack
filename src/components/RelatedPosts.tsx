import Link from "next/link";

import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDate } from "@/lib/site";
import type { Post } from "@/types/blog";

export function RelatedPosts({ posts }: { posts: Post[] }) {
    if (!posts.length) return null;

    return (
        <section aria-labelledby="related-posts" className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h2 id="related-posts" className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    Related articles
                </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.slug} className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5 transition hover:border-sky-500/40">
                        <div className="mb-3">
                            <CategoryBadge category={post.category} />
                        </div>
                        <h3 className="text-lg font-semibold leading-6 text-white">
                            <Link href={`/blog/${post.slug}`} className="transition hover:text-sky-300">
                                {post.title}
                            </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{post.description}</p>
                        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-slate-400">{formatDate(post.date)}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
