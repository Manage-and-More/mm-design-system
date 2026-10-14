import {
  Band, Button, Chip, Ending, Faq, Hero, Mock, Nav, PinnedStage, Row, Score, Seats, Split, Strip, Tiles, TextLink, Trust, usePageMotion,
  type Seat, type StageStep,
} from '../components';

/* Copy is Brand v2's hackathon landing, rewritten to the studio-landing copy rules:
   beats with full stops, one two-tone statement, a closer in the hero's meter. */

const STEPS: StageStep[] = [
  {
    title: 'Applications & check-in',
    text: 'Review applications in one queue, accept in batches and check people in with a QR code at the door.',
    card: (
      <Mock title="Applications" meta="226 received" foot={<><span>Checked in</span><span className="b3-bar"><i style={{ width: '94%' }} /></span><strong>212</strong>/ 226</>}>
        <Row name="Lena Ortmann" sub="TUM · Informatics" mid={<span className="b3-muted">Backend</span>} end={<Chip on>Accepted</Chip>} />
        <Row name="Jonas Weidinger" sub="LMU · Interaction design" mid={<span className="b3-muted">Design</span>} end={<Chip>Waitlist</Chip>} />
        <Row name="Aylin Kaya" sub="HM · Mechatronics" mid={<span className="b3-muted">Hardware</span>} end={<Chip on>Accepted</Chip>} />
      </Mock>
    ),
  },
  {
    title: 'Teams & submissions',
    text: 'Teams form around open roles. Each gets one page for repo, demo, deck and write-up, locked at the deadline to the second.',
    card: (
      <Mock title="Team Kelp" meta="Track · Mobility" foot={<><span className="b3-dot b3-dot--blink" aria-hidden="true" /><span>Locks in</span><strong>02:14:09</strong></>}>
        <Row name="Repository" sub="github.com/team-kelp/curbside" end={<Chip on>Linked</Chip>} />
        <Row name="Demo video" sub="2:41 · uploaded 11:02" end={<Chip on>Ready</Chip>} />
        <Row name="Pitch deck" sub="9 slides" end={<Chip>Draft</Chip>} />
      </Mock>
    ),
  },
  {
    title: 'Judging & scoring',
    text: 'A queue per track, the rubric next to the demo and conflict flags. The ranking builds itself as scores arrive.',
    card: (
      <Mock title="Judging · Mobility" meta="Team Kelp" foot={<><Chip>No conflicts</Chip><span>Weighted</span><strong>3.9</strong><span>· rank 2 of 38</span></>}>
        <Row name="Impact" sub="weight 40 %" mid={<Score value={4} />} end={<span className="b3-num">4.0</span>} />
        <Row name="Technical depth" sub="weight 35 %" mid={<Score value={3} />} end={<span className="b3-num">3.0</span>} />
        <Row name="Pitch" sub="weight 25 %" mid={<Score value={5} />} end={<span className="b3-num">5.0</span>} />
      </Mock>
    ),
  },
  {
    title: 'Afterwards',
    text: 'Winners, certificates and contacts go into the Manage and More CRM, so the follow-up with teams and sponsors actually happens.',
    card: (
      <Mock title="Follow-up" meta="Synced 2 min ago" foot={<><span>Pushed to the</span><strong>Manage and More CRM</strong></>}>
        <Row name="Certificates" sub="sent to participants" end={<span className="b3-num">186</span>} />
        <Row name="Sponsor contacts" sub="Mobility track" end={<span className="b3-num">14</span>} />
        <Row name="Winning teams" sub="announced and notified" end={<span className="b3-num">3</span>} />
      </Mock>
    ),
  },
];

const SEATS: Seat[] = [
  { pictogram: 'time', who: 'Participants', title: 'Forty-eight hours, one place for all of it.', text: 'Form a team, pick a challenge, submit a repo and a demo. The clock is always on screen.', cta: 'See a sample team page' },
  { pictogram: 'goals', who: 'Judges', title: 'Score what you saw, while you still remember it.', text: 'One submission at a time, the rubric next to the demo. Scores sync live.', cta: 'How scoring works' },
  { pictogram: 'events', who: 'Organisers', title: 'Run the event from one console.', text: 'Applications, check-in, tracks, sponsors and the CRM behind them. Export everything, keep your weekend.', cta: 'Start an event' },
];

