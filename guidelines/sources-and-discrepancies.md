---
title: Sources, open questions and discrepancies
summary: Where every rule comes from, how the website and the PDF differ, which website patterns were adopted, the open fixes for the website, the PDF's own inconsistencies, and the decisions log.
status: living document
---

# Sources, open questions and discrepancies

## Source hierarchy

1. **Canonical:** `source/MM_CI.pdf`, "Manage and More guideline - Brand elements", InDesign export dated **16 April 2020**, 41 pages, author MDPM team (UnternehmerTUM). Full text in [`source/MM_CI.txt`](../source/MM_CI.txt), page images in [`source/pages/`](../source/pages/).
2. **Adopted:** the live website https://www.manageandmore.de/ as implemented in the **`manage-and-more-website`** repo (Next.js 16, Tailwind v4; `src/styles/theme.css` is its single theme file). Read in full on 2026-10-07 at commit `742e91f`. The brand owner decided that the website is the **standard for screens** where the PDF is silent or out of date, subject to the decisions below.
3. **Derived:** values this repo adds (accessibility shades, print-to-screen conversions). Marked *(derived)* in the guidelines and `"source": "derived"` in tokens.

When sources disagree: for **screens**, the adopted website patterns apply, corrected for WCAG 2.2 AA; for **print, slides and identity assets** (logo, labels, colours), the PDF wins. Record new decisions in the [decisions log](#decisions-log).

## Website vs design system (checked 2026-10-07)

**How it was checked:** every component, page, the theme and the global CSS of the website repo were read, and the Playwright visual baselines (`e2e/visual.spec.ts-snapshots/`) were viewed. This replaces the earlier HTML-only check, which could not load CSS, fonts or images.

### Adopted into the design system

| # | Topic | Before (PDF / derived) | Website, now the standard | Where |
|---|---|---|---|---|
| A1 | Typeface on screens | Work Sans as code default | **Sharp Sans 500/800** (licence held), Work Sans fallback | [05-typography](05-typography.md) |
| A2 | Screen type scale | fluid clamp() scale, headline leading 1.0 | stepped scale (body 15/17/20, heading 25/50, display 30-75px) in rem, **leading 1.15** on screens | [05-typography](05-typography.md) |
| A3 | Corners | square everywhere | `card` 0.75rem, `feature` 2rem, `pill`; colour blocks stay square | [10-layout](10-layout.md#corner-radius-decision-2026-10-07) |
| A4 | Primary CTA | black uppercase button | **arrow link**; button kept for forms and product UI | [13-web-components](13-web-components.md#arrow-link-primary-call-to-action) |
| A5 | Section rhythm | blue ~25% of surfaces, blue hero | alternating black/white sections, blue for emphasis, black footer | [04-color](04-color.md#suggested-proportions) |
| A6 | Layout | 1200px container, clamp gutter | content widths 900-1700px (default 1500), gutters 20/30/50, section spacing 25-100px, breakpoints 576-1536 | [10-layout](10-layout.md#screen-layout-adopted-from-manageandmorede) |
| A7 | Emphasis in headings | italic discouraged, outline optional | two-tone outline/solid heading, no italics | [05-typography](05-typography.md#two-tone-heading) |
| A8 | Secondary text | grey tokens | text colour at reduced opacity (90/70/50%), 20% dividers | [04-color](04-color.md#how-the-website-applies-colour-adopted) |
| A9 | Text over photos | avoid; use a colour block | allowed in heroes with a flat black shade (20-70%) | [09-photography](09-photography.md#on-the-website-adopted) |
| A10 | Endorsement on screen | label 40-64px, footer only | label in the hero corner (40/80px) + lock-up in the footer | [03-endorsement-labels](03-endorsement-labels.md) |
| A11 | Inline links | black text, 2px blue underline | current colour, Extrabold, underline offset 4px | [04-color](04-color.md#accessibility-wcag-22-contrast-ratios-computed) |
| A12 | Components | button, link, card, hero, footer | header, hero, section, two-tone heading, arrow link, stat row, photo/person/scholar/directory cards, logo grid, portfolio, chips, testimonial and media carousels, FAQ, lists, countdown, video embed, footer | [13-web-components](13-web-components.md) |
| A13 | UI glyphs, motion | none | arrow, check, plus, quote, LinkedIn glyphs; 200/300/500ms ease-out | [06-iconography](06-iconography.md#ui-glyphs-adopted-from-the-website), [13-web-components](13-web-components.md#interaction-and-motion) |
| A14 | Photography | PDF example photos only | Manage and More's own photos added under `assets/photography/website/` | [09-photography](09-photography.md) |
| A15 | Voice | observed from HTML | full copy from the repo: setup/payoff headlines, CTA list | [12-voice-and-tone](12-voice-and-tone.md) |

### Website fixes

These website details break a brand or accessibility rule. The design system documents the corrected version; the website should follow.

| # | Where (website repo) | Issue | Fix |
|---|---|---|---|
| F1 | `Section.tsx` tone `highlight`; Application "Deadlines", Alumni "offers" and "stay in touch" | White text on blue, 2.98:1, fails AA | Black text on blue (7.05:1) |
| F2 | `StartupInterview.tsx` play button | White on blue | Blue with black text |
| F3 | `PhotoGrid.tsx` subtitle, `StartupGrid.tsx` eyebrow, `StartupInterview.tsx` names, program timeline phases, alumni ✓ (on white) | Brand blue text on white, 2.98:1 | `#007D9E` on white (4.74:1); brand blue only on black |
| F4 | `theme.css` `--color-focus: #4443FE` | Off-palette violet | `#007D9E`; black on blue sections |
| F5 | `theme.css` `--color-body: #102A43` | Off-palette navy (hidden by section text colours, but inherited anywhere outside a Section) | Black |
| F6 | `StartupGrid.tsx` `bg-[#f3f5f6]` | Off-palette grey | Grey `#E3E3E3` or white |
| F7 | People role (`text-dark/45`), startup chip count (`text-dark/50`) | 3.4:1 and 3.9:1 on white | at least 70% |
| F8 | `Footer.tsx` | Descriptor + BY UNTERNEHMERTUM lock-up missing (PDF p.37) | Add `descriptor-lockup-outline-white.svg` |
| F9 | `UnternehmerTumBadge.tsx` | Logo label re-typeset in CSS | Use the label SVG at the same size and position |
| F10 | Imprint and Privacy Policy | Page starts on white, so the transparent white header is invisible until scrolling | Start with a dark section or give the header a solid black background |
| F11 | `AlumniGrid.tsx` (1rem), `StartupGrid.tsx` (1.5rem, 1rem), Application steps (0.5rem) | Radii outside the token set | `card` 0.75rem or `feature` 2rem |
| F12 | `VimeoBackground.tsx`, transitions | Ignores `prefers-reduced-motion` | Show the poster photo, disable motion |
| F13 | `Logo.tsx` via `--color-highlight: #00A2CC`; `public/brand/logo.svg` `#04A2CC` | Logo blue 1 unit off `#00A2CD`; the legacy SVG has one fill colour (all-blue) | Use `#00A2CD`; delete the unused all-blue SVG |
| F14 | `src/lib/fonts.ts` fallback | Falls back to system UI fonts, not Work Sans | Add Work Sans to the fallback stack |
| F15 | Copy | "Manage & More" (Program), "Start-up Project" vs "Start-Up Project" | "Manage and More", "Start-Up Project" |
| F16 | Startups hero | Night-sky image instead of documentary photography | Prefer a real M&M photo |

### Still different, by design

| # | Topic | PDF | Website | Status |
|---|---|---|---|---|
| D1 | Language | German guideline | English-only website | Website wins for web copy |
| D2 | Footer colour | Blue (p.37) | Black | Both allowed |
| D3 | Headline leading | 100% | 1.15 on screens | PDF for print, website for screens |
| D4 | Yellow | Primary accent | Not used on the website | Yellow stays available for print, campaigns, illustrations |

### Probable cause of the drift

The PDF is from April 2020. UnternehmerTUM has since published "UnternehmerTUM in neuen Farben" (a colour refresh, https://unternehmertum.de/en/news/in-eigener-sache-unternehmertum-in-neuen-farben). The website was rebuilt in code as a faithful copy of the earlier Craft CMS site, whose look had developed beyond the 2020 PDF (rounded media, two-tone headings, black/white rhythm).

## Inconsistencies inside the PDF

| # | Page | Issue | Resolution in this repo |
|---|---|---|---|
| P1 | 17 | CMYK for White is printed "C0 M70 Y0 B0", for Grey "C0 M70 Y0 B15", for 80% Black "C0 M70 Y0 B80" (stray M70; "B" used for K) | Corrected to K-only: 0/0/0/0, 0/0/0/15, 0/0/0/80 |
| P2 | 17 | 80% Black: RGB 87/87/87 (= `#575757`) vs HEX `575756` | HEX `#575756` kept |
| P3 | 16 vs 17 | Grey `#E3E3E3` is listed as primary on p.17 but missing from the colour overview p.16 | Kept as primary |
| P4 | 10-11 | Text says "Logos von Aligned Brands", but Manage and More is an Endorsed Brand (own symbol, p.9) | Treated as Endorsed Brand |
| P5 | 2 vs 9/13 | Table of contents says "2.1 Endorsed Brands", "2.2 Label"; pages say "Logoaufbau", "2.2 Logo Label" | Cosmetic |
| P6 | 36 | E-mail mock-up uses link blue `#44ABD2`, not `#00A2CD` | Use `#00A2CD` |
| P7 | 9 | Logo construction refers to the UnternehmerTUM "U" as unit, which is not part of the M&M logo | U = height of the M&M symbol |
| P8 | 34-36 | Mock-ups show UnternehmerTUM people, numbers and Twitter/Facebook | Replace with current M&M data |

## Decisions log

| Date | Decision | By |
|---|---|---|
| 2026-10-07 | PDF is canonical; website deviations documented, not adopted | default set at repo creation |
| 2026-10-07 | The website (`manage-and-more-website`) is the standard for screens; this supersedes the line above for screen work. PDF stays canonical for print and identity assets | brand owner |
| 2026-10-07 | Corners: adopt the website radii (`card` 0.75rem, `feature` 2rem, `pill`); colour blocks, logo and labels stay square | brand owner |
| 2026-10-07 | Text on blue: keep the website's blue sections but with black text; add `#007D9E` for blue text and focus rings on white | brand owner |
| 2026-10-07 | Type: adopt the website scale, stored in rem; headline line-height 1.15 on screens, 1.0 in print | brand owner |
| 2026-10-07 | CTA: arrow link is the primary web CTA; the rectangular button stays for forms and product UI | brand owner |
| 2026-10-07 | Typeface: Manage and More holds a Sharp Sans licence and uses it on the web; Work Sans is the fallback. The font files stay out of this repo | brand owner |
