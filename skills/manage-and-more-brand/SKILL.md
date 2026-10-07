---
name: manage-and-more-brand
description: Apply the Manage and More (M&M, by UnternehmerTUM) brand - logo files, colours, fonts, web components matching manageandmore.de, icons, illustrations, photo style, tokens - to any website, app, slide deck, document, social graphic, e-mail signature or merch; also use to review a design for brand compliance.
---

# Manage and More brand

Use this skill whenever you create or review anything that carries the Manage and More brand. It gives you the essentials inline and tells you where the full guidelines and the asset files live.

## 1. Locate the design system repo

All paths below are relative to the root of the `mm-design-system` repo. Find it in this order and remember the path as `$MM`:

```bash
for d in "$MM_DESIGN_SYSTEM" "$(git rev-parse --show-toplevel 2>/dev/null)" ./mm-design-system ../mm-design-system ~/mm-design-system ~/.cache/mm-design-system; do
  [ -n "$d" ] && [ -f "$d/assets/catalog.json" ] && [ -d "$d/guidelines" ] && MM="$d" && break
done
[ -z "$MM" ] && git clone --depth 1 https://github.com/Manage-and-More/mm-design-system ~/.cache/mm-design-system && MM=~/.cache/mm-design-system
echo "$MM"
```

If cloning fails (private repo, no network), work from the essentials in section 2 and tell the user which assets you could not copy.

Then read `$MM/AGENTS.md` (the map), and only the guideline pages your task needs (`$MM/guidelines/NN-*.md`). Find files by querying `$MM/assets/catalog.json` (fields: `path`, `kind`, `description`, `use_on`, `tags`, `source`):

```bash
jq -r '.assets[] | select(.kind=="logo" and (.use_on|index("black"))) | .path' "$MM/assets/catalog.json"
```

## 2. Essentials (enough for most tasks)

**Sources:** the 2020 guideline PDF rules print and identity assets; the **manageandmore.de codebase** (`manage-and-more-website` repo) is the adopted standard for **screens**, corrected for WCAG AA. Website patterns that break a rule are listed under "Website fixes" in `guidelines/sources-and-discrepancies.md`: build the corrected version, not the website's.

**Brand:** Manage and More, an *endorsed brand* of UnternehmerTUM. Own logo and colour; shows its endorsement with the square **BY UNTERNEHMERTUM** label. Write the name "Manage and More".

**Logo** (`assets/logo/svg/`): symbol (blue swirl) + two-line wordmark "MANAGE / AND MORE".
- `mm-logo-primary.svg` on white/light · `mm-logo-primary-on-dark.svg` on black and dark heroes (website header, 98px wide, 128px from 768px) · `mm-logo-white.svg` on blue or photos · `mm-logo-black.svg` one-colour · `mm-symbol-*.svg` for favicons/avatars.
- Clear space ≥ half the logo height. Min 32px tall on screen, else symbol only.
- Never: all-blue logo, other colours, recolouring parts, rearranging, stretching, frames, shadows, anything on top, added symbols. `alt="Manage and More"`.

**Colours** (tokens in `tokens/build/tokens.css`, prefix `--mm-`):

| | HEX | Use |
|---|---|---|
| Blue | `#00A2CD` | signature: logo symbol, emphasis sections, accents |
| Yellow | `#FFED00` | accent surfaces in print/campaigns; never text on white; not used on the website |
| Black | `#000000` | text, every second website section, footer |
| White | `#FFFFFF` | text on black, every other section |
| Grey | `#E3E3E3` | quiet sections (rare) |
| 80/60/40% black | `#575756` `#878787` `#B2B2B2` | muted text / captions / lines |
| Blue text *(AA shade)* | `#007D9E` | small blue text and focus rings on white; never a surface |

Accessibility: white on blue and blue on white are 2.98:1. **Text on blue is black** (7.05:1), headings included. Blue text on white uses `#007D9E`; brand blue text is fine on black. Muted text = text colour at 70% (white at 50% is fine on black, black at 50% is not on white). No gradients, no shadows, no other hues.

**Type:** **Sharp Sans** Medium 500 / Extrabold 800 (licensed; copy the WOFF2 files from the website repo `src/fonts/`, never commit them to a public repo), fallback **Work Sans** (bundled, `assets/fonts/work-sans/`). Stack: `--mm-font-family-web`. Arial for e-mail and PowerPoint/Google Slides. Screen scale (rem tokens `--mm-font-size-*`): body 15 → 17 (768) → 20px (1200); section heading 25 → 50px (768); hero display 30/50/40/50/75px; headlines 800, **line-height 1.15 on screens** (1.0 in print); left-aligned; no italic. Signature **two-tone heading**: an outlined line (transparent fill, 1-1.5px `currentColor` stroke) above a solid line, e.g. "Broaden your horizons:" / "International Opportunities".

