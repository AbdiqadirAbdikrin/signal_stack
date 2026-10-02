const categorySummary = [
    { name: "AI", posts: 12 },
    { name: "Cloud", posts: 9 },
    { name: "DevOps", posts: 7 },
    { name: "Development", posts: 14 },
];

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <header>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Admin</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-900">Categories</h1>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {categorySummary.map((category) => (
                    <div key={category.name} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Category</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{category.name}</h2>
                        <p className="mt-2 text-sm text-slate-600">{category.posts} stories published</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
