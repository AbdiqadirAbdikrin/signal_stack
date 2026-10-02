-- =========================================================
-- REMOVE INERT public.articles RLS POLICIES
--
-- Article authorization in this project is a single-author model decided in the
-- application layer: the authenticated Supabase Auth user id is compared against
-- ARTICLE_OWNER_USER_ID in src/lib/article-auth.ts, and the admin API routes gate
-- every mutation on the resulting isOwner flag.
--
-- The five policies removed below all depended on a `profiles.role` lookup:
--
--   exists (select 1 from public.profiles where id = auth.uid() and role in (...))
--
-- public.profiles has row level security enabled and no policies of its own, so that
-- sub-select is denied for every anon/authenticated role and always evaluates to
-- false. These policies were therefore permanently unsatisfiable: they never granted
-- access, and they never protected anything. They are removed so the RLS surface
-- reflects what is actually enforced.
--
-- The policy that does real work is kept untouched: "Published articles are readable
-- by everyone", which is what keeps drafts off the public anon-key read path.
--
-- public.profiles itself is NOT modified by this migration: its schema, its empty
-- state, its deny-all RLS configuration, and the absence of any auth.users trigger
-- are all left exactly as they are.
--
-- This migration only removes policies. It changes no data, no columns, no
-- constraints, and no triggers, and every statement is guarded with `if exists` so
-- the migration is safe to run more than once.
-- =========================================================

drop policy if exists "Authenticated users can read articles they can manage"
  on public.articles;

drop policy if exists "Authors, editors, and admins can insert articles"
  on public.articles;

drop policy if exists "Authors can update their own articles"
  on public.articles;

drop policy if exists "Admins can delete articles"
  on public.articles;

drop policy if exists "Editors can delete articles"
  on public.articles;


-- =========================================================
-- VERIFY THE PUBLIC READ POLICY IS STILL IN PLACE
--
-- Authoritative single-author model. Keeps unpublished and scheduled articles
-- invisible to the anon key, which is what the public blog pages read through.
-- Re-created only if absent, so this migration never weakens or duplicates it.
-- =========================================================

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'articles'
      and policyname = 'Published articles are readable by everyone'
  ) then
    create policy "Published articles are readable by everyone"
      on public.articles
      for select
      using (
        status = 'published'
        and published_at is not null
        and published_at <= now()
      );
  end if;
end
$$;
