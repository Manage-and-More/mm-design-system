import { Specimen } from '@/core/docs/Specimen';
import { Stats } from '../components';

const uiGlyphs = import.meta.glob<string>('@ds/assets/ui/svg/*.svg', { query: '?url', import: 'default', eager: true });

export default function StatsPage() {
  return (
    <>
      <Specimen title="Stat row" description="Rule above, big value, small label. Three columns from 640px." surface="mm-surface-white">
        <Stats items={[['> 2.3 B. $', 'Capital raised'], ['10+', 'Alumni-founded VC funds'], ['260+', 'founded startups']]} />
      </Specimen>
      <Specimen title="Stat row on black" surface="mm-surface-black">
        <Stats items={[['260+', 'founded startups'], ['34', 'batches'], ['1,000+', 'alumni']]} />
      </Specimen>
      <Specimen title="Chips" description="Pill outline at 20% of the text colour; linked chips turn blue on hover." surface="mm-surface-white">
        <ul className="mm-chips">
          {['Digital Innovation', 'Marketing', 'Community & Culture', 'Finance', 'Partnerships'].map((c, i) => (
            <li key={c}>
              {i < 2 ? (
                <a className="mm-chip" href="#" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block' }}>
                  {c}
                </a>
              ) : (
                <span className="mm-chip" style={{ display: 'inline-block' }}>{c}</span>
              )}
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen title="UI glyphs" description="40×40, currentColor. Shown as masks inside a sticker-sized ring." surface="mm-surface-white">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {Object.entries(uiGlyphs).map(([path, url]) => (
            <span
              key={path}
              title={path.split('/').at(-1)}
              style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, border: '1px solid currentColor', borderRadius: 'var(--mm-radius-pill)' }}
            >
              <span style={{ width: 20, height: 20, background: 'currentColor', mask: `url("${url}") center / contain no-repeat` }} />
            </span>
          ))}
        </div>
      </Specimen>
    </>
  );
}
