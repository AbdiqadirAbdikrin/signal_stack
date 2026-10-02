# Signal Stack

Signal Stack is a production-ready technology publication built with Next.js, TypeScript, Tailwind, and MDX. It is designed for AI, cloud, DevOps, and software engineering coverage with SEO, structured data, and content-first architecture..

## Install

```bash
npm install
cp .env.example .env.local
```

Set your site URL in `.env.local` before running locally:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Create a new article

Add a new MDX file under `src/content/posts/`:

```mdx
---
title: "Example article"
description: "A practical summary for developers."
date: "2026-09-30"
author: "aisha-patel"
category: "AI"
tags: ["llms", "ai-engineering"]
image: "https://images.unsplash.com/..."
imageAlt: "Description of the hero image"
featured: true
---

Your article content goes here.
```

The slug is derived from the filename, so `src/content/posts/what-is-rag.mdx` becomes `/blog/what-is-rag`.

## How MDX works

Each article is stored as an MDX file with frontmatter. The app reads the file from the filesystem, parses the metadata, and renders the article body with MDX components. That allows rich formatting, fenced code blocks, lists, and embedded technical examples without a database.

## How SEO metadata works

Each article defines canonical metadata in frontmatter and generates dynamic `Metadata` values from the route. The app also outputs structured data using JSON-LD for articles, breadcrumbs, and organization-level metadata.

## How sitemap works

The app generates a static sitemap at `/sitemap.xml` by combining:

- the homepage and core content routes
- category pages
- article detail pages

It is defined in `src/app/sitemap.ts` and is automatically picked up by search engines.

## How RSS works

The RSS feed is generated at `/rss.xml` inside `src/app/rss.xml/route.ts`. It publishes the latest article summaries in standard RSS 2.0 format.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy.

Example:

```bash
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

## Connect a custom domain later

In Vercel:

1. Open the project dashboard.
2. Go to Settings > Domains.
3. Add your domain.
4. Follow the DNS verification instructions.
5. Configure the domain in your DNS provider.

## Connect Google Search Console

1. Verify your domain with Google Search Console.
2. Submit your sitemap URL: `https://www.example.com/sitemap.xml`
3. Monitor indexing status for the homepage and article URLs.
4. Review core web vitals and mobile usability after deployment.

## Useful commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

This project intentionally follows Google’s people-first SEO principles, avoids spammy tactics, and focuses on useful, original content for developers.
