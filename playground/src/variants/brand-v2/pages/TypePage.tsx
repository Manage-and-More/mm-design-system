import { Specimen } from '@/core/docs/Specimen';
import { Display, TextLink } from '../components';

export default function TypePage() {
  return (
    <div className="grid gap-8">
      <Specimen title="Display" description="The hero's two lines: the setup line outlined, the payoff solid. The outline is painted under a surface-coloured fill (paint-order), so overlapping glyph contours never show. Negative tracking at display size." code={`<h1 class="v2-display"><span class="v2-outline">Build in 48 hours.</span><span>Run it in one.</span></h1>`}>
        <Display setup="Build in 48 hours." payoff="Run it in one." as="p" />
      </Specimen>
      <Specimen title="Outline safety" description="Every glyph that has overlapping contours in Work Sans or Sharp Sans, in one line, so a change to the outline can be checked at a glance.">
        <p className="v2-display" style={{ fontSize: '3rem' }}><span className="v2-outline">BDNRPQ bdnpqgkm 0369 &amp; @</span></p>
      </Specimen>
      <Specimen title="Heading, lead" description="Section headings are solid, tracked −0.015em, ≤22ch. A phrase can turn blue when it names an action. The lead is muted with one strong phrase. No label above the heading, ever." code={`<h2 class="v2-heading">One event, <span class="v2-act">three seats</span> at the table.</h2>\n<p class="v2-lead">… <strong>key phrase</strong>.</p>`}>
        <div className="grid gap-4">
          <h2 className="v2-heading">One event, <span className="v2-act">three seats</span> at the table.</h2>
          <p className="v2-lead">Participants build, judges decide, organisers keep it running. <strong>Each gets a view that shows only what matters.</strong></p>
        </div>
      </Specimen>
      <Specimen title="Body, small, link" code={`<p>Body 17px/1.55.</p>\n<p class="v2-small v2-muted">Small 14px.</p>\n<a class="v2-link">View analytics</a>`}>
        <div className="grid gap-3">
          <p className="v2-prose">Body copy is 17px Medium at 1.55, left-aligned, no italic, no tracking. Emphasis is <strong>Extrabold</strong>, as in the brand.</p>
          <p className="v2-small v2-muted">Small text is 14px, muted at 80% black (dark: 40% black on near-black).</p>
          <p><TextLink>Text links are blue, with an arrow</TextLink></p>
        </div>
      </Specimen>
    </div>
  );
}
