export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    isDatabaseConfigured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
};

export function getSupabaseStatusMessage() {
    if (!supabaseConfig.isConfigured) {
        return "Supabase authentication and RLS are not configured yet. The app will gracefully disable interactive article features until the environment variables are added.";
    }

    if (!supabaseConfig.isDatabaseConfigured) {
        return "Supabase is configured for auth, but the service-role key is missing. Article CRUD is disabled until the server environment is complete.";
    }

    return "Supabase is configured and ready for the article management workflow.";
}
