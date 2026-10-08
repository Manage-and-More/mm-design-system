import { Specimen } from '@/core/docs/Specimen';
import { ArrowLink } from '../components';

const SURFACES = [
  ['white', 'Default. Alternates with black down the page.'],
  ['black', 'Alternating sections, header, footer, hero shade.'],
  ['grey', 'Quiet blocks: endorsements, notes.'],
  ['blue', 'Emphasis, at most once per page. Black text.'],
  ['yellow', 'Print and campaigns only, not used on the website.'],
] as const;

export default function SurfacesPage() {
  return (
    <>
      {SURFACES.map(([name, note]) => (
        <Specimen key={name} title={`.mm-surface-${name}`} description={note} surface={`mm-surface-${name}`} bleed>
          <section className="mm-section" style={{ borderTop: 0 }}>
            <div className="mm-container">
              <p className="mm-eyebrow">Eyebrow</p>
              <h2>Learn. Lead. Launch.</h2>
              <p className="mm-prose" style={{ marginTop: '1rem' }}>
                Text, rules and stickers inherit the surface colour through currentColor.
              </p>
              <ArrowLink>Explore the program</ArrowLink>
            </div>
          </section>
        </Specimen>
      ))}
    </>
  );
}
