import cohort from '@ds/assets/photography/website/cohort-group.webp';
import bootcamp from '@ds/assets/photography/website/bootcamp-workshop.webp';
import tour from '@ds/assets/photography/website/startup-tour-dinner.webp';
import coaching from '@ds/assets/photography/website/coaching.webp';
import scholars from '@ds/assets/photography/website/scholars-group.webp';
import { ArrowLink, FaqItem, Footer, Frame, Header, Hero, Pictogram, Stats, TwoTone } from '../components';

const FEATURES = [
  { icon: 'education-skills', title: 'Business Design', text: 'Apply design thinking to real challenges from partner companies.' },
  { icon: 'workshop', title: 'Leadership Areas', text: 'Take ownership of the program itself in one of five Areas.' },
  { icon: 'international', title: 'Go international', text: 'Startup Tours and cooperations with universities worldwide.' },
  { icon: 'rocket', title: 'Start-Up Project', text: 'Build, test and launch your own venture with your team.' },
];

const EVENTS = [
  { img: bootcamp, alt: 'Scholars in the Business Design Bootcamp', title: 'Business Design Bootcamp', sub: 'Intro week', text: 'Get to know design thinking through hands-on activities.' },
  { img: tour, alt: 'Startup Tour dinner in Istanbul', title: 'Startup Tours', sub: 'Every semester', text: 'Visit startups, accelerators and VCs across Europe and beyond.' },
  { img: coaching, alt: 'One-to-one coaching session', title: 'Coaching', sub: 'Optional element', text: 'Experienced coaches right by your side.' },
];

/** examples/landing-page.html, section for section. */
export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero home image={cohort}>
          <TwoTone as="h1" setup="ENABLING ENTREPRENEURIAL LEADERS OF TOMORROW" payoff="People who build and scale companies." />
        </Hero>

        <section className="mm-section mm-surface-black" style={{ borderTop: 0 }}>
          <div className="mm-container">
            <h2>What's it about?</h2>
            <div className="mm-prose">
              <p>
                Manage and More is the <strong>flagship entrepreneurship program</strong> for top talent in Munich. As a central part of Europe's #1
                startup hub, UnternehmerTUM, we provide the ultimate ecosystem for students ready to move beyond theory.
              </p>
            </div>
          </div>
        </section>

        <section className="mm-section mm-surface-white">
          <div className="mm-container">
            <h2>Connect. Grow. Belong.</h2>
            <p className="mm-prose">
              Join Munich's most entrepreneurial ecosystem. From day one you are part of a tight-knit circle of active members and an influential Alumni
              Network.
            </p>
            <ArrowLink>Meet the Community</ArrowLink>
          </div>
        </section>

        <section className="mm-section mm-surface-black">
          <div className="mm-container">
            <h2>Learn. Lead. Launch.</h2>
            <ul className="mm-features">
              {FEATURES.map((f) => (
                <li key={f.title} className="mm-feature">
                  <Pictogram name={f.icon} />
                  <p className="mm-title">{f.title}</p>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mm-section mm-surface-white">
          <div className="mm-container">
            <h2>Build. Scale. Succeed.</h2>
            <p className="mm-prose" style={{ marginBottom: '3rem' }}>
              Discover the track record of Munich's most entrepreneurial talent.
            </p>
            <Stats items={[['> 2.3 B. $', 'Capital raised'], ['10+', 'Alumni-founded VC funds'], ['260+', 'founded startups']]} />
            <ArrowLink style={{ marginTop: '3rem' }}>Feel the impact</ArrowLink>
          </div>
        </section>

        <section className="mm-section mm-surface-black">
          <div className="mm-container">
            <TwoTone setup="Where our culture is built:" payoff="Events" />
            <ul className="mm-grid mm-grid--3">
              {EVENTS.map((e) => (
                <li key={e.title} className="mm-photo-card">
                  <a href="#" style={{ textDecoration: 'none' }} onClick={(ev) => ev.preventDefault()}>
                    <Frame src={e.img} alt={e.alt} />
                    <p className="mm-title">{e.title}</p>
                    <p className="mm-photo-card__subtitle">{e.sub}</p>
                    <p>{e.text}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mm-section mm-surface-blue">
          <div className="mm-container">
            <h2>Application Deadlines for Upcoming Semesters</h2>
            <p className="mm-lead">Winter semester: June 7th · Summer semester: December 6th</p>
            <ArrowLink>Connect with us!</ArrowLink>
          </div>
        </section>

        <section className="mm-section mm-surface-black">
          <div className="mm-container">
            <h2>Frequently asked questions</h2>
            <div className="mm-faq">
              <FaqItem question="Do I need a startup idea to apply?">
                <p>
                  <strong>No idea? No problem.</strong> You will find co-founders and market gaps within the community.
                </p>
              </FaqItem>
              <FaqItem question="How much time does the program take?">
                <p>Roughly 20 hours per week on average over the whole year.</p>
              </FaqItem>
            </div>
          </div>
        </section>

        <section className="mm-section mm-surface-white">
          <div className="mm-container mm-split">
            <div>
              <TwoTone setup="Find your tribe." payoff="Get to know us!" />
              <p className="mm-prose" style={{ marginTop: '2rem' }}>
                Meet like-minded innovators at our next open session.
              </p>
              <ArrowLink>Join an Open Event</ArrowLink>
            </div>
            <img className="mm-photo mm-photo--feature mm-photo--square" src={scholars} alt="Smiling scholars in Manage and More hoodies" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
