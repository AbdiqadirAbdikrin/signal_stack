export type ArticleStatus = "draft" | "published";

export interface ArticleRecord {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string;
    tags: string[];
    featured_image: string | null;
    author_id: string | null;
    status: ArticleStatus;
    seo_title: string | null;
    seo_description: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ArticleInput {
    title: string;
    slug?: string;
    excerpt?: string | null;
    content: string;
    category: string;
    tags?: string[];
    featured_image?: string | null;
    status?: ArticleStatus;
    seo_title?: string | null;
    seo_description?: string | null;
    author_id?: string | null;
}

export interface ArticleListFilters {
    search?: string;
    category?: string;
    status?: ArticleStatus | "all";
    author_id?: string | null;
    page?: number;
    pageSize?: number;
}

export interface ArticlesPageResult {
    articles: ArticleRecord[];
    count: number;
    page: number;
    pageSize: number;
}
