import { z } from "zod";

export const articleStatusSchema = z.enum(["draft", "published"]);

export const articleSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long."),
    slug: z.string().trim().min(2, "Slug is required.").max(120, "Slug is too long."),
    excerpt: z.string().trim().max(500, "Excerpt is too long.").optional().or(z.literal("")),
    content: z.string().trim().min(20, "Content must include at least 20 characters."),
    category: z.string().trim().min(2, "Category is required."),
    tags: z.array(z.string().trim().min(1).max(50)).max(10, "A maximum of 10 tags is allowed.").default([]),
    featured_image: z.string().trim().url("Featured image must be a valid URL.").or(z.literal("")).optional().default(""),
    seo_title: z.string().trim().max(60, "SEO title must be 60 characters or fewer.").optional().or(z.literal("")),
    seo_description: z.string().trim().max(160, "SEO description must be 160 characters or fewer.").optional().or(z.literal("")),
    status: articleStatusSchema.default("draft"),
});

export const createArticleSchema = articleSchema.refine((article) => {
    if (article.status !== "published") {
        return true;
    }

    return Boolean(article.title.trim() && article.slug.trim() && article.content.trim() && article.category.trim());
}, {
    path: ["status"],
    message: "Published articles must include a title, slug, category, and content.",
});

export const updateArticleSchema = articleSchema.partial().refine((article) => {
    if (!article.status) {
        return true;
    }

    return articleStatusSchema.safeParse(article.status).success;
}, {
    path: ["status"],
    message: "Status must be draft or published.",
});

export function normalizeArticleTags(tags: string[] | undefined | null): string[] {
    if (!tags) {
        return [];
    }

    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean).slice(0, 10))];
}
