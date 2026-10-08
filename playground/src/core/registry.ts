import { foundationPages } from './foundations';
import type { PageDefinition, VariantDefinition } from './variant';

/**
 * Variants are discovered from src/variants/<id>/variant.ts. Folders starting with
 * `_` (templates) are ignored. Only metadata is eager; pages and CSS stay lazy.
 */
const modules = import.meta.glob<{ default: VariantDefinition }>(['../variants/*/variant.ts', '!../variants/_*/variant.ts'], {
  eager: true,
});

const statusOrder = { canonical: 0, draft: 1, experimental: 2 } as const;

export const GROUP_ORDER = ['Foundations', 'Components', 'Patterns', 'Templates', 'Assets'];

export const variants: VariantDefinition[] = Object.entries(modules)
  .map(([file, mod]) => {
    const folder = file.split('/').at(-2);
    if (mod.default.id !== folder) console.warn(`[registry] variant id "${mod.default.id}" should match its folder "${folder}"`);
    return mod.default;
  })
  .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.name.localeCompare(b.name));

export const getVariant = (id: string | undefined) => variants.find((v) => v.id === id);

export function pagesOf(variant: VariantDefinition): PageDefinition[] {
  const hidden = new Set(variant.hideFoundations);
  const own = new Set(variant.pages.map((p) => p.slug));
  const auto = foundationPages.filter((p) => !hidden.has(p.slug) && !own.has(p.slug));
  return [...auto, ...variant.pages];
}

export const getPage = (variant: VariantDefinition, slug: string | undefined) => pagesOf(variant).find((p) => p.slug === slug);

/** Pages in sidebar order (grouped), used for previous/next navigation. */
export const orderedPages = (variant: VariantDefinition) => groupPages(pagesOf(variant)).flatMap(([, pages]) => pages);

export function groupPages(pages: PageDefinition[]) {
  const groups = new Map<string, PageDefinition[]>();
  for (const page of pages) groups.set(page.group, [...(groups.get(page.group) ?? []), page]);
  const rank = (g: string) => (GROUP_ORDER.includes(g) ? GROUP_ORDER.indexOf(g) : GROUP_ORDER.length);
  return [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b));
}
