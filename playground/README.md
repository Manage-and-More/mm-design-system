# Design system playground

A local app for browsing the Manage and More design system and **variants** of it: the current brand (Brand v1) today, and later a SaaS/product language, a Landing v2, and others. Each variant renders in an isolated canvas, so you can compare variants side by side at real breakpoints.

```bash
cd playground
pnpm install
pnpm dev            # http://localhost:5173
```

Node ≥ 22.12 (`.nvmrc`: 24). Stack: Vite 8, React 19, Tailwind CSS 4, TypeScript 7, wouter, clsx + tailwind-merge. Motion is CSS only.

## What you get

- **Shell:** sidebar with a variant switcher, page search and foldable sections (option-click folds all; folds are remembered); toolbar with light/dark mode, viewport widths (Fill, 390, 768, 1280, 1536, or drag the frame edge), Compare, reload and open-in-tab. All state is in the URL: `/brand/colors?vp=390&compare=saas&mode=dark`.
- **Canvas:** every page renders in an iframe (`canvas.html`) that loads only that variant's CSS. Variant resets and media queries never leak into the shell or into other variants.
- **One scroll:** docs pages grow the iframe to their content, so the whole playground scrolls as one page (and both sides of Compare scroll together). Fullscreen pages (templates) instead get a browser-sized frame with its own scroll, so fixed headers and scroll effects behave as on a real site. Override per page with `scroll: 'page' | 'frame'`.
- **Keys:** `⌘K` or `/` search pages (↑ ↓ ↵, Esc clears), `[` `]` previous / next page. They work while focus is inside the canvas too.
- **Foundations for free:** Colour (with a contrast matrix), Typography, Spacing & Layout, Shape, Motion (live curves) and All tokens. These pages are generated from the variant's resolved tokens and badge every token as `core`, `override` or `new`.
- **Copy anything:** every CSS variable, hex value, asset path and code snippet is a chip with a copy icon. Long values truncate at the start (the unique end stays visible) but copy in full.
- **Uniform cards:** colour and asset cards share one structure (media, name, copy chip, footer with source and Notes) and equal row heights at any width. Design rationale is folded: Notes slide up over the card instead of resizing it.
- **Brand v1:** the components, patterns and landing page from `examples/` as React, styled by the unchanged `examples/mm-base.css`. Assets are browsed from `assets/catalog.json`.

Nothing in the design system is copied or edited. Tokens, assets, fonts and `mm-base.css` are read in place through the `@ds` alias (the repo root).

## Add a variant

```bash
pnpm new:variant saas --name "SaaS" --summary "Product UI for the CRM" --based-on brand
```

This copies `src/variants/_template` to `src/variants/saas/`, and the variant shows up in the switcher. No shell code changes. A variant is a folder:

| File | Purpose |
|---|---|
| `variant.ts` | `defineVariant({ id, name, summary, status, modes, styles, pages })`: metadata and lazy pages |
| `tokens.json` | W3C DTCG tokens, layered over core `tokens/tokens.json` (see below) |
| `styles.css` | The variant's own Tailwind entry: imports core and generated tokens, maps them to utilities with `@theme inline` |
| `pages/*.tsx` | Components, Patterns, Templates… Docs building blocks in `@/core/docs/`: `Specimen` (labelled example with optional code + copy), `CopyText` (copy chip), `CardFooter` (source + sliding Notes), `Notes` (inline fold), `DocSection` |

Status is `canonical`, `draft` or `experimental`. Pages with the same `slug` line up in Compare, so name equivalent pages alike across variants.

### Variant tokens

`tokens.json` uses the same format and paths as the core file:

```json
{
  "color": {
    "semantic": {
      "background": { "$value": "#F5F5F7", "$extensions": { "mm": { "modes": { "dark": "#1C1C1E" } } } }
    },
    "surface": { "$type": "color", "raised": { "$value": "{color.semantic.background}" } }
  },
  "shadow": { "card": { "$type": "shadow", "$value": { "color": "#0000001f", "offsetX": "0px", "offsetY": "1px", "blur": "3px", "spread": "0px" } } }
}
```

- A path that exists in core **overrides** it; a new path is **added**.
- References resolve against the variant first, then core. They stay live `var()`s, so overriding `color.brand.black` also changes `color.semantic.text`.
- `$extensions.mm.modes.dark` values are emitted under `:root[data-mode="dark"]`. Add `'dark'` to `modes` in `variant.ts` to enable the toolbar toggle.
- `plugins/vite-plugin-mm-tokens.ts` writes `generated/tokens.css` and `generated/tokens.json` (gitignored) and regenerates on save. CSS hot-updates; docs pages reload.
- CSS names match `scripts/build_tokens.py` (`color.semantic.text` → `--mm-color-semantic-text`), and `pnpm test` checks parity with `tokens/build/tokens.css`. When a variant is ready to become core, its `tokens.json` merges into `tokens/tokens.json` unchanged.

## Layout

```
index.html, src/shell/     playground UI (neutral, Apple-like chrome)
canvas.html, src/canvas/   iframe entry; bridge.ts = postMessage between shell and canvas
src/core/                  variant contract, registry (auto-discovery), URL state, fonts, docs blocks and Foundations pages
src/variants/<id>/         one folder per variant; _template/ is the scaffold
plugins/                   DTCG reader (dtcg.ts) + Vite plugin, with tests
scripts/new-variant.ts     scaffolder
fonts-local/               licensed fonts on your machine only (see its README)
```

## Commands

```bash
pnpm dev          # playground with hot reload
pnpm build        # typecheck + static build to dist/ (index.html + canvas.html)
pnpm preview      # serve the build
pnpm typecheck
pnpm test         # DTCG pipeline tests, incl. parity with the Python token build
pnpm new:variant <id> [--name] [--summary] [--based-on]
```

## Deploy

The playground runs at https://mm-design-system.fly.dev behind basic auth and is hidden from search engines. Every push to `main` that touches `playground/`, `tokens/`, `assets/` or `examples/` runs typecheck and tests, then deploys (`.github/workflows/playground.yml`). The image (`Dockerfile`, built from the repo root) is the static build served by Caddy (`Caddyfile`); `fly.toml` keeps one machine that suspends when idle.

Rotate the password (run in your own terminal so it never lands in a log):

```bash
PW=$(openssl rand -base64 24) && echo "New password: $PW"
fly secrets set -a mm-design-system BASIC_AUTH_USER=mm \
  BASIC_AUTH_HASH="$(docker run --rm caddy:2.11-alpine caddy hash-password --plaintext "$PW")"
```

Manual deploy from the repo root: `fly deploy --ha=false`. Only files allowed by `.dockerignore` are uploaded, so licensed fonts in `fonts-local/` never ship.
