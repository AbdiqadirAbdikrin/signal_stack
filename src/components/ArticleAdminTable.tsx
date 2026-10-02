'use client';

import Link from "next/link";

import type { ArticleRecord } from "@/types/articles";

export function ArticleAdminTable({
    articles,
}: {
    articles: ArticleRecord[];
}) {
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this article?");

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const payload = (await response.json()) as { message?: string };
                throw new Error(payload.message ?? "Unable to delete this article.");
            }

            window.location.reload();
        } catch (error) {
            window.alert(error instanceof Error ? error.message : "Unable to delete this article.");
        }
    };

    const handleStatusUpdate = async (id: string, status: "draft" | "published") => {
        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const payload = (await response.json()) as { message?: string };
                throw new Error(payload.message ?? "Unable to update this article.");
            }

            window.location.reload();
        } catch (error) {
            window.alert(error instanceof Error ? error.message : "Unable to update this article.");
        }
    };

    if (!articles.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
                No articles match the current filters.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Published</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Updated</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {articles.map((article) => (
                            <tr key={article.id} className="align-top">
                                <td className="px-4 py-4">
                                    <div className="font-semibold text-slate-900">{article.title}</div>
                                    <div className="mt-1 text-xs text-slate-500">/{article.slug}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {article.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">{article.category}</td>
                                <td className="px-4 py-4">{article.published_at ? new Date(article.published_at).toLocaleDateString() : "—"}</td>
                                <td className="px-4 py-4">{new Date(article.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-4">{new Date(article.updated_at).toLocaleDateString()}</td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Link href={`/blog/${article.slug}`} className="rounded-full border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                                            View
                                        </Link>
                                        <Link href={`/admin/articles/${article.id}/edit`} className="rounded-full border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                                            Edit
                                        </Link>
                                        {article.status !== "published" ? (
                                            <button type="button" onClick={() => handleStatusUpdate(article.id, "published")} className="rounded-full bg-sky-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-sky-500">
                                                Publish
                                            </button>
                                        ) : (
                                            <button type="button" onClick={() => handleStatusUpdate(article.id, "draft")} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100">
                                                Unpublish
                                            </button>
                                        )}
                                        <button type="button" onClick={() => handleDelete(article.id)} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
