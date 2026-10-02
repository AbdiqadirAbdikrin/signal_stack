import { cookies } from "next/headers";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { SupabaseCookieWriteMode } from "@/lib/supabase-server";

export type ArticleRole = "reader" | "owner";

export interface ArticleOwnerSession {
    userId: string | null;
    email: string | null;
    role: ArticleRole;
    isOwner: boolean;
    isAuthenticated: boolean;
}

/**
 * ARTICLE_OWNER_USER_ID is the single authoritative ownership setting. It is the
 * only environment variable consulted here: there is deliberately no email
 * fallback, no hardcoded uuid, and no development bypass, so a bad configuration
 * can only ever remove access, never grant it.
 */
const ownerUserIdSchema = z.string().trim().min(1).uuid();

/**
 * Thrown when the ownership configuration is missing or malformed. The message
 * names the offending variable and the expected shape but never includes the
 * configured value, so it is safe to log.
 */
export class ArticleAuthConfigurationError extends Error {
    constructor(detail: string) {
        super(`Article authorization is misconfigured: ${detail} Set ARTICLE_OWNER_USER_ID to the owner's Supabase Auth user id (UUID). Access is denied until it is valid.`);
        this.name = "ArticleAuthConfigurationError";
    }
}

let hasLoggedConfigurationError = false;

/**
 * Validate ARTICLE_OWNER_USER_ID and return the owner uuid.
 * Throws ArticleAuthConfigurationError when it is missing or not a UUID.
 */
export function getConfiguredOwnerUserId(): string {
    const raw = process.env.ARTICLE_OWNER_USER_ID;

    if (raw === undefined || raw.trim() === "") {
        throw new ArticleAuthConfigurationError("ARTICLE_OWNER_USER_ID is not set.");
    }

    const parsed = ownerUserIdSchema.safeParse(raw);

    if (!parsed.success) {
        throw new ArticleAuthConfigurationError("ARTICLE_OWNER_USER_ID is not a valid UUID.");
    }

    return parsed.data;
}

/**
 * Existing accessor shape, kept so current callers keep working. Returns an empty
 * ownerUserId when the configuration is invalid so authorization still fails closed;
 * use getConfiguredOwnerUserId() when you need the explicit error.
 */
export function getConfiguredOwnerValues() {
    let ownerUserId = "";

    try {
        ownerUserId = getConfiguredOwnerUserId();
    } catch {
        ownerUserId = "";
    }

    return { ownerUserId };
}

export interface ArticleSessionOptions {
    /**
     * Server Components (the admin pages and the root layout) must leave this at the
     * default "read-only", because `cookies()` is read-only there. Route Handlers
     * pass "read-write" so a refreshed Supabase session can be persisted.
     */
    cookieWriteMode?: SupabaseCookieWriteMode;
}

export async function getArticleSession(options: ArticleSessionOptions = {}): Promise<ArticleOwnerSession> {
    // Fail closed: an invalid configuration denies all owner access. The reason is
    // recorded once on the server so a silent admin lockout is diagnosable, and the
    // session below still reports a non-owner.
    let ownerUserId = "";

    try {
        ownerUserId = getConfiguredOwnerUserId();
    } catch (error) {
        if (!hasLoggedConfigurationError) {
            hasLoggedConfigurationError = true;
            console.error(error);
        }
    }

    const cookieStore = await cookies();

    const supabase = createSupabaseServerClient(cookieStore, options.cookieWriteMode ?? "read-only");
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            userId: null,
            email: null,
            role: "reader",
            isOwner: false,
            isAuthenticated: false,
        };
    }

    // Ownership is decided only by comparing the authenticated Supabase Auth uuid
    // against ARTICLE_OWNER_USER_ID. There is no development bypass and no synthetic
    // identity, so userId is always either null or a real auth.users uuid.
    const isOwner = Boolean(ownerUserId && user.id === ownerUserId);

    return {
        userId: isOwner ? user.id : null,
        email: user.email ?? null,
        role: isOwner ? "owner" : "reader",
        isOwner,
        isAuthenticated: Boolean(user),
    };
}

export async function requireOwnerAccess() {
    const session = await getArticleSession();

    if (!session.isOwner) {
        throw new Error("Unauthorized");
    }

    return session;
}
