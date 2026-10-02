import Link from "next/link";

import { normalizeSlug } from "@/lib/site";

export function CategoryBadge({ category }: { category: string }) {
    return (
        <Link
            href={`/category/${normalizeSlug(category)}`}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
        >
            {category}
        </Link>
    );
}
