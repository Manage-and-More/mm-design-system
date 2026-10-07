# AGENTS.md — Manage and More Design System

Instructions for AI agents (Claude Code, Codex, Cursor, Copilot, …) working **with** or **on** this repository.

## If you are applying the brand to another project

Use the skill: [`skills/manage-and-more-brand/SKILL.md`](skills/manage-and-more-brand/SKILL.md). It contains the essentials and a review checklist. Then:

1. **Find files** with [`assets/catalog.json`](assets/catalog.json). Every asset has `path`, `kind` (logo, symbol, label, lockup, icon, illustration, infographic, photo, font, license), `description`, `use_on` (backgrounds it is approved for), `tags`, `source`.
2. **Use tokens, not hex codes you remember:** [`tokens/build/tokens.css`](tokens/build/tokens.css) (`--mm-*`), [`tokens.flat.json`](tokens/build/tokens.flat.json), [`tailwind.theme.css`](tokens/build/tailwind.theme.css) (Tailwind v4), [`tailwind.preset.js`](tokens/build/tailwind.preset.js) (Tailwind v3), [`tokens.scss`](tokens/build/tokens.scss).
3. **Read only the guideline you need** (each starts with a `summary` in front matter):

| Task | Read |
|---|---|
| Place a logo | [guidelines/02-logo.md](guidelines/02-logo.md) |
| Footer / UnternehmerTUM endorsement | [guidelines/03-endorsement-labels.md](guidelines/03-endorsement-labels.md) |
| Pick colours, check contrast | [guidelines/04-color.md](guidelines/04-color.md) |
| Fonts, type scale | [guidelines/05-typography.md](guidelines/05-typography.md) |
| Icons | [guidelines/06-iconography.md](guidelines/06-iconography.md) |
| Illustrations | [guidelines/07-illustration.md](guidelines/07-illustration.md) |
| Charts | [guidelines/08-infographics.md](guidelines/08-infographics.md) |
| Photos | [guidelines/09-photography.md](guidelines/09-photography.md) |
| Grid, widths, spacing, radii | [guidelines/10-layout.md](guidelines/10-layout.md) |
| Web UI: header, hero, sections, CTAs, cards, footer | [guidelines/13-web-components.md](guidelines/13-web-components.md) |
| Slides, letters, e-mail signature, merch | [guidelines/11-applications.md](guidelines/11-applications.md) |
| Writing copy | [guidelines/12-voice-and-tone.md](guidelines/12-voice-and-tone.md) |
| Conflicts, website differences, open website fixes | [guidelines/sources-and-discrepancies.md](guidelines/sources-and-discrepancies.md) |

4. **Copy assets into the target project**; don't hot-link raw GitHub URLs.
5. **Reference implementation:** [`examples/landing-page.html`](examples/landing-page.html) with [`examples/mm-base.css`](examples/mm-base.css). The production reference is the website repo `manage-and-more-website` (`src/styles/theme.css`, `src/components/`).
6. When the guidelines don't cover something, look at the page images in [`source/pages/`](source/pages/) (`page-NN.jpg`, 41 pages; full text in [`source/MM_CI.txt`](source/MM_CI.txt)), choose the option closest to the PDF, and tell the user it was your assumption.

## Hard rules (never break)

- Never redraw, recolour, re-space or retype the logo or the BY UNTERNEHMERTUM label; use the files. No all-blue logo.
- Only palette colours (plus `#007D9E` for blue text and focus rings). No gradients, shadows or glows.
- Rounded corners only with the radius tokens (`card`, `feature`, `pill`) on photos, cards, chips and controls. Sections, colour blocks, logo and labels stay square.
- No white text on blue (2.98:1): text on blue is black. No brand-blue text on white: use `#007D9E`.
- Web type: Sharp Sans 500/800 where the project has the licensed files, Work Sans fallback. **Never commit Sharp Sans files to this repo** (it may be shared outside the team).
- Treat photos in `assets/photography/` as references; flag rights and consent before publishing.

## If you are changing this repository

Follow [`CONTRIBUTING.md`](CONTRIBUTING.md). In short:

- The PDF is canonical for print and identity assets; the website repo `manage-and-more-website` is the adopted standard for screens. New knowledge goes into the matching guideline page with its source; conflicts go into `guidelines/sources-and-discrepancies.md`.
- When the website changes its theme (`src/styles/theme.css`) or a component, update the tokens and `guidelines/13-web-components.md` to match, or log the difference.
- Edit tokens only in `tokens/tokens.json`, then run `python3 scripts/build_tokens.py`. Never edit `tokens/build/*` by hand.
- Every new file in `assets/` needs an entry in `assets/catalog.json`.
- Run `python3 scripts/validate.py` before committing; CI runs it too.
- Add a line to `CHANGELOG.md`.
