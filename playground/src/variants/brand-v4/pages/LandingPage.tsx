import cohort from '@ds/assets/photography/website/cohort-group.webp';
import bootcamp from '@ds/assets/photography/website/bootcamp-workshop.webp';
import tour from '@ds/assets/photography/website/startup-tour-dinner.webp';
import coaching from '@ds/assets/photography/website/coaching.webp';
import scholars from '@ds/assets/photography/website/scholars-group.webp';
import alumni from '@ds/assets/photography/website/alumni-group.webp';
import talk from '@ds/assets/photography/website/event-talk.webp';
import graduation from '@ds/assets/photography/website/graduation.webp';
import flipchart from '@ds/assets/photography/principles/principles-01.jpg';
import labelBlack from '@ds/assets/labels/svg/by-unternehmertum-label-black.svg?url';
import lockupWhite from '@ds/assets/labels/svg/descriptor-lockup-outline-white.svg?url';
import symbolBlue from '@ds/assets/logo/svg/mm-symbol-blue.svg?url';
import { cn } from '@/lib/cn';
import { Backdrop, Button, Header, TextLink, Wordmark, useStudioPage } from '../components';

/* Copy: facts from examples/landing-page.html and guidelines/12-voice-and-tone.md; headlines rewritten to the skill's rules. */
const H1 = ['Entrepreneurial leaders of tomorrow.', 'Students in Munich today.'];
const CLOSER = ['Entrepreneurial leaders of tomorrow.', 'Applicants in Munich today.'];

const STEPS = [
  { title: 'Business Design', meta: 'Partner challenges', text: 'Apply design thinking to real challenges from partner companies.', img: flipchart, alt: 'A scholar sketching on a flipchart' },
  { title: 'Leadership Areas', meta: 'One of five Areas', text: 'Take ownership of the program itself in one of five Areas.', img: scholars, alt: 'Scholars in Manage and More hoodies' },
  { title: 'Go international', meta: 'Tours and universities', text: 'Startup Tours and cooperations with universities worldwide.', img: alumni, alt: 'A generation sitting on concrete steps' },
  { title: 'Start-Up Project', meta: 'The heart of it all', text: 'Build, test and launch your own venture with your team.', img: talk, alt: 'Audience at a pitch event in a hall' },
];

const EVENTS = [
  { img: bootcamp, alt: 'Scholars in the Business Design Bootcamp', title: 'Business Design Bootcamp', sub: 'Intro week', text: 'Get to know design thinking through hands-on activities.' },
  { img: tour, alt: 'Startup Tour dinner in Istanbul', title: 'Startup Tours', sub: 'Every semester', text: 'Visit startups, accelerators and VCs across Europe and beyond.' },
  { img: coaching, alt: 'One-to-one coaching session', title: 'Coaching', sub: 'Optional element', text: 'Experienced coaches right by your side.' },
];

const FAQ = [
  { q: 'Do I need a startup idea to apply?', a: 'No idea? No problem. You will find co-founders and market gaps within the community.' },
  { q: 'How much time does the program take?', a: 'Roughly 20 hours per week on average over the whole year.' },
  { q: 'When can I apply?', a: 'Twice a year: by June 7th for the winter semester and by December 6th for the summer semester, each at 23:59:59 Munich time.' },
  { q: 'Which language is the program in?', a: 'English. The program is conducted entirely in English.' },
  { q: 'How do I get to know you before I apply?', a: 'Join an Open Event to learn more, then apply. Meet like-minded innovators and the people who run the program.' },
];

const HANDLES = Array.from({ length: 16 }, (_, i) => ({ left: `${((i % 4) * 100) / 3}%`, top: `${(Math.floor(i / 4) * 100) / 3}%` }));

