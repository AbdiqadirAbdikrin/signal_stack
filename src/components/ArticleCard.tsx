import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDate } from "@/lib/site";
import type { Post } from "@/types/blog";

export function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
    return (
        <article className={`group overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/70 transition duration-200 hover:border-sky-500/40 ${featured ? "lg:col-span-2" : ""}`}>
            <Link href={`/blog/${post.slug}`} className="block">
                <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-[16/11]"}`}>
                    <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                </div>
            </Link>

            <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    <CategoryBadge category={post.category} />
                    <span>{formatDate(post.date)}</span>
                </div>

                <div className="space-y-3">
                    <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className={`font-semibold tracking-[-0.03em] text-slate-50 transition group-hover:text-sky-300 ${featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"}`}>
                            {post.title}
                        </h3>
                    </Link>
                    <p className={`leading-6 text-slate-300 ${featured ? "text-base sm:text-lg" : "text-sm"}`}>
                        {post.description}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <span>Signal Stack</span>
                    <span>{post.readingTime} min read</span>
                </div>
            </div>
        </article>
    );
}
