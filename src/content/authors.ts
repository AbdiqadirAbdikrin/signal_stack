import type { Author } from "@/types/blog";

export const authors: Author[] = [
    {
        slug: "aisha-patel",
        name: "Aisha Patel",
        title: "Senior Platform Engineer",
        bio: "Aisha writes about AI infrastructure, cloud-native systems, and the engineering habits that help teams ship reliable software faster.",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        website: "https://www.aishapatel.dev",
        twitter: "https://x.com/aishapatel",
        linkedin: "https://www.linkedin.com/in/aishapatel",
        github: "https://github.com/aishapatel",
    },
];

export const authorMap = Object.fromEntries(
    authors.map((author) => [author.slug, author]),
) as Record<string, Author>;
