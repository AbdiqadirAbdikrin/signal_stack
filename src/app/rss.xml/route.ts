import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export async function GET() {
    const posts = await getAllPosts();

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    ${posts
            .map(
                (post) => `
        <item>
          <title>${post.title}</title>
          <link>${siteConfig.url}/blog/${post.slug}</link>
          <description><![CDATA[${post.description}]]></description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <guid>${siteConfig.url}/blog/${post.slug}</guid>
        </item>`,
            )
            .join("")}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}
