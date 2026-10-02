"use client";

import { useRouter } from "next/navigation";

export function AdminShell({ email }: { email?: string | null }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 sm:flex sm:items-center sm:gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                    {email?.trim().charAt(0)?.toUpperCase() ?? "A"}
                </span>
                <span className="max-w-[10rem] truncate">{email ?? "Admin"}</span>
            </div>

            <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
                Logout
            </button>
        </div>
    );
}
