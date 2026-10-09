import { ArrowLink, AudienceTabs, Band, Button, Card, Chip, Faq, Footer, Header, Hero, Section, SectionHead, Stats, TextLink, type Audience } from '../components';

const AUDIENCES: Audience[] = [
  {
    id: 'participants', label: 'Participants', figure: 'hours', cta: 'See a sample team page',
    title: 'Forty-eight hours, one place for all of it.',
    text: 'Form a team, pick a challenge, submit a repo and a demo. Everything you need to hand in is one page, and the clock is always visible.',
    points: ['Team formation with open roles', 'Submissions with repo, deck and video links', 'Schedule, mentors and rooms in one view'],
  },
  {
    id: 'judges', label: 'Judges', figure: 'podium', cta: 'How scoring works',
    title: 'Score what you saw, while you still remember it.',
    text: 'A judging queue per track, one submission at a time, with the rubric next to the demo. Scores sync live; the ranking builds itself.',
    points: ['Rubrics with weighted criteria', 'Conflict-of-interest flags', 'Live leaderboard for organisers only'],
  },
  {
    id: 'organisers', label: 'Organisers', figure: 'terminal', cta: 'Start an event',
    title: 'Run the event from one console.',
    text: 'Applications, check-in, tracks, sponsors and the CRM behind them. Export everything, automate the rest, keep your weekend.',
    points: ['Applications and check-in with QR codes', 'Sponsor challenges and prize tracks', 'Connected to the Manage and More CRM'],
  },
];

/** The hackathon platform entry page: participants, judges and organisers alike. */
export default function LandingPage() {
  return (
    <>
      <Header cta="Sign in" />
      <main>
        <Hero
          setup="Build in 48 hours."
          payoff="Run it in one."
          figure="bench"
          lead={<>One platform for teams, judges and organisers: applications, team formation, submissions, scoring and the follow-up, <strong>built by people who run hackathons</strong>.</>}
          actions={<><Button href="#">Start an event</Button><Button variant="action" href="#">Watch the 2-minute tour</Button></>}
        />

        <Section>
          <SectionHead title={<>One event, <span className="v2-act">three seats</span> at the table.</>}>
            Participants build, judges decide, organisers keep it running. Each gets a view that shows only what matters to them.
          </SectionHead>
          <AudienceTabs items={AUDIENCES} />
        </Section>

        <Section>
          <SectionHead title="Everything a hackathon needs. Nothing it doesn't.">
            Opinionated defaults, so an event is set up in an afternoon, with the escape hatches an experienced team wants.
          </SectionHead>
          <div className="v2-grid v2-grid--3">
            <Card figure="lockers" title="Applications & check-in" text="Review applications in one queue, accept in batches, check people in with a QR code at the door." href="#" foot={<><span>Updated live</span><span className="v2-link">View</span></>} />
            <Card figure="riffle" title="Submissions" text="One page per team: repo, demo, deck and a short write-up. Locked at the deadline, to the second." href="#" foot={<><span>Locks at the deadline</span><span className="v2-link">View</span></>} />
            <Card figure="elevator" title="Tracks & stages" text="Sponsor challenges, prize tracks and pitch slots. Teams move through stages; nobody waits in the wrong room." href="#" foot={<><span>Per track</span><span className="v2-link">View</span></>} />
            <Card pictogram="workshop" title="Mentors & schedule" text="A schedule that updates live, mentor office hours teams can book, and rooms that know who is in them." />
            <Card pictogram="education-skills" title="Judging & scoring" text="Weighted rubrics, per-track queues, conflict flags, and a ranking that builds itself as scores arrive." />
            <Card pictogram="rocket" title="Afterwards" text="Winners, certificates and the contacts, pushed into the CRM so the follow-up with teams and sponsors actually happens." />
          </div>
        </Section>

        <Section tone="parchment">
          <SectionHead title="Built on events we actually ran.">
            The numbers from the last two seasons, straight from the platform.
          </SectionHead>
          <div className="v2-grid v2-grid--3">
            <Card chip={<Chip live>Live</Chip>} title="Check-in rate" text="Participants who checked in at the door against those accepted." foot={<><span>Updated 2 min ago</span><TextLink>View</TextLink></>}><p className="v2-number">94<small> %</small></p></Card>
            <Card chip={<Chip>Last season</Chip>} title="Judging time" text="Judges score five times faster than with the spreadsheet we used before." foot={<><span>Per submission</span><TextLink>View</TextLink></>}><p className="v2-number">5<small> x</small></p></Card>
            <Card title={<>Quiet by default, <span className="v2-act">blue when it acts</span></>} text="Every number has a place to go. Open the full analytics for any event you organise."><div><Button variant="action" href="#">View analytics</Button></div></Card>
          </div>
          <Stats items={[['12', 'hackathons run on it'], ['2,400 +', 'participants checked in'], ['< 1 min', 'from submission to judging queue']]} />
        </Section>

        <Band title="Applications for the Munich Hackathon close on 14 November." action={<Button variant="primary" href="#">Apply as a participant</Button>}>
          Two days, six sponsor challenges, two hundred builders. Judges and mentors can sign up through the same page.
        </Band>

        <Section tone="dark">
          <SectionHead title="Before you ask.">
            Short answers. For the long ones, <TextLink>read the docs</TextLink>
          </SectionHead>
          <Faq items={[
            ['Can we use it for our own hackathon?', <p key="a">Yes. Organisers create an event, set tracks and rubrics, and invite their team. Pricing is per event, free for student-run events.</p>],
            ['Does it work without the Manage and More CRM?', <p key="b">It does. The CRM connection is optional and adds the follow-up: contacts, sponsors and teams land in your pipeline after the event.</p>],
            ['What do judges need to install?', <p key="c">Nothing. Judges get a link, sign in with their e-mail and score on any device.</p>],
            ['Where is the data hosted?', <p key="d">In the EU, on infrastructure operated by UnternehmerTUM. Events can be exported and deleted at any time.</p>],
          ]} />
          <ArrowLink className="mt-10">Talk to the team</ArrowLink>
        </Section>
      </main>
      <Footer />
    </>
  );
}
