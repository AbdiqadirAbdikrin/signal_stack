"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function PublicLayout({
    children,
    session,
}: {
    children: ReactNode;
    session?: unknown;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <div className="flex min-h-screen flex-col">
            {!isAdminRoute ? <SiteHeader session={session as never} /> : null}
            <main id="content" className="flex-1">{children}</main>
            {!isAdminRoute ? <SiteFooter /> : null}
        </div>
    );
}
