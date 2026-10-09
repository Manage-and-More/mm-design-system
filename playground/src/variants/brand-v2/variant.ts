import { defineVariant } from '@/core/variant';

export default defineVariant({
  id: 'brand-v2',
  name: 'Brand v2',
  summary: 'Quiet, Apple-like landing language for tech products, drawn in hairline',
  status: 'draft',
  basedOn: 'brand',
  modes: ['light', 'dark'],
  // Brand v2 has no accent colour: the brand yellow is retired here (decision 2026-10-09)
  hideTokens: ['color.brand.yellow'],
  styles: () => import('./styles.css'),
  pages: [
    { slug: 'type', title: 'Type in use', group: 'Components', summary: 'Display with the one outline line, headings with size-specific tracking, lead, body, links. No labels above headings.', load: () => import('./pages/TypePage') },
    { slug: 'ctas', title: 'Calls to action', group: 'Components', summary: 'Pill = action: primary, action and quiet pills, arrow link, text link, chips.', load: () => import('./pages/CtasPage') },
    { slug: 'cards', title: 'Cards & lists', group: 'Components', summary: 'Shadow-lifted utility and feature cards, full-bleed tiles, audience tabs, stat row, FAQ.', load: () => import('./pages/CardsPage') },
    { slug: 'figures', title: 'Hairline figures', group: 'Components', summary: 'The three custom figures and the library figures used, with the brand stroke.', load: () => import('./pages/FiguresPage') },
    { slug: 'empty', title: 'Empty states', group: 'Components', summary: 'Library figures above a heading and one action.', load: () => import('./pages/EmptyStatesPage') },
    { slug: 'header', title: 'Header', group: 'Patterns', summary: 'Translucent sticky header with the underline wipe and one CTA.', load: () => import('./pages/HeaderPage') },
    { slug: 'hero', title: 'Hero', group: 'Patterns', summary: 'Text left, figure on a product plate right, label in the corner.', load: () => import('./pages/HeroPage') },
    { slug: 'footer', title: 'Footer', group: 'Patterns', summary: 'Hairline-ruled footer with the descriptor lock-up.', load: () => import('./pages/FooterPage') },
    { slug: 'landing', title: 'Landing page', group: 'Templates', layout: 'fullscreen', summary: 'Hackathon platform entry page for participants, judges and organisers.', load: () => import('./pages/LandingPage') },
  ],
});
