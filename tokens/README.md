# Tokens

[`tokens.json`](tokens.json) is the single source of truth, in the [W3C Design Tokens](https://design-tokens.github.io/community-group/format/) format. Each token can carry `$description` and `$extensions.mm.source` (`pdf p.N`, `website <file>` for values adopted from the manageandmore.de codebase, or `derived`). Responsive tokens carry `$extensions.mm.min-width`: the `mobile` step applies from 0, the others from that width up.

Generated files in [`build/`](build/) (run `python3 scripts/build_tokens.py`, never edit by hand):

| File | Use |
|---|---|
| [`tokens.css`](build/tokens.css) | `@import` once; use `var(--mm-color-brand-blue)` etc. |
| [`tokens.scss`](build/tokens.scss) | `$mm-color-brand-blue` etc. |
| [`tokens.flat.json`](build/tokens.flat.json) | `{"color.brand.blue": "#00A2CD"}`; easiest for scripts and agents |
| [`tailwind.preset.js`](build/tailwind.preset.js) | Tailwind v3: `presets: [require('./tailwind.preset.js')]`, then `bg-mm-blue`, `text-mm-text`, `font-mm-web`, `text-mm-heading-desktop`, `rounded-mm-card`; import `tokens.css` too |
| [`tailwind.theme.css`](build/tailwind.theme.css) | Tailwind v4: `@import "tailwindcss"; @import "./tailwind.theme.css";`, then the same `mm-` utilities. Standalone (literal values). |

Naming: `color.brand.*` (the five primaries), `color.neutral.*` (80/60/40% black), `color.accessible.*` (AA-only shades: `blue-text`), `color.semantic.*` (roles such as text, text-on-brand, accent-text, focus-ring), `font.*` (family, weight, responsive `size.*`, line-height, letter-spacing), `opacity.*`, `space.*` (incl. `space.section.*`), `radius.*`, `stroke.*`, `size.*`, `aspect.*`, `layout.*` (content widths, gutters, header), `breakpoint.*`, `motion.*`, `logo.*`, `label.size.*`.

## Mapping to the website theme

The website (`manage-and-more-website/src/styles/theme.css`) uses its own variable names. Equivalents:

| Website | Token |
|---|---|
| `--color-dark` / `--color-light` / `--color-gray` / `--color-highlight` | `color.brand.black` / `white` / `grey` / `blue` |
| `--radius-card` / `--radius-feature` | `radius.card` / `radius.feature` |
| `--layout-content-*` | `layout.content.*` |
| `--layout-gutter-small/medium/large` | `layout.gutter.*` |
| `--layout-header-gutter-*` | `layout.header.gutter-*` |
| `--section-space-*` | `space.section.*` |
| `--type-body-*` / `--type-section-heading-*` / `--type-display-*` | `font.size.body.*` / `font.size.heading.*` / `font.size.display.*` (rem instead of px) |
| `--stroke-outline-*` | `stroke.outline-text.*` |
