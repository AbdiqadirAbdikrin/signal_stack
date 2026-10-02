"use client";

import { supabaseConfig } from "@/lib/supabase";

export function ArticleActions({ slug, title }: { slug: string; title: string }) {
    const isEnabled = supabaseConfig.isConfigured;

    return (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={!isEnabled}
                    aria-label={`Like article ${title}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${isEnabled
                            ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                >
                    <span aria-hidden="true">♥</span>
                    {isEnabled ? "Like article" : "Sign in to like"}
                </button>

                <button
                    type="button"
                    disabled={!isEnabled}
                    aria-label={`Save article ${title}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${isEnabled
                            ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                >
                    <span aria-hidden="true">🔖</span>
                    {isEnabled ? "Save article" : "Save unavailable"}
                </button>
            </div>

            {!isEnabled ? (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Like and save features are available once Supabase authentication and database schema are configured for {slug}.
                </p>
            ) : null}
        </div>
    );
}
