import cohort from '@ds/assets/photography/website/cohort-group.webp';
import { Specimen } from '@/core/docs/Specimen';
import { Header } from '../components';

/** `contain: paint` makes the specimen the containing block for the fixed mobile menu overlay. */
const contained = { contain: 'layout paint', minHeight: 420 } as const;

export default function HeaderPage() {
  return (
    <>
      <Specimen title="Solid" description="After 60px of scroll, and on pages without a hero. At the 390 viewport it collapses into the menu toggle." bleed>
        <div style={{ ...contained, background: 'var(--mm-color-brand-grey)' }}>
          <Header solid inline />
        </div>
      </Specimen>
      <Specimen title="Transparent over a hero" description="At the top of pages with a full-bleed hero." bleed>
        <div style={{ ...contained, position: 'relative', background: `url(${cohort}) center / cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--mm-color-brand-black)', opacity: 'var(--mm-opacity-shade)' }} />
          <Header inline />
        </div>
      </Specimen>
    </>
  );
}
