import type { SupabaseClient } from "@supabase/supabase-js";

import { authors } from "@/content/authors";
import { internalError } from "@/lib/api-errors";
import { normalizeSlug, readingTimeForContent, siteConfig } from "@/lib/site";
import { getSupabaseAdminClient, getSupabaseAnonClient, isSupabaseConfigured } from "@/lib/supabase-server";
import type { Post } from "@/types/blog";
import type { ArticleInput, ArticleListFilters, ArticleRecord, ArticlesPageResult, ArticleStatus } from "@/types/articles";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Public author handle for database-backed posts. Reuses the existing site author so
 * `/authors/[author]` and the author links keep working, and keeps the Supabase auth
 * user id out of every public payload.
 */
const DEFAULT_PUBLIC_AUTHOR_SLUG = authors[0]?.slug ?? "signal-stack";

/**
 * Quotes a value so PostgREST treats it as a literal instead of filter syntax.
 *
 * The `.or()` filter is a small DSL: an unquoted term containing `,` `(` `)` or `"`
 * can close the current node and inject further operators. Wrapping the term in double
 * quotes and escaping backslashes and quotes makes any user input plain data, so
 * `a,b`, `x),id.not.is.null` and `title.ilike.*` are searched for literally.
 *
 * `%` and `_` are intentionally left intact: they are SQL LIKE wildcards handled by
 * Postgres, not PostgREST filter operators, and the existing search behaviour
 * depends on them.
 */
function toFilterLiteral(value: string) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Postgres codes that mean the articles relation itself is absent:
 *   42P01   undefined_table
 *   PGRST205 table not present in the PostgREST schema cache
 */
const MISSING_ARTICLES_TABLE_CODES = new Set(["42P01", "PGRST205"]);

/**
 * Messages that name the articles relation as absent. Used only when the error
 * carries no code. Deliberately narrow: each pattern has to name the relation or
 * table and say it does not exist.
 */
const MISSING_ARTICLES_TABLE_MESSAGES = [
    /relation\s+"?public\.articles"?\s+does not exist/i,
    /relation\s+"?articles"?\s+does not exist/i,
    /table\s+"?public\.articles"?\s+does not exist/i,
    /undefined table/i,
    /could not find the table\b[^\n]*in the schema cache/i,
];

/**
 * PostgREST rejects with a plain `{ message, code, details, hint }` object rather
 * than an Error, so both shapes have to be read.
 */
function readDatabaseError(error: unknown): { code: string | null; message: string } {
    if (typeof error === "string") {
        return { code: null, message: error };
    }

    if (error instanceof Error) {
        return { code: null, message: error.message };
    }

    if (error && typeof error === "object") {
        const candidate = error as { code?: unknown; message?: unknown };
        return {
            code: typeof candidate.code === "string" ? candidate.code : null,
            message: typeof candidate.message === "string" ? candidate.message : "",
        };
    }

    return { code: null, message: String(error ?? "") };
}

/**
 * Detects a genuinely missing `public.articles` relation.
 *
 * A missing or invalid COLUMN must never be classified as a missing table, otherwise
 * `column "seo_title" of relation "articles" does not exist` would be reported to the
 * author as "the articles table has not been created yet", which sends them to re-run
 * migration 001. That is a no-op against an existing table and hides the real cause.
 *
 * When the error carries a Postgres/PostgREST code the code decides the outcome, so
 * constraint, permission, type and syntax errors are all left to propagate untouched.
 */
function isMissingArticlesTableError(error: unknown): boolean {
    const { code, message } = readDatabaseError(error);

    if (code) {
        return MISSING_ARTICLES_TABLE_CODES.has(code);
    }

    if (!message) {
        return false;
    }

    // Column-level errors mention a specific column and are rejected outright.
    if (/column/i.test(message)) {
        return false;
    }

    return MISSING_ARTICLES_TABLE_MESSAGES.some((pattern) => pattern.test(message));
}

export function articleIsPublished(status: ArticleStatus | string | null | undefined) {
    return status === "published";
}

