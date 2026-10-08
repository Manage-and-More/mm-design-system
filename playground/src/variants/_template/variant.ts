import { defineVariant } from '@/core/variant';

// Created by `pnpm new:variant`. The id must match this folder's name.
export default defineVariant({
  id: '__ID__',
  name: '__NAME__',
  summary: '__SUMMARY__',
  status: 'draft',
  basedOn: '__BASED_ON__',
  // Add 'dark' once tokens.json has $extensions.mm.modes.dark values.
  modes: ['light'],
  styles: () => import('./styles.css'),
  pages: [
    { slug: 'overview', title: 'Overview', group: 'Components', summary: 'Starting point for this variant.', load: () => import('./pages/Overview') },
  ],
});
