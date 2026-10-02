'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ArticleRecord } from "@/types/articles";

const defaultForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Development",
    tags: "",
    featured_image: "",
    seo_title: "",
    seo_description: "",
    status: "draft" as "draft" | "published",
};

export function ArticleAdminForm({
    article,
    mode,
}: {
    article?: ArticleRecord | null;
    mode: "create" | "edit";
}) {
    const initialForm = article
        ? {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? "",
            content: article.content,
            category: article.category,
            tags: article.tags.join(", "),
            featured_image: article.featured_image ?? "",
            seo_title: article.seo_title ?? "",
            seo_description: article.seo_description ?? "",
            status: article.status,
        }
        : defaultForm;

    const router = useRouter();
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitArticle = async (nextStatus: "draft" | "published") => {
        setIsSubmitting(true);
        setError(null);

        const payload = {
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt,
            content: form.content,
            category: form.category,
            tags: form.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            featured_image: form.featured_image,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            status: nextStatus,
        };

        const url = mode === "create" ? "/api/articles" : `/api/articles/${article?.id ?? ""}`;
        const method = mode === "create" ? "POST" : "PATCH";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = (await response.json()) as { message?: string };

            if (!response.ok) {
                throw new Error(json.message ?? "Unable to save the article.");
            }

            router.push("/admin/articles");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Unable to save the article.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!article?.id) {
            return;
        }

        const confirmed = window.confirm("Delete this article permanently?");
        if (!confirmed) {
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/articles/${article.id}`, {
                method: "DELETE",
            });

            const json = (await response.json()) as { message?: string };

            if (!response.ok) {
                throw new Error(json.message ?? "Unable to delete the article.");
            }

            router.push("/admin/articles");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Unable to delete the article.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={(event) => {
            event.preventDefault();
            void submitArticle(form.status);
        }}>
            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Title</span>
                    <input
                        value={form.title}
                        onChange={(event) => handleChange("title", event.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="How AI teams ship faster APIs"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Slug</span>
                    <input
                        value={form.slug}
                        onChange={(event) => handleChange("slug", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="how-ai-teams-ship-faster-apis"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <select
                        value={form.status}
                        onChange={(event) => handleChange("status", event.target.value as "draft" | "published")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Category</span>
                    <input
                        value={form.category}
                        onChange={(event) => handleChange("category", event.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="AI"
                    />
                </label>

                <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Excerpt</span>
                    <textarea
                        value={form.excerpt}
                        onChange={(event) => handleChange("excerpt", event.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="A practical guide for engineering teams trying to move faster without sacrificing reliability."
                    />
                </label>

                <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Content (MDX)</span>
                    <textarea
                        value={form.content}
                        onChange={(event) => handleChange("content", event.target.value)}
                        required
                        rows={18}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="# Heading\n\nYour article content here."
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Tags</span>
                    <input
                        value={form.tags}
                        onChange={(event) => handleChange("tags", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="ai, devops, platform"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Featured image URL</span>
                    <input
                        value={form.featured_image}
                        onChange={(event) => handleChange("featured_image", event.target.value)}
                        type="url"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="https://images.unsplash.com/..."
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">SEO title</span>
                    <input
                        value={form.seo_title}
                        onChange={(event) => handleChange("seo_title", event.target.value)}
                        maxLength={60}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="Optional search title"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">SEO description</span>
                    <textarea
                        value={form.seo_description}
                        onChange={(event) => handleChange("seo_description", event.target.value)}
                        rows={3}
                        maxLength={160}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                        placeholder="Optional summary for search engines"
                    />
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {mode === "create" ? (
                    <>
                        <button type="button" disabled={isSubmitting} onClick={() => void submitArticle("draft")} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? "Saving..." : "Save Draft"}
                        </button>
                        <button type="button" disabled={isSubmitting} onClick={() => void submitArticle("published")} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                            Publish
                        </button>
                    </>
                ) : (
                    <>
                        <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? "Updating..." : "Update"}
                        </button>
                        <button type="button" disabled={isSubmitting} onClick={() => void submitArticle("published")} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                            Publish
                        </button>
                        <button type="button" disabled={isSubmitting} onClick={() => void submitArticle("draft")} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                            Unpublish
                        </button>
                        <button type="button" disabled={isSubmitting} onClick={handleDelete} className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
                            Delete
                        </button>
                    </>
                )}

                <a href="/admin/articles" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Cancel
                </a>
            </div>
        </form>
    );
}