**Layout (web):** fixed transparent header over a full-bleed **hero** (photo or video, flat black shade 20-60%, two-tone h1 bottom-left, BY UNTERNEHMERTUM label bottom-right 40/80px) → **alternating black and white sections** (1px divider at 20% `currentColor`; one or two blue sections with black text) → black footer with the descriptor + label lock-up. Content width 1500px with gutters 20/30/50px; section padding 25 → 50 → 75 → 100px. Corners: `--mm-radius-card` 0.75rem (photos, cards), `--mm-radius-feature` 2rem (large media), `--mm-radius-pill` (chips, circular controls); sections, colour blocks, logo and labels square.

**CTA:** the **arrow link** is primary: a 44px outlined circle with an arrow (`assets/ui/svg/arrow-right.svg`) + Extrabold label, inheriting the text colour; the circle nudges 4px right on hover. Rectangular black button (uppercase Extrabold, square) only for forms and product UI. Inline links: current colour, Extrabold, underline offset 4px.

**Icons** (`assets/icons/svg/*.svg`, `currentColor`): monoline, square ends, one colour (black/white/blue). 16 icons: globe, signpost, map, rocket, health, money, network, education, calendar, tools, connected-car, robot-arm, team, building, technology, chat. Missing ones: Tabler/Lucide at stroke 2, square caps. **UI glyphs** (`assets/ui/svg/`: arrows, check, plus, quote, LinkedIn) have round caps and are only for controls.

**Illustration:** black line art + one big flat blue circle or full yellow ground, dot/hatch textures, white knock-outs, playful innovation motifs. **Infographics:** thin black lines + big flat shapes in blue/yellow/black/grey, big Extrabold numbers; on the web, a stat row (top rule, 30-50px Extrabold number, small label).

**Photography:** documentary, real people interacting, natural soft light. Prefer Manage and More's own photos (`assets/photography/website/`); crops 4:3 cards, 4:5 team portraits, 1:1 portraits, 2:1 heroes. B/W and blue tint (`scripts/tint_photo.py`) only as highlights. Check rights and consent before publishing.

**Endorsement:** website: BY UNTERNEHMERTUM label file in the hero corner + ENTREPRENEURIAL EDUCATION descriptor lock-up in the footer (descriptor left of the label, contrasting with it). Print: label in a corner, size = short side ÷ 8; none on business cards. Never UnternehmerTUM blue for the label; never re-typeset it.

**Voice:** English. Triplets ("Learn. Lead. Launch."), setup/payoff headlines matching the two-tone heading, "you"/"we", proof through numbers ("260+ founded startups"), short verb-first CTAs ("Explore the program").

## 3. Workflow by task

- **Web / app UI:** copy `tokens/build/tokens.css` (or `tailwind.theme.css` for Tailwind v4, `tailwind.preset.js` for v3), the Sharp Sans files (if the project may have them) and the Work Sans fallback; copy the needed logo/label/icon/glyph SVGs instead of hot-linking. Build from the components in `guidelines/13-web-components.md`; layout numbers in `guidelines/10-layout.md`. Start from `examples/landing-page.html` + `examples/mm-base.css`. For pixel-exact detail, read the website repo (`src/styles/theme.css`, `src/components/`).
- **Slides / documents:** `guidelines/11-applications.md` (presentations, letterhead) + logo PNGs. Arial in PowerPoint/Slides, Sharp Sans or Work Sans elsewhere; headline leading 1.0.
- **E-mail signature:** template in `guidelines/11-applications.md`.
- **Social / print graphic:** big Extrabold headline (two-tone outline/solid works well), flat blue/yellow/black blocks, logo with clear space, label in a corner.
- **Charts:** `guidelines/08-infographics.md` series order: blue, black, yellow, 60% and 40% black.
- **Copy:** `guidelines/12-voice-and-tone.md`.

## 4. Review checklist (run before you finish)

- [ ] Correct logo version for the background, unmodified file, clear space respected
- [ ] Only palette colours (+ `#007D9E` for blue text/focus); blue is the signature; no gradients or shadows
- [ ] Text contrast ≥ 4.5:1: **black text on blue**, no brand-blue small text on white, muted text ≥ 70% on white
- [ ] Sharp Sans 500/800 with Work Sans fallback (Arial only for office/e-mail); headlines 800, line-height 1.15 on screens; body 500; left-aligned; no italic
- [ ] Web: hero + alternating black/white sections, two-tone headings, arrow-link CTAs
- [ ] Radii only from tokens (card, feature, pill); sections, colour blocks, logo and labels square
- [ ] Icons monoline single-colour; UI glyphs only in controls; photos documentary, preferably M&M's own
- [ ] Endorsement present: label in the hero/print corner, descriptor lock-up in the website footer
- [ ] Focus visible (2px `#007D9E`, black on blue), controls ≥ 44px, `prefers-reduced-motion` respected

If something is not covered, follow the website repo for screens or the PDF page images in `source/pages/` for print, and say that you made an assumption. Rule conflicts, adopted website patterns and open website fixes are listed in `guidelines/sources-and-discrepancies.md`.
