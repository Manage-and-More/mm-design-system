import type { ComponentType } from 'react';

export type VariantStatus = 'canonical' | 'draft' | 'experimental';
export type Mode = 'light' | 'dark';
export type PageGroup = 'Foundations' | 'Components' | 'Patterns' | 'Templates' | 'Assets' | (string & {});

export interface PageDefinition {
  /** URL segment, unique within a variant. Same slug across variants lines pages up in Compare. */
  slug: string;
  title: string;
  group: PageGroup;
  /** `padded` (default) wraps the page in a docs frame; `fullscreen` renders edge to edge. */
  layout?: 'padded' | 'fullscreen';
  /**
   * `page`: the canvas grows to its content and scrolls with the whole playground.
   * `frame`: the canvas is a browser-sized window with its own scroll, needed for fixed or
   * sticky elements and scroll effects. Default: `frame` for fullscreen pages, `page` otherwise.
   */
  scroll?: 'page' | 'frame';
  /** One line shown under the page title. */
  summary?: string;
  load: () => Promise<{ default: ComponentType }>;
}

export interface VariantDefinition {
  /** Must equal the folder name in src/variants/. */
  id: string;
  name: string;
  summary: string;
  status: VariantStatus;
  /** Variant this one grows out of, for documentation (tokens always layer on core). */
  basedOn?: string;
  /** Modes the variant defines token values for. Default: ['light']. */
  modes?: Mode[];
  /** Lazy stylesheet import; only ever loaded inside the canvas iframe. */
  styles: () => Promise<unknown>;
  /** Hand-written pages. Foundations pages are added automatically from tokens. */
  pages: PageDefinition[];
  /** Opt out of auto-generated Foundations pages by slug. */
  hideFoundations?: string[];
}

export const scrollModeOf = (page: PageDefinition) => page.scroll ?? (page.layout === 'fullscreen' ? 'frame' : 'page');

export const defineVariant = (variant: VariantDefinition) => variant;

export const definePages = (pages: PageDefinition[]) => pages;
