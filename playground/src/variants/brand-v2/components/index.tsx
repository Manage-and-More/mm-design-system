/* Brand v2 components. Styling lives in ../styles.css (.v2-* classes); tokens come from tokens.json. */
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
/* Brand v2 assets: assets/v2/ mirrors assets/ with the swirl in the Brand v2 blue (built by scripts/build_v2_assets.py). */
import logoPrimary from '@ds/assets/v2/logo/svg/mm-logo-primary.svg?url';
import logoOnDark from '@ds/assets/v2/logo/svg/mm-logo-primary-on-dark.svg?url';
import symbolBlue from '@ds/assets/v2/logo/svg/mm-symbol-blue.svg?url';
import labelBlack from '@ds/assets/v2/labels/svg/by-unternehmertum-label-outline-black.svg?url';
import labelWhite from '@ds/assets/v2/labels/svg/by-unternehmertum-label-outline-white.svg?url';
import lockupBlack from '@ds/assets/v2/labels/svg/descriptor-lockup-outline-black.svg?url';
import lockupWhite from '@ds/assets/v2/labels/svg/descriptor-lockup-outline-white.svg?url';
import { cn } from '@/lib/cn';
import { pictograms } from '../../brand/components/pictograms';
import { Figure } from './Figure';

export { Figure } from './Figure';

export const ARROW = 'M21.707 4.293 37.5 20 21.707 35.707l-1.414-1.414L33.584 21H6v-2h27.585L20.293 5.707z';
const PLUS = 'M21 5v14h14v2H21v14h-2V21H5v-2h14V5h2Z';
const CHECK = 'M16.5 28.2 7.3 19l1.4-1.4 7.8 7.8L31.3 10.6l1.4 1.4z';
const MENU = 'M35 27v2H5v-2h30Zm0-8v2H5v-2h30Zm0-8v2H5v-2h30Z';
const CLOSE = 'm34.293 4.293 1.414 1.414L21.414 20l14.293 14.293-1.414 1.414L20 21.414 5.707 35.707l-1.414-1.414L18.586 20 4.293 5.707l1.414-1.414L20 18.586 34.293 4.293Z';

export const Glyph = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true"><path d={d} /></svg>
);

/** A light/dark pair of asset files: the playground toggles data-mode on <html>. */
const Pair = ({ light, dark, alt, className }: { light: string; dark: string; alt: string; className?: string }) => (
  <>
    <img src={light} alt={alt} className={cn(className, 'dark:hidden')} />
    <img src={dark} alt={alt} className={cn(className, 'hidden dark:block')} />
  </>
);

const stop = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => href === '#' && e.preventDefault();

/** The hero's two-line display: the setup line outlined, the payoff solid. */
export function Display({ setup, payoff, as: Tag = 'h1', className }: { setup?: string; payoff: string; as?: 'h1' | 'h2' | 'p'; className?: string }) {
  return (
    <Tag className={cn('v2-display', className)}>
      {setup && <span className="v2-outline">{setup}</span>}
      <span>{payoff}</span>
    </Tag>
  );
}

export function ArrowLink({ href = '#', up, className, style, children }: { href?: string; up?: boolean; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <a className={cn('v2-arrow-link', up && 'v2-arrow-link--up', className)} href={href} style={style} onClick={(e) => stop(e, href)}>
      <span className="v2-arrow-link__ring" aria-hidden="true"><Glyph d={ARROW} /></span>
      {children}
    </a>
  );
}

