import { useLocation, useParams, useSearch } from 'wouter';
import { getPage, getVariant, pagesOf } from './registry';
import type { Mode } from './variant';

export type Viewport = 'fill' | number;

export const VIEWPORT_PRESETS: { label: string; value: Viewport; hint: string }[] = [
  { label: 'Fill', value: 'fill', hint: 'Fill the stage' },
  { label: '390', value: 390, hint: 'Phone' },
  { label: '768', value: 768, hint: 'Tablet (md)' },
  { label: '1280', value: 1280, hint: 'Laptop' },
  { label: '1536', value: 1536, hint: 'Desktop (2xl)' },
];

export interface ShellState {
  variantId: string;
  pageSlug: string;
  mode: Mode;
  viewport: Viewport;
  compare: string | null;
}

const parseViewport = (v: string | null): Viewport => {
  const n = Number(v);
  return v && Number.isFinite(n) && n >= 280 ? Math.round(n) : 'fill';
};

/** All shell state lives in the URL: /:variant/:page?mode=dark&vp=390&compare=saas */
export function useShellState() {
  const [, navigate] = useLocation();
  const params = useParams<{ variant: string; page?: string }>();
  const search = new URLSearchParams(useSearch());

  const state: ShellState = {
    variantId: params.variant,
    pageSlug: params.page ?? '',
    mode: search.get('mode') === 'dark' ? 'dark' : 'light',
    viewport: parseViewport(search.get('vp')),
    compare: search.get('compare'),
  };

  const update = (next: Partial<ShellState>) => {
    const s = { ...state, ...next };
    const variant = getVariant(s.variantId);
    // Switching variant keeps the page when it exists there, otherwise opens the first page.
    if (variant && !getPage(variant, s.pageSlug)) s.pageSlug = pagesOf(variant)[0]?.slug ?? '';
    if (variant && !(variant.modes ?? ['light']).includes(s.mode)) s.mode = 'light';
    const q = new URLSearchParams();
    if (s.mode !== 'light') q.set('mode', s.mode);
    if (s.viewport !== 'fill') q.set('vp', String(s.viewport));
    if (s.compare && s.compare !== s.variantId) q.set('compare', s.compare);
    navigate(`/${s.variantId}/${s.pageSlug}${q.size ? `?${q}` : ''}`);
  };

  return [state, update] as const;
}
