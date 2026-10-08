import { defineVariant } from '@/core/variant';

export default defineVariant({
  id: 'brand',
  name: 'Brand v1',
  summary: 'The current system, as on manageandmore.de',
  status: 'canonical',
  modes: ['light'],
  styles: () => import('./styles.css'),
  pages: [
    { slug: 'type', title: 'Type in use', group: 'Components', summary: 'Display, two-tone headings, lead, eyebrow and prose.', load: () => import('./pages/TypePage') },
    { slug: 'ctas', title: 'Calls to action', group: 'Components', summary: 'Arrow link with sticker (primary) and the form button.', load: () => import('./pages/CtasPage') },
    { slug: 'cards', title: 'Cards', group: 'Components', summary: 'Photo, feature, person and plain cards.', load: () => import('./pages/CardsPage') },
    { slug: 'stats', title: 'Stats & chips', group: 'Components', summary: 'Stat row, chips and UI glyphs.', load: () => import('./pages/StatsPage') },
    { slug: 'faq', title: 'FAQ', group: 'Components', summary: 'Disclosure built on <details>, animated where supported.', load: () => import('./pages/FaqPage') },
    { slug: 'surfaces', title: 'Surfaces', group: 'Components', summary: 'The five section tones and how content inherits colour.', load: () => import('./pages/SurfacesPage') },
    { slug: 'header', title: 'Header', group: 'Patterns', summary: 'Solid and transparent header. Below 768px it becomes a menu toggle.', load: () => import('./pages/HeaderPage') },
    { slug: 'hero', title: 'Hero', group: 'Patterns', summary: 'Full-bleed home hero and page hero with the endorsement label.', load: () => import('./pages/HeroPage') },
    { slug: 'footer', title: 'Footer', group: 'Patterns', summary: 'Black footer with descriptor lockup and back-to-top.', load: () => import('./pages/FooterPage') },
    { slug: 'landing', title: 'Landing page', group: 'Templates', layout: 'fullscreen', summary: 'examples/landing-page.html as a live template.', load: () => import('./pages/LandingPage') },
    { slug: 'logos', title: 'Logos & labels', group: 'Assets', summary: 'From assets/catalog.json.', load: () => import('./pages/LogosPage') },
    { slug: 'icons', title: 'Icons & glyphs', group: 'Assets', summary: 'Print icons, web pictograms and UI glyphs.', load: () => import('./pages/IconsPage') },
    { slug: 'imagery', title: 'Imagery', group: 'Assets', summary: 'Illustrations, infographics and photography.', load: () => import('./pages/ImageryPage') },
  ],
});
