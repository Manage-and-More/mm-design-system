# Changelog

## Unreleased

### Motion and live-site alignment

The live manageandmore.de is now the reference for look and motion (the rebuild repo stays the reference for tokens and layout).

- New `guidelines/14-motion.md`: hover (sticker scale, nav underline wipe, image zoom), scroll and loading (header shrink at 60px, image fade-in with pulse), opening and closing (FAQ height and sticker turn, dropdown clip, side panels, video poster), and a strict reduced-motion rule. Partner marquee not adopted.
- Arrow link is now the live "sticker": a filled circle in the text colour with the glyph in the surface colour, scaling to 1.1 on hover. FAQ uses a plus/minus sticker.
- UI glyphs replaced with the live `utum-icon` set (filled 2-unit paths, square ends); added arrow-up, arrow-down, chevron-down, minus, close, hamburger.
- Tokens: `motion.*` rebuilt (7 durations, 4 easings, `scale-hover`, `scroll-threshold`); `size.sticker`, `size.sticker-glyph`; `layout.header.padding-desktop`; `opacity.placeholder-*`. Removed `motion.easing` and `opacity.header-scrolled` (the header becomes solid).
- Updated web components, layout, iconography, discrepancies (A16-A18, F17-F21, decisions), skill, AGENTS.md, README, llms.txt, `examples/` and `index.html`.


Aligned the design system with the live website (`manage-and-more-website`, commit 742e91f), which is now the standard for screens. Decisions by the brand owner are logged in `guidelines/sources-and-discrepancies.md`.

**Breaking token changes**
- `font.size.*` replaced by the website's responsive scale in rem: `display.{mobile,tablet,laptop,desktop,wide}`, `heading.{mobile,desktop}`, `lead.*`, `body.{mobile,tablet,desktop}`, `subheading`, `title`, `small`, `caption`, `stat.*`, `stat-label.*`, `nav`, `nav-mobile`. Removed `h1`, `h2`, `h3`, `lead` (single value), `body` (single value).
- `font.line-height.headline` 1.0 → 1.15 (screens); new `headline-print` 1.0 and `tight` 1.0.
- `font.family.web` is now Sharp Sans → Work Sans → Arial; new `font.family.open` (Work Sans → Arial).
- `font.letter-spacing.headline` -0.01em → 0; `label` 0.02em → 0.025em; new `meta`, `eyebrow`.
- `layout.gutter` (clamp) replaced by `layout.gutter.{small,medium,large}`; `layout.container-max` 1200px → 1500px (`layout.content.medium`).
- `color.semantic.focus-ring` → `#007D9E`. `radius.pill` 999px → 9999px.

**Added**
- Tokens: `color.accessible.blue-text` `#007D9E`, `color.semantic.text-on-brand`, `color.semantic.accent-text`; `opacity.*`; `space.section.*`; `radius.card` (0.75rem), `radius.feature` (2rem); `stroke.ui`, `stroke.outline-text.*`; `size.control*`; `aspect.*`; `layout.content.*`, `layout.header.*`; `breakpoint.*`; `motion.*`; `label.size.web-*`.
- `tokens/build/tailwind.theme.css` for Tailwind v4; the v3 preset gains letter-spacing, opacity, aspect ratio, max-width and motion entries.
- `guidelines/13-web-components.md`: header, hero, section, two-tone heading, arrow link, button, stat row, cards, logo grid, startup portfolio, chips, carousels, FAQ, lists, countdown, video embed, footer, motion, focus.
- UI glyphs in `assets/ui/svg/` (arrows, check, plus, quote, LinkedIn); 8 Manage and More photos in `assets/photography/website/`.
- Rewritten `examples/mm-base.css` and `examples/landing-page.html` after the website; updated `index.html`.

**Changed rules**
- Corners: rounded photos, cards, chips and controls via tokens; sections, colour blocks, logo and labels stay square.
- Text on blue is always black; blue text on white uses `#007D9E`.
- Arrow link is the primary web CTA; the button is for forms and product UI.
- Sharp Sans (licensed) is the web typeface; Work Sans is the fallback. The font files stay out of this repo.
- Inline links: current colour, Extrabold, underline offset 4px. Focus: 2px `#007D9E`.
- Hero text over photos allowed with a flat black shade; BY UNTERNEHMERTUM label in the hero corner.
- Voice and tone rewritten from the website copy (setup/payoff headlines, CTA list).
- `sources-and-discrepancies.md`: the full website comparison, adopted patterns (A1-A15), website fixes (F1-F16), decisions log.
- Updated `AGENTS.md`, `README.md`, `llms.txt`, `CONTRIBUTING.md`, the brand skill, `tokens/README.md` (with a website-to-token mapping) and `assets/README.md`.

## 1.0.0 — 2026-10-07

- First version, extracted from the 2020 Manage and More brand guideline PDF (`source/MM_CI.pdf`).
- Guidelines for brand architecture, logo, endorsement labels, colour, typography, icons, illustration, infographics, photography, layout, applications, voice and tone.
- Design tokens (W3C format) with CSS, SCSS, flat JSON and Tailwind builds.
- Vector logo, symbol, label and lock-up files; 16 icons; 4 illustrations; infographic and photo references; Work Sans fonts.
- Agent skill `manage-and-more-brand`, `AGENTS.md`, asset catalogue, validation script and CI.
- Comparison with manageandmore.de recorded in `guidelines/sources-and-discrepancies.md`.
