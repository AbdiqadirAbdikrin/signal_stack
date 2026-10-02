import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/AdminShell";
import { getArticleSession } from "@/lib/article-auth";

const adminNavigation = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/articles", label: "Posts" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getArticleSession();

    if (!session.isAuthenticated) {
        redirect("/admin/login");
    }

    if (!session.isOwner) {
        redirect("/blog");
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Signal Stack</p>
                        <p className="text-lg font-semibold tracking-tight text-slate-900">Admin</p>
                    </div>

                    <nav aria-label="Admin navigation" className="hidden items-center gap-2 md:flex">
                        {adminNavigation.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <AdminShell email={session.email} />
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </div>
    );
}
