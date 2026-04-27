import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { basename, extname } from 'node:path';
import remarkContentFixes from './src/lib/remark-content-fixes.mjs';

const katexPlugins = [[rehypeKatex, { strict: false, throwOnError: false }]];
const remarkPlugins = [remarkMath, remarkContentFixes];

export default defineConfig({
  site: 'https://ning0713.github.io',
  build: {
    format: 'directory',
    assets: 'assets',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.names?.[0] ?? 'asset';
            const extension = extname(fileName);
            const baseName = basename(fileName, extension).replace(/^_+/, '') || 'asset';
            return `assets/${baseName}.[hash][extname]`;
          },
        },
      },
    },
  },
  integrations: [
    mdx({
      remarkPlugins,
      rehypePlugins: katexPlugins,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins: katexPlugins,
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
