import { Specimen } from '@/core/docs/Specimen';
import { AudienceTabs, Button, Card, Chip, Faq, Stats, TextLink } from '../components';

export default function CardsPage() {
  return (
    <div className="grid gap-8">
      <Specimen title="Utility cards" description="Canvas-toned, lifted by the soft layered shadow, no border. A big number with a muted unit, a chip on top, a hairline foot with a blue link. A linked card lifts 3px to the hover shadow.">
        <div className="v2-grid v2-grid--3">
          <Card chip={<Chip live>Live</Chip>} title="Check-in rate" text="Participants who checked in against those accepted." foot={<><span>Updated 2 min ago</span><TextLink>View</TextLink></>}><p className="v2-number">94<small> %</small></p></Card>
          <Card chip={<Chip>Last season</Chip>} title="Judging time" text="Five times faster than the spreadsheet." foot={<><span>Per submission</span><TextLink>View</TextLink></>}><p className="v2-number">5<small> x</small></p></Card>
          <Card title={<>Quiet by default, <span className="v2-act">blue when it acts</span></>} text="Open the analytics for any event."><div><Button variant="action" href="#">View analytics</Button></div></Card>
        </div>
      </Specimen>
      <Specimen title="Feature cards" description="A small figure or a brand pictogram on top. The whole card is the link.">
        <div className="v2-grid v2-grid--3">
          <Card figure="lockers" title="Applications & check-in" text="Review applications in one queue and check people in at the door." href="#" foot={<><span>Updated live</span><span className="v2-link">View</span></>} />
          <Card figure="riffle" title="Submissions" text="One page per team, locked at the deadline." href="#" foot={<><span>Locks at the deadline</span><span className="v2-link">View</span></>} />
          <Card pictogram="rocket" title="Afterwards" text="Winners and contacts, pushed into the CRM." />
        </div>
      </Specimen>
      <Specimen title="Full-bleed tiles" bleed description="Three tiles: light, parchment and dark. The colour change is the divider; there are no rules between sections.">
        <div>
          <div className="v2-tile v2-tile--light" style={{ padding: '2.5rem 2rem' }}><h3 className="v2-subheading">Light tile</h3><p className="v2-muted">surface.tile-light</p></div>
          <div className="v2-tile v2-tile--parchment" style={{ padding: '2.5rem 2rem' }}><h3 className="v2-subheading">Parchment tile</h3><p className="v2-muted">surface.tile-parchment breaks two light tiles</p></div>
          <div className="v2-tile v2-tile--dark" style={{ padding: '2.5rem 2rem' }}><h3 className="v2-subheading">Dark tile</h3><p className="v2-muted">surface.tile-dark; links use <TextLink>brand blue</TextLink></p></div>
        </div>
      </Specimen>
      <Specimen title="Audience tabs" description="A capsule rail; the selected tab is a raised pill. One figure per audience on a framed plate.">
        <AudienceTabs items={[
          { id: 'p', label: 'Participants', figure: 'hours', cta: 'See a team page', title: 'Forty-eight hours, one place for all of it.', text: 'Form a team, pick a challenge, submit.', points: ['Team formation', 'Submissions', 'Schedule'] },
          { id: 'j', label: 'Judges', figure: 'podium', cta: 'How scoring works', title: 'Score what you saw.', text: 'A queue per track with the rubric next to the demo.', points: ['Weighted rubrics', 'Conflict flags', 'Live ranking'] },
          { id: 'o', label: 'Organisers', figure: 'terminal', cta: 'Start an event', title: 'Run it from one console.', text: 'Applications, check-in, tracks, sponsors.', points: ['Check-in', 'Prize tracks', 'CRM'] },
        ]} />
      </Specimen>
      <Specimen title="Stat row" description="The brand's top-rule stat, with tabular numerals, tighter tracking and a muted unit.">
        <Stats items={[['12', 'hackathons'], ['2,400 +', 'participants'], ['< 1 min', 'to judging queue']]} />
      </Specimen>
      <Specimen title="FAQ" description="Native details/summary with a blue-tinted plus that turns 45°; the answer's height animates where ::details-content is supported.">
        <Faq items={[['Can we use it for our own hackathon?', <p key="1">Yes. Create an event, set tracks and rubrics, invite your team.</p>], ['What do judges need to install?', <p key="2">Nothing.</p>]]} />
      </Specimen>
    </div>
  );
}
