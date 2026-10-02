import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSanitize from "rehype-sanitize";

import { CodeBlock } from "@/components/CodeBlock";

/**
 * Compile options for article content.
 *
 * `next-mdx-remote` evaluates compiled MDX through a `Function` constructor, so these
 * settings are pinned explicitly rather than left to the library defaults:
 *
 * - `blockJS: true` removes `{expression}` nodes before compilation.
 * - `blockDangerousJS: true` keeps the library's blocklist for dangerous globals.
 * - `useDynamicImport: false` keeps the plugin that strips `import`/`export` active.
 *
 * `rehype-sanitize` then applies the default (GitHub-style) schema to the resulting
 * hast tree, which permits the HTML elements the components map above is keyed on
 * (headings, paragraphs, links, lists, code, blockquotes, tables, images) while
 * discarding script-bearing or otherwise dangerous raw markup. Custom authoring is
 * limited to markdown; no app-level `eval`/`Function`/dynamic import is introduced.
 */
const mdxOptions = {
    blockJS: true,
    blockDangerousJS: true,
    mdxOptions: {
        useDynamicImport: false,
        rehypePlugins: [rehypeSanitize],
    },
};

const components = {
    h2: ({ children }: { children: React.ReactNode }) => (
        <h2 className="mt-12 scroll-mt-28 text-[clamp(1.9rem,1.8vw+1.05rem,2.2rem)] font-bold tracking-[-0.04em] text-[var(--heading)]">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
        <h3 className="mt-8 scroll-mt-28 text-[clamp(1.45rem,1.5vw+0.8rem,1.7rem)] font-bold tracking-[-0.04em] text-[var(--heading)]">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
        <h4 className="mt-8 scroll-mt-28 text-[clamp(1.2rem,1vw+0.75rem,1.45rem)] font-bold tracking-[-0.04em] text-[var(--heading)]">{children}</h4>
    ),
    p: ({ children }: { children: React.ReactNode }) => <p className="mt-0 text-[1.0625rem] leading-[1.8] text-[var(--article-body)]">{children}</p>,
    a: ({ children, href }: { children: React.ReactNode; href?: string }) => (
        <a href={href} className="font-medium text-[var(--link)] underline decoration-[var(--link)]/40 underline-offset-[0.2em] transition hover:text-[var(--link-hover)]">
            {children}
        </a>
    ),
    ul: ({ children }: { children: React.ReactNode }) => <ul className="mt-6 list-disc space-y-3 pl-6 text-[var(--article-body)]">{children}</ul>,
    ol: ({ children }: { children: React.ReactNode }) => <ol className="mt-6 list-decimal space-y-3 pl-6 text-[var(--article-body)]">{children}</ol>,
    li: ({ children }: { children: React.ReactNode }) => <li className="leading-[1.8]">{children}</li>,
    blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="mt-8 rounded-r-2xl border-l-4 border-[var(--accent)] bg-[var(--page-surface-alt)] px-5 py-4 text-[var(--text-secondary)]">{children}</blockquote>
    ),
    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
        const isInline = !className;

        if (isInline) {
            return <code className="rounded-md bg-[var(--page-surface-alt)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--heading)]">{children}</code>;
        }

        return <code className={className}>{children}</code>;
    },
    pre: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <CodeBlock className={className}>{children}</CodeBlock>
    ),
    hr: () => <hr className="my-10 border-[var(--page-border)]" />,
    table: ({ children }: { children: React.ReactNode }) => (
        <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-[1rem] text-[var(--article-body)]">{children}</table>
        </div>
    ),
    th: ({ children }: { children: React.ReactNode }) => <th className="border border-[var(--page-border)] bg-[var(--page-surface-alt)] px-3 py-2 font-semibold text-[var(--heading)]">{children}</th>,
    td: ({ children }: { children: React.ReactNode }) => <td className="border border-[var(--page-border)] px-3 py-2">{children}</td>,
};

export function ArticleContent({ source }: { source: string }) {
    return (
        <div className="article-prose">
            <MDXRemote source={source} components={components} options={mdxOptions} />
        </div>
    );
}