export function Button({ variant = 'primary', small, href, className, children, ...rest }: { variant?: 'primary' | 'action' | 'quiet'; small?: boolean; href?: string; className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn('v2-button', `v2-button--${variant}`, small && 'v2-button--small', className);
  if (href !== undefined) return <a className={cls} href={href} onClick={(e) => stop(e, href)}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

export function TextLink({ href = '#', children }: { href?: string; children: ReactNode }) {
  return <a className="v2-link" href={href} onClick={(e) => stop(e, href)}>{children}</a>;
}

const NAV = ['Product', 'For judges', 'For organisers', 'Pricing', 'Docs'];

/** Sticky translucent header. `inline` keeps it in flow for specimens. */
export function Header({ inline, cta = 'Sign in' }: { inline?: boolean; cta?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (inline) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [inline]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <>
      <header className={cn('v2-header', scrolled && 'is-scrolled', inline && 'v2-header--inline')}>
        <div className="v2-container v2-header__inner">
          <a className="v2-header__logo" href="#" aria-label="Manage and More — home" onClick={(e) => stop(e, '#')}>
            <Pair light={logoPrimary} dark={logoOnDark} alt="Manage and More" />
          </a>
          <nav aria-label="Main">
            <ul>{NAV.map((n, i) => <li key={n}><a href="#" aria-current={i === 0 ? 'page' : undefined} onClick={(e) => stop(e, '#')}>{n}</a></li>)}</ul>
          </nav>
          <Button small variant="primary" href="#" className="v2-header__cta">{cta}</Button>
          <button className="v2-menu-toggle" type="button" aria-expanded={open} aria-controls="v2-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <Glyph d={open ? CLOSE : MENU} />
          </button>
        </div>
      </header>
      {open && (
        <nav id="v2-menu" className="v2-menu" aria-label="Main">
          {NAV.map((n) => <a key={n} href="#" onClick={(e) => { stop(e, '#'); setOpen(false); }}>{n}</a>)}
          <Button variant="primary" href="#">{cta}</Button>
        </nav>
      )}
    </>
  );
}

/** Text left, figure right; the endorsement label sits quietly in the corner. */
export function Hero({ setup, payoff, lead, figure, play = true, actions, label = true }: { setup?: string; payoff: string; lead: ReactNode; figure: string; play?: boolean; actions?: ReactNode; label?: boolean }) {
  return (
    <section className="v2-hero">
      <div className="v2-container v2-split">
        <div className="v2-hero__content">
          <Display setup={setup} payoff={payoff} />
          <p className="v2-lead">{lead}</p>
          {actions && <div className="v2-hero__actions">{actions}</div>}
        </div>
        <div className="v2-hero__figure">
          <Figure name={figure} play={play} readout intensity={0.6} plate="raised" className="v2-figure--plate" />
        </div>
      </div>
      {label && (
        <div className="v2-hero__label">
          <Pair light={labelBlack} dark={labelWhite} alt="by UnternehmerTUM" />
        </div>
      )}
    </section>
  );
}

/** A section on the canvas, or a full-bleed tile (`tone`): the colour change is the divider. */
export function Section({ tone, id, className, children }: { tone?: 'light' | 'parchment' | 'dark'; id?: string; className?: string; children: ReactNode }) {
  return <section id={id} className={cn('v2-section', tone && `v2-tile v2-tile--${tone}`, className)}><div className="v2-container">{children}</div></section>;
}

export function SectionHead({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="v2-section__head">
      <h2 className="v2-heading">{title}</h2>
      {children && <p className="v2-lead">{children}</p>}
    </div>
  );
}

export function Pictogram({ name, className }: { name: string; className?: string }) {
  return <span aria-hidden="true" className={cn('v2-pictogram', className)} style={{ display: 'block', background: 'currentColor', mask: `url("${pictograms[name]}") center / contain no-repeat`, WebkitMask: `url("${pictograms[name]}") center / contain no-repeat` }} />;
}

export function Chip({ live, sm, children }: { live?: boolean; sm?: boolean; children: ReactNode }) {
  return <span className={cn('v2-chip', live && 'v2-chip--live', sm && 'v2-chip--sm')}>{children}</span>;
}

export function Card({ figure, pictogram, chip, title, text, foot, href, quiet, children }: { figure?: string; pictogram?: string; chip?: ReactNode; title: ReactNode; text?: ReactNode; foot?: ReactNode; href?: string; quiet?: boolean; children?: ReactNode }) {
  const cls = cn('v2-card', href && 'v2-card--link', quiet && 'v2-card--quiet');
  const body = (
    <>
      {figure && <div className="v2-card__figure"><Figure name={figure} plate={quiet ? 'surface' : 'raised'} /></div>}
      {pictogram && <Pictogram name={pictogram} />}
      {chip && <div>{chip}</div>}
      <h3 className="v2-card__title">{title}</h3>
      {text && <p className="v2-card__text">{text}</p>}
      {children}
      {foot && <div className="v2-card__foot">{foot}</div>}
    </>
  );
  return href ? <a className={cls} href={href} onClick={(e) => stop(e, href)}>{body}</a> : <div className={cls}>{body}</div>;
}

export interface Audience { id: string; label: string; title: string; text: ReactNode; points: string[]; figure: string; cta: string }

/** Participants / Judges / Organisers: each tab is one audience with its own figure. */
export function AudienceTabs({ items }: { items: Audience[] }) {
  const [active, setActive] = useState(items[0].id);
  const base = useId();
  const current = items.find((i) => i.id === active) ?? items[0];
  return (
    <div>
      <div className="v2-tabs" role="tablist" aria-label="Who it is for">
        {items.map((it) => (
          <button key={it.id} role="tab" id={`${base}-${it.id}`} aria-selected={it.id === active} aria-controls={`${base}-${it.id}-panel`} onClick={() => setActive(it.id)}>{it.label}</button>
        ))}
      </div>
      <div className="v2-tabpanel" role="tabpanel" id={`${base}-${current.id}-panel`} aria-labelledby={`${base}-${current.id}`}>
        <div>
          <h3 className="v2-heading" style={{ fontSize: 'var(--mm-font-size-v2-subheading)', maxWidth: 'none' }}>{current.title}</h3>
          <p className="v2-prose v2-muted" style={{ marginTop: '0.75rem' }}>{current.text}</p>
          <ul className="v2-checklist">{current.points.map((p) => <li key={p}><Glyph d={CHECK} /><span>{p}</span></li>)}</ul>
          <ArrowLink className="mt-8">{current.cta}</ArrowLink>
        </div>
        <Figure key={current.figure} name={current.figure} framed readout intensity={0.6} />
      </div>
    </div>
  );
}

/** Stat row. A value's unit after a space is set small and muted ("90 %", "5 x"). */
export function Stats({ items }: { items: [value: string, label: string][] }) {
  const split = (v: string) => { const m = /^(.*\S)\s+(\S{1,4})$/.exec(v); return m ? <>{m[1]}<small> {m[2]}</small></> : v; };
  return (
    <dl className="v2-stats">
      {items.map(([value, label]) => (
        <div key={label}><dt hidden>{label}</dt><dd><span className="v2-stat__value">{split(value)}</span><span className="v2-stat__label">{label}</span></dd></div>
      ))}
    </dl>
  );
}

/** The one blue section per page. Text on it is black (brand rule). */
export function Band({ title, children, action, figure }: { title: string; children?: ReactNode; action?: ReactNode; figure?: string }) {
  return (
    <section className="v2-band">
      <div className={cn('v2-container', figure && 'v2-split')}>
        <div className="grid gap-4 justify-items-start">
          <h2 className="v2-heading">{title}</h2>
          {children && <p className="v2-lead">{children}</p>}
          {action}
        </div>
        {figure && <Figure name={figure} intensity={0.5} />}
      </div>
    </section>
  );
}

export function Faq({ items }: { items: [question: string, answer: ReactNode][] }) {
  return (
    <div className="v2-faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary><span className="v2-faq__glyph" aria-hidden="true"><Glyph d={PLUS} /></span>{q}</summary>
          <div className="v2-faq__body">{a}</div>
        </details>
      ))}
    </div>
  );
}

