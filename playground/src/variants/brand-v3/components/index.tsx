/* Brand v3 components: the studio-landing skill ported from templates/skeleton.html into React.
   Styling lives in ../styles.css (.b3-* classes); colours, radius and motion come from tokens.json. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import logoPrimary from '@ds/assets/v2/logo/svg/mm-logo-primary.svg?url';
import logoOnDark from '@ds/assets/v2/logo/svg/mm-logo-primary-on-dark.svg?url';
import labelOutlineWhite from '@ds/assets/v2/labels/svg/by-unternehmertum-label-outline-white.svg?url';
import lockupWhite from '@ds/assets/v2/labels/svg/descriptor-lockup-outline-white.svg?url';
import { cn } from '@/lib/cn';
import { pictograms } from '../../brand/components/pictograms';

const stop = (e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.getAttribute('href') === '#' && e.preventDefault();
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Automated browsers (pnpm shot) take one full-page picture without scrolling: show the final, static state. */
const automated = () => navigator.webdriver === true;
/** The stage unpins on phones, under reduced motion and for full-page screenshots. */
const STATIC_STAGE = '(max-width: 860px), (prefers-reduced-motion: reduce)';
const stageIsStatic = () => automated() || window.matchMedia(STATIC_STAGE).matches;

export const Arrow = () => <span className="b3-arrow" aria-hidden="true">→</span>;

export function Button({ variant = 'solid', small, href = '#', children }: { variant?: 'solid' | 'ghost'; small?: boolean; href?: string; children: ReactNode }) {
  return <a className={cn('b3-btn', `b3-btn--${variant}`, small && 'b3-btn--small')} href={href} onClick={stop}>{children}</a>;
}

export function TextLink({ href = '#', children }: { href?: string; children: ReactNode }) {
  return <a className="b3-link" href={href} onClick={stop}>{children} <Arrow /></a>;
}

/* ---------- page behaviour: fade-ups once, nav tone per section ---------- */

/** Marks the document as scripted (so .b3-reveal may start hidden) and reveals blocks once as they enter. */
export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll<HTMLElement>('.b3-reveal')];
    if (automated()) { root.classList.add('b3-still'); return () => root.classList.remove('b3-still'); }
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    // Anything already on screen (or above it) is shown at once; only what lies below waits for its entrance.
    els.forEach((el) => el.getBoundingClientRect().top < innerHeight && el.classList.add('is-in'));
    root.classList.add('b3-js');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => !el.classList.contains('is-in') && io.observe(el));
    return () => { io.disconnect(); root.classList.remove('b3-js'); };
  }, []);
}

/* ---------- strip and nav ---------- */

export function Strip({ children, action }: { children: ReactNode; action: ReactNode }) {
  return (
    <div className="b3-strip">
      <span className="b3-dot b3-dot--blink" aria-hidden="true" />
      <span>{children}</span>
      {action}
    </div>
  );
}

const NAV = ['Product', 'For judges', 'For organisers', 'Pricing', 'Docs'];

