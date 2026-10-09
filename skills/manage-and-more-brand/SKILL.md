---
name: manage-and-more-brand
description: Apply the Manage and More (M&M, by UnternehmerTUM) brand - logo files, colours, fonts, web components matching manageandmore.de, icons, illustrations, photo style, tokens - to any website, app, slide deck, document, social graphic, e-mail signature or merch; also use to review a design for brand compliance.
---

# Manage and More brand

Use this skill whenever you create or review anything that carries the Manage and More brand. It gives you the essentials inline and tells you where the full guidelines and the asset files live.

## 1. Locate the design system repo

All paths below are relative to the root of the `mm-design-system` repo. Find it in this order and remember the **absolute** path as `$MM`. The snippet is bash; in fish or zsh-only setups run it with `bash -c '…'`.

```bash
for d in "$MM_DESIGN_SYSTEM" "$(git rev-parse --show-toplevel 2>/dev/null)" ./mm-design-system ../mm-design-system ~/mm-design-system ~/.cache/mm-design-system; do
  [ -n "$d" ] && [ -f "$d/assets/catalog.json" ] && [ -d "$d/guidelines" ] && MM="$(cd "$d" && pwd)" && break
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

**Which brand?** Two brands share the repo. **Brand v1** (everything below in this section) is the programme: manageandmore.de, print, the scholarship. **Brand v2** (section 2b) is for tech products: hackathon platform, CRM, SaaS and their landing pages. Never mix their blues on one surface.


**Sources:** the 2020 guideline PDF rules print and identity assets; the **manageandmore.de codebase** (`manage-and-more-website` repo) is the adopted standard for **screens**, corrected for WCAG AA. Website patterns that break a rule are listed under "Website fixes" in `guidelines/sources-and-discrepancies.md`: build the corrected version, not the website's.

**Brand:** Manage and More, an *endorsed brand* of UnternehmerTUM. Own logo and colour; shows its endorsement with the square **BY UNTERNEHMERTUM** label. Write the name "Manage and More".

**Logo** (`assets/logo/svg/`): symbol (blue swirl) + two-line wordmark "MANAGE / AND MORE".
- `mm-logo-primary.svg` on white/light · `mm-logo-primary-on-dark.svg` on black and dark heroes (website header: set by height, 32px, 40px from 768px) · `mm-logo-white.svg` on blue or photos · `mm-logo-black.svg` one-colour · `mm-symbol-*.svg` for favicons/avatars.
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

**CTA:** the **arrow link** is primary: a filled **sticker** circle (2em of the label size, ~40px) in the text colour with the arrow (`assets/ui/svg/arrow-right.svg`, inlined) in the section's background colour, then an Extrabold label; the sticker scales to 1.1 on hover (250ms ease-out). Rectangular black button (uppercase Extrabold, square) only for forms and product UI. Inline links: current colour, Extrabold, underline offset 4px.

**Motion** (`guidelines/14-motion.md`, tokens `--mm-motion-*`): short and reactive only. Sticker scale 1.1 (250ms); nav underline wipe (150ms); linked-card image zoom 1.1 (500ms); colour fades 200ms; header solid and slimmer after 60px (500ms); images fade in over a pulsing placeholder; FAQ sticker swaps plus→minus and turns 180° (300ms) while the answer's height expands (350ms). No parallax, scroll-triggered entrances or marquees. Under `prefers-reduced-motion` everything stops and background video shows its poster.

**Icons:** for web pages use the 36 live-site pictograms in `assets/icons/web/` (e.g. smart-industry, mobility, artificial-intelligence, mentoring-coaching; no energy icon). For print, the 16 PDF icons in `assets/icons/svg/*.svg` (`currentColor`): monoline, square ends, one colour (black/white/blue): globe, signpost, map, rocket, health, money, network, education, calendar, tools, connected-car, robot-arm, team, building, technology, chat. Missing ones: Tabler/Lucide at stroke 2 with square caps and mitred joins. **UI glyphs** (`assets/ui/svg/`: arrows, chevron, check, plus/minus, close, menu, quote, LinkedIn) are thin filled paths with square ends, only for controls; paste them inline so they can take `currentColor`.

**Illustration:** black line art + one big flat blue circle or full yellow ground, dot/hatch textures, white knock-outs, playful innovation motifs. **Infographics:** thin black lines + big flat shapes in blue/yellow/black/grey, big Extrabold numbers; on the web, a stat row (top rule, 30-50px Extrabold number, small label).

**Photography:** documentary, real people interacting, natural soft light. Prefer Manage and More's own photos (`assets/photography/website/`); crops 4:3 cards, 4:5 team portraits, 1:1 portraits, 2:1 heroes. B/W and blue tint (`scripts/tint_photo.py`) only as highlights. Check rights and consent before publishing.

**Endorsement:** website: BY UNTERNEHMERTUM label file in the hero corner + ENTREPRENEURIAL EDUCATION descriptor lock-up in the footer (descriptor left of the label, contrasting with it). Print: label in a corner, size = short side ÷ 8; none on business cards. Never UnternehmerTUM blue for the label; never re-typeset it.

**Voice:** English. Triplets ("Learn. Lead. Launch."), setup/payoff headlines matching the two-tone heading, "you"/"we", proof through numbers ("260+ founded startups"), short verb-first CTAs ("Explore the program").

## 2b. Brand v2 essentials (tech products)

Full spec: `guidelines/15-brand-v2.md`. It sits on top of the Brand v1 rules (logo files, endorsement, type, voice, contrast) and overrides what is listed here. Status: draft until the brand owner adopts it; its deviations are logged in `guidelines/sources-and-discrepancies.md`.

**Thesis:** quiet page, one living drawing. Near-monochrome surfaces; the only colour is one blue, carried mostly by a hairline figure that answers the pointer.

**Colour:** one blue, `#0071E3` (`#2997FF` on dark), `--mm-color-brand-blue` in the variant tokens. **No accent colour**: no yellow, nothing else; blue, black, white and the greys only. Blue is the action colour (`--mm-color-semantic-action`: links, action pills, live chips, the arrow sticker, at most one phrase per heading), the figures' lit stroke, the logo swirl, and one flat **blue band** per page with **white** text (black fails AA on this blue). Charts: blue, black, greys, then the blue tint `#BFDBFF`. Canvas `#F5F5F7` / `#0B0B0C`, raised surfaces white / `#151517`, tiles light / parchment `#ECECEF` / dark.

**Assets:** `assets/v2/`, same sub-folders and file names as `assets/` (`jq -r '.assets[] | select(.brand=="v2") | .path' assets/catalog.json`). Never the `#00A2CD` files in a Brand v2 product. Everything without blue (`currentColor` icons, UI glyphs, photos, fonts) is shared from `assets/`.

**Tokens:** `tokens/build/tokens.css` then `tokens/build/variants/brand-v2.css` (overrides and additions, dark values under `:root[data-mode="dark"]`). Fluid type `--mm-font-size-fluid-*`; radius grammar `--mm-radius-xs/sm/md/lg/xl/pill` (5/8/11/18/22px; cards lg, containers xl); two shadows only, `--mm-shadow-card` (layered lift) and `--mm-shadow-product` (the hero figure plate); spring easing `--mm-motion-easing-spring`.

**Grammar:** hierarchy from full-bleed **tiles** and the card shadow, never borders; **pill = action**, buttons and status chips are the only pills; buttons and text stay flat; **no kicker labels** above headings; display and headings with negative tracking; the two-tone outline line once per page, painted with `paint-order: stroke fill` and a surface-coloured fill; translucent sticky header with the nav underline wipe and one pill CTA; the endorsement label small in the hero corner, the lock-up in the footer.

**Figures:** `@lucasmarkes/hairline` (MIT; Terminal, Lockers, Riffle, Elevator; Plot, Query, Drawer as empty states) plus the custom Bench (hero), Podium (judges) and Hours (participants) in `examples/hairline-figures.js` (sources `playground/hairline/figures/`, built with the `hairline-create` skill in `.agents/skills/`). Set `--hairline-plate` to the surface the figure sits on; `--hairline-hi` is the blue.

**Start from:** `examples/brand-v2.html` + `examples/brand-v2.css`; React components and docs pages in `playground/src/variants/brand-v2/` (variant **Brand v2**, light and dark; `pnpm shot brand-v2 landing` screenshots it).

## 3. Workflow by task

- **Web / app UI:** copy `tokens/build/tokens.css` (or `tailwind.theme.css` for Tailwind v4, `tailwind.preset.js` for v3), the Sharp Sans files (if the project may have them) and the Work Sans fallback; copy the needed logo/label/icon/glyph SVGs instead of hot-linking. Build from the components in `guidelines/13-web-components.md`, motion from `guidelines/14-motion.md`; layout numbers in `guidelines/10-layout.md`. Start from `examples/landing-page.html` + `examples/mm-base.css`. Put licensed Sharp Sans in `fonts/sharp-sans/` and git-ignore it unless the repo is private to the team. For unconfirmed content follow `guidelines/13-web-components.md#placeholders`. For pixel-exact detail: the live https://www.manageandmore.de for look and motion, the website repo (`src/styles/theme.css`) for tokens and layout.
- **Landing page or UI for a tech product (hackathon platform, CRM, SaaS):** use Brand v2, `guidelines/15-brand-v2.md`: start from `examples/brand-v2.html` + `examples/brand-v2.css` with `tokens/build/variants/brand-v2.css`, figures from `@lucasmarkes/hairline` and `examples/hairline-figures.js`. Grammar: hierarchy from surface tiles (light, parchment, dark) and the soft layered card shadow, never borders; one blue only: Brand v2 replaces the brand blue with `#0071E3` (`#2997FF` on dark) everywhere in that language, band, figures, actions and the logo (a logged deviation); text on that blue is white. **Assets from `assets/v2/`** (same file names as `assets/`, `jq 'select(.brand=="v2")'`), never the `#00A2CD` files; no yellow and no other accent anywhere in Brand v2; buttons and text stay flat; the hero figure sits on a plate with the product shadow; one blue band per page; no kicker labels.
- **Explore or design a new language (SaaS/product UI, Brand v2):** use the repo's `playground/` (`pnpm install && pnpm dev`). It shows every token, component and asset live, and compares variants side by side at real breakpoints. Start a variant with `pnpm new:variant <id>`: its DTCG `tokens.json` overrides or extends core paths, and Foundations pages are generated from it. Keep variants inside the hard rules unless the brand owner approves a deviation (log it in `guidelines/sources-and-discrepancies.md`).
- **Slides / documents:** `guidelines/11-applications.md` (presentations, letterhead) + logo PNGs. Arial in PowerPoint/Slides, Sharp Sans or Work Sans elsewhere; headline leading 1.0.
- **E-mail signature:** template in `guidelines/11-applications.md`.
- **Social / print graphic:** big Extrabold headline (two-tone outline/solid works well), flat blue/yellow/black blocks, logo with clear space, label in a corner.
- **Charts:** `guidelines/08-infographics.md` series order: blue, black, yellow, 60% and 40% black.
- **Copy:** `guidelines/12-voice-and-tone.md`.

## 4. Review checklist (run before you finish)

- [ ] Correct logo version for the background, unmodified file, clear space respected
- [ ] Only palette colours (+ `#007D9E` for blue text/focus); blue is the signature; no gradients or shadows (Brand v2: its two shadow tokens only)
- [ ] **No kicker labels**: no small uppercase line (with or without a dash) above any heading or card title; status in a chip, counts in the copy
- [ ] Text contrast ≥ 4.5:1: **black text on blue**, no brand-blue small text on white, muted text ≥ 70% on white
- [ ] Sharp Sans 500/800 with Work Sans fallback (Arial only for office/e-mail); headlines 800, line-height 1.15 on screens; body 500; left-aligned; no italic
- [ ] Web: hero + alternating black/white sections, two-tone headings, sticker arrow-link CTAs
- [ ] Radii only from tokens (card, feature, pill); sections, colour blocks, logo and labels square
- [ ] Icons monoline single-colour; UI glyphs only in controls; photos documentary, preferably M&M's own
- [ ] Endorsement present: label in the hero/print corner, descriptor lock-up in the website footer
- [ ] Motion only from `14-motion.md` (durations and easings from tokens); nothing moves on its own
- [ ] Focus visible (2px `#007D9E`, black on blue), icon-only controls ≥ 44px, `prefers-reduced-motion` stops all non-essential motion

Brand v2 only (in place of the Brand v1 web and colour lines above):

- [ ] One blue `#0071E3` / `#2997FF` everywhere, logo included (`assets/v2/`); no yellow, no other accent; **white** text on the blue band
- [ ] Hierarchy from tiles and the card shadow, no card borders; pills only for buttons and status chips; no shadows on buttons or text
- [ ] One hairline figure carries the colour; its plate matches its surface; empty states use a library figure
- [ ] No kicker labels; display and headings tracked negative; the outline line once, in the hero, with the paint-order fill
- [ ] Both modes checked (`pnpm shot … --mode dark`); the deviations stay inside Brand v2

If something is not covered, follow the website repo for screens or the PDF page images in `source/pages/` for print, and say that you made an assumption. Rule conflicts, adopted website patterns and open website fixes are listed in `guidelines/sources-and-discrepancies.md`.
