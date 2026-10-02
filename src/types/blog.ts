export type Category = "AI" | "Cloud" | "DevOps" | "Development";

export interface Author {
    slug: string;
    name: string;
    title: string;
    bio: string;
    avatar: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
}

export interface PostFrontmatter {
    title: string;
    description: string;
    date: string;
    updated?: string;
    author: string;
    category: Category;
    tags: string[];
    image: string;
    imageAlt: string;
    featured?: boolean;
}

export interface Post extends PostFrontmatter {
    slug: string;
    readingTime: number;
    content: string;
}

export interface TocItem {
    id: string;
    text: string;
    level: number;
}
