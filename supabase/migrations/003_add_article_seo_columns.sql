-- =========================================================
-- DECLARE THE ARTICLE SEO COLUMNS
--
-- Schema-drift correction (C6). `public.articles` has carried these four columns in
-- the live database for some time, but no migration ever declared them. Migration 001
-- creates the table with 13 columns; the live table has 17. Because the application
-- writes two of them, a database provisioned purely from migrations would fail on
-- article create and update with:
--
--   column "seo_title" of relation "articles" does not exist
--
-- This migration closes that gap by declaring the columns in migration history so the
-- migration set is a faithful description of the database.
--
-- The four columns are declared exactly as they exist live: `text`, nullable, no
-- default. They are added, not recreated, so no data can be lost if they are already
-- present.
--
-- Deliberately NOT done here:
--
--   * No defaults, NOT NULL constraints, indexes, CHECK constraints or comments.
--   * No data is inserted and no existing row is updated. The default for an added
--     nullable column is NULL, which is already the live value for every row.
--   * Nothing is dropped or modified.
--   * `canonical_url` and `og_image` are kept even though the application does not
--     read or write them yet. Deciding their fate is deferred (C6-07); dropping them
--     here would destroy a decision that is not part of this change.
--
-- `if not exists` makes this safe to apply both to a fresh database built from the
-- migration set and to the current live database where the columns already exist, and
-- safe to apply more than once.
--
-- `public.articles` RLS, policies, triggers and the authorization architecture are
-- untouched. ARTICLE_OWNER_USER_ID remains the sole owner mechanism.
-- =========================================================

alter table public.articles
  add column if not exists seo_title text;

alter table public.articles
  add column if not exists seo_description text;

alter table public.articles
  add column if not exists canonical_url text;

alter table public.articles
  add column if not exists og_image text;