"use client";

import { useState } from "react";

export function CodeBlock({ children, className, ...props }: React.ComponentPropsWithoutRef<"pre">) {
    const [copied, setCopied] = useState(false);

    const language = className?.replace("language-", "") ?? "code";
    const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="group relative mt-6 overflow-hidden rounded-2xl border border-[var(--page-border)] bg-[var(--code-surface)] shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900/90 px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-slate-300">
                <span>{language}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded border border-slate-600 bg-slate-800 px-2 py-1 font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
                    aria-label="Copy code block"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="overflow-x-auto p-4 text-[0.95rem] leading-7 text-[var(--code-text)]" {...props}>
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
}

