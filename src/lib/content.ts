export function sortByDateDesc<T extends { data: { date: Date } }>(left: T, right: T) {
  return right.data.date.valueOf() - left.data.date.valueOf();
}

export function dedupeEntriesBySlug<T extends { slug: string }>(entries: T[]) {
  const uniqueEntries = new Map<string, T>();

  for (const entry of entries) {
    if (!uniqueEntries.has(entry.slug)) {
      uniqueEntries.set(entry.slug, entry);
    }
  }

  return [...uniqueEntries.values()];
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
