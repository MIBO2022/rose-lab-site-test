import rss from '@astrojs/rss';
import { SITE } from '../config/site';
import { getVisiblePosts, postPath } from '../utils/content';

export async function GET(context) {
  const posts = await getVisiblePosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postPath(post),
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
    customData: '<language>zh-TW</language>',
  });
}
