import { supabaseConfig } from "@/lib/supabase";

export function CommentThread({ slug, title }: { slug: string; title: string }) {
    const isEnabled = supabaseConfig.isConfigured;

    return (
        <section aria-labelledby="comments-heading" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <h2 id="comments-heading" className="text-2xl font-semibold tracking-tight text-slate-900">Comments</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                    {isEnabled ? "Live" : "Pending"}
                </span>
            </div>

            {isEnabled ? (
                <div className="mt-6 space-y-4">
                    <form className="space-y-3">
                        <label htmlFor={`comment-${slug}`} className="block text-sm font-medium text-slate-700">
                            Join the conversation
                        </label>
                        <textarea
                            id={`comment-${slug}`}
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none"
                            placeholder="Share a technical perspective on this article..."
                        />
                        <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                            Post comment
                        </button>
                    </form>
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                    Comments are disabled until the Supabase environment variables and database tables are configured for {title}. This keeps the deployment secure and avoids exposing secrets or pretending the commenting system is live.
                </div>
            )}
        </section>
    );
}
