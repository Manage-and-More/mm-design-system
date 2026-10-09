#!/usr/bin/env python3
"""Build assets/v2/: the Brand v2 versions of every asset that carries the brand blue.

  python3 scripts/build_v2_assets.py

Brand v1 (the programme, manageandmore.de) keeps assets/ as it is, in #00A2CD. Brand v2 (tech
products: hackathon platform, CRM, SaaS; guidelines/15-brand-v2.md) uses one blue, #0071E3
(#2997FF on dark surfaces). This script mirrors into assets/v2/, with the same sub-folders and
file names, every file that contains the blue:

  - SVGs under logo/, labels/, illustrations/, infographics/ with #00A2CD swapped for #0071E3
    (files whose name ends in -on-dark get #2997FF), and their PNGs re-rendered at the Brand v1 sizes;
    Brand v2 has no accent colour, so the yellow #FFED00 becomes the parchment tile #ECECEF in
    illustrations and the blue tint #BFDBFF in the chart examples
  - the blue icon PNGs under icons/png/, re-rendered from the currentColor SVGs
  - the blue-tint photo examples under photography/toning/, re-tinted with scripts/tint_photo.py
  - the label and lock-up files that have no blue (outline black/white, solid black) are copied as
    they are, so a Brand v2 project can take everything from assets/v2/ without looking back

Then it writes assets/v2/README.md and updates assets/catalog.json: every Brand v1 entry gets
"brand": "v1", every generated file an entry with "brand": "v2". Re-run after changing any source
asset. Needs ImageMagick (`magick identify`) for sizes, Node + playwright-core (see scripts/render_svg.mjs) for the
PNGs and Pillow for the tints.
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
A = ROOT / "assets"
V2 = A / "v2"
V1_BLUE, V2_BLUE, V2_BLUE_DARK = "#00A2CD", "#0071E3", "#2997FF"
BLUE_RE = re.compile(re.escape(V1_BLUE), re.I)
# Brand v2 has no accent colour: yellow grounds become the parchment tile, yellow chart series the blue tint
YELLOW_RE = re.compile(r"#FFE[CD]00", re.I)
YELLOW_TO = {"illustrations": "#ECECEF", "infographics": "#BFDBFF"}

catalog = json.loads((A / "catalog.json").read_text())
by_path = {e["path"]: e for e in catalog["assets"]}
made = []  # (v2 path, v1 path, note)


def v2_entry(v1_path, v2_path, note):
    src = by_path[v1_path]
    e = {k: v for k, v in src.items() if k != "path"}
    e["path"] = v2_path
    e["brand"] = "v2"
    e["description"] = f"Brand v2 ({V2_BLUE}): {src['description']}"
    e["source"] = f"derived (scripts/build_v2_assets.py from {v1_path}; {note})"
    return e


def png_size(path):
    out = subprocess.run(["magick", "identify", "-format", "%w %h", str(path)], capture_output=True, text=True, check=True).stdout
    return tuple(int(x) for x in out.split()[:2])


def render(svg, png, width):
    """Rasterise an SVG to `width` pixels wide in a real browser (scripts/render_svg.mjs): the
    illustrations carry CSS <style> blocks that ImageMagick's own SVG renderer ignores."""
    png.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["node", str(ROOT / "scripts/render_svg.mjs"), str(svg), str(png), str(width)], check=True)


def write(v2_path: Path, text: str):
    v2_path.parent.mkdir(parents=True, exist_ok=True)
    v2_path.write_text(text)


# 1. vector files with the blue, plus the blue-free labels/lock-ups (copied), and their PNGs
for folder in ("logo", "labels", "illustrations", "infographics"):
    for svg in sorted((A / folder / "svg").glob("*.svg")):
        text = svg.read_text()
        has_blue, has_yellow = bool(BLUE_RE.search(text)), bool(YELLOW_RE.search(text)) and folder in YELLOW_TO
        if not (has_blue or has_yellow) and folder not in ("labels", "logo"):
            continue
        blue = V2_BLUE_DARK if svg.stem.endswith("-on-dark") else V2_BLUE
        new = BLUE_RE.sub(blue, text)
        notes = [f"{V1_BLUE} -> {blue}"] if has_blue else []
        if has_yellow:
            new = YELLOW_RE.sub(YELLOW_TO[folder], new)
            notes.append(f"yellow -> {YELLOW_TO[folder]} (no accent colour in Brand v2)")
        out = V2 / folder / "svg" / svg.name
        write(out, new if notes else text)
        rel1, rel2 = svg.relative_to(ROOT).as_posix(), out.relative_to(ROOT).as_posix()
        made.append((rel2, rel1, "; ".join(notes) if notes else "no blue in the file; copied unchanged"))
        png1 = A / folder / "png" / (svg.stem + ".png")
        if png1.exists():
            png2 = V2 / folder / "png" / png1.name
            render(out, png2, png_size(png1)[0])
            made.append((png2.relative_to(ROOT).as_posix(), png1.relative_to(ROOT).as_posix(), f"re-rendered from the Brand v2 SVG at {png_size(png1)[0]}px"))

