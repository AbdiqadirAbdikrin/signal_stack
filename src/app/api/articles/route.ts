import { NextResponse } from "next/server";

import { getArticleSession } from "@/lib/article-auth";
import { createArticleSchema } from "@/lib/article-validation";
import { readJsonObjectBody, toErrorResponse } from "@/lib/api-errors";
import { createArticle, getArticles } from "@/lib/articles";

export async function GET(request: Request) {
    try {
        const session = await getArticleSession({ cookieWriteMode: "read-write" });

        if (!session.isOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") ?? "1");
        const pageSize = Number(searchParams.get("pageSize") ?? "10");
        const search = searchParams.get("search") ?? "";
        const category = searchParams.get("category") ?? undefined;
        const status = (searchParams.get("status") ?? "all") as "all" | "draft" | "published";

        const result = await getArticles({
            page,
            pageSize,
            search,
            category: category || undefined,
            status,
        });

        return NextResponse.json(result);
    } catch (error) {
        return toErrorResponse(error, "Unable to load articles.");
    }
}

export async function POST(request: Request) {
    try {
        const session = await getArticleSession({ cookieWriteMode: "read-write" });

        if (!session.isOwner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await readJsonObjectBody(request);
        const payload = {
            ...body,
            author_id: session.userId,
            tags: Array.isArray(body.tags) ? body.tags : [],
            status: body.status === "published" ? "published" : "draft",
            seo_title: typeof body.seo_title === "string" ? body.seo_title : "",
            seo_description: typeof body.seo_description === "string" ? body.seo_description : "",
        };

        const validation = createArticleSchema.safeParse(payload);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.error.issues[0]?.message ?? "Validation failed.",
                    errors: validation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const article = await createArticle({
            title: validation.data.title,
            slug: validation.data.slug,
            excerpt: validation.data.excerpt ?? "",
            content: validation.data.content,
            category: validation.data.category,
            tags: validation.data.tags,
            featured_image: validation.data.featured_image ?? null,
            status: validation.data.status,
            author_id: session.userId,
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        // A slug collision is a known conflict and keeps its specific safe message.
        if (error instanceof Error && error.message.includes("already exists")) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }

        return toErrorResponse(error, "Unable to create the article.");
    }
}
