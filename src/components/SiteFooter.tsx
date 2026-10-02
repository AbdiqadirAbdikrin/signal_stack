import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr] lg:px-8">
                <div>
                    <div className="text-lg font-semibold text-slate-900">{siteConfig.name}</div>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                        A technology publication for practical guidance on AI, cloud architecture, DevOps workflows, and modern software engineering.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Sections</h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        <li><Link href="/blog" className="hover:text-slate-900">Blog</Link></li>
                        <li><Link href="/category/ai" className="hover:text-slate-900">AI</Link></li>
                        <li><Link href="/category/cloud" className="hover:text-slate-900">Cloud</Link></li>
                        <li><Link href="/markets" className="hover:text-slate-900">Markets</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Company</h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
                        <li><Link href="/rss.xml" className="hover:text-slate-900">RSS</Link></li>
                        <li><Link href="/search" className="hover:text-slate-900">Search</Link></li>
                        <li><Link href="/saved" className="hover:text-slate-900">Saved</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Connect</h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        <li><a href={siteConfig.social.x} target="_blank" rel="noreferrer noopener">X / Twitter</a></li>
                        <li><a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a></li>
                        <li><a href={siteConfig.social.github} target="_blank" rel="noreferrer noopener">GitHub</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
