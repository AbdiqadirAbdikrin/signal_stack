"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { marketNavigation, siteConfig, techNavigation } from "@/lib/site";

const mainNavigation = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/tech", label: "Tech", type: "dropdown" as const },
    { href: "/markets", label: "Markets", type: "dropdown" as const },
    { href: "/business", label: "Business" },
    { href: "/about", label: "About" },
];

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
        </svg>
    );
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 text-black transition-transform ${open ? "rotate-180" : ""}`}
            style={{ color: "#000000" }}
            aria-hidden="true"
        >
            <path d="m5 7 5 5 5-5" />
        </svg>
    );
}

export function SiteHeader({ session }: { session?: unknown }) {
    void session;
    const navRef = useRef<HTMLElement | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<"tech" | "markets" | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const toggleDropdown = (menu: "tech" | "markets") => {
        setOpenDropdown((current) => (current === menu ? null : menu));
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-5 py-4">
                    <Link href="/" className="flex items-center gap-3" aria-label="Signal Stack home page">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                            S
                        </div>
                        <div>
                            <div className="text-lg font-semibold tracking-tight text-black" style={{ color: "#000000" }}>{siteConfig.name}</div>
                        </div>
                    </Link>

                    <nav ref={navRef} aria-label="Main navigation" className="hidden items-center lg:flex">
                        <ul className="flex items-center gap-5">
                            {mainNavigation.map((item) => {
                                if (item.type === "dropdown") {
                                    const isOpen = openDropdown === item.label.toLowerCase();
                                    const items = item.label === "Tech" ? techNavigation : marketNavigation;
                                    const menuId = `${item.label.toLowerCase()}-menu`;

                                    return (
                                        <li key={item.label} className="relative">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={menuId}
                                                aria-haspopup="menu"
                                                onClick={() => toggleDropdown(item.label.toLowerCase() as "tech" | "markets")}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-black transition hover:text-blue-600"
                                                style={{ color: "#000000" }}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronIcon open={isOpen} />
                                            </button>

                                            {isOpen ? (
                                                <ul
                                                    id={menuId}
                                                    role="menu"
                                                    className="absolute left-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60"
                                                >
                                                    {items.map((menuItem) => (
                                                        <li key={menuItem.href} role="none">
                                                            <Link
                                                                href={menuItem.href}
                                                                role="menuitem"
                                                                className="block rounded-xl px-3 py-2 text-sm font-medium text-black transition hover:bg-slate-100 hover:text-blue-600"
                                                                style={{ color: "#000000" }}
                                                                onClick={() => setOpenDropdown(null)}
                                                            >
                                                                {menuItem.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-sm font-medium text-black transition hover:text-blue-600"
                                            style={{ color: "#000000" }}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/search"
                            aria-label="Search Signal Stack"
                            className="hidden rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:inline-flex"
                        >
                            <SearchIcon />
                        </Link>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                            aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {mobileMenuOpen ? (
                    <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-2 border-t border-slate-200 py-4 lg:hidden">
                        <ul className="space-y-2">
                            {mainNavigation.map((item) => {
                                if (item.type === "dropdown") {
                                    const section = item.label.toLowerCase() as "tech" | "markets";
                                    const isOpen = openDropdown === section;
                                    const items = section === "tech" ? techNavigation : marketNavigation;

                                    return (
                                        <li key={item.label} className="rounded-xl border border-slate-200 bg-slate-50">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={`${section}-mobile-menu`}
                                                onClick={() => toggleDropdown(section)}
                                                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-black hover:text-blue-600"
                                                style={{ color: "#000000" }}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronIcon open={isOpen} />
                                            </button>
                                            {isOpen ? (
                                                <ul id={`${section}-mobile-menu`} className="space-y-1 border-t border-slate-200 bg-white px-3 py-2">
                                                    {items.map((menuItem) => (
                                                        <li key={menuItem.href}>
                                                            <Link
                                                                href={menuItem.href}
                                                                className="block rounded-lg px-2 py-2 text-sm text-black transition hover:bg-slate-100 hover:text-blue-600"
                                                                style={{ color: "#000000" }}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                {menuItem.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-slate-50 hover:text-blue-600"
                                            style={{ color: "#000000" }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}

                            <li>
                                <Link
                                    href="/search"
                                    aria-label="Search articles"
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Search</span>
                                    <SearchIcon />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                ) : null}
            </div>
        </header>
    );
}