export function buildArticleSlug(title: string, manualSlug?: string | null) {
    if (manualSlug && manualSlug.trim()) {
        return normalizeSlug(manualSlug);
    }

    return normalizeSlug(title) || "article";
}

export function articleToPost(article: ArticleRecord): Post {
    const dateValue = article.published_at ?? article.created_at;

    return {
        title: article.title,
        slug: article.slug,
        description: article.excerpt ?? article.seo_description ?? "A Signal Stack article.",
        date: dateValue,
        updated: article.updated_at,
        // The public author is a site author handle, never the Supabase auth user id.
        // article.author_id is the configured ARTICLE_OWNER_USER_ID and must never be
        // published, so database-backed posts use the same handle as the static MDX posts.
        author: DEFAULT_PUBLIC_AUTHOR_SLUG,
        category: (article.category as Post["category"]) ?? "Development",
        tags: article.tags ?? [],
        image: article.featured_image ?? siteConfig.defaultImage,
        imageAlt: `${article.title} cover image`,
        featured: article.status === "published",
        readingTime: readingTimeForContent(article.content),
        content: article.content,
    };
}

async function queryArticleList(client: SupabaseClient, filters: ArticleListFilters): Promise<ArticlesPageResult> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = client.from("articles").select("*", { count: "exact" });

    if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }

    if (filters.category) {
        query = query.eq("category", filters.category);
    }

    if (filters.author_id) {
        query = query.eq("author_id", filters.author_id);
    }

    if (filters.search) {
        const likeTerm = toFilterLiteral(`%${filters.search.trim()}%`);
        query = query.or(`title.ilike.${likeTerm},excerpt.ilike.${likeTerm},content.ilike.${likeTerm}`);
    }

    try {
        const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);

        if (error) {
            if (isMissingArticlesTableError(error)) {
                return { articles: [], count: 0, page, pageSize };
            }

            throw internalError("queryArticleList", error.message);
        }

        return {
            articles: (data ?? []) as ArticleRecord[],
            count: count ?? 0,
            page,
            pageSize,
        };
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return { articles: [], count: 0, page, pageSize };
        }

        throw error;
    }
}

export async function getArticles(filters: ArticleListFilters = {}): Promise<ArticlesPageResult> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    return queryArticleList(getSupabaseAdminClient(), filters);
}

export async function getPublicArticleList(
    filters: Omit<ArticleListFilters, "status"> = {},
): Promise<ArticlesPageResult> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    // Public reads run on the anon key so that database row level security enforces
    // visibility: status = 'published', published_at is not null, and published_at <= now().
    // The status filter is deliberately not part of the accepted filters, so a caller
    // cannot widen this query beyond published articles.
    return queryArticleList(getSupabaseAnonClient(), {
        ...filters,
        status: "published",
    });
}

export async function getArticleById(id: string): Promise<ArticleRecord | null> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    try {
        const { data, error } = await getSupabaseAdminClient()
            .from("articles")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) {
            if (isMissingArticlesTableError(error)) {
                return null;
            }

            throw internalError("getArticleById", error.message);
        }

        return (data as ArticleRecord | null) ?? null;
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return null;
        }

        throw error;
    }
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord | null> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    try {
        const { data, error } = await getSupabaseAdminClient()
            .from("articles")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            if (isMissingArticlesTableError(error)) {
                return null;
            }

            throw internalError("getArticleBySlug", error.message);
        }

        return (data as ArticleRecord | null) ?? null;
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return null;
        }

        throw error;
    }
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
    try {
        const result = await getPublicArticleList();
        return result.articles;
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return [];
        }

        throw error;
    }
}

export async function getPublicArticleBySlug(slug: string): Promise<Post | null> {
    if (!isSupabaseConfigured()) {
        return null;
    }

    try {
        // Queried directly on the anon client rather than through getArticleBySlug, because
        // that function is also used by the privileged duplicate-slug checks and must stay
        // on the service-role client. Row level security restricts this query to published
        // articles whose published_at is set and in the past.
        const { data, error } = await getSupabaseAnonClient()
            .from("articles")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            if (isMissingArticlesTableError(error)) {
                return null;
            }

            throw internalError("getPublicArticleBySlug", error.message);
        }

        const article = (data as ArticleRecord | null) ?? null;

        if (!article || article.status !== "published") {
            return null;
        }

        return articleToPost(article);
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return null;
        }

        throw error;
    }
}

