export const SITE_TITLE = '不宁yasushi';
export const SITE_DESCRIPTION = 'A minimal personal website built with Astro, MDX, and Tailwind CSS.';
export const SITE_URL = 'https://ning0713.github.io';

export const NAV_ITEMS = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/academic', label: 'Academic' },
  { href: '/links', label: 'Links' },
  { href: '/about', label: 'About' },
] as const;

export const BLOG_CATEGORY_ITEMS = [
  { slug: 'technical', label: 'Technical' },
  { slug: 'life-and-talk', label: 'Life and Talk' },
  { slug: 'journal', label: 'Journal' },
] as const;

export const BLOG_CATEGORY_META = {
  technical: {
    label: 'Technical',
    description: 'Engineering notes, implementation diaries, and toolchain write-ups.',
  },
  'life-and-talk': {
    label: 'Life and Talk',
    description: 'Daily life, learning fragments, and conversations with myself.',
  },
  journal: {
    label: 'Journal',
    description: 'Month notes, short essays, and ongoing public thinking.',
  },
} as const;
