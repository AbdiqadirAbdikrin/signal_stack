import Link from "next/link";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                        {item.href ? (
                            <Link href={item.href} className="transition hover:text-slate-900">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page">{item.label}</span>
                        )}
                        {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
