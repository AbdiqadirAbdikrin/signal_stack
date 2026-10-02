import { getAllPosts } from "@/lib/content";

export async function GET() {
    const posts = await getAllPosts();

    return Response.json(posts);
}