/** The hackathon platform entry page in the studio-landing language. */
export default function LandingPage() {
  usePageMotion();
  return (
    <>
      <Strip action={<a href="#" className="b3-link" style={{ color: 'inherit' }}>Apply <span className="b3-arrow" aria-hidden="true">→</span></a>}>
        <span className="b3-strip__long">Munich Hackathon: applications close on 14 November.</span>
        <span className="b3-strip__short">Munich Hackathon: apply by 14 November.</span>
      </Strip>
      <Nav />
      <main>
        <Hero
          lines={['Build in 48 hours.', 'Run it in one.']}
          lede="One platform for teams, judges and organisers: applications, team formation, submissions, scoring and the follow-up."
          actions={<><Button>Start an event <span className="b3-arrow" aria-hidden="true">→</span></Button><Button variant="ghost">Talk to the team</Button></>}
          teaser={{ title: 'Watch the 2-minute tour', meta: 'Participants, judges, organisers · 2:04' }}
        />

        <section className="b3-statement-section">
          <p className="b3-statement b3-reveal">
            Most hackathons still run on a spreadsheet, three group chats and a judge’s memory.{' '}
            <strong>Here the whole weekend lives in one place: applications, teams, submissions, scores and the follow-up.</strong>
          </p>
          <p className="b3-signoff b3-small b3-muted b3-reveal"><span className="b3-dot" aria-hidden="true" />Built by people who run hackathons.</p>
        </section>

        <section className="b3-section" style={{ paddingTop: 0 }}>
          <Split title="Everything a hackathon needs. Nothing it doesn’t.">
            Opinionated defaults, so an event is set up in an afternoon, with the escape hatches an experienced team wants.
          </Split>
        </section>
        <PinnedStage steps={STEPS} action={<Button>Start an event <span className="b3-arrow" aria-hidden="true">→</span></Button>} meta={['Munich Hackathon', 'Event console']} />

        <section className="b3-section">
          <Split title="One event. Three seats at the table.">
            Participants build, judges decide, organisers keep it running. Each gets a view that shows only what matters to them.
          </Split>
          <Seats items={SEATS} />
        </section>

        <section className="b3-section">
          <Split title="Built on events we actually ran.">
            The numbers from the last two seasons, straight from the platform.
          </Split>
          <Tiles items={[
            ['94%', 'Checked in at the door, of everyone accepted.'],
            ['5x', 'Faster judging than the spreadsheet we used before.'],
            ['+2.4k', 'Participants checked in across 12 hackathons.'],
            ['<1min', 'From submission to the judging queue.'],
          ]} />
        </section>

        <Band title="Free for student-run events." action={<Button>Start an event <span className="b3-arrow" aria-hidden="true">→</span></Button>}>
          Everyone else pays per event. Set one up in an afternoon and invite your team.
        </Band>

        <Trust items={[
          { kind: 'eu', title: 'Hosted in the EU.', text: 'On infrastructure operated by UnternehmerTUM.' },
          { kind: 'export', title: 'Yours to take.', text: 'Export or delete any event at any time.' },
          { kind: 'link', title: 'Nothing to install.', text: 'Judges get a link and sign in with their e-mail.' },
        ]} />

        <Faq
          title="Before you ask."
          intro={<>Short answers. For the long ones, <TextLink>read the docs</TextLink></>}
          items={[
            ['Can we use it for our own hackathon?', 'Yes. Organisers create an event, set tracks and rubrics, and invite their team. Pricing is per event, free for student-run events.'],
            ['How long does setup take?', 'An afternoon. Opinionated defaults cover tracks, rubrics and the schedule; change only what you need.'],
            ['Does it work without the Manage and More CRM?', 'It does. The CRM connection is optional and adds the follow-up: contacts, sponsors and teams land in your pipeline after the event.'],
            ['What do judges need to install?', 'Nothing. Judges get a link, sign in with their e-mail and score on any device.'],
            ['Where is the data hosted?', 'In the EU, on infrastructure operated by UnternehmerTUM. Events can be exported and deleted at any time.'],
          ]}
        />
      </main>
      <Ending
        lines={['Your next 48 hours.', 'Run them in one.']}
        lede="Set up an event in an afternoon. Free for student-run events."
        actions={<><Button>Start an event <span className="b3-arrow" aria-hidden="true">→</span></Button><Button variant="ghost">Talk to the team</Button></>}
        tagline={['Build in 48 hours.', 'Run it in one.']}
      />
    </>
  );
}
