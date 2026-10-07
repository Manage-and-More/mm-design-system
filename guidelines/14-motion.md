---
title: Motion and interaction
summary: How Manage and More moves on screen - hover micro-interactions, scroll and loading behaviour, opening and closing - with durations, easings, exact CSS and the reduced-motion rule.
source: live manageandmore.de (styles.css, index.js, icons.js), read 2026-10-07
status: adopted (the live site is the reference for look and motion, decision 2026-10-07)
tokens: tokens/tokens.json#motion
---

# Motion and interaction

The live site moves **little, quickly and purposefully**: things respond to the pointer, content settles in as it loads, and panels open without bounce. There is no parallax, no entrance choreography on scroll and nothing moves on its own except loading placeholders.

The rebuild repo (`manage-and-more-website`) simplified much of this. Where the two differ, follow this page; the rebuild's gaps are listed under [Website fixes](sources-and-discrepancies.md#website-fixes).

## Principles

1. **Respond, don't perform.** Motion confirms an action (hover, open, load). Nothing animates just because it scrolled into view.
2. **Short and eased-out.** 150-500ms for everything a user triggers; ease-out for things that react, `ease` for things that resize.
3. **One property per gesture.** A hover scales *or* recolours *or* underlines, never all at once.
4. **Flat.** Scale, opacity, clip and colour only. No shadows appearing, no blur on content, no 3D.
5. **Off when asked.** Under `prefers-reduced-motion: reduce`, every non-essential animation stops (see [Reduced motion](#reduced-motion)).

## Tokens

| Token | Value | Job |
|---|---|---|
| `--mm-motion-duration-quick` | 150ms | nav underline wipe, pill colour |
| `--mm-motion-duration-fast` | 200ms | colour / opacity / border on hover, dropdown reveal, menu colours |
| `--mm-motion-duration-medium` | 250ms | sticker scale, side panel slide and backdrop |
| `--mm-motion-duration-base` | 300ms | FAQ sticker turn, dialogs |
| `--mm-motion-duration-expand` | 350ms | FAQ answer height |
| `--mm-motion-duration-slow` | 500ms | header on scroll, image zoom, image fade-in |
| `--mm-motion-duration-slower` | 1000ms | video poster fade-out |
| `--mm-motion-duration-pulse` | 2000ms | one loading-placeholder cycle |
| `--mm-motion-easing-out` | `cubic-bezier(0, 0, 0.58, 1)` (CSS `ease-out`) | default for reactions |
| `--mm-motion-easing-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` (CSS `ease`) | header, height changes |
| `--mm-motion-easing-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)` | side panels |
| `--mm-motion-easing-pulse` | `cubic-bezier(0.455, 0.03, 0.515, 0.955)` | loading pulse |
| `--mm-motion-scale-hover` | 1.1 | sticker and image zoom |
| `--mm-motion-scroll-threshold` | 60px | header turns solid |

Tailwind v4: `duration-mm-*` is not generated (Tailwind has no duration namespace); use `duration-[var(--mm-motion-duration-medium)]` or the numeric `duration-250`, and `ease-mm-out`, `ease-mm-standard`, `ease-mm-in-out`.

## Hover micro-interactions

### Sticker (arrow link, FAQ toggle)

The filled circle scales up when its link or row is hovered. Use the individual `scale` and `rotate` properties (not `transform`) so the hover scale (250ms) and the FAQ turn (300ms) keep their own timings and can combine.

```css
.mm-sticker { transition: scale var(--mm-motion-duration-medium) var(--mm-motion-easing-out),
                          rotate var(--mm-motion-duration-base) var(--mm-motion-easing-out); }
.mm-arrow-link:hover .mm-sticker, .mm-arrow-link:focus-visible .mm-sticker,
.mm-faq summary:hover .mm-sticker { scale: var(--mm-motion-scale-hover); }
.mm-faq details[open] summary .mm-sticker { rotate: 180deg; }
```

The label does not move or change colour. The whole link is the hover target, including the label.

### Navigation underline wipe

Wherever the horizontal navigation is shown (from 768px; the live site shows it from 992px), header links get a 2px underline in `currentColor` that grows from the left on hover and shrinks to the right on leave.

```css
.mm-nav-link { position: relative; }
.mm-nav-link::after { content: ""; position: absolute; left: 0; bottom: -1px; width: 100%; height: 2px; background: currentColor;
  transform: scaleX(0); transform-origin: 100% 100%; transition: transform var(--mm-motion-duration-quick) var(--mm-motion-easing-out); }
.mm-nav-link:hover::after, .mm-nav-link:focus-visible::after { transform: scaleX(1); transform-origin: 0 0; }
```

The link text stays at full colour; the underline is the only change.

### Image zoom on linked cards

When a card or tile is a link, its image zooms inside the rounded frame.

```css
.mm-frame { overflow: hidden; border-radius: var(--mm-radius-card); }
.mm-frame img { transition: transform var(--mm-motion-duration-slow) var(--mm-motion-easing-out); }
a:hover .mm-frame img { transform: scale(var(--mm-motion-scale-hover)); }
```

Only on cards that are links. Static photos never zoom.

### Colour fades

Pills, chips, footer links, table rows and form controls change colour, background or border over `--mm-motion-duration-fast` (pills `--mm-motion-duration-quick`). Footer links on the live site fade opacity over 500ms; use `fast` for new work.

## Scroll and loading

### Header on scroll

- Before scrolling: transparent over the hero. From 992px the header is `--mm-layout-header-height-desktop` (100px) **plus** `--mm-layout-header-padding-desktop` (1em) above and below.
- After `--mm-motion-scroll-threshold` (60px): the background becomes **solid** in the header's surface colour (black over dark heroes) and the extra padding goes to 0, so the header gets slimmer. Both animate over `--mm-motion-duration-slow` with `--mm-motion-easing-standard`.
- Back at the top (scrollY 0) it returns to transparent.
- Listen to scroll passively and update in `requestAnimationFrame`.

```css
.mm-header { transition: background-color var(--mm-motion-duration-slow) var(--mm-motion-easing-standard); }
.mm-header.is-scrolled { background: var(--mm-color-brand-black); }
@media (min-width: 992px) {
  /* the inner bar is border-box with a min-height, so grow the min-height by the padding, then remove both */
  .mm-header__inner { padding-block: var(--mm-layout-header-padding-desktop);
    min-height: calc(var(--mm-layout-header-height-desktop) + 2 * var(--mm-layout-header-padding-desktop));
    transition: padding var(--mm-motion-duration-slow) var(--mm-motion-easing-standard), min-height var(--mm-motion-duration-slow) var(--mm-motion-easing-standard); }
  .mm-header.is-scrolled .mm-header__inner { padding-block: 0; min-height: var(--mm-layout-header-height-desktop); }
}
```

### Image loading

Images load lazily. Until they arrive, the frame pulses softly; then the image fades in.

```css
.mm-frame { position: relative; }
.mm-frame:not(.is-loaded)::before { content: ""; position: absolute; inset: 0; background: currentColor;
  animation: mm-pulse var(--mm-motion-duration-pulse) var(--mm-motion-easing-pulse) infinite; }
.mm-frame img { opacity: 0; transition: opacity var(--mm-motion-duration-slow) var(--mm-motion-easing-out); }
.mm-frame.is-loaded img { opacity: 1; }
@keyframes mm-pulse { 0%, 100% { opacity: var(--mm-opacity-placeholder-min); } 50% { opacity: var(--mm-opacity-placeholder-max); } }
```

Set `is-loaded` from the image's `load` event (or `img.complete`). Hero images load eagerly and are not faded.

## Opening and closing

| Element | Motion | Duration / easing |
|---|---|---|
| **FAQ answer** | height from 0 to auto | `expand` (350ms), `standard` |
| **FAQ sticker** | glyph swaps plus → minus and turns 180° (`rotate`, separate from the hover `scale`) | `base` (300ms) |
| **Dropdown** (navigation sub-menus, selects) | reveals top-down: `clip-path: inset(0 0 100% 0)` → `inset(0)`; reverse on close | `fast` (200ms) |
| **Side panel** (tile details: person, startup) | slides in from the right (`translateX(100%)` → 0); backdrop fades in with `backdrop-filter: blur(5px) brightness(79%)` | `medium` (250ms), `in-out` |
| **Mobile menu** | full-screen black overlay, shown instantly; colours change over `fast` | no slide |
| **Video poster** | fades out when playback starts | `slower` (1s) |
| **Dialog** | settles from a slight offset (`transform` to none) | `base`, `out` |

For the FAQ height with native `<details>`, use `interpolate-size: allow-keywords` with a `height` transition on `::details-content` where supported, and let it open instantly elsewhere. Never animate with JavaScript-measured heights if CSS can do it.

## Not adopted

- **Partner logo marquee.** The live site runs partner logos as an endless horizontal strip. The design system keeps a static [logo grid](13-web-components.md#logo-grid-partners). Decision 2026-10-07.
- Scroll-triggered entrance animations, parallax, page transitions: not used on the live site, not part of the brand.
- Lottie: the live site loads a Lottie player but the pages read on 2026-10-07 used none. Do not add Lottie animations without a brand decision.

## Reduced motion

Required for every Manage and More screen (decision 2026-10-07; stricter than the live site, which only stops navigation motion):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation: none !important; scroll-behavior: auto !important; }
}
```

- Hover scale and image zoom: off. Colour changes may stay (they are instant).
- Header: switches instantly at the threshold.
- Loading placeholder: static at `--mm-opacity-placeholder-min`; images appear without fading.
- FAQ, dropdowns, side panels: open and close instantly.
- Background video: replaced by its poster image. Do not autoplay video.
- Keep focus indicators visible in all cases.
