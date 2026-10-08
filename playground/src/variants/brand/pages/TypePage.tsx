import { Specimen } from '@/core/docs/Specimen';
import { TwoTone } from '../components';

export default function TypePage() {
  return (
    <>
      <Specimen
        title="Two-tone heading"
        description="Setup line outlined, payoff solid. The signature typographic move."
        surface="mm-surface-black"
        code={`<h2><span class="mm-outline">Where our culture is built:</span><span>Events</span></h2>`}
      >
        <TwoTone setup="Where our culture is built:" payoff="Events" />
      </Specimen>
      <Specimen title="Display" description="h1 / .mm-display, 30 → 75px across breakpoints." surface="mm-surface-white" code={`<h1 class="mm-display mm-caps">Brand<br><span class="mm-outline">elements</span></h1>`}>
        <h1 className="mm-display mm-caps">
          Brand
          <br />
          <span className="mm-outline">elements</span>
        </h1>
      </Specimen>
      <Specimen title="Section heading, lead and prose" surface="mm-surface-white">
        <p className="mm-eyebrow">Design system</p>
        <h2>Connect. Grow. Belong.</h2>
        <p className="mm-lead" style={{ marginTop: '1.5rem' }}>
          Join Munich's most entrepreneurial ecosystem.
        </p>
        <div className="mm-prose">
          <p>
            From day one you are part of a tight-knit circle of active members and an influential <strong>Alumni Network</strong>. Read the{' '}
            <a href="#">programme details</a>.
          </p>
          <p className="mm-small mm-muted">Small, muted: deadlines, captions and legal notes.</p>
        </div>
      </Specimen>
      <Specimen title="On blue" description="Text on blue is always black (7.05:1), never white." surface="mm-surface-blue">
        <h2>Application deadlines</h2>
        <p className="mm-lead">Winter semester: June 7th · Summer semester: December 6th</p>
      </Specimen>
    </>
  );
}
