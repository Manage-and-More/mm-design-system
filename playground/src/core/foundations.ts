import type { PageDefinition } from './variant';

/** Token-driven pages every variant gets for free (rendered from generated/tokens.json). */
export const foundationPages: PageDefinition[] = [
  { slug: 'colors', title: 'Colour', group: 'Foundations', summary: 'Palette, semantic roles and contrast.', load: () => import('./docs/pages/ColorsPage') },
  { slug: 'typography', title: 'Typography', group: 'Foundations', summary: 'Families, weights, sizes, leading and tracking.', load: () => import('./docs/pages/TypographyPage') },
  { slug: 'spacing', title: 'Spacing & Layout', group: 'Foundations', summary: 'Space scale, section rhythm, containers, gutters and breakpoints.', load: () => import('./docs/pages/SpacingPage') },
  { slug: 'shape', title: 'Shape', group: 'Foundations', summary: 'Radii, strokes, sizes, aspect ratios and opacity.', load: () => import('./docs/pages/ShapePage') },
  { slug: 'motion', title: 'Motion', group: 'Foundations', summary: 'Durations and easing curves, live.', load: () => import('./docs/pages/MotionPage') },
  { slug: 'tokens', title: 'All tokens', group: 'Foundations', summary: 'Every resolved token with its CSS variable and origin.', load: () => import('./docs/pages/AllTokensPage') },
];
