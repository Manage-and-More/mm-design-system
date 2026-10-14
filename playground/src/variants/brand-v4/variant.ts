import { defineVariant } from '@/core/variant';

/**
 * Brand v4: the studio-landing skill (Architectural cluster) applied to Brand v1, the programme site.
 * Experimental. Every deliberate deviation from AGENTS.md is listed in NOTES.md.
 */
export default defineVariant({
  id: 'brand-v4',
  name: 'Brand v4',
  summary: 'Studio landing language for the programme site',
  status: 'experimental',
  basedOn: 'brand',
  modes: ['light'],
  styles: () => import('./styles.css'),
  pages: [
    {
      slug: 'landing',
      title: 'Landing page',
      group: 'Templates',
      layout: 'fullscreen',
      summary: 'The programme landing page in the studio-landing language: cohort photo with a low blue light, one pinned stage, outline wordmark.',
      load: () => import('./pages/LandingPage'),
    },
  ],
});
