import { Specimen } from '@/core/docs/Specimen';
import { ArrowLink } from '../components';

const ARROW_CODE = `<a class="mm-arrow-link" href="#">
  <span class="mm-sticker" aria-hidden="true"><svg viewBox="0 0 40 40">…arrow-right…</svg></span>
  Meet the Community
</a>`;

export default function CtasPage() {
  return (
    <>
      {(['mm-surface-white', 'mm-surface-black', 'mm-surface-blue', 'mm-surface-grey'] as const).map((surface) => (
        <Specimen
          key={surface}
          title={`Arrow link · ${surface.replace('mm-surface-', '')}`}
          description="Primary CTA. The sticker scales on hover; the glyph takes the surface colour."
          surface={surface}
          code={surface === 'mm-surface-white' ? ARROW_CODE : undefined}
        >
          <ArrowLink style={{ marginTop: 0 }}>Meet the Community</ArrowLink>
        </Specimen>
      ))}
      <Specimen title="Back to top" description="Arrow rotated up, used in the footer." surface="mm-surface-black">
        <ArrowLink up style={{ marginTop: 0 }}>
          Back to top
        </ArrowLink>
      </Specimen>
      <Specimen
        title="Button"
        description="Only for forms and product UI. Square, uppercase, black → blue on hover."
        surface="mm-surface-white"
        code={`<button class="mm-btn">Apply now</button>\n<button class="mm-btn mm-btn--secondary">Download brochure</button>`}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <button className="mm-btn" type="button">Apply now</button>
          <button className="mm-btn mm-btn--secondary" type="button">Download brochure</button>
        </div>
      </Specimen>
      <Specimen title="Button on black" surface="mm-surface-black">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <button className="mm-btn" type="button">Apply now</button>
          <button className="mm-btn mm-btn--secondary" type="button">Download brochure</button>
        </div>
      </Specimen>
    </>
  );
}
