import { redirect } from "next/navigation";

import { ArticleAdminForm } from "@/components/ArticleAdminForm";
import { getArticleSession } from "@/lib/article-auth";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export default async function NewArticlePage() {
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
                    <h1 className="mt-3 text-3xl font-bold">Supabase must be configured to add articles.</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Admin</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Create Post</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <ArticleAdminForm mode="create" />
            </div>
        </div>
    );
}
