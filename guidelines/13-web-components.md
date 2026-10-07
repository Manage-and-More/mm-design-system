---
title: Web components
summary: The building blocks of manageandmore.de (header, hero, sections, two-tone headings, arrow links, stat rows, cards, carousels, FAQ, footer) with exact specs, tokens and accessibility fixes.
source: manage-and-more-website repo (Next.js 16 + Tailwind v4), src/components and src/app, commit 742e91f, read 2026-10-07
status: adopted (website patterns approved as the screen standard on 2026-10-07)
tokens: tokens/tokens.json#layout, #radius, #opacity, #motion, #font.size
---

# Web components

These are the components of the live website, written down so that every new Manage and More page, app, landing page or campaign site looks like manageandmore.de. Each spec names the website file it comes from (paths are inside the `manage-and-more-website` repo).

Where the website fails WCAG 2.2 AA or a brand rule, the spec gives the **corrected** version and marks the website's current value with **Website today**. The full list of open website fixes is in [sources-and-discrepancies.md](sources-and-discrepancies.md#website-fixes).

Tokens are written as CSS custom properties (`--mm-…`, from [`tokens/build/tokens.css`](../tokens/build/tokens.css)); Tailwind v4 projects can use [`tokens/build/tailwind.theme.css`](../tokens/build/tailwind.theme.css) (`bg-mm-blue`, `rounded-mm-card`, …). A framework-free implementation of most components is in [`examples/mm-base.css`](../examples/mm-base.css) and [`examples/landing-page.html`](../examples/landing-page.html).

## Page anatomy

```
Header (fixed, transparent over the hero)
Hero (full-bleed photo or video, black shade, two-tone h1 bottom-left, label bottom-right)
Section dark  ─┐
Section light  │  alternate; a hairline divides them
Section dark   │  one or two blue sections per page for emphasis
Section light ─┘
Footer (black)
```

