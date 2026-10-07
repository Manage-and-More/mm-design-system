#!/usr/bin/env python3
"""Re-extract brand assets from the canonical guideline PDF.

Usage:  python3 scripts/extract/extract_pdf.py source/MM_CI.pdf
Requires: pip install pymupdf pillow

Everything this script writes is reproducible from the PDF. Coordinates are
PDF points on the 1920x1080 pt pages. If the PDF is replaced by a new
revision, re-check the clip rectangles below against the page renders.
"""
import io, os, re, sys
from pathlib import Path

import pymupdf
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
import pdfvec  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
BLUE, BLACK, WHITE = "#00A2CD", "#000000", "#FFFFFF"


def write(path, data):
    path = ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "w" if isinstance(data, str) else "wb"
    with open(path, mode) as f:
        f.write(data)
    print("wrote", path.relative_to(ROOT))


def svg_to_png(svg_path, png_path, width):
    doc = pymupdf.open(ROOT / svg_path)
    page = doc[0]
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    (ROOT / png_path).parent.mkdir(parents=True, exist_ok=True)
    pix.save(ROOT / png_path)
    print("wrote", png_path)


def crop_svg(page, rect, title):
    """Whole-page SVG (keeps clipping, dashes, gradients) cropped to rect."""
    svg = page.get_svg_image(text_as_path=True)
    r = pymupdf.Rect(rect)
    svg = re.sub(r'<svg([^>]*?)width="[^"]*"', rf'<svg\1width="{r.width:.0f}"', svg, count=1)
    svg = re.sub(r'(<svg[^>]*?)height="[^"]*"', rf'\1height="{r.height:.0f}"', svg, count=1)
    svg = re.sub(r'(<svg[^>]*?)viewBox="[^"]*"', rf'\1viewBox="{r.x0:.1f} {r.y0:.1f} {r.width:.1f} {r.height:.1f}"', svg, count=1)
    svg = svg.replace(">", f"><title>{title}</title>", 1) if "<title>" not in svg else svg
    return svg


def derive(src, dst, cmap, png_width):
    """Write a colour-swapped copy of an extracted SVG (plus PNG)."""
    svg = (ROOT / src).read_text()
    svg = re.sub(r'(fill|stroke)="(#[0-9A-F]{6})"',
                 lambda m: f'{m.group(1)}="{cmap.get(m.group(2), m.group(2))}"', svg)
    write(dst, svg)
    svg_to_png(dst, dst.replace("/svg/", "/png/").replace(".svg", ".png"), png_width)


def logos(doc):
    page = doc[10]  # p.11 "Farboptionen": blue symbol + black wordmark on white
    drs = pdfvec.drawings_in(page, (1280, 0, 1920, 540))
    symbol = [d for d in drs if pdfvec.hexc(d["fill"]) == BLUE]
    word = [d for d in drs if pdfvec.hexc(d["fill"]) == BLACK]
    variants = {
        # name: (symbol colour, wordmark colour)
        "mm-logo-primary": (BLUE, BLACK),        # on white / light backgrounds
        "mm-logo-primary-on-dark": (BLUE, WHITE),  # on black / dark backgrounds
        "mm-logo-black": (BLACK, BLACK),
        "mm-logo-white": (WHITE, WHITE),          # on brand blue or photos
    }
    for name, (sc, wc) in variants.items():
        for d in symbol:
            d["_c"] = sc
        for d in word:
            d["_c"] = wc
        svg, _ = pdfvec.to_svg(symbol + word, colormap=None, title="Manage and More logo",
                               fill_override="_c")
        write(f"assets/logo/svg/{name}.svg", svg)
        svg_to_png(f"assets/logo/svg/{name}.svg", f"assets/logo/png/{name}.png", 1200)
    for name, c in {"mm-symbol-blue": BLUE, "mm-symbol-black": BLACK, "mm-symbol-white": WHITE}.items():
        for d in symbol:
            d["_c"] = c
        svg, _ = pdfvec.to_svg(symbol, title="Manage and More symbol", fill_override="_c")
        write(f"assets/logo/svg/{name}.svg", svg)
        svg_to_png(f"assets/logo/svg/{name}.svg", f"assets/logo/png/{name}.png", 512)


