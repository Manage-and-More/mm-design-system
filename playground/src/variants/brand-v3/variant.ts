import { defineVariant } from '@/core/variant';

/**
 * Brand v3: the studio-landing skill (Architectural cluster) applied to the Brand v2 identity.
 * Experimental. Every deliberate deviation from AGENTS.md is listed in NOTES.md.
 */
export default defineVariant({
  id: 'brand-v3',
  name: 'Brand v3',
  summary: 'Studio landing language: quiet page, loud weather',
  status: 'experimental',
  basedOn: 'brand-v2',
  modes: ['light', 'dark'],
  // Like Brand v2, no accent besides the one blue.
  hideTokens: ['color.brand.yellow'],
  styles: () => import('./styles.css'),
  pages: [
    { slug: 'landing', title: 'Landing page', group: 'Templates', layout: 'fullscreen', summary: 'Hackathon platform entry page in the studio-landing language: night backdrop with a low blue horizon, one pinned stage, pixel wordmark.', load: () => import('./pages/LandingPage') },
  ],
});