/** Logo left, links and one square CTA right. Inverts over night sections (any element with .b3-on-night). */
export function Nav({ cta = 'Sign in' }: { cta?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<'night' | 'paper'>('night');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const nav = ref.current;
      if (!nav) return;
      const probe = nav.getBoundingClientRect().bottom - 8;
      const onNight = [...document.querySelectorAll('.b3-on-night')].some((el) => { const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
      setTone(onNight ? 'night' : 'paper');
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <>
      <header ref={ref} className={cn('b3-nav', scrolled && 'is-scrolled')} data-tone={tone}>
        <a className="b3-nav__logo" href="#" onClick={stop} aria-label="Manage and More, home">
          <img className="b3-logo--night" src={logoOnDark} alt="Manage and More" />
          <img className="b3-logo--paper" src={logoPrimary} alt="" />
        </a>
        <nav aria-label="Main"><ul>{NAV.map((n) => <li key={n}><a href="#" onClick={stop}>{n}</a></li>)}</ul></nav>
        <Button small>{cta}</Button>
        <button className="b3-burger" type="button" aria-label="Open menu" aria-expanded={open} aria-controls="b3-menu" onClick={() => setOpen(true)}><span /></button>
      </header>
      {open && (
        <nav id="b3-menu" className="b3-menu b3-on-night" aria-label="Main">
          <button className="b3-menu__close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
          {NAV.map((n) => <a key={n} href="#" onClick={(e) => { stop(e); setOpen(false); }}>{n}</a>)}
          <div style={{ marginTop: 24 }}><Button>{cta}</Button></div>
        </nav>
      )}
    </>
  );
}

/* ---------- weather: night sky, low horizon light, ground; used by the hero and the ending ---------- */

const RAILS = ['var(--g)', '33.333%', '66.666%', 'calc(100% - var(--g))'];

function Rails() {
  return <div className="b3-rails" aria-hidden="true">{RAILS.map((left) => <i key={left} style={{ left }} />)}</div>;
}

export function Weather({ className, sky, ground, as: Tag = 'section', label }: { className?: string; sky: ReactNode; ground: ReactNode; as?: 'section' | 'header' | 'div'; label?: string }) {
  return (
    <Tag className={cn('b3-weather b3-on-night', className)} aria-label={label}>
      <div className="b3-sky"><Rails /><div className="b3-grain" aria-hidden="true" />{sky}</div>
      <div className="b3-ground"><div className="b3-grain" aria-hidden="true" />{ground}</div>
    </Tag>
  );
}

/** Two beats, the second muted: the hero H1, and its restatement in the closer. */
export function Beats({ lines, as: Tag = 'h1', arrive }: { lines: [string, string]; as?: 'h1' | 'h2'; arrive?: boolean }) {
  return (
    <Tag className="b3-h1">
      {lines.map((l, i) => <span key={l} className={cn(arrive && 'b3-arrive')} style={arrive ? ({ '--d': `${i * 150}ms` } as CSSProperties) : undefined}>{l}</span>)}
    </Tag>
  );
}

export function Hero({ lines, lede, actions, teaser }: { lines: [string, string]; lede: ReactNode; actions: ReactNode; teaser: { title: string; meta: string } }) {
  return (
    <Weather
      as="header"
      className="b3-hero"
      sky={
        <>
          <div className="b3-hero__copy">
            <p className="b3-arrive" style={{ '--d': '250ms' } as CSSProperties}>{lede}</p>
            <div className="b3-hero__actions b3-arrive" style={{ '--d': '350ms' } as CSSProperties}>{actions}</div>
          </div>
          <a className="b3-teaser b3-arrive" href="#" onClick={stop} style={{ '--d': '450ms' } as CSSProperties}>
            <span className="b3-teaser__thumb"><span className="b3-grain" aria-hidden="true" /><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" /></svg></span>
            <span><strong>{teaser.title}</strong>{teaser.meta}</span>
          </a>
        </>
      }
      ground={
        <>
          <Beats lines={lines} arrive />
          <img className="b3-endorse" src={labelOutlineWhite} alt="by UnternehmerTUM" />
        </>
      }
    />
  );
}

/* ---------- split heading ---------- */

export function Split({ title, children, as: Tag = 'h2', className }: { title: ReactNode; children?: ReactNode; as?: 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cn('b3-split b3-reveal', className)}>
      <Tag className="b3-h2">{title}</Tag>
      {children && <p className="b3-lede">{children}</p>}
    </div>
  );
}

/* ---------- pinned stage ---------- */

export interface StageStep { title: string; text: string; card: ReactNode }

const HANDLES = Array.from({ length: 16 }, (_, i) => ({ left: `${((i % 4) * 100) / 3}%`, top: `${(Math.floor(i / 4) * 100) / 3}%` }));

/** A sticky stage inside a tall parent: one step per ~620px of scroll. The matching rail slab opens as its card lands on the stack. */
export function PinnedStage({ steps, action, meta }: { steps: StageStep[]; action: ReactNode; meta: [ReactNode, ReactNode] }) {
  const ref = useRef<HTMLElement>(null);
  const [isStatic, setStatic] = useState(stageIsStatic);
  const [current, setCurrent] = useState(() => (stageIsStatic() ? steps.length - 1 : 0));
  useEffect(() => {
    const section = ref.current!;
    const static_ = window.matchMedia(STATIC_STAGE);
    let raf = 0;
    const update = () => {
      raf = 0;
      const still = stageIsStatic();
      setStatic(still);
      if (still) { setCurrent(steps.length - 1); return; }
      const top = section.getBoundingClientRect().top + window.scrollY;
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / (section.offsetHeight - innerHeight)));
      section.style.setProperty('--p', p.toFixed(3));
      setCurrent(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    static_.addEventListener('change', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); static_.removeEventListener('change', onScroll); cancelAnimationFrame(raf); };
  }, [steps.length]);
  /** Clicking a slab scrolls to its step, so the stage is usable without scrubbing. */
  const jump = (i: number) => {
    const section = ref.current!;
    if (stageIsStatic()) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / steps.length) * (section.offsetHeight - innerHeight) });
  };
  return (
    <section ref={ref} className={cn('b3-pin', isStatic && 'is-static')} data-current={current} style={{ '--steps': steps.length } as CSSProperties}>
      <div className="b3-stage">
        <div className="b3-rail">
          {steps.map((s, i) => (
            <div key={s.title} className={cn('b3-rail__item', i === current && 'is-open')}>
              <h3><button type="button" className="b3-rail__head" aria-expanded={i === current} onClick={() => jump(i)}><span className="b3-num">0{i + 1}</span>{s.title}</button></h3>
              <div className="b3-rail__body"><div><p>{s.text}</p></div></div>
            </div>
          ))}
          {action}
        </div>
        <div className="b3-scene" aria-hidden="true">
          <div className="b3-scene__frame">
            <div className="b3-scene__grid">{HANDLES.map((h, i) => <span key={i} className="b3-handle" style={h} />)}</div>
            <p className="b3-scene__meta b3-scene__meta--top b3-label">{meta[0]}</p>
            <p className="b3-scene__meta b3-scene__meta--bottom b3-label"><span className="b3-num">0{current + 1} / 0{steps.length}</span>{meta[1]}</p>
            {steps.map((s, i) => (
              <div key={s.title} className="b3-plate" style={{ zIndex: i + 1, '--k': current - i } as CSSProperties} data-state={i < current ? 'past' : i === current ? 'active' : 'next'}>
                {s.card}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- redrawn product cards ---------- */

export function Mock({ title, meta, children, foot }: { title: string; meta?: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="b3-mock">
      <div className="b3-mock__head"><span className="b3-mock__icon" /><span className="b3-mock__title">{title}</span>{meta && <span className="b3-mock__meta">{meta}</span>}</div>
      {children}
      {foot && <div className="b3-mock__foot">{foot}</div>}
    </div>
  );
}

export function Row({ name, sub, mid, end }: { name: ReactNode; sub?: ReactNode; mid?: ReactNode; end?: ReactNode }) {
  return <div className="b3-mock__row"><div>{name}{sub && <small>{sub}</small>}</div><div>{mid}</div><div>{end}</div></div>;
}

export const Chip = ({ on, children }: { on?: boolean; children: ReactNode }) => <span className={cn('b3-chip', on && 'b3-chip--on')}>{children}</span>;

export const Score = ({ of = 5, value }: { of?: number; value: number }) => (
  <span className="b3-score" aria-label={`${value} of ${of}`}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < value ? 'on' : undefined} />)}</span>
);

/* ---------- seats ---------- */

export interface Seat { pictogram: string; who: string; title: string; text: string; cta: string }

export function Seats({ items }: { items: Seat[] }) {
  return (
    <div className="b3-cells b3-reveal">
      {items.map((s) => (
        <article key={s.who} className="b3-cell">
          <span aria-hidden="true" className="b3-cell__mark" style={{ mask: `url("${pictograms[s.pictogram]}") center / contain no-repeat`, WebkitMask: `url("${pictograms[s.pictogram]}") center / contain no-repeat` }} />
          <div className="b3-cell__foot">
            <h3 className="b3-h3">{s.who}. <span>{s.title}</span></h3>
            <p>{s.text}</p>
            <TextLink>{s.cta}</TextLink>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------- numbers ---------- */

export function Tiles({ items }: { items: [figure: string, caption: string][] }) {
  return (
    <dl className="b3-tiles b3-reveal">
      {items.map(([fig, cap]) => (
        <div key={fig} className="b3-tile"><dt><p>{cap}</p></dt><dd className="b3-fig">{fig}</dd></div>
      ))}
    </dl>
  );
}

/* ---------- band ---------- */

export function Band({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
  return (
    <section className="b3-band">
      <div className="b3-split">
        <h2 className="b3-h2">{title}</h2>
        <div><p>{children}</p>{action}</div>
      </div>
    </section>
  );
}

/* ---------- trust badges as line art ---------- */

const ring = (r: number, n: number) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [48 + r * Math.cos(a), 48 + r * Math.sin(a)] as const; });

export function Badge({ kind }: { kind: 'eu' | 'export' | 'link' }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="48" cy="48" r="46" strokeDasharray="1 4" strokeLinecap="round" />
      {kind === 'eu' && ring(22, 12).map(([x, y], i) => <path key={i} d={`M${x} ${y - 3}l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z`} />)}
      {kind === 'export' && <><path d="M36 30h16l8 8v28H36z" /><path d="M52 30v8h8" /><path d="M48 44v14m-5-5 5 5 5-5" /></>}
      {kind === 'link' && <><path d="M30 38h36v24H30z" /><path d="m30 38 18 13 18-13" /><circle cx="66" cy="62" r="7" fill="var(--paper)" /><path d="m63 62 2 2 4-4" /></>}
    </svg>
  );
}

export function Trust({ items }: { items: { kind: 'eu' | 'export' | 'link'; title: string; text: string }[] }) {
  return (
    <section className="b3-trust b3-reveal" aria-label="Trust">
      {items.map((t) => <div key={t.title} className="b3-badge"><Badge kind={t.kind} /><p><strong>{t.title}</strong>{t.text}</p></div>)}
    </section>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ title, intro, items }: { title: string; intro: ReactNode; items: [q: string, a: string][] }) {
  return (
    <section className="b3-faq-section">
      <div className="b3-split b3-reveal">
        <div><h2 className="b3-h2">{title}</h2><p className="b3-lede">{intro}</p></div>
        <div className="b3-faq">{items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </div>
    </section>
  );
}

/* ---------- pixel wordmark: the name in blocks, lit from the horizon ---------- */

const GLYPHS: Record<string, string[]> = {
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
};

function pixels(text: string) {
  const cells: [number, number][] = [];
  let x = 0;
  for (const ch of text.toUpperCase()) {
    if (ch === ' ') { x += 2; continue; }
    GLYPHS[ch]?.forEach((row, y) => [...row].forEach((bit, cx) => bit === '1' && cells.push([x + cx, y])));
    x += 6;
  }
  return { cells, cols: x - 1 };
}

export function PixelWordmark({ text }: { text: string }) {
  const { cells, cols } = pixels(text);
  return (
    <div className="b3-wordmark" style={{ '--cols': cols } as CSSProperties} aria-hidden="true">
      <svg viewBox={`0 0 ${cols} 7`}>
        <defs>
          <radialGradient id="b3-wm-light" gradientUnits="userSpaceOnUse" cx={cols * 0.64} cy="9" r={cols * 0.5}>
            <stop offset="0" stopColor="var(--glow)" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
          </radialGradient>
        </defs>
        <g fill="url(#b3-wm-light)">{cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x + 0.06} y={y + 0.06} width="0.88" height="0.88" />)}</g>
      </svg>
    </div>
  );
}

/* ---------- ending: closing CTA and footer on one field ---------- */

export function Ending({ lines, lede, actions, tagline }: { lines: [string, string]; lede: string; actions: ReactNode; tagline: [string, string] }) {
  return (
    <Weather
      as="div"
      className="b3-ending"
      sky={<div className="b3-ending__actions b3-reveal"><p>{lede}</p>{actions}</div>}
      ground={
        <>
          <Beats lines={lines} as="h2" />
          <footer className="b3-footer">
            <div>
              <p className="b3-footer__tag">{tagline[0]}<br />{tagline[1]}</p>
              <img className="b3-footer__lockup" src={lockupWhite} alt="Entrepreneurial Education, by UnternehmerTUM" />
            </div>
            <nav aria-label="Product"><h2>Product</h2><ul><li><a href="#" onClick={stop}>Hackathon platform</a></li><li><a href="#" onClick={stop}>CRM</a></li><li><a href="#" onClick={stop}>Changelog</a></li></ul></nav>
            <nav aria-label="Company"><h2>Company</h2><ul><li><a href="#" onClick={stop}>Manage and More</a></li><li><a href="#" onClick={stop}>LinkedIn ↗</a></li><li><a href="#" onClick={stop}>Instagram ↗</a></li></ul></nav>
            <nav aria-label="Legal"><h2>Legal</h2><ul><li><a href="#" onClick={stop}>Imprint</a></li><li><a href="#" onClick={stop}>Privacy Policy</a></li><li><a href="#" onClick={stop}>Terms</a></li></ul></nav>
          </footer>
          <div className="b3-legal"><span>© {new Date().getFullYear()} Manage and More · UnternehmerTUM GmbH · Lichtenbergstraße 6 · D-85748 Garching</span><span>Brand v3, experimental</span></div>
          <PixelWordmark text="Manage and More" />
        </>
      }
    />
  );
}