def labels(doc):
    page = doc[12]  # p.13 "Logo Label"
    specs = {
        "by-unternehmertum-label-black": (674, 757, 907, 989),
        "by-unternehmertum-label-outline-black": (973, 756, 1206, 989),
        "by-unternehmertum-label-blue": (1272, 756, 1505, 989),
    }
    for name, clip in specs.items():
        drs = pdfvec.drawings_in(page, pymupdf.Rect(clip) + (-2, -2, 2, 2), skip_bg=False)
        svg, _ = pdfvec.to_svg(drs, title="BY UNTERNEHMERTUM logo label")
        write(f"assets/labels/svg/{name}.svg", svg)
        svg_to_png(f"assets/labels/svg/{name}.svg", f"assets/labels/png/{name}.png", 600)
    # white variants derived from the black ones (the PDF permits a white label)
    for src, dst, cmap in [
        ("by-unternehmertum-label-black", "by-unternehmertum-label-white", {BLACK: WHITE, WHITE: BLACK}),
        ("by-unternehmertum-label-outline-black", "by-unternehmertum-label-outline-white", {BLACK: WHITE, WHITE: "none"}),
    ]:
        derive(f"assets/labels/svg/{src}.svg", f"assets/labels/svg/{dst}.svg", cmap, 600)

    page = doc[14]  # p.15 "Deskriptor Label": descriptor + logo label lock-ups
    rows = {
        # name: descriptor style + logo label style, as shown on the page
        "descriptor-lockup-outline-black": (672, 312, 1035, 426),        # both outline, black
        "descriptor-lockup-outline-label-black": (672, 435, 1035, 549),  # outline descriptor, solid black label
        "descriptor-lockup-solid-black": (672, 558, 1035, 672),          # solid black descriptor, outline label
        "descriptor-lockup-label-blue": (1122, 312, 1484, 426),          # outline descriptor, solid blue label
        "descriptor-lockup-solid-blue": (1122, 435, 1484, 549),          # solid blue descriptor, outline label
    }
    for name, clip in rows.items():
        drs = pdfvec.drawings_in(page, pymupdf.Rect(clip) + (-3, -3, 3, 3), skip_bg=False)
        if not drs:
            continue
        svg, _ = pdfvec.to_svg(drs, title="ENTREPRENEURIAL EDUCATION descriptor label + BY UNTERNEHMERTUM logo label")
        write(f"assets/labels/svg/{name}.svg", svg)
        svg_to_png(f"assets/labels/svg/{name}.svg", f"assets/labels/png/{name}.png", 900)
    # white outline lock-up for blue or black footers (PDF p.37 shows it on a blue footer)
    derive("assets/labels/svg/descriptor-lockup-outline-black.svg",
           "assets/labels/svg/descriptor-lockup-outline-white.svg", {BLACK: WHITE, WHITE: "none"}, 900)


ICON_NAMES = [
    ["globe", "signpost", "map", "rocket"],
    ["health", "money", "network", "education"],
    ["calendar", "tools", "connected-car", "robot-arm"],
    ["team", "building", "technology", "chat"],
]


def icons(doc):
    page = doc[21]  # p.22 "Icons": 4x4 grid in the right 2/3 of the page
    x0, y0, w, h = 673.3, 0, (1920 - 673.3) / 4, 1080 / 4
    for r, row in enumerate(ICON_NAMES):
        for c, name in enumerate(row):
            clip = pymupdf.Rect(x0 + c * w, y0 + r * h, x0 + (c + 1) * w, y0 + (r + 1) * h)
            drs = [d for d in pdfvec.drawings_in(page, clip) if d["rect"].width < w * 0.9]
            if not drs:
                print("no icon at", name)
                continue
            for d in drs:
                d["_c"] = "currentColor"
            svg, _ = pdfvec.to_svg(drs, title=f"{name} icon", fill_override="_c", pad=2)
            write(f"assets/icons/svg/{name}.svg", svg)
            for color, suffix in [(BLUE, "blue"), (BLACK, "black")]:
                tmp = svg.replace("currentColor", color)
                write(f"assets/icons/svg/.tmp.svg", tmp)
                svg_to_png("assets/icons/svg/.tmp.svg", f"assets/icons/png/{name}-{suffix}.png", 256)
            os.remove(ROOT / "assets/icons/svg/.tmp.svg")


def illustrations(doc):
    specs = {
        "illustration-ufo-on-black": (22, (960, 0, 1920, 1080)),
        "illustration-city-port": (24, (860, 225, 1825, 865)),
        "illustration-idea-head-on-yellow": (25, (0, 0, 960, 1080)),
        "illustration-wind-tower": (25, (1090, 240, 1820, 845)),
        "infographics-examples": (23, (650, 80, 1880, 1000)),
    }
    for name, (pno, rect) in specs.items():
        folder = "infographics" if name.startswith("infographics") else "illustrations"
        write(f"assets/{folder}/svg/{name}.svg", crop_svg(doc[pno], rect, name.replace("-", " ")))
        pix = doc[pno].get_pixmap(clip=pymupdf.Rect(rect), matrix=pymupdf.Matrix(1.5, 1.5))
        (ROOT / f"assets/{folder}/png").mkdir(parents=True, exist_ok=True)
        pix.save(ROOT / f"assets/{folder}/png/{name}.png")


PHOTO_PAGES = {1: "cover", 27: "principles", 28: "people", 29: "events", 30: "startups",
               31: "tech", 32: "toning", 40: "merchandise"}


def photos(doc):
    for pno, topic in PHOTO_PAGES.items():
        page = doc[pno - 1]
        seen = set()
        for i, info in enumerate(page.get_images(full=True)):
            xref = info[0]
            if xref in seen:
                continue
            seen.add(xref)
            img = pymupdf.Pixmap(doc, xref)
            if img.alpha or img.n not in (1, 3):
                img = pymupdf.Pixmap(pymupdf.csRGB, img) if img.n not in (1, 3) else img
            pil = Image.open(io.BytesIO(img.tobytes("png"))).convert("RGB")
            if min(pil.size) < 300:
                continue
            pil.thumbnail((1600, 1600))
            buf = io.BytesIO()
            pil.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
            write(f"assets/photography/{topic}/{topic}-{len(seen):02d}.jpg", buf.getvalue())


def pages(doc):
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(0.75, 0.75))
        pil = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        buf = io.BytesIO()
        pil.save(buf, "JPEG", quality=78, optimize=True, progressive=True)
        write(f"source/pages/page-{i:02d}.jpg", buf.getvalue())
    write("source/MM_CI.txt", "\n\f".join(p.get_text() for p in doc))


if __name__ == "__main__":
    pdf = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "source/MM_CI.pdf")
    doc = pymupdf.open(pdf)
    which = sys.argv[2:] or ["logos", "labels", "icons", "illustrations", "photos", "pages"]
    for step in which:
        globals()[step](doc)
