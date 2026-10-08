import bootcamp from '@ds/assets/photography/website/bootcamp-workshop.webp';
import tour from '@ds/assets/photography/website/startup-tour-dinner.webp';
import coaching from '@ds/assets/photography/website/coaching.webp';
import { Specimen } from '@/core/docs/Specimen';
import { Frame, Pictogram } from '../components';

const EVENTS = [
  { img: bootcamp, title: 'Business Design Bootcamp', sub: 'Intro week', text: 'Get to know design thinking through hands-on activities.' },
  { img: tour, title: 'Startup Tours', sub: 'Every semester', text: 'Visit startups, accelerators and VCs across Europe and beyond.' },
  { img: coaching, title: 'Coaching', sub: 'Optional element', text: 'Experienced coaches right by your side.' },
];

const FEATURES = [
  { icon: 'education-skills', title: 'Business Design', text: 'Apply design thinking to real challenges from partner companies.' },
  { icon: 'workshop', title: 'Leadership Areas', text: 'Take ownership of the program itself in one of five Areas.' },
  { icon: 'international', title: 'Go international', text: 'Startup Tours and cooperations with universities worldwide.' },
  { icon: 'rocket', title: 'Start-Up Project', text: 'Build, test and launch your own venture with your team.' },
];


export default function CardsPage() {
  return (
    <>
      <Specimen title="Photo cards" description="Linked cards: the photo zooms on hover and fades in after loading." surface="mm-surface-black">
        <ul className="mm-grid mm-grid--3">
          {EVENTS.map((e) => (
            <li key={e.title} className="mm-photo-card">
              <a href="#" style={{ textDecoration: 'none' }} onClick={(ev) => ev.preventDefault()}>
                <Frame src={e.img} alt="" />
                <p className="mm-title">{e.title}</p>
                <p className="mm-photo-card__subtitle">{e.sub}</p>
                <p>{e.text}</p>
              </a>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen title="Feature cards" description="Web pictogram, top rule, title and short text." surface="mm-surface-black">
        <ul className="mm-features">
          {FEATURES.map((f) => (
            <li key={f.title} className="mm-feature">
              <Pictogram name={f.icon} />
              <p className="mm-title">{f.title}</p>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen title="People" description="Portrait placeholder until a photo exists." surface="mm-surface-white">
        <ul className="mm-people">
          {['Anna Berger', 'Jonas Weber', 'Mia Schulz', 'Leon Wagner'].map((name) => (
            <li key={name} className="mm-person">
              <div className="mm-placeholder-portrait">{name.split(' ').map((n) => n[0]).join('')}</div>
              <p className="mm-title">{name}</p>
              <p className="mm-person__role">Scholar · Batch 34</p>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen title="Plain card and logo placeholders" surface="mm-surface-white">
        <div className="mm-grid mm-grid--3">
          <div className="mm-card">
            <p className="mm-title">Card</p>
            <p className="mm-small mm-muted" style={{ margin: 0 }}>Hairline border, card radius, no shadow.</p>
          </div>
          <div className="mm-placeholder-logo">Partner logo</div>
          <div className="mm-placeholder-logo">Partner logo</div>
        </div>
      </Specimen>
    </>
  );
}