export async function getPublicArticles(): Promise<Post[]> {
    if (!isSupabaseConfigured()) {
        return [];
    }

    try {
        const result = await getPublishedArticles();
        return result.map((article) => articleToPost(article));
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            return [];
        }

        throw error;
    }
}

export async function createArticle(input: ArticleInput): Promise<ArticleRecord> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    try {
        const client = getSupabaseAdminClient();
        const nextSlug = buildArticleSlug(input.title, input.slug);
        const existing = await getArticleBySlug(nextSlug);

        if (existing) {
            throw new Error("An article with this slug already exists.");
        }

        const payload = {
            title: input.title.trim(),
            slug: nextSlug,
            excerpt: (input.excerpt ?? "").trim() || null,
            content: input.content.trim(),
            category: input.category.trim(),
            tags: Array.isArray(input.tags) ? [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))] : [],
            featured_image: input.featured_image?.trim() || null,
            author_id: input.author_id ?? null,
            status: input.status ?? "draft",
            seo_title: (input.seo_title ?? "").trim() || null,
            seo_description: (input.seo_description ?? "").trim() || null,
            published_at: input.status === "published" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await client.from("articles").insert([payload]).select().single();

        if (error) {
            if (isMissingArticlesTableError(error)) {
                throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before creating articles.");
            }

            throw internalError("createArticle", error.message);
        }

        return data as ArticleRecord;
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before creating articles.");
        }

        throw error;
    }
}

export async function updateArticle(id: string, input: Partial<ArticleInput>): Promise<ArticleRecord> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    try {
        const existing = await getArticleById(id);

        if (!existing) {
            throw new Error("Article not found.");
        }

        const nextStatus = input.status ?? existing.status;
        const nextSlug = buildArticleSlug(input.title ?? existing.title, input.slug ?? existing.slug);
        const duplicate = await getArticleBySlug(nextSlug);

        if (duplicate && duplicate.id !== id) {
            throw new Error("An article with this slug already exists.");
        }

        const payload = {
            title: input.title?.trim() ?? existing.title,
            slug: nextSlug,
            excerpt: input.excerpt !== undefined ? (input.excerpt?.trim() || null) : existing.excerpt,
            content: input.content?.trim() ?? existing.content,
            category: input.category?.trim() ?? existing.category,
            tags: input.tags ? [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))] : existing.tags,
            featured_image: input.featured_image !== undefined ? (input.featured_image?.trim() || null) : existing.featured_image,
            author_id: input.author_id ?? existing.author_id,
            status: nextStatus,
            seo_title: input.seo_title !== undefined ? ((input.seo_title ?? "").trim() || null) : existing.seo_title,
            seo_description: input.seo_description !== undefined ? ((input.seo_description ?? "").trim() || null) : existing.seo_description,
            published_at:
                nextStatus === "published"
                    ? (existing.published_at ?? new Date().toISOString())
                    : existing.published_at,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await getSupabaseAdminClient()
            .from("articles")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            if (isMissingArticlesTableError(error)) {
                throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before updating articles.");
            }

            throw internalError("updateArticle", error.message);
        }

        return data as ArticleRecord;
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before updating articles.");
        }

        throw error;
    }
}

export async function deleteArticle(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase article database is not configured.");
    }

    try {
        const existing = await getArticleById(id);

        if (!existing) {
            throw new Error("Article not found.");
        }

        const { error } = await getSupabaseAdminClient().from("articles").delete().eq("id", id);

        if (error) {
            if (isMissingArticlesTableError(error)) {
                throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before deleting articles.");
            }

            throw internalError("deleteArticle", error.message);
        }
    } catch (error) {
        if (isMissingArticlesTableError(error)) {
            throw new Error("The articles table has not been created yet. Run the migration in supabase/migrations/001_create_articles_table.sql before deleting articles.");
        }

        throw error;
    }
}