- **Black and white sections alternate.** This is the main rhythm of the site. Blue is used for one or two emphasis sections (deadlines, an offer), grey rarely.
- Every page opens with a dark hero (or a dark first section). The header is white and transparent, so a page that starts on white makes the navigation invisible (see [Header](#header)).
- Text is left-aligned. The only centred element is the application countdown.

## Section

Source: `src/components/Section.tsx`, `src/app/globals.css`.

A full-bleed band with a tone, vertical padding and a width-limited container.

| Tone | Background | Text | Use |
|---|---|---|---|
| `dark` | black | white | default emphasis, every second section |
| `light` | white | black | every other section |
| `gray` | grey `#E3E3E3` | black | quiet supporting content (rare) |
| `blue` | blue `#00A2CD` | **black** | one or two emphasis sections per page |

- **Blue sections use black text** (7.05:1). **Website today:** white text on blue (2.98:1, fails AA) in "Application Deadlines", "What the Manage and More Alumni network offers" and "How we stay in touch".
- **Divider:** each section has a 1px top border in `currentColor` at `--mm-opacity-divider` (20%). Drop it when a section follows a hero of the same colour.
- **Padding** (`--mm-space-section-*`):

| Spacing | Mobile | ≥768px | ≥1200px | ≥1536px |
|---|---|---|---|---|
| small | 25px | 50px | 50px | 50px |
| default | 25px | 50px | 75px | 100px |
| large | 50px | 75px | 100px | 100px |

- **Container:** `width: 100%`, centred, horizontal padding `--mm-layout-gutter-small` (20px), `-medium` from 768px (30px), `-large` from 1200px (50px). Max width (gutter included) by `width`:

| Width | Max | Use |
|---|---|---|
| `text` | 900px | legal pages, long reading |
| `sm` | 1180px | |
| `split` | 1300px | one half of a 50/50 split |
| `md` (default) | 1500px | almost every section |
| `page` | 1600px | directory and portfolio grids |
| `lg` | 1700px | |

- Inside a section, keep running text to about 48rem (`max-w-3xl`) so lines stay readable at 20px body size.

## Section heading (two-tone)

Source: `src/components/SectionHeading.tsx`, `.section-title` and `.text-outline` in `src/app/globals.css`.

The signature heading: an **outlined** line (transparent fill, stroke in `currentColor`) stacked above a **solid** line. It applies the PDF's optional outline headline (p.18) and replaces the old site's italics.

```html
<h2 class="mm-heading">
  <span class="mm-outline">Broaden your horizons:</span>
  <span>International Opportunities</span>
</h2>
```

- Size `--mm-font-size-heading-*` (25px, 50px from 768px), weight 800, `line-height: 1.15`, `text-wrap: balance`. Each line is `display: block`.
- Outline stroke `--mm-stroke-outline-text-mobile` (1px), `-desktop` (1.5px from 576px). Colour comes from `currentColor`, so it works on every tone.
- The outline line is optional; a single solid line is common ("Connect. Grow. Belong.").
- Variants seen on the site: **inline**, where the outline and solid parts flow on one line ("The Proven Framework to **Build and Scale.**", "What will you do at *Manage and More?*"), and **reversed**, solid first then outline ("Testimonials / *by Our Active Scholars and Alumni*").
- Copy pattern: the outline line sets up, the solid line pays off. See [12-voice-and-tone.md](12-voice-and-tone.md).
- Keep outline lines short (one line where possible). Thin outlines at 25px are harder to read; never put essential information only in the outline line.

## Header

Source: `src/components/Header.tsx`, `src/components/Logo.tsx`.

- `position: fixed`, full width, transparent, white text, sitting over the hero. Height 70px, 100px from 768px. Horizontal padding 30px, 50px from 1200px (`--mm-layout-header-*`).
- **Logo** left: primary logo on dark (blue symbol, white wordmark), 98px wide, 128px from 768px. Link label "Manage and More — home".
- **Navigation** right, from 768px: links in 0.95rem Medium, white at 90% opacity, full white on hover, 32px apart. Items: Home, Program, Application, People, Startups, Alumni.
- **After 20px of scrolling** the header gets a black background at 95% (`--mm-opacity-header-scrolled`) with a small backdrop blur, transition 300ms. The blur only keeps the navigation legible; it is not a "glass" style for content.
- **Mobile** (below 768px): a hamburger of three 2px bars, 28px wide, morphing into an X. It opens a full-screen black overlay with the nav items at 1.875rem Extrabold, 24px apart. Escape closes it, page scrolling is locked, and the toggle has `aria-expanded` and `aria-controls`.
- **Pages without a dark hero** must start with a dark section, or give the header a solid black background from the start. **Website today:** Imprint and Privacy Policy start on white, so the white navigation is invisible until you scroll.

## Hero

Source: `src/components/Hero.tsx`, `src/components/VimeoBackground.tsx`.

- Full-bleed, black background, `overflow: hidden`, content anchored to the **bottom-left**.
- **Media:** a cover photo (source files 1920×960) or a muted, looping background video (Vimeo `background=1&muted=1&loop=1&dnt=1`, `aria-hidden`, not focusable).
- **Shade:** a flat black layer over the media at `--mm-opacity-shade` (40%) by default, `-light` (20%) for calm dark images, `-strong` (60%) for bright or busy ones. No gradients. Check contrast against the brightest area behind the text: at least 3:1 for the display heading and 4.5:1 for any smaller text.
- **Heading:** a two-tone h1 at display size (`--mm-font-size-display-*`: 30, 50, 40 at 992, 50 at 1200, 75px at 1536), max-width 1200px. The inline variant suits short single-line titles.
- **Sizes:** *home*, min-height 550px (710px from 768px) with bottom padding 52px (78px); *compact* (inner pages), padding-top 120px (175px) and bottom 45px (75px), so the content clears the fixed header.
- **Endorsement:** the BY UNTERNEHMERTUM label in the bottom-right corner, 20px from the edges (50px from 768px), 40px square (80px from 768px). Use the label file [`by-unternehmertum-label-outline-white.svg`](../assets/labels/svg/by-unternehmertum-label-outline-white.svg) (solid white on busy images). **Website today:** the label is re-typeset in CSS (`UnternehmerTumBadge.tsx`); replace it with the file. Leave it out of a hero that holds other content in that corner (Startups shows a stat row instead).
- Optional content under the heading, such as a [stat row](#stat-row).
- Respect `prefers-reduced-motion`: show the poster photo instead of the background video. **Website today:** the video always plays.

## Arrow link (primary call to action)

Source: `src/components/ArrowLink.tsx`. This is the **primary CTA** on web pages (decision 2026-10-07).

```
( → )  Explore the program
```

- A 44px circle (`--mm-size-control`) with a 1px `currentColor` border and a 20px right arrow ([`arrow-right.svg`](../assets/ui/svg/arrow-right.svg), stroke 2, round caps), then the label in Extrabold, sentence or title case, 12px gap.
- Inherits the text colour, so it works on every tone with no extra variants (black on white and blue, white on black and photos).
- Hover: the circle moves 4px right (`translate-x`, 200ms). No underline.
- Typical spacing: 40px above it (48px after a stat row).
- Labels are short verbs ([12-voice-and-tone.md](12-voice-and-tone.md#calls-to-action)). External links open in a new tab with `rel="noopener noreferrer"`.
- One arrow link per section. For a list of actions, use inline links.

## Button (forms and product UI)

Not used on the marketing site. Use it for form submits, product and app UI, and anywhere a real `<button>` is needed.

- Black background, white text (or white on black sections), Extrabold, 0.875-1rem, uppercase with `--mm-font-letter-spacing-label`, padding 0.875rem 1.5rem, square corners (`--mm-radius-none`), 2px border in the same colour.
- Hover: blue background, black text. Secondary: transparent with a 2px border in `currentColor`.
- On blue: black background, white text.

## Inline link

Source: `src/app/page.tsx` ("Open Event", "Apply Now"), legal pages.

- Text colour unchanged (`currentColor`), Extrabold, underlined with `text-underline-offset: 4px`. Legal pages use a plain underline at body weight.
- Do not set links in blue on white (2.98:1). If a link must be blue, use `--mm-color-accent-text` (`#007D9E`) on white, or brand blue on black.

## Stat row

Source: `src/components/StatRow.tsx`.

- A `<dl>` with 3 items. One column on mobile with 20px between items, three columns from 640px with 30px gaps.
- Each item has a 1px top rule in `currentColor`, then the value and the label.
- Value: Extrabold, `line-height: 1`, `--mm-font-size-stat-*` (30, 40 from 640, 50px from 1280).
- Label: Medium, `line-height: 1`, 12px (15px from 1024px), 10-15px under the value. Lower-case labels are fine ("founded startups").
- Values are short and concrete: "> 2.3 B. $", "10+", "260+".

## Photo card grid

Source: `src/components/PhotoGrid.tsx`.

- Grid with 32px gaps: 1 column, 2 from 640px, 3 or 4 from 1024px.
- Image 4:3 (`--mm-aspect-photo`), `object-fit: cover`, `--mm-radius-card` (0.75rem).
- 16px below: title (`--mm-font-size-title`, 20px, Extrabold), optional subtitle (small, Extrabold, **blue**), body text at 80% opacity, 8px below.
- **Blue subtitle:** brand blue on black (7.05:1). On white use `--mm-color-accent-text` `#007D9E` (4.74:1). **Website today:** brand blue on white (2.98:1) in the light "Events with Partner Companies" section.

## Person card (team)

Source: `src/app/people/page.tsx`.

- Portrait 4:5 (`--mm-aspect-portrait`), `--mm-radius-card`, cropped at `object-position: center 38%` so faces sit high.
- Name: 20px Extrabold, `line-height: 1.25`, 16px below the image. Role: small, Extrabold, uppercase, `letter-spacing: 0.08em` (`--mm-font-letter-spacing-meta`), 8px below.
- **Role colour:** black at 70% or more. **Website today:** 45% (3.4:1, fails AA).
- Two columns from 640px, 20px gap. On the People page the intro column is sticky beside the grid from 1024px.

## Scholar card

Source: `src/components/ScholarGrid.tsx`.

- Square portrait, `--mm-radius-card`. Below it: name (Extrabold, tight), field of study (small, 70%), and a 20px LinkedIn glyph on the right ([`linkedin.svg`](../assets/ui/svg/linkedin.svg), 70% opacity, 100% on hover, `aria-label="{Name} on LinkedIn"`).
- Grid: 2 columns, 3 from 640px, 4 from 1024px; gaps 24px across, 40px down.

## Directory card (alumni)

Source: `src/components/AlumniGrid.tsx`.

- The whole card is a link. 1px border at black 10%, `--mm-radius-card`, 12px padding, 16px gap. Hover: blue border with a 5% blue tint (200ms).
- 72px square avatar with `--mm-radius-card`, then the name (Extrabold) and the headline (small, two-line clamp, 70%), and a LinkedIn glyph top-right (decorative, `aria-hidden`).
- Grid: 1, 2 (640px), 3 (1024px), 4 (1280px) columns, 16px gap.
- **Website today:** card radius 1rem, avatar 0.75rem, headline at 65%. Use `--mm-radius-card` for both and 70% for the text.

## Logo grid (partners)

Source: `src/components/PartnerLogos.tsx`.

- 2, 3 (640px), 5 (768px) columns, gaps 32px across and 40px down, logos centred.
- Logos 48px tall (56px from 768px), in their original colours, `object-fit: contain`. Never recolour partner logos.

## Startup portfolio

Source: `src/components/StartupGrid.tsx`.

- **Category navigation:** a row of [chips](#chips) linking to anchors, each with its company count, 56px above the first group.
- **Category block:** eyebrow ("12 companies", small, Extrabold, uppercase, `letter-spacing: 0.16em`, blue), h2 (30px, 48px from 768px), a description at 70%, then the grid. Blocks are 80px apart, `scroll-margin-top: 7rem` so anchors clear the header.
- **Grid:** 1, 2 (640px), 4 (1024px) columns of white tiles divided by 1px hairlines (black 10%), in a container with `--mm-radius-feature`.
- **Tile:** the whole tile is a link, 20px padding, min-height 208px. An 80px logo tile (`--mm-radius-card`; transparent logos sit on a light grey, `object-fit: contain`, 12px padding), the name (20px Extrabold, `line-height: 1.15`), and at the bottom a link row: a 30px black circle with a white arrow, plus the link label (15px Extrabold).
- Hover: the logo scales to 1.05 over 500ms.
- **Eyebrow colour on white:** `--mm-color-accent-text`. **Website today:** brand blue (2.98:1). **Website today:** grid radius 1.5rem and logo tile 1rem; normalise to `feature` and `card`. **Website today:** the light-grey logo backdrop is `#F3F5F6`, which is off-palette; use grey `#E3E3E3` or white.

## Chips

Source: `src/app/program/page.tsx` (Areas), `src/components/StartupGrid.tsx`.

- Pill (`--mm-radius-pill`), 1px border in `currentColor` at 20%, padding 8px 20px, small Extrabold text, 12px gap, wrapping.
- Static chips are labels (the Areas). Link chips get a blue border on hover.
- A count inside a chip: 70% opacity on white. **Website today:** 50% (3.9:1).

## Testimonial carousel

Source: `src/components/Testimonials.tsx`. Used on People and Startups.

- Two equal columns from 768px, inside a container with `--mm-radius-feature` and `overflow: hidden`.
- **Left:** a square portrait. Without a photo, show a grey tile with the initials (60px Extrabold, black at 40%, decorative).
- **Right** (padding equal to the section spacing): previous/next controls (white circles 30, 37, 45px with a black 1.5px arrow, 40-55px hit area), attribution (15px: **Name**, generation, role on the next line), the quote (20px, `line-height: 1.5`, `aria-live="polite"`), and the [quote mark](../assets/ui/svg/quote.svg) 75px wide.
- Controls loop around. Keep one quote visible at a time.

## Media carousel (Startup Tours)

Source: `src/components/TourCarousel.tsx`.

- Two columns from 768px, 32-48px gap. Photo 4:3 with `--mm-radius-feature`.
- Controls: two 44px circles with a 1px `currentColor` border and 20px arrows, a 10% `currentColor` fill on hover, 12px apart. Next to them: the city (24px Extrabold) and the country (small, 70%).
- Quote (18px, 20px from 768px, relaxed leading, curly quotes), author (small Extrabold, 80%), and a counter "1 / 6" (small, 60%, `aria-live="polite"`).

## Disclosure (FAQ)

Source: `Disclosure` in `src/app/application/page.tsx`.

- Native `<details>`/`<summary>` so it works without JavaScript. Hide the default marker.
- Each row has a 1px top border at 20% `currentColor`; the list closes with a bottom border.
- Summary: 20px padding top and bottom, Extrabold, with a 32px circle (1px border) holding a [plus](../assets/ui/svg/plus.svg) that rotates 45° to a cross when open (200ms).
- Answer: indented 48px to align with the question, max about 48rem, 90% opacity, 24px bottom padding.

## Lists

- **Check list** (requirements): a 20px [check](../assets/ui/svg/check.svg) glyph, 4px down from the first line, 16px gap, then the text, with key phrases in Extrabold. Items 20px apart.
- **Highlight list** (Program "What will you do"): a `<dl>` with a ✓ in an 18px column, a title in Extrabold and the body under it. On the Alumni page the ✓ sits inline in blue: use brand blue on black, `--mm-color-accent-text` on white.
- **Timeline:** phase in a 220px column (24px Extrabold, blue; `--mm-color-accent-text` on white), items to its right with a 2px left border at black 15%, 20px left padding, name in Extrabold, body at 70%. Stacks on mobile. **Website today:** phase labels are brand blue on white (2.98:1; 24px Extrabold counts as large text, but large text still needs 3:1).
- **Process steps:** date in Extrabold in a 10rem column, then the step in a tinted box (white at 10% on black, `--mm-radius-card`, padding 16px 20px). **Website today:** box radius 0.5rem.
- **Accent list:** a 2px left border at 30% `currentColor` with 24px padding (Application "after acceptance").

## Split feature

Source: `src/app/page.tsx` ("Backed by Europe's #1 Startup Hub"), `src/app/alumni-network/page.tsx`.

- Two columns from 768px, 48px gap, vertically centred: text (heading, paragraph, arrow link) and a square image (`--mm-radius-card`, or `--mm-radius-feature` for large feature photos). Mobile stacks text first.
- Variant **lead + highlights**: a lead statement (`--mm-font-size-lead-*`, 20px, 30px from 768px) on the left and a highlight list on the right.

## CTA band over a photo

Source: last section of `src/app/alumni-network/page.tsx`.

- Full-bleed photo with a flat black shade at `--mm-opacity-shade-solid` (70%), white text, padding 80px (112px from 768px), heading, up to 48rem of text and an arrow link (`mailto:` is fine).

## Video embed

Source: `src/components/StartupInterview.tsx`.

- 16:9, black background. Show a poster image with a 45% black shade and a centred **play button**. Load the player only on click (privacy, performance), from `youtube-nocookie.com`.
- Play button: pill, padding 1em 1.25em, Extrabold 15px (20px from 640px), label "Play video ▶". **Blue background with black text**, hover white background with black text. **Website today:** white text on blue (2.98:1).
- Heading next to it may emphasise names in blue: brand blue on black, `--mm-color-accent-text` on white. **Website today:** brand blue on white.

## Countdown

Source: `src/app/application/ApplicationCountdown.tsx`.

- The only centred block. Title 35px Extrabold (`line-height: 1.05`). Numbers in Medium 500, 50px (90px from 768px), `font-variant-numeric: tabular-nums`, labels small at 80%. Units 24-56px apart. The exact deadline with time zone is written below at 20px.

## Footer

Source: `src/components/Footer.tsx`.

- Black, white text. Container with 64px vertical padding, 40px gaps, 4 columns from 768px:
  1. **UNTERNEHMERTUM GMBH** and the address (Lichtenbergstraße 6, D-85748 Garching, Germany).
  2. **SOCIAL MEDIA**: LinkedIn, Instagram.
  3. **LEGAL**: Imprint, Privacy Policy.
  4. Right-aligned "Back to top ↑" and "© {year} Manage and More" (white 50%).
- Column headings: small, Extrabold, uppercase, `letter-spacing: 0.025em`. Links: small, white 70%, white on hover.
- **Required addition:** the ENTREPRENEURIAL EDUCATION + BY UNTERNEHMERTUM lock-up ([`descriptor-lockup-outline-white.svg`](../assets/labels/svg/descriptor-lockup-outline-white.svg), about 56-64px tall) in the footer, as the guideline requires (PDF p.37). **Website today:** missing.

## Interaction and motion

Source: classes across `src/components`. Tokens `--mm-motion-*`.

| What | Duration | Effect |
|---|---|---|
| Link and control hover (colour, opacity, border) | 200ms | colour change |
| Arrow-link hover | 200ms | circle moves 4px right |
| FAQ toggle | 200ms | plus rotates 45° |
| Header on scroll | 300ms | transparent to black 95% |
| Portfolio tile hover | 500ms ease-out | logo scales to 1.05 |

- No parallax, bounce or entrance animations.
- Wrap motion in `@media (prefers-reduced-motion: no-preference)` and pause background video when reduced motion is requested. **Website today:** it does not check this preference.
- **Focus:** a 2px outline with a 2px offset in `--mm-color-focus-ring` (`#007D9E`, at least 3:1 on white and black); black on blue sections. **Website today:** `#4443FE`, an off-palette violet.
- **Text selection:** blue background (`::selection`).

## Accessibility checklist for components

- [ ] Text on blue is black. Blue text on white uses `#007D9E`.
- [ ] Text opacity on white is at least 70% for small text (50% is fine only for white on black).
- [ ] Photo shades give at least 4.5:1 for body text and 3:1 for display headings.
- [ ] Every icon-only control has an `aria-label`; carousels announce changes with `aria-live="polite"`.
- [ ] Circular controls are at least 44px (or have a 44px hit area).
- [ ] Decorative media (background video, quote mark, initials tile) is `aria-hidden`.
- [ ] Reduced motion respected; focus visible on every tone.
