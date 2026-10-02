import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { authorMap } from "@/content/authors";
import { getPublicArticleBySlug, getPublicArticles } from "@/lib/articles";
import { getCategoryBySlug, readingTimeForContent } from "@/lib/site";
import type { Post, PostFrontmatter, TocItem } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "src", "content", "posts");

export async function getAllPosts(): Promise<Post[]> {
    const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));

    const staticPosts = files
        .map((file) => {
            const raw = fs.readFileSync(path.join(postsDirectory, file), "utf8");
            const { data, content } = matter(raw);

            const frontmatter = data as PostFrontmatter;
            const slug = file.replace(/\.mdx$/, "");

            return {
                ...frontmatter,
                slug,
                readingTime: readingTimeForContent(content),
                content,
            } satisfies Post;
        });

    const publicPosts = await getPublicArticles();
    const posts = [...publicPosts, ...staticPosts].filter(
        (post, index, all) => all.findIndex((item) => item.slug === post.slug) === index,
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const dbArticle = await getPublicArticleBySlug(slug);
    if (dbArticle) {
        return dbArticle;
    }

    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug) ?? null;
}

export async function getFeaturedPosts(count = 3): Promise<Post[]> {
    const posts = await getAllPosts();
    return posts.filter((post) => post.featured).slice(0, count);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
    const resolved = getCategoryBySlug(category) ?? category;
    const posts = await getAllPosts();
    return posts.filter((post) => post.category === resolved);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
    const normalized = tag.toLowerCase();
    const posts = await getAllPosts();
    return posts.filter((post) => post.tags.some((item) => item.toLowerCase() === normalized));
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
    const posts = await getAllPosts();
    return posts.filter((post) => post.author === authorSlug);
}

export async function getAuthorBySlug(slug: string) {
    return authorMap[slug] ?? null;
}

export function extractToc(content: string): TocItem[] {
    const headings = content.match(/^#{1,3}\s+(.+)$/gm) ?? [];

    return headings
        .map((heading) => {
            const level = heading.match(/^#+/)?.[0].length ?? 1;
            const text = heading.replace(/^#{1,3}\s+/, "").trim();
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

            return { id, text, level };
        })
        .filter((heading) => Boolean(heading.id && heading.text));
}

export async function getRelatedPosts(currentPost: Post): Promise<Post[]> {
    const posts = await getAllPosts();
    const sameCategory = posts.filter(
        (post) => post.slug !== currentPost.slug && post.category === currentPost.category,
    );

    const byTag = posts.filter((post) => {
        if (post.slug === currentPost.slug || post.category === currentPost.category) {
            return false;
        }

        return post.tags.some((tag) => currentPost.tags.includes(tag));
    });

    return [...sameCategory, ...byTag].slice(0, 3);
}
