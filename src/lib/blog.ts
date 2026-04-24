import type { CollectionEntry } from 'astro:content';
import { BLOG_CATEGORY_ITEMS, BLOG_CATEGORY_META } from '../consts';
import { dedupeEntriesBySlug, sortByDateDesc } from './content';

export const BLOG_PAGE_SIZE = 6;

export type BlogPost = CollectionEntry<'blog'>;
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

export function getBlogCollectionOverview(posts: BlogPost[]): BlogCollectionOverview[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const collection = (post.data.collection ?? '').trim() || '未分类';
    counts.set(collection, (counts.get(collection) ?? 0) + 1);
  }

  return [...counts.entries()]
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
    }));
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
