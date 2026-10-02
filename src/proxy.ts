import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase keeps its session in a cookie named `sb-<project-ref>-auth-token`, which is
 * chunked into `.0`, `.1`, ... when large. Checking for that cookie lets public,
 * unauthenticated requests skip the refresh round trip entirely.
 */
function hasSupabaseSessionCookie(request: NextRequest) {
    return request.cookies
        .getAll()
        .some(({ name }) => name.startsWith("sb-") && name.includes("auth-token"));
}

export async function proxy(request: NextRequest) {
    if (!supabaseUrl || !supabaseAnonKey || !hasSupabaseSessionCookie(request)) {
        return NextResponse.next({ request });
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
                // Keep the request cookies in sync so the rest of this request sees the
                // refreshed session.
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
        },
    });

    // Resolving the user validates the session with the Supabase auth server. If the
    // access token has expired, @supabase/ssr refreshes it and setAll above persists
    // the new cookies.
    //
    // This has to happen here, before render. A Server Component cannot do it:
    // next/headers hands it a read-only cookie store, so the refresh would either
    // throw or be discarded, and an expired owner session would silently degrade to a
    // logged-out one. Proxy performs no authorization; the owner check stays in
    // src/lib/article-auth.ts and the protected admin layout.
    await supabase.auth.getUser();

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};