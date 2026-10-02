import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { getPostsByTag } from "@/lib/content";

export async function generateStaticParams() {
    const tags = ["kubernetes", "containers", "terraform", "rag", "llms", "devops", "ai-agents", "cloudformation"];
    return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const posts = await getPostsByTag(tag);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Tag</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">#{tag}</h1>
            </header>

            {posts.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
                    No posts match this tag yet.
                </div>
            )}

            <div className="mt-10">
                <Link href="/blog" className="text-sm font-medium text-slate-700 hover:text-slate-900">Browse all stories</Link>
            </div>
        </main>
    );
}
