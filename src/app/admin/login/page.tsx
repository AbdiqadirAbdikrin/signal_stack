"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            nextErrors.email = "Email is required.";
        }

        if (!password) {
            nextErrors.password = "Password is required.";
        }

        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const payload = (await response.json()) as { message?: string };

            if (!response.ok) {
                throw new Error(payload.message ?? "Invalid email or password.");
            }

            router.push("/admin");
            router.refresh();
        } catch (error) {
            setErrors({
                form: error instanceof Error ? error.message : "Authentication failed.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="mb-8 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Editorial access</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Admin sign in</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Use your publication credentials to manage stories, categories, and publication settings.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="owner@signalstack.dev"
                            aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                placeholder="Enter password"
                                aria-invalid={Boolean(errors.password)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((current) => !current)}
                                className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 transition hover:text-slate-700"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
                    </div>

                    {errors.form ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.form}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <Link href="/blog" className="font-medium text-slate-700 transition hover:text-slate-900">
                        Return to publication
                    </Link>
                </div>
            </div>
        </main>
    );
}
