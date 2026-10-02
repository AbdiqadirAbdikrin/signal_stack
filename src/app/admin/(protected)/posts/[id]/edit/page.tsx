import { redirect } from "next/navigation";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/admin/articles/${id}/edit`);
}
