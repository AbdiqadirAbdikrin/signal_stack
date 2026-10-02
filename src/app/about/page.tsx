export const metadata = {
    title: "About",
    description: "Learn about Signal Stack and our editorial focus on AI, cloud, DevOps, and software engineering.",
};

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">About</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Technology insight for builders</h1>
            <div className="mt-8 space-y-6 text-lg leading-8 text-slate-700">
                <p>
                    Signal Stack is a technology publication focused on the systems and engineering habits that shape modern software delivery.
                </p>
                <p>
                    We cover AI engineering, cloud architecture, DevOps workflows, and the software development practices that help teams build resilient products faster.
                </p>
                <p>
                    Our goal is to help engineers make informed technical decisions with practical examples, thoughtful explanations, and clear editorial standards.
                </p>
            </div>
        </main>
    );
}
