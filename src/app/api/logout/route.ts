import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST() {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore, "read-write");

    await supabase.auth.signOut();

    return NextResponse.json({ success: true }, { status: 200 });
}
