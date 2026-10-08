import type { ResolvedToken } from '../../plugins/dtcg';

export type { ResolvedToken };

const loaders = import.meta.glob<ResolvedToken[]>('../variants/*/generated/tokens.json', { import: 'default' });

/** Resolved tokens (core + variant) written by the mm-tokens Vite plugin. */
export async function loadTokens(variantId: string): Promise<ResolvedToken[]> {
  const load = loaders[`../variants/${variantId}/generated/tokens.json`];
  if (!load) throw new Error(`No generated tokens for "${variantId}". Is the dev server running the mm-tokens plugin?`);
  return load();
}

export const byPrefix = (tokens: ResolvedToken[], prefix: string) =>
  tokens.filter((t) => t.path === prefix || t.path.startsWith(prefix + '.'));

/** Last path segments after a prefix, e.g. ("color.brand.blue", "color.brand") → "blue". */
export const shortName = (path: string, prefix: string) => path.slice(prefix.length + 1) || path.split('.').at(-1)!;
