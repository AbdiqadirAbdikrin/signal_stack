export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <header>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Admin</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-900">Settings</h1>
            </header>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Publication</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Editorial workflow</h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                        The site is structured for a single-author editorial workflow with secure admin access, publication status controls, and a clean reader-first public experience.
                    </p>
                </div>
            </div>
        </div>
    );
}
