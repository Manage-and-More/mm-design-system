# Brand v3: notes and deviations

Status: **experimental** playground variant. It is the `studio-landing` skill ("quiet page, loud weather") applied to the Brand v2 identity for the hackathon platform landing page. Nothing here is adopted. `guidelines/` and `AGENTS.md` are unchanged.

## Cluster

**Architectural** (kuro, tacto). A hackathon is a build site: visible construction (rails, hatch walls, square handles), a grotesk display that fits Sharp Sans, and one pinned set piece that shows the event being assembled step by step. Editorial and Soft both need a serif display, which the brand does not have.

## Token table (studio-landing §3, filled)

| Token | Value | Source |
|---|---|---|
| display | Sharp Sans 500, Work Sans 500 fallback, one weight for the whole page | brand fonts; skill "one display weight" |
| body | same family, 400 | |
| H1 | `clamp(44px, 1rem + 8.4vw, 148px)`, line-height 0.94, -0.04em, flush to the bottom of the hero | kuro giant display, in sentence case |
| paper | `#F5F5F7`, framed by the tinted night hero and ending | Brand v2 canvas |
| ink | `#000`; muted = ink at 60%, quiet = ink at 40% | Architectural ink; skill "muted is alpha" |
| dark sections | night `#08111F` (the v2 blue at about 10% lightness), deep `#03060C` | skill derivation rule |
| accent | `#0071E3` (`#2997FF` on dark), the only hue | Brand v2 |
| radius | 0 for all chrome and mockups | skill "binary radius" |
| edges | 1px hairlines, 20px diagonal hatch walls, 5px square handles | Architectural |
| gutter | 40px, 20px on phones | kuro |
| backdrop | CSS: night sky, a low blue horizon light, a ground under it, grain | no imagery exists |
| wordmark | "Manage and More" in 5x7 pixel blocks, lit from the horizon, ghosted, cropped by the page bottom | derivation: geometric logo, builder audience |
| motion | hero arrive, fade-ups once, one pinned stage, a blink inside mockups | profile "medium" |

## Deviations from AGENTS.md hard rules

| Rule | Deviation | Why |
|---|---|---|
| No gradients, shadows or glows | Grained gradients in the hero sky and ground and in the closing CTA and footer field; a radial "horizon light" in the v2 blue | The language's core idea is a quiet page in front of loud weather. Without imagery, the weather is a CSS gradient, always under grain. No card shadows anywhere. |
| Only palette colours | Night tints `#08111F`, `#03060C`, mockup and tile darks `#0E1522`, `#111A2A`, horizon light `#CFE5FF` | Dark sections take the hero hue (skill rule). Brand v2 set the precedent with its screen greys. |
| Motion short and reactive only (no scroll-triggered entrances or marquees) | Hero arrive (opacity, 22px, blur, 1.25s), block fade-up once on entry (18px), one pinned scroll stage on desktop, a blinking status dot | The skill's "medium" motion profile. Everything stops under `prefers-reduced-motion`: the stage unpins and shows its final state. No marquee. |
| Rounded corners only with radius tokens; Brand v2 "pill = action" | All chrome is square (`radius.card` and `radius.feature` set to 0); buttons are square | Skill rule: radius is binary, 0 or pill, and the Architectural cluster is 0. |
| Brand headline weight 800 | Headlines at 500 (`font.weight.headline` overridden) | Skill rule: one display weight per page, hierarchy from size and tone. |
| Backdrop blur on the header | Translucent nav over paper and night | As in Brand v2. |

Kept from the rules: logo and labels only from `assets/v2/`, the BY UNTERNEHMERTUM label in the hero's bottom-right corner (80px, 50px inset; 40px on phones), the descriptor lock-up in the footer, no kicker labels, white text on the blue only on the band, primary buttons white on dark and black on light.

## Not in this page

- **Logo proof and a named quote.** The platform has no customer logos or real quotes yet; inventing them would read as fact. Add both before this ships.
- **No-JS rendering.** The playground renders pages with React, so the page needs JS. With JS but reduced motion, everything is visible and static.

## Screenshots

Automated browsers (`navigator.webdriver`, as in `pnpm shot`) get the final state: no entrance animations, fade-ups shown, the pinned stage unpinned. A full-page capture never scrolls, so the scroll states would otherwise be blank. To see the stage scrub, use `pnpm dev`.
