import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "FinTech",
    description: "Financial technology, payments, banking software, infrastructure, and digital transformation in finance.",
};

const themes = [
    { title: "Payments", description: "Card rails, settlement paths, and the infrastructure behind digital transactions." },
    { title: "Banking Software", description: "Core systems, account access layers, and modernization strategies in financial services." },
    { title: "Fraud & Risk", description: "Signal analysis, trust systems, and controls that protect transaction flows." },
    { title: "Open Finance", description: "API-driven financial products connecting banks, providers, and software ecosystems." },
];

export default function FinTechPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">FinTech</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Financial software, payments, and platform infrastructure</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                FinTech reporting focuses on the systems behind payments, fraud prevention, digital banking, open finance APIs, and the operational layers that move money safely and reliably.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {themes.map((theme) => (
                    <div key={theme.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h2 className="text-xl font-semibold text-slate-900">{theme.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{theme.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <Link href="/markets" className="text-sm font-medium text-slate-700 hover:text-slate-900">Back to the Markets overview</Link>
            </div>
        </main>
    );
}
