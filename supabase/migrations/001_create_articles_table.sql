create extension if not exists "pgcrypto";


-- =========================================================
-- ARTICLE STATUS ENUM
-- =========================================================

do $$
begin
  create type public.article_status as enum (
    'draft',
    'published',
    'archived'
  );
exception
  when duplicate_object then null;
end
$$;


-- =========================================================
-- ARTICLES TABLE
-- =========================================================

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  slug text not null unique,

  excerpt text,

  content text not null,

  category text not null,

  tags text[] not null default '{}',

  featured_image text,

  author_id uuid
    references auth.users(id)
    on delete set null,

  status public.article_status
    not null
    default 'draft',

  published_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);


-- =========================================================
-- PROFILES TABLE
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text,

  role text
    not null
    default 'reader'
    check (
      role in (
        'reader',
        'author',
        'editor',
        'admin'
      )
    ),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);


-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists idx_articles_slug
  on public.articles (slug);

create index if not exists idx_articles_category
  on public.articles (category);

create index if not exists idx_articles_status
  on public.articles (status);

create index if not exists idx_articles_published_at
  on public.articles (published_at);

create index if not exists idx_articles_author_id
  on public.articles (author_id);


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.articles
  enable row level security;

alter table public.profiles
  enable row level security;


-- =========================================================
-- REMOVE OLD POLICIES
-- This makes the migration safe to run again.
-- =========================================================

drop policy if exists "Published articles are readable by everyone"
  on public.articles;

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
-- READ PUBLISHED ARTICLES
-- Public users can read published articles.
-- =========================================================

create policy "Published articles are readable by everyone"
on public.articles
for select
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);


-- =========================================================
-- READ ARTICLES FOR AUTHORS / EDITORS / ADMINS
-- =========================================================

create policy "Authenticated users can read articles they can manage"
on public.articles
for select
using (
  auth.uid() is not null
  and (
    author_id = auth.uid()
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('editor', 'admin')
    )
  )
);


-- =========================================================
-- CREATE ARTICLES
-- =========================================================

create policy "Authors, editors, and admins can insert articles"
on public.articles
for insert
with check (
  auth.uid() is not null
  and (
    author_id = auth.uid()
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('editor', 'admin')
    )
  )
);


-- =========================================================
-- UPDATE ARTICLES
-- =========================================================

create policy "Authors can update their own articles"
on public.articles
for update
using (
  auth.uid() is not null
  and (
    author_id = auth.uid()
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('editor', 'admin')
    )
  )
)
with check (
  auth.uid() is not null
  and (
    author_id = auth.uid()
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('editor', 'admin')
    )
  )
);


-- =========================================================
-- DELETE ARTICLES - ADMIN
-- =========================================================

create policy "Admins can delete articles"
on public.articles
for delete
using (
  auth.uid() is not null
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
);


-- =========================================================
-- DELETE ARTICLES - EDITOR
-- =========================================================

create policy "Editors can delete articles"
on public.articles
for delete
using (
  auth.uid() is not null
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'editor'
  )
);


-- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================================
-- REMOVE OLD TRIGGERS
-- =========================================================

drop trigger if exists set_public_articles_updated_at
on public.articles;

drop trigger if exists set_public_profiles_updated_at
on public.profiles;


-- =========================================================
-- CREATE UPDATED_AT TRIGGERS
-- =========================================================

create trigger set_public_articles_updated_at
before update
on public.articles
for each row
execute function public.set_updated_at();


create trigger set_public_profiles_updated_at
before update
on public.profiles
for each row
execute function public.set_updated_at();