import { Specimen } from '@/core/docs/Specimen';
import { FaqItem } from '../components';

export default function FaqPage() {
  return (
    <>
      {(['mm-surface-black', 'mm-surface-white'] as const).map((surface) => (
        <Specimen
          key={surface}
          title={`FAQ · ${surface.replace('mm-surface-', '')}`}
          description="Sticker rotates on open; the answer's height animates via interpolate-size where supported."
          surface={surface}
          code={surface === 'mm-surface-black' ? `<div class="mm-faq">\n  <details><summary><span class="mm-sticker">…plus/minus…</span>Question</summary><div><p>Answer</p></div></details>\n</div>` : undefined}
        >
          <div className="mm-faq">
            <FaqItem question="Do I need a startup idea to apply?" open={surface === 'mm-surface-black'}>
              <p>
                <strong>No idea? No problem.</strong> You will find co-founders and market gaps within the community.
              </p>
            </FaqItem>
            <FaqItem question="How much time does the program take?">
              <p>Roughly 20 hours per week on average over the whole year.</p>
            </FaqItem>
            <FaqItem question="Who can apply?">
              <p>Students of all Munich universities and disciplines.</p>
            </FaqItem>
          </div>
        </Specimen>
      ))}
    </>
  );
}
