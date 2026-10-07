---
title: Layout and composition
summary: High-contrast, left-aligned layouts built from big headlines and flat colour blocks; the website's section rhythm, content widths, gutters, spacing, breakpoints and corner radii.
source: Brand Guideline PDF p.6-7, 16, 18, 37 (principles); manage-and-more-website src/styles/theme.css and src/app/globals.css (screen numbers, adopted 2026-10-07)
status: canonical (principles) / adopted (screen numbers)
tokens: tokens/tokens.json#layout, #space, #radius, #breakpoint
---

# Layout and composition

## Principles

1. **Big, bold headline first.** Large Extrabold headlines, much larger than the body text. On screens, the two-tone outline/solid heading.
2. **Left-aligned** text, ragged right, with generous white space.
3. **Flat colour blocks.** Pages are built from full-bleed solid areas. On the website these are **alternating black and white sections** with one or two blue sections for emphasis; in print and slides blue, yellow, black, white and grey (p.10, 11, 16, 22). No gradients and no shadows.
4. **Square blocks, rounded content.** Sections, colour blocks, the logo, the logo label and the descriptor are square. Photos, cards, media, chips and circular controls are rounded with the radius tokens (decision 2026-10-07, below).
5. **Strong contrast.** Black on white, white on black, black on blue, black on yellow.
6. **One logo per layout**, with the BY UNTERNEHMERTUM label in a corner (print, website hero) and the descriptor lock-up in the website footer.
7. **Photos full-bleed** (hero, with a flat black shade under text) **or in a clean grid** with even gutters.

## Guideline-PDF page anatomy (useful for slides and reports)

- Title top left, large Extrabold.
- Explanatory text in a narrow column on the left third.
- Visuals in the right two thirds.
- Footer line: "Manage and More guideline" bottom left, section and page number bottom right, small.

## Screen layout *(adopted from manageandmore.de)*

### Breakpoints

`--mm-breakpoint-*`: **576, 768, 992, 1200, 1536px**. The website's components (Tailwind) also use 640, 1024 and 1280px for grid column changes. Design mobile first.

### Content widths and gutters

The container is centred, `width: 100%`, with horizontal padding (the gutter) inside the max width.

| Token | Value | Use |
|---|---|---|
| `--mm-layout-content-text` | 900px | legal pages, long reading |
| `--mm-layout-content-small` | 1180px | |
| `--mm-layout-content-split` | 1300px | one half of a 50/50 split section |
| `--mm-layout-content-medium` | 1500px | **default section width** (`--mm-layout-container-max`) |
| `--mm-layout-content-page` | 1600px | page maximum, header, directory and portfolio grids |
| `--mm-layout-content-wide` | 1700px | |
| `--mm-layout-gutter-small` / `-medium` / `-large` | 20 / 30 / 50px | page gutter from 0 / 768 / 1200px |
| `--mm-layout-header-gutter-small` / `-large` | 30 / 50px | header gutter from 0 / 1200px |

Inside a section, keep running text to about 48rem (`max-w-3xl`).

### Section spacing

Vertical padding of full-bleed sections (`--mm-space-section-*`):

| | Mobile | ≥768px | ≥1200px | ≥1536px |
|---|---|---|---|---|
| small | 25px | 50px | 50px | 50px |
| **default** | 25px | 50px | 75px | 100px |
| large | 50px | 75px | 100px | 100px |

Inside sections, the website uses an 8px-based rhythm: heading to text 32px, text to arrow link 40px, text to grid 48px, between blocks 48-80px. The general spacing scale `--mm-space-1` … `--mm-space-9` (4px to 128px) covers these.

### Grids

- Two-column splits from 768px with 32-64px gaps (text + image, heading + content, lead + highlights). Variant: 1/3 heading, 2/3 content (Application page).
- Card grids: 1 → 2 (640px) → 3 or 4 (1024px) columns, 16-32px gaps. See [13-web-components.md](13-web-components.md) for each grid.

### Corner radius *(decision 2026-10-07)*

| Token | Value | Use |
|---|---|---|
| `--mm-radius-none` | 0 | sections, colour blocks, buttons, the logo label and descriptor |
| `--mm-radius-card` | 0.75rem | photos in grids, portraits, cards, directory tiles, small boxes |
| `--mm-radius-feature` | 2rem | large media: testimonial block, carousel photo, portfolio grid, feature images |
| `--mm-radius-pill` | 9999px | chips, circular controls (arrow link, carousel arrows, FAQ toggle), the play button |

Do not invent other radii. The website currently also uses 0.5rem, 1rem and 1.5rem in a few places; these are listed as fixes in [sources-and-discrepancies.md](sources-and-discrepancies.md#website-fixes).

### Depth and effects

- No drop shadows, glows or gradients.
- Allowed: a **flat black shade** over photos and video when text sits on them (20-70%, `--mm-opacity-shade-*`), and a blurred, darkened backdrop behind side panels.

## Components

Full specs, with sizes, states and accessibility fixes, are in **[13-web-components.md](13-web-components.md)**. Overview:

| Component | In short |
|---|---|
| Section | Full-bleed band: dark, light, grey or blue (black text). 1px divider at 20% `currentColor`. |
| Two-tone heading | Outlined line above a solid line, Extrabold, 25-50px, line-height 1.15. |
| Header | Fixed, transparent over the hero, white; solid black and slimmer after 60px; underline-wipe links; full-screen mobile menu. |
| Hero | Full-bleed photo or video with a black shade, h1 bottom-left, BY UNTERNEHMERTUM label bottom-right. |
| Arrow link | **Primary CTA:** filled "sticker" circle (2em) in the text colour with the arrow in the background colour, then an Extrabold label; sticker scales to 1.1 on hover. |
| Button | Forms and product UI only: black, white Extrabold uppercase text, square. Hover blue with black text. |
| Inline link | Current colour, Extrabold, underline offset 4px. |
| Stat row | Three items with a top rule, a big Extrabold number and a small label. |
| Cards | Photo cards (4:3), person cards (4:5), scholar cards (1:1), directory cards, startup tiles. |
| Chips | Pills with a 20% `currentColor` border, small Extrabold text. |
| Carousels | Testimonial (portrait + quote) and media (photo + quote) with circular arrow controls. |
| Disclosure | FAQ rows with a plus sticker that turns into minus; answer expands in height. |
| Footer | Black, 4 columns, plus the required descriptor + label lock-up. |
| Focus | 2px outline, 2px offset, `#007D9E` (black on blue). |
| Motion | Short, eased-out reactions only; see [14-motion.md](14-motion.md). |
