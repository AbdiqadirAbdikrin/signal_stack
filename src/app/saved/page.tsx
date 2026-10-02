import type { Metadata } from "next";

import { supabaseConfig } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Saved articles",
    description: "Saved reading list for Signal Stack articles.",
};

export default function SavedPage() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Saved</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Your saved reading list</h1>

            {!supabaseConfig.isConfigured ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-lg leading-8 text-slate-600">
                    Saved articles are available once Supabase authentication and the saved-articles table are configured.
                </div>
            ) : (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
                    Your saved list will appear here after authentication is enabled and the database is connected.
                </div>
            )}
        </main>
    );
}
