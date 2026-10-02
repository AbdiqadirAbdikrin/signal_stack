import { notFound, redirect } from "next/navigation";

import { ArticleAdminForm } from "@/components/ArticleAdminForm";
import { getArticleSession } from "@/lib/article-auth";
import { getArticleById } from "@/lib/articles";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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
                    <p className="text-sm font-semibold uppercase tracking-[0.14em]">Setup required</p>
                    <h1 className="mt-3 text-3xl font-bold">Supabase must be configured to edit articles.</h1>
                </div>
            </div>
        );
    }

    const article = await getArticleById(id);

    if (!article) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Admin</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Edit article</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <ArticleAdminForm article={article} mode="edit" />
            </div>
        </div>
    );
}
