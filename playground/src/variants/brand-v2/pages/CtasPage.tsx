import { Specimen } from '@/core/docs/Specimen';
import { ArrowLink, Button, Chip, TextLink } from '../components';

export default function CtasPage() {
  return (
    <div className="grid gap-8">
      <Specimen title="Pill = action" description="Primary: black pill. Action: blue outline pill with a blue tint and an arrow, filling blue on hover. Quiet: a hairline pill. Pills are the action signal; nothing else on the page is a pill except status chips." code={`<a class="v2-button v2-button--primary">Start an event</a>\n<a class="v2-button v2-button--action">View analytics</a>\n<button class="v2-button v2-button--quiet">Later</button>`}>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Start an event</Button><Button variant="action">View analytics</Button><Button variant="quiet">Later</Button><Button small>Sign in</Button>
        </div>
      </Specimen>
      <Specimen title="Arrow link and text link" description="The brand's arrow link, now a filled blue sticker (scales 1.08 on a spring). Text links are blue with a trailing arrow. One arrow link per section." code={`<a class="v2-arrow-link"><span class="v2-arrow-link__ring"><svg …/></span>Talk to the team</a>\n<a class="v2-link">View</a>`}>
        <div className="flex flex-wrap gap-8 items-center"><ArrowLink>Talk to the team</ArrowLink><ArrowLink up>Back to top</ArrowLink><TextLink>View analytics</TextLink></div>
      </Specimen>
      <Specimen title="Chips" description="Status chips are pills; a live one is blue. Inline chips use the sm radius." code={`<span class="v2-chip v2-chip--live">Live</span>\n<span class="v2-chip">Measurable impact</span>\n<span class="v2-chip v2-chip--sm">Beta</span>`}>
        <div className="flex flex-wrap gap-3 items-center"><Chip live>Live</Chip><Chip>Measurable impact</Chip><Chip sm>Beta</Chip></div>
      </Specimen>
      <Specimen title="On the blue band" surface="v2-band" description="Everything on blue is black. Hover inverts.">
        <div className="flex flex-wrap gap-6 items-center"><Button>Apply as a participant</Button><Button variant="action">Judging guide</Button><ArrowLink>Apply now</ArrowLink></div>
      </Specimen>
      <Specimen title="On the dark tile" surface="v2-tile v2-tile--dark" description="Actions turn brand blue on black (7.05:1).">
        <div className="flex flex-wrap gap-6 items-center"><Button>Start an event</Button><Button variant="action">View analytics</Button><TextLink>Read the docs</TextLink></div>
      </Specimen>
    </div>
  );
}
