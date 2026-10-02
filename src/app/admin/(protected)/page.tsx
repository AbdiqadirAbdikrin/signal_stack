import Link from "next/link";

const dashboardCards = [
    {
        title: "Posts",
        description: "Create, review, and publish editorial content.",
        href: "/admin/articles",
    },
    {
        title: "Categories",
        description: "Organize the publication by topic and audience.",
        href: "/admin/articles",
    },
    {
        title: "Settings",
        description: "Keep the publication stable, polished, and current.",
        href: "/admin",
    },
];

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <header className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Dashboard</p>
                <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-900">Overview</h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    Keep the publication moving with a clean editorial workflow for publishing, editing, and managing article categories.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Admin</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{card.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
