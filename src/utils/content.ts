import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** 公開文章固定依發布日由新到舊排列。 */
export const byNewest = (a: BlogPost, b: BlogPost) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export const visiblePosts = (posts: BlogPost[]) =>
  posts.filter((post) => !post.data.draft).sort(byNewest);

/** 頁面與元件共用的公開文章查詢，避免各處重複 filter/sort。 */
export async function getVisiblePosts() {
  return visiblePosts(await getCollection('blog'));
}

export const slugifyTaxonomy = (value: string) => encodeURIComponent(value.trim());

export const postPath = (postOrSlug: BlogPost | string) =>
  `/blog/${typeof postOrSlug === 'string' ? postOrSlug : postOrSlug.slug}/`;

export const categoryPath = (category: string) =>
  `/category/${slugifyTaxonomy(category)}/`;

export const tagPath = (tag: string) =>
  `/tag/${slugifyTaxonomy(tag)}/`;

export const seriesPath = (series: string) =>
  `/series/${slugifyTaxonomy(series)}/`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export function serializePost(post: BlogPost) {
  return {
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    date: formatDate(post.data.pubDate),
    cover: post.data.cover ?? '/sample-cover.webp',
    coverAlt: post.data.coverAlt ?? post.data.title,
    url: postPath(post),
  };
}

export function sortPopularPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const aRank = a.data.popularRank ?? Number.POSITIVE_INFINITY;
    const bRank = b.data.popularRank ?? Number.POSITIVE_INFINITY;
    if (aRank !== bRank) return aRank - bRank;

    const aScore = a.data.featured ? 1 : 0;
    const bScore = b.data.featured ? 1 : 0;
    if (aScore !== bScore) return bScore - aScore;

    return byNewest(a, b);
  });
}

export function categoryCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function plainTextFromMarkdown(source = '') {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`|~\[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scoreRelated(current: BlogPost, candidate: BlogPost) {
  if (current.slug === candidate.slug) return -1;
  let score = 0;
  if (current.data.category === candidate.data.category) score += 8;
  const currentTags = new Set(current.data.tags ?? []);
  for (const tag of candidate.data.tags ?? []) {
    if (currentTags.has(tag)) score += 3;
  }
  if (candidate.data.featured) score += 1;
  return score;
}

export function relatedPosts(current: BlogPost, posts: BlogPost[], limit = 4) {
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({ post, score: scoreRelated(current, post) }))
    .sort((a, b) => b.score - a.score || byNewest(a.post, b.post))
    .slice(0, limit)
    .map(({ post }) => post);
}

export function seriesPosts(current: BlogPost, posts: BlogPost[]) {
  if (!current.data.series) return [];
  return posts
    .filter((post) => post.data.series === current.data.series)
    .sort((a, b) =>
      (a.data.seriesOrder ?? 999) - (b.data.seriesOrder ?? 999) || byNewest(a, b),
    );
}

export function estimateReadingMinutes(text: string, explicit?: number) {
  if (explicit) return explicit;
  const compact = text.replace(/\s+/g, '');
  return Math.max(1, Math.ceil(compact.length / 500));
}
