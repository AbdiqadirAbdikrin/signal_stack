"use client";

import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/placeholders/tech-default.svg";

export function FeaturedStoryCard({
    title,
    description,
    image,
    imageAlt,
    href,
    category,
}: {
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    href: string;
    category?: string;
}) {
    const resolvedImage = image && image.trim().length > 0 ? image : FALLBACK_IMAGE;

    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Featured story</span>
                {category ? (
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                        {category}
                    </span>
                ) : null}
            </div>

            <div className="relative h-52 overflow-hidden rounded-2xl bg-slate-900">
                <Image
                    src={resolvedImage}
                    alt={imageAlt || title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    onError={(event) => {
                        const target = event.currentTarget as HTMLImageElement;
                        const fallbackUrl = new URL(FALLBACK_IMAGE, window.location.origin).toString();

                        if (target.currentSrc !== fallbackUrl && target.src !== fallbackUrl) {
                            target.src = fallbackUrl;
                        }
                    }}
                />
            </div>

            <div className="mt-5 space-y-3">
                <Link href={href} className="block text-2xl font-semibold tracking-tight text-slate-900 transition hover:text-sky-700">
                    {title}
                </Link>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
            </div>
        </div>
    );
}
