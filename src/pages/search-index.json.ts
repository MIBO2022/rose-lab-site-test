import { getVisiblePosts, plainTextFromMarkdown, postPath } from '../utils/content';

export async function GET() {
  const posts = (await getVisiblePosts()).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags ?? [],
    series: post.data.series ?? '',
    pubDate: post.data.pubDate.toISOString(),
    cover: post.data.cover ?? '',
    url: postPath(post),
    text: plainTextFromMarkdown(post.body ?? '').slice(0, 5000),
  }));

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
