/* Brand v4 building blocks. Styling lives in ../styles.css; logo and labels come only from asset files. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import logoOnDark from '@ds/assets/logo/svg/mm-logo-primary-on-dark.svg?url';
import logoOnLight from '@ds/assets/logo/svg/mm-logo-primary.svg?url';
import { cn } from '@/lib/cn';

/** The website's arrow glyph (examples/landing-page.html). */
const ARROW = 'M21.707 4.293 37.5 20 21.707 35.707l-1.414-1.414L33.584 21H6v-2h27.585L20.293 5.707z';

const prevent = (e: React.MouseEvent) => e.preventDefault();

export function Button({ variant = 'primary', children, href = '#' }: { variant?: 'primary' | 'ink' | 'glass'; children: ReactNode; href?: string }) {
  const arrow = variant !== 'glass';
  return (
    <a className={cn('v4-btn', `v4-btn--${variant}`, !arrow && 'v4-btn--plain')} href={href} onClick={href === '#' ? prevent : undefined}>
      {children}
      {arrow && (
        <span className="v4-dot" aria-hidden="true">
          <svg viewBox="0 0 40 40">
            <path d={ARROW} />
          </svg>
        </span>
      )}
    </a>
  );
}

export function TextLink({ children, external }: { children: ReactNode; external?: boolean }) {
  return (
    <a className="v4-link" href="#" onClick={prevent}>
      {children} <span aria-hidden="true">{external ? '↗' : '→'}</span>
    </a>
  );
}

/** Automated runs (`?static`, or a webdriver such as `pnpm shot`) see every stage in its final state. */
export const isStatic = () => new URLSearchParams(location.search).has('static') || navigator.webdriver === true;

/**
 * Page behaviour: header state, fade-ups (an enhancement only, content renders visible),
 * and the pinned stage's current step from scroll progress.
 */
export function useStudioPage(steps: number) {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [current, setCurrent] = useState(isStatic() ? steps - 1 : 0);
  const pinRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const still = isStatic();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) root.dataset.v4Static = '';
    else if (!reduced) root.dataset.v4Motion = '';

    const fades = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), fades.unobserve(e.target))),
      { rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('.v4-fade').forEach((el) => fades.observe(el));

    // The header inverts over dark sections: whatever sits under its 68px bar decides.
    const darkNow = new Set<Element>();
    const darkIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? darkNow.add(e.target) : darkNow.delete(e.target)));
        setOnDark(darkNow.size > 0);
      },
      { rootMargin: '-34px 0px -94% 0px' },
    );
    document.querySelectorAll('[data-tone="dark"]').forEach((el) => darkIO.observe(el));

    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(scrollY > 40);
      const pin = pinRef.current;
      if (!pin || still || innerWidth < 900) return;
      const p = Math.min(1, Math.max(0, (scrollY - pin.offsetTop) / (pin.offsetHeight - innerHeight)));
      setCurrent(Math.min(steps - 1, Math.floor(p * steps)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      fades.disconnect();
      darkIO.disconnect();
      delete root.dataset.v4Static;
      delete root.dataset.v4Motion;
    };
  }, [steps]);

  return { scrolled, onDark, current, pinRef };
}

const NAV = ['Program', 'Application', 'People', 'Startups', 'Alumni'];

export function Header({ scrolled, onDark }: { scrolled: boolean; onDark: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <header className={cn('v4-header', scrolled && 'is-scrolled', onDark && 'on-dark')}>
      <div className="v4-strip">
        <span className="v4-pip" aria-hidden="true" />
        <span>
          Next deadline: Sun, December 6th, 2026<span className="v4-strip__long">, 23:59:59 (CET), for the summer semester</span>.
        </span>
        <TextLink>Apply now</TextLink>
      </div>
      <div className={cn('v4-nav', open && 'is-open')}>
        <a href="#" onClick={prevent} aria-label="Manage and More, home">
          <img className="v4-logo-dark" src={logoOnDark} alt="Manage and More" />
          <img className="v4-logo-light" src={logoOnLight} alt="Manage and More" />
        </a>
        <nav aria-label="Main">
          <ul id="v4-menu">
            {NAV.map((item) => (
              <li key={item}>
                <a href="#" onClick={prevent}>
                  {item}
                </a>
              </li>
            ))}
            <li>
              <Button>Apply</Button>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className="v4-burger v4-btn v4-btn--glass"
          aria-expanded={open}
          aria-controls="v4-menu"
          onClick={() => setOpen(!open)}
          style={scrolled && !onDark ? { color: 'var(--ink)', borderColor: 'var(--hair)' } : undefined}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}

/** A full-bleed photo as weather: bottom-weighted black scrim and a low blue light, under grain. */
export function Backdrop({ src, priority }: { src: string; priority?: boolean }) {
  return (
    <div className="v4-backdrop" aria-hidden="true">
      <img src={src} alt="" fetchPriority={priority ? 'high' : 'auto'} />
    </div>
  );
}

/** The typeset brand name (not the logo) as outline caps, the website's two-tone outline material. */
export function Wordmark() {
  return (
    <div className="v4-wordmark" aria-hidden="true">
      <svg viewBox="0 0 1000 86" preserveAspectRatio="xMidYMin meet">
        <text x="0" y="80" fontSize="101" textLength="1000" lengthAdjust="spacing">
          MANAGE AND MORE
        </text>
      </svg>
    </div>
  );
}
