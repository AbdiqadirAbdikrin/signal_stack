import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { authorMap } from "@/content/authors";
import { getPostsByAuthor } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return Object.keys(authorMap).map((author) => ({ author }));
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
    const { author } = await params;
    const authorDetails = authorMap[author];

    if (!authorDetails) {
        notFound();
    }

    const posts = await getPostsByAuthor(author);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">{authorDetails.name}</h1>
                <p className="mt-3 text-lg text-slate-600">{authorDetails.title}</p>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">{authorDetails.bio}</p>
            </header>

            <div className="mt-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Articles by {authorDetails.name}</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <Link href="/blog" className="text-sm font-medium text-slate-700 hover:text-slate-900">Back to blog</Link>
            </div>
        </main>
    );
}
