import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"Microsoft YaHei UI"', '"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
        serif: ['"Microsoft YaHei"', '"Microsoft YaHei UI"', '"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(15, 23, 42, 0.35)',
      },
      maxWidth: {
        reading: '72ch',
      },
    },
  },
  plugins: [typography],
};
