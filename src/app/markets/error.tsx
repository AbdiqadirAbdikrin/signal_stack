"use client";

export default function MarketsError({ reset }: { reset: () => void }) {
    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-900">
                <p className="text-sm font-semibold uppercase tracking-[0.14em]">Market data</p>
                <h2 className="mt-3 text-2xl font-bold">Unable to load market data. Try again.</h2>
                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        </main>
    );
}
