export const metadata = {
    title: "Business",
    description: "Signal Stack covers startups, big tech, AI companies, cloud businesses, funding, and technology entrepreneurship.",
};

export default function BusinessPage() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Business</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Technology business and company strategy</h1>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {[
                    "Startups",
                    "Big Tech",
                    "AI Companies",
                    "Cloud Companies",
                    "Funding",
                    "Entrepreneurship",
                    "Technology Industry",
                ].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <h2 className="text-xl font-semibold text-slate-900">{item}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Analysis of how product, capital, and execution shape modern technology companies and the markets around them.
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
