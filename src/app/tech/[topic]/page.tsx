import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/content";

const topicConfig = {
    ai: {
        label: "AI",
        description: "LLMs, retrieval systems, AI agents, and practical model-driven workflows.",
        category: "AI",
    },
    cloud: {
        label: "Cloud",
        description: "Cloud architecture, platform decisions, and resilient systems design.",
        category: "Cloud",
    },
    devops: {
        label: "DevOps",
        description: "Delivery pipelines, Kubernetes, automation, and operational control.",
        category: "DevOps",
    },
    development: {
        label: "Development",
        description: "Software craftsmanship, APIs, tooling, and engineering workflows.",
        category: "Development",
    },
    cybersecurity: {
        label: "Cybersecurity",
        description: "Security fundamentals, engineering controls, and risk-aware system design.",
        category: "Cybersecurity",
    },
    "software-gadgets": {
        label: "Software & Gadgets",
        description: "Developer tooling, productivity, and the devices shaping modern work.",
        category: "Software & Gadgets",
    },
} as const;

export async function generateStaticParams() {
    return Object.keys(topicConfig).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    const topicData = topicConfig[topic as keyof typeof topicConfig];

    if (!topicData) {
        return { title: "Technology topic" };
    }

    return {
        title: topicData.label,
        description: topicData.description,
    };
}

export default async function TechTopicPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    const topicData = topicConfig[topic as keyof typeof topicConfig];

    if (!topicData) {
        notFound();
    }

    const posts = (await getAllPosts()).filter((post) => post.category === topicData.category);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Tech</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{topicData.label}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{topicData.description}</p>
            </header>

            {posts.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
                    No stories are published in this topic yet. Explore the broader technology coverage or return to the Signal Stack homepage.
                </div>
            )}

            <div className="mt-10">
                <Link href="/tech" className="text-sm font-medium text-slate-700 hover:text-slate-900">Browse all technology topics</Link>
            </div>
        </main>
    );
}