# 2. blue icon PNGs from the currentColor SVGs
for png1 in sorted((A / "icons/png").glob("*-blue.png")):
    svg = A / "icons/svg" / (png1.stem[: -len("-blue")] + ".svg")
    if not svg.exists():
        print("skip, no svg for", png1.name, file=sys.stderr)
        continue
    tmp = V2 / "icons/png" / (svg.stem + ".tmp.svg")
    write(tmp, svg.read_text().replace("currentColor", V2_BLUE))
    render(tmp, V2 / "icons/png" / png1.name, png_size(png1)[0])
    tmp.unlink()
    made.append(((V2 / "icons/png" / png1.name).relative_to(ROOT).as_posix(), png1.relative_to(ROOT).as_posix(), f"rendered in {V2_BLUE}"))

# 3. blue-tint photo examples
for tint in sorted((A / "photography/toning").glob("*-blue-tint.jpg")):
    src = tint.with_name(tint.name.replace("-blue-tint", ""))
    out = V2 / "photography/toning" / tint.name
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([sys.executable, str(ROOT / "scripts/tint_photo.py"), str(src), str(out), "--blue", V2_BLUE], check=True, capture_output=True)
    made.append((out.relative_to(ROOT).as_posix(), tint.relative_to(ROOT).as_posix(), f"re-tinted with scripts/tint_photo.py --blue {V2_BLUE}"))

# 4. catalogue
for e in catalog["assets"]:
    if not e["path"].startswith("assets/v2/"):
        e.setdefault("brand", "v1")
catalog["assets"] = [e for e in catalog["assets"] if not e["path"].startswith("assets/v2/")]
for v2p, v1p, note in made:
    catalog["assets"].append(v2_entry(v1p, v2p, note))
catalog["$description"] = re.sub(r"\s*brand: .*$", "", catalog["$description"]) + ' brand: "v1" = the programme brand (assets/, #00A2CD), "v2" = Brand v2 for tech products (assets/v2/, #0071E3; built by scripts/build_v2_assets.py).'
(A / "catalog.json").write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")

# 5. README
(V2 / "README.md").write_text(f"""# Brand v2 assets

The Manage and More identity in the **Brand v2 blue `{V2_BLUE}`** (`{V2_BLUE_DARK}` on dark surfaces), for the tech products: hackathon platform, CRM, SaaS ([guidelines/15-brand-v2.md](../../guidelines/15-brand-v2.md)). Same sub-folders and file names as [`assets/`](../README.md), so a project switches brand by switching the folder.

**Generated.** Do not edit these files; run `python3 scripts/build_v2_assets.py` after changing a source asset in `assets/`. What is here:

| Folder | Files |
|---|---|
| `logo/` | the logo versions and the symbol with the swirl in `{V2_BLUE}` (`-on-dark` files in `{V2_BLUE_DARK}`), SVG and PNG |
| `labels/` | every BY UNTERNEHMERTUM label and descriptor lock-up; the blue ones recoloured, the black/white outline ones copied unchanged |
| `illustrations/`, `infographics/` | the line-art illustrations and chart examples with the blue in `{V2_BLUE}`; Brand v2 has **no accent colour**, so yellow grounds became the parchment tile `#ECECEF` and yellow chart series the blue tint `#BFDBFF` |
| `icons/png/` | the blue icon PNGs; the SVGs in `assets/icons/svg/` use `currentColor` and need no copy |
| `photography/toning/` | the blue-tint examples re-tinted (`scripts/tint_photo.py --blue {V2_BLUE}`) |

Everything without blue (black and white logos, `currentColor` icons and UI glyphs, photos, fonts) is shared: take it from `assets/`. In the catalogue every entry carries `brand: "v1"` or `"v2"`:

```bash
jq -r '.assets[] | select(.brand=="v2" and .kind=="logo") | .path' assets/catalog.json
```

The programme brand (manageandmore.de, print, the scholarship) stays Brand v1 in `assets/`. Never mix the two blues on one surface.
""")
print(f"wrote {len(made)} files under assets/v2/ and updated assets/catalog.json")
