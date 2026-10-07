---
title: Iconography
summary: The corporate line-icon set, its style and colour rules.
source: Brand Guideline PDF p.22
status: canonical
assets: assets/icons/
---

# Iconography

![Icons](../source/pages/page-22.jpg)

Like typography, consistent icons and infographics build recognition. All sub-brands receive the corporate icons in **black, white and their corporate colour** (Manage and More: blue). The set is extended over time.

## Style

- **Monoline outline icons**: one even stroke weight, square/flat stroke ends, mostly right angles and full circles, built on a square icon grid (PDF p.22 shows the grid).
- No fills except small solid details (dots, the centre of a coin).
- One colour per icon: black, white or blue. Never multicolour, never gradients.
- Icons sit on white, black or blue surfaces; blue icons on white, white icons on blue or black, black icons on white or yellow.

## Files

16 icons, extracted as vectors from PDF p.22. The SVGs use `currentColor`, so they inherit the text colour in HTML. PNGs are 256px in blue and black.

| Name | SVG | | Name | SVG |
|---|---|---|---|---|
| globe | [svg](../assets/icons/svg/globe.svg) | | calendar | [svg](../assets/icons/svg/calendar.svg) |
| signpost | [svg](../assets/icons/svg/signpost.svg) | | tools | [svg](../assets/icons/svg/tools.svg) |
| map | [svg](../assets/icons/svg/map.svg) | | connected-car | [svg](../assets/icons/svg/connected-car.svg) |
| rocket | [svg](../assets/icons/svg/rocket.svg) | | robot-arm | [svg](../assets/icons/svg/robot-arm.svg) |
| health | [svg](../assets/icons/svg/health.svg) | | team | [svg](../assets/icons/svg/team.svg) |
| money | [svg](../assets/icons/svg/money.svg) | | building | [svg](../assets/icons/svg/building.svg) |
| network | [svg](../assets/icons/svg/network.svg) | | technology | [svg](../assets/icons/svg/technology.svg) |
| education | [svg](../assets/icons/svg/education.svg) | | chat | [svg](../assets/icons/svg/chat.svg) |

The names are descriptive names given in this repo; the PDF does not name the icons.

## When an icon is missing *(derived)*

The corporate set is small. When you need another icon, use an open-source monoline set that matches the style (square caps, geometric, even stroke), and keep the stroke weight visually equal to the brand icons. **[Tabler Icons](https://tabler.io/icons)** or **Lucide** with `stroke-width` ≈ 2 at 24px, `stroke-linecap="square"`, `stroke-linejoin="miter"` come closest. Don't mix filled and outline styles. Add new brand-approved icons to `assets/icons/svg/` and to `assets/catalog.json`.

```html
<span style="color: var(--mm-color-brand-blue)">
  <!-- inline the SVG so currentColor applies -->
</span>
```

## UI glyphs *(adopted from the website)*

Small functional marks for controls are a separate set from the brand pictograms above. They come from the website's components and live in [`assets/ui/svg/`](../assets/ui/svg/) (catalogue kind `ui-glyph`):

| Glyph | File | Used in |
|---|---|---|
| Arrow right / left | [arrow-right](../assets/ui/svg/arrow-right.svg), [arrow-left](../assets/ui/svg/arrow-left.svg) | arrow link, carousel controls |
| Check | [check](../assets/ui/svg/check.svg) | requirement and highlight lists |
| Plus | [plus](../assets/ui/svg/plus.svg) | FAQ toggle (rotates 45° to close) |
| Quote | [quote](../assets/ui/svg/quote.svg) | under testimonial quotes, ~75px wide |
| LinkedIn | [linkedin](../assets/ui/svg/linkedin.svg) | person and alumni cards (third-party mark) |

- 24px grid, stroke `--mm-stroke-ui` (2px; 1.5px inside small filled circles), **round caps and joins**, `currentColor`. Round ends set them apart from the square-ended brand icons; do not mix the two styles in one component.
- Usually inside a circle: 44px with a 1px `currentColor` border (arrow link, carousel), 32px (FAQ), or a filled 30px circle (portfolio tiles, testimonial controls).
- Decorative glyphs get `aria-hidden`; the control carries the `aria-label`. See [13-web-components.md](13-web-components.md).
