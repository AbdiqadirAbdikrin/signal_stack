import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { getPostsByCategory } from "@/lib/content";
import { getCategoryBySlug } from "@/lib/site";

export async function generateStaticParams() {
    return ["ai", "cloud", "devops", "development"].map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const resolved = getCategoryBySlug(category) ?? category;
    const posts = await getPostsByCategory(category);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Category</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{resolved}</h1>
            </header>

            {posts.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
                    No stories have been published in this category yet.
                </div>
            )}

            <div className="mt-10">
                <Link href="/blog" className="text-sm font-medium text-slate-700 hover:text-slate-900">Browse all stories</Link>
            </div>
        </main>
    );
}
