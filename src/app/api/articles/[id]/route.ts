import { NextResponse } from "next/server";
import { z } from "zod";

import { getArticleSession } from "@/lib/article-auth";
import { updateArticleSchema } from "@/lib/article-validation";
import { ApiError, readJsonObjectBody, toErrorResponse } from "@/lib/api-errors";
import { deleteArticle, getArticleById, updateArticle } from "@/lib/articles";

const idSchema = z.string().uuid();

/**
 * Validates the article id from the route path.
 *
 * The Zod issue object is never returned to the client: it contains internal
 * validation internals (including the UUID pattern). A fixed message and status are
 * raised instead.
 */
function parseArticleId(rawId: string): string {
    const result = idSchema.safeParse(rawId);

    if (!result.success) {
        throw new ApiError("Invalid article ID.", 400, result.error.message);
    }

    return result.data;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getArticleSession({ cookieWriteMode: "read-write" });

        if (!session.isOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const parsedId = parseArticleId(id);
        const article = await getArticleById(parsedId);

        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return toErrorResponse(error, "Unable to load the article.");
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication and owner authorization run before the path parameter is
        // validated, matching GET. No database work happens before authorization.
        const session = await getArticleSession({ cookieWriteMode: "read-write" });

        if (!session.isOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const parsedId = parseArticleId(id);
        const article = await getArticleById(parsedId);

        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }

        const body = await readJsonObjectBody(request);
        const validation = updateArticleSchema.safeParse({
            ...article,
            ...body,
            tags: Array.isArray(body.tags) ? body.tags : article.tags,
            excerpt: typeof body.excerpt === "string" ? body.excerpt : article.excerpt ?? "",
            featured_image: typeof body.featured_image === "string" ? body.featured_image : article.featured_image ?? "",
            seo_title: typeof body.seo_title === "string" ? body.seo_title : article.seo_title ?? "",
            seo_description: typeof body.seo_description === "string" ? body.seo_description : article.seo_description ?? "",
            status: typeof body.status === "string" && (body.status === "draft" || body.status === "published") ? body.status : article.status,
        });

        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0]?.message ?? "Validation failed." },
                { status: 400 },
            );
        }

        const updated = await updateArticle(parsedId, {
            title: validation.data.title,
            slug: validation.data.slug,
            excerpt: validation.data.excerpt,
            content: validation.data.content,
            category: validation.data.category,
            tags: validation.data.tags,
            featured_image: validation.data.featured_image,
            status: validation.data.status,
            seo_title: validation.data.seo_title ?? null,
            seo_description: validation.data.seo_description ?? null,
            author_id: article.author_id ?? session.userId,
        });

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }

        return toErrorResponse(error, "Unable to update the article.");
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authentication and owner authorization run before the path parameter is
        // validated, matching GET.
        const session = await getArticleSession({ cookieWriteMode: "read-write" });

        if (!session.isOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const parsedId = parseArticleId(id);
        const article = await getArticleById(parsedId);

        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }

        await deleteArticle(parsedId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return toErrorResponse(error, "Unable to delete the article.");
    }
}