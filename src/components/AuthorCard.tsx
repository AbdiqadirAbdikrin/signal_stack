import Image from "next/image";
import Link from "next/link";

import type { Author } from "@/types/blog";

export function AuthorCard({ author }: { author: Author }) {
    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{author.name}</h3>
                    <p className="text-sm text-slate-500">{author.title}</p>
                </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">{author.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                {author.website ? (
                    <Link href={author.website} target="_blank" rel="noreferrer noopener" className="rounded-full border border-slate-200 px-2.5 py-1.5">
                        Website
                    </Link>
                ) : null}
                {author.linkedin ? (
                    <Link href={author.linkedin} target="_blank" rel="noreferrer noopener" className="rounded-full border border-slate-200 px-2.5 py-1.5">
                        LinkedIn
                    </Link>
                ) : null}
                {author.github ? (
                    <Link href={author.github} target="_blank" rel="noreferrer noopener" className="rounded-full border border-slate-200 px-2.5 py-1.5">
                        GitHub
                    </Link>
                ) : null}
            </div>
        </aside>
    );
}
