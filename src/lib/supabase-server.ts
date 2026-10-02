import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const supabaseServerConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export function isSupabaseConfigured() {
    return Boolean(
        supabaseServerConfig.url &&
        supabaseServerConfig.anonKey &&
        supabaseServerConfig.serviceRoleKey,
    );
}

/**
 * Whether this call site is allowed to write cookies.
 *
 * `cookies()` from `next/headers` returns a read-only store inside a Server
 * Component. Writing to it throws "Cookies can only be modified in a Server Action or
 * Route Handler". Route Handlers and Server Actions receive a mutable store and do
 * need to persist refreshed Supabase cookies.
 */
export type SupabaseCookieWriteMode = "read-write" | "read-only";

/**
 * Defaults to "read-only" so a Server Component can never throw on a cookie write.
 * Route Handlers opt in explicitly with "read-write".
 *
 * Session refresh is persisted by src/proxy.ts, which runs before rendering and can
 * write cookies. This is the Supabase SSR pattern for the App Router: middleware/proxy
 * owns refreshing, Server Components only read.
 */
export function createSupabaseServerClient(
    cookieStore?: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    cookieWriteMode: SupabaseCookieWriteMode = "read-only",
) {
    if (!supabaseServerConfig.url || !supabaseServerConfig.anonKey) {
        throw new Error("Supabase public variables are not configured.");
    }

    return createServerClient(supabaseServerConfig.url, supabaseServerConfig.anonKey, {
        cookies: {
            getAll: () => cookieStore ? cookieStore.getAll() : [],
            setAll: (cookiesToSet) => {
                // Reads always work. Writes are performed only where Next.js allows
                // them; this is decided by the caller rather than by catching and
                // discarding the "Cookies can only be modified..." error, so a genuine
                // failure in a Route Handler still surfaces.
                if (!cookieStore || cookieWriteMode !== "read-write") {
                    return;
                }

                cookiesToSet.forEach(({ name, value, options }) => {
                    cookieStore.set(name, value, options);
                });
            },
        },
    });
}

export function getSupabaseAdminClient() {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Add the public and service role variables before using the article database.");
    }

    return createClient(supabaseServerConfig.url, supabaseServerConfig.serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}

export function getSupabaseAnonClient() {
    if (!supabaseServerConfig.url || !supabaseServerConfig.anonKey) {
        throw new Error("Supabase public variables are not configured.");
    }

    return createClient(supabaseServerConfig.url, supabaseServerConfig.anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}
