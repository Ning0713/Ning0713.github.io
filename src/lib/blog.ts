import type { CollectionEntry } from 'astro:content';
import { BLOG_CATEGORY_ITEMS, BLOG_CATEGORY_META } from '../consts';
import { dedupeEntriesBySlug, sortByDateDesc } from './content';

export const BLOG_PAGE_SIZE = 6;

export type BlogPost = CollectionEntry<'blog'>;
export type BlogPostCollection = CollectionEntry<'postCollections'>;
export type BlogCategory = keyof typeof BLOG_CATEGORY_META;

export interface BlogPaginationResult {
  page: number;
  totalPages: number;
  totalPosts: number;
  startIndex: number;
  endIndex: number;
  posts: BlogPost[];
}

export interface BlogCollectionOverview {
  slug: string;
  label: string;
  count: number;
  href: string;
  description?: string;
  cover?: string;
  bloglist?: string[];
  source?: 'content' | 'frontmatter';
}

export interface BlogTagOverview {
  tag: string;
  count: number;
  href: string;
}

export function sortBlogPosts(posts: BlogPost[]) {
  return dedupeEntriesBySlug(posts).sort(sortByDateDesc);
}

export function paginateBlogPosts(posts: BlogPost[], page: number, pageSize = BLOG_PAGE_SIZE): BlogPaginationResult {
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startOffset = (safePage - 1) * pageSize;
  const pagePosts = posts.slice(startOffset, startOffset + pageSize);
  const startIndex = totalPosts === 0 ? 0 : startOffset + 1;
  const endIndex = totalPosts === 0 ? 0 : startOffset + pagePosts.length;

  return {
    page: safePage,
    totalPages,
    totalPosts,
    startIndex,
    endIndex,
    posts: pagePosts,
  };
}

export function getBlogCategoryPageHref(category: BlogCategory, page = 1) {
  if (category === 'technical') {
    return page === 1 ? '/blog' : `/blog/page/${page}`;
  }

  return page === 1 ? `/blog/category/${category}` : `/blog/category/${category}/page/${page}`;
}

export function getBlogCollectionPageHref(collection: string, page = 1) {
  const encodedCollection = encodeURIComponent(collection);
  return page === 1 ? `/collection/${encodedCollection}` : `/collection/${encodedCollection}/page/${page}`;
}

export function getBlogTagPageHref(tag: string, page = 1) {
  const encodedTag = encodeURIComponent(tag);
  return page === 1 ? `/blog/tag/${encodedTag}` : `/blog/tag/${encodedTag}/page/${page}`;
}

export function buildBlogPaginationLinks(totalPages: number, currentPage: number, hrefForPage: (page: number) => string) {
  return Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      page,
      href: hrefForPage(page),
      isCurrent: page === currentPage,
    };
  });
}

export function getBlogCategoryOverview(posts: BlogPost[]): BlogCollectionOverview[] {
  return BLOG_CATEGORY_ITEMS.map((item) => ({
    slug: item.slug,
    label: item.label,
    count: posts.filter((post) => post.data.category === item.slug).length,
    href: getBlogCategoryPageHref(item.slug),
  }));
}

function cleanCollectionId(value: string) {
  return value
    .trim()
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '')
    .replace(/\/index$/i, '');
}

function normalizeLookupValue(value: string) {
  let decoded = value.trim();

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    decoded = value.trim();
  }

  return cleanCollectionId(decoded).toLowerCase();
}

function buildPostLookup(posts: BlogPost[]) {
  const lookup = new Map<string, BlogPost>();

  for (const post of posts) {
    const keys = [
      post.id,
      post.slug,
      post.data.title,
      cleanCollectionId(post.id),
      cleanCollectionId(post.slug),
    ];

    for (const key of keys) {
      const normalized = normalizeLookupValue(key);

      if (normalized && !lookup.has(normalized)) {
        lookup.set(normalized, post);
      }
    }
  }

  return lookup;
}

function isPostInCollection(post: BlogPost, collection: BlogCollectionOverview) {
  const postCollection = normalizeLookupValue(post.data.collection ?? '');
  return postCollection === normalizeLookupValue(collection.label) || postCollection === normalizeLookupValue(collection.slug);
}

export function getPostsForBlogCollection(collection: BlogCollectionOverview, posts: BlogPost[]) {
  const references = collection.bloglist ?? [];

  if (references.length > 0) {
    const lookup = buildPostLookup(posts);
    return references
      .map((reference) => lookup.get(normalizeLookupValue(reference)))
      .filter((post): post is BlogPost => Boolean(post));
  }

  return posts.filter((post) => isPostInCollection(post, collection));
}

export function getBlogCollectionOverview(
  posts: BlogPost[],
  contentCollections: BlogPostCollection[] = [],
): BlogCollectionOverview[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const collection = (post.data.collection ?? '').trim() || '未分类';
    counts.set(collection, (counts.get(collection) ?? 0) + 1);
  }

  const definedCollections = contentCollections
    .filter((collection) => !collection.data.draft)
    .map((collection) => {
      const slug = cleanCollectionId(collection.id);
      const overview: BlogCollectionOverview = {
        slug,
        label: collection.data.title,
        count: 0,
        href: getBlogCollectionPageHref(slug),
        description: collection.data.description,
        cover: collection.data.cover,
        bloglist: collection.data.bloglist,
        source: 'content',
      };

      return {
        ...overview,
        count: getPostsForBlogCollection(overview, posts).length,
      };
    });

  const definedCollectionKeys = new Set(
    definedCollections.flatMap((collection) => [
      normalizeLookupValue(collection.slug),
      normalizeLookupValue(collection.label),
    ]),
  );

  const fallbackCollections = [...counts.entries()]
    .filter(([collection]) => !definedCollectionKeys.has(normalizeLookupValue(collection)))
    .sort((left, right) => {
      const countDiff = right[1] - left[1];
      if (countDiff !== 0) {
        return countDiff;
      }

      return left[0].localeCompare(right[0], 'zh-Hans-CN');
    })
    .map(([collection, count]) => ({
      slug: collection,
      label: collection,
      count,
      href: getBlogCollectionPageHref(collection),
      source: 'frontmatter' as const,
    }));

  return [...definedCollections, ...fallbackCollections];
}

export function getBlogTagOverview(posts: BlogPost[]): BlogTagOverview[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const rawTag of post.data.tags ?? []) {
      const tag = rawTag.trim();
      if (!tag) {
        continue;
      }

      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => {
      const countDiff = right[1] - left[1];
      if (countDiff !== 0) {
        return countDiff;
      }

      return left[0].localeCompare(right[0], 'en');
    })
    .map(([tag, count]) => ({
      tag,
      count,
      href: getBlogTagPageHref(tag),
    }));
}
