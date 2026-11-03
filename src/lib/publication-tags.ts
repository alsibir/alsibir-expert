import { getCollection } from 'astro:content';
import { slug } from 'github-slugger';

/** Same source and URL normalization as the blog's individual tag pages. */
export async function getPublicationTags() {
  const entries = await getCollection('docs', entry => !entry.data.draft && !!entry.filePath?.replaceAll('\\', '/').includes('/docs/blog/') && !!entry.data.date);
  const counts = new Map<string, { label: string; count: number }>();
  for (const entry of entries) {
    for (const key of new Set((entry.data.tags ?? []).map(tag => slug(tag)))) {
      const label = entry.data.tags!.find(tag => slug(tag) === key)!;
      const current = counts.get(key);
      counts.set(key, { label: current?.label ?? label, count: (current?.count ?? 0) + 1 });
    }
  }
  return [...counts].map(([key, item]) => ({ ...item, href: `${import.meta.env.BASE_URL}blog/tags/${key}/` }));
}
