# Brand v2 assets

The Manage and More identity in the **Brand v2 blue `#0071E3`** (`#2997FF` on dark surfaces), for the tech products: hackathon platform, CRM, SaaS ([guidelines/15-brand-v2.md](../../guidelines/15-brand-v2.md)). Same sub-folders and file names as [`assets/`](../README.md), so a project switches brand by switching the folder.

**Generated.** Do not edit these files; run `python3 scripts/build_v2_assets.py` after changing a source asset in `assets/`. What is here:

| Folder | Files |
|---|---|
| `logo/` | the logo versions and the symbol with the swirl in `#0071E3` (`-on-dark` files in `#2997FF`), SVG and PNG |
| `labels/` | every BY UNTERNEHMERTUM label and descriptor lock-up; the blue ones recoloured, the black/white outline ones copied unchanged |
| `illustrations/`, `infographics/` | the line-art illustrations and chart examples with the blue in `#0071E3`; Brand v2 has **no accent colour**, so yellow grounds became the parchment tile `#ECECEF` and yellow chart series the blue tint `#BFDBFF` |
| `icons/png/` | the blue icon PNGs; the SVGs in `assets/icons/svg/` use `currentColor` and need no copy |
| `photography/toning/` | the blue-tint examples re-tinted (`scripts/tint_photo.py --blue #0071E3`) |

Everything without blue (black and white logos, `currentColor` icons and UI glyphs, photos, fonts) is shared: take it from `assets/`. In the catalogue every entry carries `brand: "v1"` or `"v2"`:

```bash
jq -r '.assets[] | select(.brand=="v2" and .kind=="logo") | .path' assets/catalog.json
```

The programme brand (manageandmore.de, print, the scholarship) stays Brand v1 in `assets/`. Never mix the two blues on one surface.
