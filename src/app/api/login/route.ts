import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { readJsonObjectBody, toErrorResponse } from "@/lib/api-errors";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

export async function POST(request: Request) {
    try {
        const body = await readJsonObjectBody(request);
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createSupabaseServerClient(cookieStore, "read-write");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            // One constant message for every failure so the endpoint cannot be used to
            // distinguish unknown accounts, wrong passwords, banned or unconfirmed
            // users. The specific Supabase error is logged server-side only.
            if (error) {
                console.error(`[api/login] sign-in failed: ${error.message}`);
            }

            return NextResponse.json({ message: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
        }

        return NextResponse.json({ success: true, userId: data.user.id });
    } catch (error) {
        return toErrorResponse(error, "Authentication failed.");
    }
}