export function EmptyState({ figure, title, text, action }: { figure: string; title: string; text: ReactNode; action: ReactNode }) {
  return (
    <div className="v2-empty">
      <Figure name={figure} />
      <h3>{title}</h3>
      <p className="v2-muted">{text}</p>
      {action}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-container">
        <div className="v2-footer__grid">
          <div>
            <Pair light={lockupBlack} dark={lockupWhite} alt="Entrepreneurial Education, by UnternehmerTUM" className="v2-footer__lockup" />
            <p className="v2-muted" style={{ marginTop: '1rem', maxWidth: '28ch' }}>UnternehmerTUM GmbH · Lichtenbergstraße 6 · D-85748 Garching</p>
          </div>
          <nav aria-label="Product"><h2>Product</h2><ul><li><a href="#">Hackathon platform</a></li><li><a href="#">CRM</a></li><li><a href="#">Changelog</a></li></ul></nav>
          <nav aria-label="Company"><h2>Company</h2><ul><li><a href="#">Manage and More</a></li><li><a href="#">LinkedIn</a></li><li><a href="#">Instagram</a></li></ul></nav>
          <nav aria-label="Legal"><h2>Legal</h2><ul><li><a href="#">Imprint</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms</a></li></ul></nav>
        </div>
        <div className="v2-footer__bottom">
          <span className="inline-flex items-center gap-3"><img src={symbolBlue} alt="" className="v2-footer__symbol" />© {new Date().getFullYear()} Manage and More</span>
          <ArrowLink up href="#">Back to top</ArrowLink>
        </div>
      </div>
    </footer>
  );
}
