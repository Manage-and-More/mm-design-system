/* React versions of the markup in examples/landing-page.html. Styling comes entirely from mm-base.css. */
import { useEffect, useState, type ReactNode } from 'react';
import logoOnDark from '@ds/assets/logo/svg/mm-logo-primary-on-dark.svg?url';
import labelOutlineWhite from '@ds/assets/labels/svg/by-unternehmertum-label-outline-white.svg?url';
import lockupOutlineWhite from '@ds/assets/labels/svg/descriptor-lockup-outline-white.svg?url';
import { cn } from '@/lib/cn';
import { pictograms } from './pictograms';

export const ARROW = 'M21.707 4.293 37.5 20 21.707 35.707l-1.414-1.414L33.584 21H6v-2h27.585L20.293 5.707z';
const PLUS = 'M21 5v14h14v2H21v14h-2V21H5v-2h14V5h2Z';
const MINUS = 'M35 19v2H5v-2z';
const MENU = 'M35 27v2H5v-2h30Zm0-8v2H5v-2h30Zm0-8v2H5v-2h30Z';
const CLOSE =
  'm34.293 4.293 1.414 1.414L21.414 20l14.293 14.293-1.414 1.414L20 21.414 5.707 35.707l-1.414-1.414L18.586 20 4.293 5.707l1.414-1.414L20 18.586 34.293 4.293Z';

export const Glyph = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);

export function ArrowLink({ href = '#', up, className, style, children }: { href?: string; up?: boolean; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  return (
    <a className={cn('mm-arrow-link', up && 'mm-arrow-link--up', className)} href={href} style={style} onClick={(e) => href === '#' && e.preventDefault()}>
      <span className="mm-sticker" aria-hidden="true">
        <Glyph d={ARROW} />
      </span>
      {children}
    </a>
  );
}

export function TwoTone({ as: Tag = 'h2', setup, payoff, className }: { as?: 'h1' | 'h2'; setup: string; payoff: string; className?: string }) {
  return (
    <Tag className={className}>
      <span className="mm-outline">{setup}</span>
      <span>{payoff}</span>
    </Tag>
  );
}

export function FaqItem({ question, children, open }: { question: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open}>
      <summary>
        <span className="mm-sticker" aria-hidden="true">
          <Glyph d={PLUS} className="mm-faq__plus" />
          <Glyph d={MINUS} className="mm-faq__minus" />
        </span>
        {question}
      </summary>
      <div>{children}</div>
    </details>
  );
}

/** Image in a frame that pulses until loaded, then fades in (14-motion.md). */
export function Frame({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('mm-frame', loaded && 'is-loaded', className)}>
      <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} ref={(img) => void (img?.complete && img.naturalWidth && setLoaded(true))} />
    </div>
  );
}

const NAV = ['Program', 'Application', 'People', 'Startups', 'Alumni'];

/**
 * Header with the live-site behaviour: solid after the scroll threshold, full-screen
 * menu below 768px (Escape closes, scroll locked). `inline` keeps it in flow for specimens.
 */
export function Header({ solid, inline }: { solid?: boolean; inline?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (inline) return;
    const threshold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mm-motion-scroll-threshold')) || 60;
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [inline]);

  useEffect(() => {
    document.body.classList.toggle('mm-menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn('mm-header', (solid || scrolled) && 'is-scrolled', open && 'is-open')}
      style={inline ? { position: 'relative' } : undefined}
    >
      <div className="mm-header__inner">
        <a className="mm-header__logo" href="#" aria-label="Manage and More — home" onClick={(e) => e.preventDefault()}>
          <img src={logoOnDark} alt="Manage and More" />
        </a>
        <button
          className="mm-menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <Glyph d={MENU} className="mm-menu-toggle__open" />
          <Glyph d={CLOSE} className="mm-menu-toggle__close" />
        </button>
        <nav aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item}>
                <a href="#" onClick={(e) => (e.preventDefault(), setOpen(false))}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Hero({ home, image, children, meta }: { home?: boolean; image: string; children: ReactNode; meta?: ReactNode }) {
  return (
    <section className={cn('mm-hero', home && 'mm-hero--home')}>
      <div className="mm-hero__media">
        <img src={image} alt="" fetchPriority="high" />
      </div>
      <div className="mm-container mm-hero__content">
        {children}
        {meta && <p className="mm-hero__meta">{meta}</p>}
      </div>
      <img className="mm-hero__label" src={labelOutlineWhite} alt="by UnternehmerTUM" />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mm-footer">
      <div className="mm-container mm-footer__grid">
        <div>
          <h2>UnternehmerTUM GmbH</h2>
          <address>
            Lichtenbergstraße 6
            <br />
            D-85748 Garching
            <br />
            Germany
          </address>
        </div>
        <nav aria-label="Social media">
          <h2>Social Media</h2>
          <ul>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2>Legal</h2>
          <ul>
            <li><a href="#">Imprint</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </nav>
        <div>
          <img className="mm-footer__lockup" src={lockupOutlineWhite} alt="Entrepreneurial Education, by UnternehmerTUM" />
          <ArrowLink up href="#" style={{ marginTop: '1.5rem' }}>
            Back to top
          </ArrowLink>
        </div>
      </div>
    </footer>
  );
}

export function Stats({ items }: { items: [value: string, label: string][] }) {
  return (
    <dl className="mm-stats">
      {items.map(([value, label]) => (
        <div key={label}>
          <dt hidden>{label}</dt>
          <dd>
            <span className="mm-stat__value">{value}</span>
            <span className="mm-stat__label">{label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Web pictogram (assets/icons/web) drawn in currentColor. */
export const Pictogram = ({ name, size = 48 }: { name: string; size?: number }) => (
  <span
    aria-hidden="true"
    style={{ display: 'block', width: size, height: size, background: 'currentColor', mask: `url("${pictograms[name]}") center / contain no-repeat` }}
  />
);
