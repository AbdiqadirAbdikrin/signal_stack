"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/types/blog";

export function TableOfContents({ items }: { items: TocItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const headings = Array.from(document.querySelectorAll("h2[id], h3[id], h4[id]"));

        if (!headings.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry) {
                    setActiveId(visibleEntry.target.id);
                }
            },
            {
                rootMargin: "-10% 0% -65% 0%",
                threshold: [0.2, 0.5, 1],
            },
        );

        headings.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [items]);

    if (!items.length) {
        return null;
    }

    const tocMarkup = (
        <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface-alt)] p-4 shadow-sm">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Table of contents</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {items.map((item) => (
                    <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 0.75}rem` }}>
                        <a
                            href={`#${item.id}`}
                            className={`block rounded-xl px-2.5 py-1.5 text-left transition ${activeId === item.id
                                    ? "bg-[var(--accent-soft)] font-medium text-[var(--heading)]"
                                    : "hover:bg-[var(--page-surface)] hover:text-[var(--heading)]"
                                }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <div className="hidden lg:block">{tocMarkup}</div>
            <details className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface-alt)] p-3 shadow-sm lg:hidden" open>
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--heading)]">Table of contents</summary>
                <div className="mt-3">{tocMarkup}</div>
            </details>
        </>
    );
}
