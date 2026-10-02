export const metadata = {
    title: "Contact",
    description: "Get in touch with Signal Stack for editorial, partnership, or product inquiries.",
};

export default function ContactPage() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Contact</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Get in touch</h1>

            <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-700">
                <p className="text-lg leading-8">
                    Signal Stack is focused on thoughtful analysis of AI, cloud, DevOps, software engineering, and financial technology.
                </p>
                <p>
                    For editorial, partnership, and general inquiries, email <a href="mailto:hello@signalstack.dev" className="font-medium text-sky-700 underline">hello@signalstack.dev</a>.
                </p>
            </div>
        </main>
    );
}
