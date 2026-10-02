import Link from "next/link";
import { redirect } from "next/navigation";

import { ArticleAdminTable } from "@/components/ArticleAdminTable";
import { getArticleSession } from "@/lib/article-auth";
import { getArticles } from "@/lib/articles";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export default async function AdminArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; status?: string; page?: string }>;
}) {
    const params = await searchParams;
    const session = await getArticleSession();

    if (!session.isAuthenticated) {
        redirect("/admin/login");
    }

    if (!session.isOwner) {
        redirect("/blog");
    }

    if (!isSupabaseConfigured()) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em]">Article database required</p>
                    <h1 className="mt-3 text-3xl font-bold">Set up Supabase to enable article management.</h1>
                    <p className="mt-4 text-sm leading-6 text-amber-800">
                        Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to your environment, then run the migration in <strong>supabase/migrations/001_create_articles_table.sql</strong>.
                    </p>
                </div>
            </div>
        );
    }

    const query = params.search ?? "";
    const category = params.category ?? "";
    const status = (params.status ?? "all") as "all" | "draft" | "published";
    const currentPage = Number(params.page ?? "1");

    const { articles, count, page, pageSize } = await getArticles({
        search: query,
        category: category || undefined,
        status,
        page: currentPage,
        pageSize: 10,
    });

    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Admin</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Article management</h1>
                </div>

                <Link href="/admin/articles/new" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
                    + Create Post
                </Link>
            </div>

            <form method="GET" className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="space-y-2 md:col-span-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Search</span>
                        <input
                            name="search"
                            defaultValue={query}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none"
                            placeholder="Search title or content"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Category</span>
                        <select
                            name="category"
                            defaultValue={category}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none"
                        >
                            <option value="">All categories</option>
                            <option value="AI">AI</option>
                            <option value="Cloud">Cloud</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Development">Development</option>
                        </select>
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</span>
                        <select
                            name="status"
                            defaultValue={status}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none"
                        >
                            <option value="all">All statuses</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                    <a href="/admin/articles" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        Reset
                    </a>
                    <button type="submit" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500">
                        Apply filters
                    </button>
                </div>
            </form>

            <div className="mb-4 text-sm text-slate-600">
                Showing {articles.length} of {count} articles • Page {page} of {totalPages}
            </div>

            <ArticleAdminTable articles={articles} />

            {count > pageSize ? (
                <div className="mt-6 flex items-center justify-between">
                    <a
                        href={`/admin/articles?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&page=${Math.max(1, page - 1)}`}
                        className={`rounded-full border border-slate-200 px-4 py-2 text-sm font-medium ${page <= 1 ? "pointer-events-none opacity-40" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                        Previous
                    </a>
                    <a
                        href={`/admin/articles?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&page=${Math.min(totalPages, page + 1)}`}
                        className={`rounded-full border border-slate-200 px-4 py-2 text-sm font-medium ${page >= totalPages ? "pointer-events-none opacity-40" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                        Next
                    </a>
                </div>
            ) : null}
        </div>
    );
}
