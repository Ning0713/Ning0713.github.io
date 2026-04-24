type ContentEntry = {
  body?: string;
  data: {
    title?: string;
    description?: string;
  };
};

const CJK_CHAR_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const LATIN_WORD_PATTERN = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

function stripMarkdownSyntax(input: string) {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*(import|export)\s.+$/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/\r?\n+/g, ' ')
    .trim();
}

export function countReadableWords(input: string) {
  const cleaned = stripMarkdownSyntax(input);
  const cjkChars = cleaned.match(CJK_CHAR_PATTERN)?.length ?? 0;
  const latinWords = cleaned.replace(CJK_CHAR_PATTERN, ' ').match(LATIN_WORD_PATTERN)?.length ?? 0;
  return cjkChars + latinWords;
}

export function countCollectionWords(entries: ContentEntry[]) {
  return entries.reduce((total, entry) => {
    const segments = [entry.data.title, entry.data.description, entry.body ?? ''].filter(Boolean);
    return total + countReadableWords(segments.join(' '));
  }, 0);
}
