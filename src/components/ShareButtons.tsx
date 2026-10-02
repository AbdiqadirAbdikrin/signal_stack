"use client";

import Link from "next/link";

export function ShareButtons({ title, url }: { title: string; url: string }) {
    const shareMessage = encodeURIComponent(`${title} via Signal Stack`);

    const buttons = [
        {
            label: "X",
            href: `https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodeURIComponent(url)}`,
        },
        {
            label: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            label: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            label: "Copy link",
            href: `#`,
        },
    ];

    return (
        <div className="flex items-center gap-3 pt-6">
            <span className="text-sm font-medium text-slate-700">Share:</span>
            {buttons.map((button) => {
                if (button.label === "Copy link") {
                    return (
                        <button
                            key={button.label}
                            type="button"
                            onClick={() => navigator.clipboard.writeText(url)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            Copy link
                        </button>
                    );
                }

                return (
                    <Link
                        key={button.label}
                        href={button.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        {button.label}
                    </Link>
                );
            })}
        </div>
    );
}
