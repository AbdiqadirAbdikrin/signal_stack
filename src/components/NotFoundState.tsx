import Link from "next/link";

export function NotFoundState({ label }: { label: string }) {
    return (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">Not found</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{label}</h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
                The page or article you were looking for could not be found.
            </p>
            <Link href="/" className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Return home
            </Link>
        </main>
    );
}
