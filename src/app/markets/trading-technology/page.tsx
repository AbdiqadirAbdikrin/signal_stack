import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Trading Technology",
    description: "Execution systems, algorithmic trading, and the engineering behind low-latency market access.",
};

const topics = [
    { title: "Execution Systems", description: "Order routing, matching logic, and trade lifecycle management across venues." },
    { title: "Latency & Infrastructure", description: "Network design, event streaming, and the systems that reduce operational delay." },
    { title: "Strategy Tooling", description: "Analytics, signal generation, and model assessment for modern digital trading teams." },
    { title: "Market Connectivity", description: "Direct feeds, APIs, protocols, and the architecture that shapes access to liquidity." },
];

export default function TradingTechnologyPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Trading Technology</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Execution architecture and market access systems</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                This section explores trade execution, strategy tooling, market connectivity, and the software design decisions that shape modern trading operations.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {topics.map((topic) => (
                    <div key={topic.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h2 className="text-xl font-semibold text-slate-900">{topic.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{topic.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <Link href="/markets" className="text-sm font-medium text-slate-700 hover:text-slate-900">Back to the Markets overview</Link>
            </div>
        </main>
    );
}