export default function LandingPage() {
  const { scrolled, onDark, current, pinRef } = useStudioPage(STEPS.length);

  return (
    <div className="v4">
      <Header scrolled={scrolled} onDark={onDark} />
      <main>
        {/* Hero: the cohort as weather, copy bottom-left, the next deadline parked bottom-right */}
        <section className="v4-hero v4-grain" data-tone="dark">
          <Backdrop src={cohort} priority />
          <div className="v4-hero__copy v4-arrive">
            <h1>
              {H1[0]}
              <br />
              {H1[1]}
            </h1>
            <p>
              Manage and More is the flagship entrepreneurship program for top talent in Munich: a year of real challenges, ownership and a startup of your own, inside
              UnternehmerTUM.
            </p>
            <div className="v4-actions">
              <Button>Apply by December 6th</Button>
              <Button variant="glass">Join an Open Event</Button>
            </div>
          </div>
          <a className="v4-teaser v4-arrive" href="#" onClick={(e) => e.preventDefault()}>
            <img src={graduation} alt="" />
            <span>
              Summer semester 2027
              <br />
              <span>Applications close Sun, Dec 6th</span>
            </span>
          </a>
        </section>

        <div className="v4-paper">
          <div className="v4-wrap">
            {/* Proof: the endorsement label, small, in a big cell */}
            <section className="v4-proof v4-fade" aria-label="Part of UnternehmerTUM">
              <div>
                <p className="v4-label v4-muted">Part of</p>
                <p>Manage and More is a central part of UnternehmerTUM, Europe's #1 startup hub, in Garching near Munich.</p>
              </div>
              <div className="v4-proof__mark">
                <img src={labelBlack} alt="by UnternehmerTUM" />
              </div>
              <div>
                <p className="v4-label v4-muted">Ecosystem</p>
                <TextLink external>Discover UnternehmerTUM</TextLink>
              </div>
              <i className="v4-handle" style={{ left: '25%', bottom: 0 }} />
              <i className="v4-handle" style={{ left: '75%', bottom: 0 }} />
            </section>

            {/* Statement: context muted, claim in ink, one size */}
            <section className="v4-statement v4-inner v4-fade">
              <p>
                You are not joining a standalone program.{' '}
                <strong>
                  You are plugging into Europe's #1 startup hub, with a tight-knit circle of active members from day one and an influential Alumni Network behind you.
                </strong>
              </p>
            </section>
          </div>
        </div>

        {/* The one set piece: four parts of the year, one plate per scroll step */}
        <section className="v4-pin v4-dark v4-grain" data-tone="dark" ref={pinRef} aria-label="The program">
          <div className="v4-stage">
            <div className="v4-rail">
              <h2>Learn. Lead. Launch.</h2>
              <p>Four parts of one year, at roughly 20 hours a week.</p>
              {STEPS.map((s, i) => (
                <div key={s.title} className={cn('v4-slab', i === current && 'is-current')}>
                  <div className="v4-slab__head">
                    <span className="v4-label">
                      <span>0{i + 1}</span>
                      <span>{s.title}</span>
                    </span>
                    <span className="v4-slab__sign" aria-hidden="true" />
                  </div>
                  <div className="v4-slab__body">
                    <div>
                      <img className="v4-slab__photo" src={s.img} alt="" />
                      <h3>{s.meta}</h3>
                      <p>{s.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="v4-actions">
                <Button>Explore the program</Button>
              </div>
            </div>
            <div className="v4-scene" aria-hidden="true">
              <div className="v4-scene__box">
                <div className="v4-scene__grid">
                  {HANDLES.map((h, i) => (
                    <i key={i} style={h} />
                  ))}
                </div>
                <p className="v4-scene__meta v4-scene__meta--top v4-label">
                  <span>Output</span>Founders and leaders
                </p>
                <p className="v4-scene__meta v4-scene__meta--bottom v4-label">
                  <span>Foundation</span>One year, one generation
                </p>
                {STEPS.map((s, i) => (
                  <figure key={s.title} className={cn('v4-plate', i < current && 'is-past', i === current && 'is-current')} style={{ '--i': i } as React.CSSProperties}>
                    <img src={s.img} alt={s.alt} />
                    <figcaption className="v4-label">
                      <span>0{i + 1}</span>
                      <span>{s.title}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="v4-paper">
          <div className="v4-wrap">
            {/* Events: headline left, lede right; photo cards */}
            <section className="v4-inner" aria-label="Events">
              <div className="v4-split v4-fade">
                <h2>Connect. Grow. Belong.</h2>
                <div>
                  <p>
                    Our culture is built at events. From day one you are part of a tight-knit circle of active members and an influential Alumni Network, and you meet them
                    here first.
                  </p>
                  <div className="v4-actions">
                    <TextLink>Meet the Community</TextLink>
                  </div>
                </div>
              </div>
              <ul className="v4-cards v4-fade" role="list">
                {EVENTS.map((e) => (
                  <li key={e.title} className="v4-card">
                    <img src={e.img} alt={e.alt} />
                    <span className="v4-label">{e.sub}</span>
                    <div>
                      <h3>{e.title}</h3>
                      <p>{e.text}</p>
                      <TextLink>Read more</TextLink>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Numbers: light, signed, caption top, figure bottom */}
            <section className="v4-inner" aria-label="Track record">
              <div className="v4-split v4-fade">
                <h2>Build. Scale. Succeed.</h2>
                <div>
                  <p>The track record of Munich's most entrepreneurial talent, counted across every generation of our alumni.</p>
                  <div className="v4-actions">
                    <TextLink>Feel the impact</TextLink>
                  </div>
                </div>
              </div>
              <div className="v4-numbers v4-fade">
                <div className="v4-tile v4-tile--photo">
                  <img src={graduation} alt="" />
                  <span className="v4-label">Capital raised by alumni startups</span>
                  <span className="v4-fig">
                    &gt;$2.3<small>b</small>
                  </span>
                </div>
                <div className="v4-tile">
                  <span className="v4-label">Startups founded</span>
                  <span className="v4-fig">260+</span>
                </div>
                <div className="v4-tile">
                  <span className="v4-label">Alumni-founded VC funds</span>
                  <span className="v4-fig">10+</span>
                </div>
                <div className="v4-tile">
                  <span className="v4-label">UnternehmerTUM, Europe's startup hub</span>
                  <span className="v4-fig">#1</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* The one hard colour block: application deadlines, black on blue */}
        <section className="v4-block" aria-label="Application deadlines">
          <div className="v4-wrap">
            <div className="v4-inner">
              <div className="v4-split v4-fade">
                <h2>Applications open twice a year.</h2>
                <div>
                  <p>Join an Open Event to learn more, apply before the deadline, get accepted. Then a year starts that you shape yourself.</p>
                  <div className="v4-actions">
                    <Button variant="ink">Apply now</Button>
                    <TextLink>Connect with us</TextLink>
                  </div>
                </div>
              </div>
              <div className="v4-mock v4-fade" aria-label="Upcoming deadlines">
                <div className="v4-mock__head">
                  <img src={symbolBlue} alt="" />
                  <span>Applications</span>
                  <span className="v4-label">2026 / 27</span>
                </div>
                <div className="v4-mock__row">
                  <span>Summer semester 2027</span>
                  <span>Sun, December 6th, 2026, 23:59:59 (CET)</span>
                  <span className="v4-chip v4-chip--next">
                    <i />
                    Next
                  </span>
                </div>
                <div className="v4-mock__row">
                  <span>Winter semester 2027/28</span>
                  <span>Mon, June 7th, 2027, 23:59:59 (CEST)</span>
                  <span className="v4-chip">
                    <i />
                    Later
                  </span>
                </div>
                <div className="v4-mock__row v4-mock__row--fade">
                  <span>Open Event</span>
                  <span>Meet the community before you apply</span>
                  <span className="v4-chip">
                    <i />
                    Step 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="v4-paper">
          <div className="v4-wrap">
            <section className="v4-faq v4-inner v4-fade" aria-label="Frequently asked questions">
              <h2>Questions before you apply.</h2>
              <div>
                {FAQ.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Ending: the hero's weather returns, restates the H1 and runs under the footer */}
        <div className="v4-ending v4-dark v4-grain" data-tone="dark">
          <Backdrop src={cohort} />
          <section className="v4-cta v4-fade" aria-label="Apply">
            <h2>
              {CLOSER[0]}
              <br />
              {CLOSER[1]}
            </h2>
            <p>Find your tribe. Meet like-minded innovators at our next Open Event, or apply for the summer semester by December 6th.</p>
            <div className="v4-actions">
              <Button>Apply by December 6th</Button>
              <Button variant="glass">Join an Open Event</Button>
            </div>
          </section>
          <footer className="v4-footer">
            <div className="v4-footer__cols">
              <div>
                <p className="v4-footer__tag">
                  {H1[0]} {H1[1]}
                </p>
              </div>
              <div>
                <p className="v4-label">UnternehmerTUM GmbH</p>
                <address>
                  Lichtenbergstraße 6<br />
                  D-85748 Garching
                  <br />
                  Germany
                </address>
              </div>
              <div>
                <p className="v4-label">Social media</p>
                <a href="#">LinkedIn ↗</a>
                <a href="#">Instagram ↗</a>
              </div>
              <div>
                <p className="v4-label">Legal</p>
                <a href="#">Imprint</a>
                <a href="#">Privacy Policy</a>
              </div>
              <div>
                <img className="v4-footer__lockup" src={lockupWhite} alt="Entrepreneurial Education, by UnternehmerTUM" />
              </div>
            </div>
            <div className="v4-legal">
              <span>© 2026 UnternehmerTUM GmbH. Manage and More is an endorsed brand of UnternehmerTUM.</span>
              <a href="#" onClick={(e) => (e.preventDefault(), scrollTo({ top: 0 }))}>
                Back to top ↑
              </a>
            </div>
            <Wordmark />
          </footer>
        </div>
      </main>
    </div>
  );
}
