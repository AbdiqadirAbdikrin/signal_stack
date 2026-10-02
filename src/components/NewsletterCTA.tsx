"use client";

import { useState } from "react";

const isBackendConfigured = false;

export function NewsletterCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error" | "unavailable">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setStatus("error");
            setMessage("Enter a valid email address to subscribe.");
            return;
        }

        if (!isBackendConfigured) {
            setStatus("unavailable");
            setMessage("Newsletter delivery is not configured yet. Add an email provider in the environment to enable sign-ups.");
            return;
        }

        setStatus("success");
        setMessage("Thanks for signing up. Your first issue will arrive soon.");
        setEmail("");
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">Newsletter</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Architecture notes and practical engineering insight.
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="sr-only" htmlFor="newsletter-email">
                        Email address
                    </label>
                    <input
                        id="newsletter-email"
                        name="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
                        aria-invalid={status === "error"}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-400"
                    >
                        Subscribe
                    </button>
                    {message ? (
                        <p className={`text-sm ${status === "success" ? "text-emerald-300" : status === "error" ? "text-red-300" : "text-sky-200"}`}>
                            {message}
                        </p>
                    ) : null}
                </form>
            </div>
        </section>
    );
}
