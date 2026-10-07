---
title: Web components
summary: The building blocks of manageandmore.de (header, hero, sections, two-tone headings, arrow links, stat rows, cards, carousels, FAQ, footer) with exact specs, tokens and accessibility fixes.
source: manage-and-more-website repo (Next.js 16 + Tailwind v4), commit 742e91f, for structure and numbers; live manageandmore.de (styles.css, icons.js) for look and motion; both read 2026-10-07
status: adopted (website patterns approved as the screen standard on 2026-10-07)
tokens: tokens/tokens.json#layout, #radius, #opacity, #motion, #font.size
---

# Web components

These are the components of the live website, written down so that every new Manage and More page, app, landing page or campaign site looks like manageandmore.de. Each spec names the website file it comes from (paths are inside the `manage-and-more-website` repo). Where the rebuild repo and the live site differ in **look or motion**, the live site is the reference (decision 2026-10-07); motion is specified in [14-motion.md](14-motion.md).

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

Source: `src/components/Header.tsx`, `src/components/Logo.tsx`; scroll behaviour from the live site.

- `position: fixed`, full width, transparent, white text, sitting over the hero. Height 70px, 100px from 768px. Horizontal padding 30px, 50px from 1200px (`--mm-layout-header-*`). From 992px the navigation has 1em extra padding top and bottom (`--mm-layout-header-padding-desktop`).
- **Logo** left: primary logo on dark (blue symbol, white wordmark), set by **height: 32px, 40px from 768px** (`--mm-layout-header-logo-height-*`; about 138 / 173px wide). Link label "Manage and More — home". **Website today:** about 19 / 24px tall (98 / 128px wide including built-in padding), below the 32px minimum, so the two-line wordmark gets hard to read.
- **Navigation** right, from 768px: links in 0.95rem Medium, white, 32px apart. Items: Home, Program, Application, People, Startups, Alumni. Hover and focus: a 2px underline **wipes in from the left** wherever the navigation is shown (150ms, [14-motion.md](14-motion.md#navigation-underline-wipe)). **Website today** (rebuild): links at 90% opacity brightening on hover.
- **After 60px of scrolling** (`--mm-motion-scroll-threshold`) the header background becomes **solid black** and, from 992px, the extra padding goes to 0, so the header gets slimmer (100px + 2em, about 134-140px → 100px). Both over 500ms `ease`. It turns transparent again at the very top. **Website today** (rebuild): switches at 20px to black at 95% with a backdrop blur, over 300ms, without shrinking.
- **Mobile** (below 768px): a menu toggle with the [hamburger](../assets/ui/svg/hamburger.svg) glyph (changes to [close](../assets/ui/svg/close.svg) when open). It opens a full-screen black overlay with the nav items at 1.875rem Extrabold, 24px apart, shown instantly. Escape closes it, page scrolling is locked, and the toggle has `aria-expanded` and `aria-controls`.
- **Pages without a dark hero** must start with a dark section, or give the header a solid black background from the start. **Website today:** Imprint and Privacy Policy start on white, so the white navigation is invisible until you scroll.

## Hero

Source: `src/components/Hero.tsx`, `src/components/VimeoBackground.tsx`.

- Full-bleed, black background, `overflow: hidden`, content anchored to the **bottom-left**.
- **Media:** a cover photo (source files 1920×960) or a muted, looping background video (Vimeo `background=1&muted=1&loop=1&dnt=1`, `aria-hidden`, not focusable).
- **Shade:** a flat black layer over the media at `--mm-opacity-shade` (40%) by default, `-light` (20%) for calm dark images, `-strong` (60%) for bright or busy ones. No gradients. Check contrast against the brightest area behind the text: at least 3:1 for the display heading and 4.5:1 for any smaller text.
- **Heading:** a two-tone h1 at display size (`--mm-font-size-display-*`: 30, 50, 40 at 992, 50 at 1200, 75px at 1536), max-width 1200px. The inline variant suits short single-line titles.
- **Sizes:** *home*, min-height 550px (710px from 768px) with bottom padding 52px (78px); *compact* (inner pages), padding-top 120px (175px) and bottom 45px (75px), so the content clears the fixed header.
- **Endorsement:** the BY UNTERNEHMERTUM label in the bottom-right corner, 20px from the edges (50px from 768px), 40px square (80px from 768px). Use the outline file [`by-unternehmertum-label-outline-white.svg`](../assets/labels/svg/by-unternehmertum-label-outline-white.svg) on calm or shaded photos (as on the website), and the solid [`by-unternehmertum-label-white.svg`](../assets/labels/svg/by-unternehmertum-label-white.svg) on busy ones (PDF p.13). **Website today:** the label is re-typeset in CSS (`UnternehmerTumBadge.tsx`); replace it with the file. Leave it out of a hero that holds other content in that corner (Startups shows a stat row instead).
- **Keep text clear of the label:** give the hero content right padding of label size + inset (60px on mobile, 130px from 768px), so the heading never runs under the label.
- **Optional content under the heading**, 24-32px below it, in this order:
  - a **meta line** for events (date · place): `--mm-font-size-lead-*`, Medium, white, items separated by " · ";
  - one **arrow link** as the hero CTA ("Apply now"), 32px below the meta line or heading;
  - or a [stat row](#stat-row) instead (Startups).
  Never more than one CTA in the hero.
- Respect `prefers-reduced-motion`: show the poster photo instead of the background video. **Website today:** the video always plays.

## Arrow link (primary call to action)

Source: live manageandmore.de (`.btn` with `utum-icon.sticker`). This is the **primary CTA** on web pages (decision 2026-10-07).

```
(●→)  Explore the program
```

- A **sticker**: a filled circle in the text colour (`currentColor`), `--mm-size-sticker` (2em of the label size: about 40px with 20px body text, 30px with 15px), with the [arrow-right](../assets/ui/svg/arrow-right.svg) glyph inside in the **background colour** (`--mm-size-sticker-glyph`, 1.333em, centred). So: black circle with a white arrow on white, black circle with a blue arrow on blue (7.05:1), white circle with a black arrow on black. In CSS, give each section tone a `--mm-surface` variable and colour the glyph with it.
- Then the label in Extrabold (the live site asks for 900, which renders as Sharp Sans Extrabold 800), sentence or title case, 0.625em after the sticker.
- Inherits the text colour, so it works on every tone without variants.
- **Hover and focus:** the sticker scales to 1.1 over 250ms ease-out ([14-motion.md](14-motion.md#sticker-arrow-link-faq-toggle)). The label does not move. No underline.
- **Focus ring:** 2px `--mm-color-focus-ring` around the link with a pill radius (black on blue sections).
- Inline the SVG so the glyph can take the background colour; an `<img>` cannot.
- Typical spacing: 40px above it (48px after a stat row). One arrow link per section. Labels are short verbs ([12-voice-and-tone.md](12-voice-and-tone.md#calls-to-action)). External links open in a new tab with `rel="noopener noreferrer"`.
- **"Back to top"** in the footer uses the same sticker with the arrow rotated -90°.
- **Website today** (rebuild `ArrowLink.tsx`): an outlined 44px circle with a short round-capped arrow that nudges 4px right on hover. Replace it with the sticker.

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
- 16px below: title (`--mm-font-size-title`, 20px, Extrabold), optional subtitle (small, Extrabold, **blue**), body text at `--mm-opacity-text-card` (80%), 8px below.
- If the card is a link, the image zooms to 1.1 on hover (500ms). Images fade in after loading over a pulsing placeholder ([14-motion.md](14-motion.md#image-loading)).
- **Blue subtitle:** brand blue on black (7.05:1). On white use `--mm-color-accent-text` `#007D9E` (4.74:1). **Website today:** brand blue on white (2.98:1) in the light "Events with Partner Companies" section.

## Person card (team)

Source: `src/app/people/page.tsx`.

- Portrait 4:5 (`--mm-aspect-portrait`), `--mm-radius-card`, cropped at `object-position: center 38%` so faces sit high.
- Name: 20px Extrabold, `line-height: 1.25`, 16px below the image. Role: small, Extrabold, uppercase, `letter-spacing: 0.08em` (`--mm-font-letter-spacing-meta`), 8px below.
- **Role colour:** black at 70% or more. **Website today:** 45% (3.4:1, fails AA).
- **Grid:** next to a sticky intro column (People page): 2 columns from 640px, 20px gap; the intro column is sticky from 1024px. **Full-width** (jury, mentors, speakers): 2 columns, 3 from 640px, 4 from 1024px, gaps 24px across and 40px down (as the scholar grid).
- **Placeholder** (person not confirmed yet): the portrait frame in grey `#E3E3E3` with "TBA" or initials centred (Extrabold, 2-3rem, black at `--mm-opacity-placeholder-text`), name "[Name]", role "[Role, organisation]". Never use stock photos or silhouettes.

## Scholar card

Source: `src/components/ScholarGrid.tsx`.

- Square portrait, `--mm-radius-card`. Below it: name (Extrabold, tight), field of study (small, 70%), and a 20px LinkedIn glyph on the right ([`linkedin.svg`](../assets/ui/svg/linkedin.svg), 70% opacity, 100% on hover, `aria-label="{Name} on LinkedIn"`).
- Grid: 2 columns, 3 from 640px, 4 from 1024px; gaps 24px across, 40px down.

## Directory card (alumni)

Source: `src/components/AlumniGrid.tsx`.

- The whole card is a link. 1px border at black `--mm-opacity-hairline` (10%), `--mm-radius-card`, 12px padding, 16px gap. Hover: blue border with a 5% blue tint (200ms).
- 72px square avatar with `--mm-radius-card`, then the name (Extrabold) and the headline (small, two-line clamp, 70%), and a LinkedIn glyph top-right (decorative, `aria-hidden`).
- Grid: 1, 2 (640px), 3 (1024px), 4 (1280px) columns, 16px gap.
- **Website today:** card radius 1rem, avatar 0.75rem, headline at 65%. Use `--mm-radius-card` for both and 70% for the text.

## Feature card (icon card)

For tracks, challenges, benefits or programme elements that have no photo. Built from the stat-row rule and the brand icons.

- Grid: 1 column, 2 from 640px, 4 from 1024px (or 3 for three items), gaps 32px across, 40px down.
- Each card: 1px top rule in `currentColor`, 16px padding-top; a **48px brand icon** in `currentColor` (from [`assets/icons/web/`](../assets/icons/web/) or [`assets/icons/svg/`](../assets/icons/svg/), inlined); 16px below it the title (`--mm-font-size-title`, Extrabold); 8px below the text at `--mm-opacity-text-card`; optionally a meta line at the bottom (small, Extrabold, e.g. "Case partner: [Partner name]").
- No background, border box or radius: the top rule carries the structure, as in the stat row.
- If the whole card is a link, end it with an arrow link; do not zoom anything.

## Placeholders

While content is unconfirmed, placeholders must look deliberate and be impossible to mistake for real content.

- **Text:** square brackets, e.g. "[Date TBA]", "[Partner name]", "[XX] hours". Keep the surrounding copy final.
- **Portrait:** see [Person card](#person-card-team).
- **Logo:** a box the size of a real logo cell (48px tall, 56px from 768px, about 3:1), 1px border in `currentColor` at `--mm-opacity-divider`, `--mm-radius-card`, centred small text "Partner logo" at `--mm-opacity-text-muted`.
- **Links:** in drafts use `href="#"` with an HTML comment `<!-- TODO: link -->`. Before publishing, every placeholder link is either real or its CTA is removed.
- Never use stock photos, fake logos or real company names as placeholders.

## Logo grid (partners)

Source: `src/components/PartnerLogos.tsx`.

- 2, 3 (640px), 5 (768px) columns, gaps 32px across and 40px down, logos centred.
- Logos 48px tall (56px from 768px), in their original colours, `object-fit: contain`. Never recolour partner logos.

## Startup portfolio

Source: `src/components/StartupGrid.tsx`.

- **Category navigation:** a row of [chips](#chips) linking to anchors, each with its company count, 56px above the first group.
- **Category block:** eyebrow ("12 companies", small, Extrabold, uppercase, `letter-spacing: 0.16em`, blue), h2 (30px, 48px from 768px), a description at 70%, then the grid. Blocks are 80px apart, `scroll-margin-top: 7rem` so anchors clear the header.
- **Grid:** 1, 2 (640px), 4 (1024px) columns of white tiles divided by 1px hairlines (black `--mm-opacity-hairline`), in a container with `--mm-radius-feature`.
- **Tile:** the whole tile is a link, 20px padding, min-height 208px. An 80px logo tile (`--mm-radius-card`; transparent logos sit on a light grey, `object-fit: contain`, 12px padding), the name (20px Extrabold, `line-height: 1.15`), and at the bottom a link row: a 30px black circle with a white arrow, plus the link label (15px Extrabold).
- Hover: the logo zooms to 1.1 over 500ms ease-out inside its tile ([14-motion.md](14-motion.md#image-zoom-on-linked-cards)). **Website today:** 1.05.
- **Eyebrow colour on white:** `--mm-color-accent-text`. **Website today:** brand blue (2.98:1). **Website today:** grid radius 1.5rem and logo tile 1rem; normalise to `feature` and `card`. **Website today:** the light-grey logo backdrop is `#F3F5F6`, which is off-palette; use grey `#E3E3E3` or white.

## Chips

Source: `src/app/program/page.tsx` (Areas), `src/components/StartupGrid.tsx`.

- Pill (`--mm-radius-pill`), 1px border in `currentColor` at 20%, padding 8px 20px, small Extrabold text, 12px gap, wrapping.
- Static chips are labels (the Areas). Link chips get a blue border on hover.
- A count inside a chip: 70% opacity on white. **Website today:** 50% (3.9:1).

## Testimonial carousel

Source: `src/components/Testimonials.tsx`. Used on People and Startups.

- Two equal columns from 768px, inside a container with `--mm-radius-feature` and `overflow: hidden`.
- **Left:** a square portrait. Without a photo, show a grey tile with the initials (60px Extrabold, black at `--mm-opacity-placeholder-text`, decorative).
- **Right** (padding equal to the section spacing): previous/next controls (white circles 30, 37, 45px with a black 1.5px arrow, 40-55px hit area), attribution (15px: **Name**, generation, role on the next line), the quote (20px, `line-height: 1.5`, `aria-live="polite"`), and the [quote mark](../assets/ui/svg/quote.svg) 75px wide.
- Controls loop around. Keep one quote visible at a time.

## Media carousel (Startup Tours)

Source: `src/components/TourCarousel.tsx`.

- Two columns from 768px, 32-48px gap. Photo 4:3 with `--mm-radius-feature`.
- Controls: two 44px circles with a 1px `currentColor` border and 20px arrows, a 10% `currentColor` fill on hover, 12px apart. Next to them: the city (24px Extrabold) and the country (small, 70%).
- Quote (18px, 20px from 768px, relaxed leading, curly quotes), author (small Extrabold, 80%), and a counter "1 / 6" (small, 60%, `aria-live="polite"`).

## Disclosure (FAQ)

Source: live manageandmore.de (`.collapse-list`), rebuild `Disclosure` in `src/app/application/page.tsx`.

- Native `<details>`/`<summary>` so it works without JavaScript. Hide the default marker.
- Each row has a 1px top border at 20% `currentColor`; the list closes with a bottom border.
- Summary: 20px padding top and bottom, Extrabold, starting with a **sticker** (filled circle, `--mm-size-sticker`) holding the [plus](../assets/ui/svg/plus.svg) glyph, 0.625em before the question. When open the glyph becomes [minus](../assets/ui/svg/minus.svg) and the sticker turns 180° (300ms). The answer expands in height over 350ms `ease` ([14-motion.md](14-motion.md#opening-and-closing)).
- Answer: indented to align with the question, max about 48rem, 90% opacity, 24px bottom padding.
- **Website today** (rebuild): an outlined 32px circle with a "+" character that rotates 45°, and the answer appears without height animation.

## Lists

- **Check list** (requirements): a 20px [check](../assets/ui/svg/check.svg) glyph, 4px down from the first line, 16px gap, then the text, with key phrases in Extrabold. Items 20px apart.
- **Highlight list** (Program "What will you do"): a `<dl>` with a ✓ in an 18px column, a title in Extrabold and the body under it. On the Alumni page the ✓ sits inline in blue: use brand blue on black, `--mm-color-accent-text` on white.
- **Timeline:** phase in a 220px column (24px Extrabold, blue; `--mm-color-accent-text` on white), items to its right with a 2px left border at black `--mm-opacity-rule` (15%), 20px left padding, name in Extrabold, body at 70%. Stacks on mobile. **Website today:** phase labels are brand blue on white (2.98:1; 24px Extrabold counts as large text, but large text still needs 3:1).
- **Process steps:** date in Extrabold in a 10rem column, then the step in a tinted box (white at `--mm-opacity-hairline` on black, `--mm-radius-card`, padding 16px 20px). **Website today:** box radius 0.5rem.
- **Accent list:** a 2px left border at `--mm-opacity-accent-rule` (30%) `currentColor` with 24px padding (Application "after acceptance").

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

- The only centred block. Title 35px Extrabold (`line-height: 1.05`). Numbers in Medium 500, 50px (90px from 768px), `font-variant-numeric: tabular-nums`, labels small at `--mm-opacity-text-card`. Units 24-56px apart. The exact deadline with time zone is written below at 20px.

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

All motion (hover, scroll, loading, opening and closing, reduced motion) is specified in **[14-motion.md](14-motion.md)**. In short:

| What | Motion |
|---|---|
| Arrow link, FAQ sticker | sticker scales to 1.1, 250ms ease-out; FAQ sticker turns 180° and swaps plus/minus, 300ms |
| Header links | 2px underline wipes in from the left, 150ms |
| Linked card images | zoom to 1.1, 500ms ease-out |
| Colour, opacity, border on hover | 200ms (pills 150ms) |
| Header after 60px | solid black, padding shrinks from 992px, 500ms ease |
| Images | pulsing placeholder (2s), fade in 500ms |
| FAQ answer | height, 350ms ease |
| Dropdowns | clip reveal top-down, 200ms |
| Side panels | slide in from the right, 250ms, blurred backdrop |
| Video poster | fades out, 1s |

- No parallax, no scroll-triggered entrances, no marquee.
- **Reduced motion:** everything above stops; background video shows its poster. **Website today:** the rebuild does not check `prefers-reduced-motion`; the live site only stops navigation motion.
- **Focus:** a 2px outline with a 2px offset in `--mm-color-focus-ring` (`#007D9E`, at least 3:1 on white and black); black on blue sections. **Website today:** `#4443FE`, an off-palette violet.
- **Text selection:** blue background with black text.

## Accessibility checklist for components

- [ ] Text on blue is black. Blue text on white uses `#007D9E`.
- [ ] Text opacity on white is at least 70% for small text (50% is fine only for white on black).
- [ ] Photo shades give at least 4.5:1 for body text and 3:1 for display headings.
- [ ] Every icon-only control has an `aria-label`; carousels announce changes with `aria-live="polite"`.
- [ ] Icon-only controls are at least 44px (or have a 44px hit area); stickers sit inside a larger link with a text label.
- [ ] Decorative media (background video, quote mark, initials tile) is `aria-hidden`.
- [ ] Reduced motion respected ([14-motion.md](14-motion.md#reduced-motion)); focus visible on every tone.
