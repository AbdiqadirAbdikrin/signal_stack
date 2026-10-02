import Link from "next/link";

import { techNavigation } from "@/lib/site";

export const metadata = {
    title: "Technology",
    description: "Explore Signal Stack coverage across AI, cloud, DevOps, development, cybersecurity, and software engineering.",
};

export default function TechOverviewPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Tech</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Technology coverage for builders</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Signal Stack covers the systems, practices, and tradeoffs behind modern software, infrastructure, security, and AI engineering.
                </p>
            </header>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {techNavigation.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-slate-300 hover:bg-white"
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-700">Topic</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{item.label}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.label === "AI" && "LLMs, retrieval, agents, and decision-making systems."}
                            {item.label === "Cloud" && "Architecture, AWS, Azure, resilience, and platform design."}
                            {item.label === "DevOps" && "Kubernetes, GitOps, automation, and delivery systems."}
                            {item.label === "Development" && "APIs, TypeScript, Python, tooling, and day-to-day engineering."}
                            {item.label === "Cybersecurity" && "Modern security patterns, trust boundaries, and defensive systems."}
                            {item.label === "Software & Gadgets" && "Tools, workflows, hardware, and developer productivity."}
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
