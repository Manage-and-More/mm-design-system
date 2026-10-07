#!/usr/bin/env python3
"""Apply the brand photo treatments from the guideline (PDF p.32).

Usage:
  python3 scripts/tint_photo.py IN.jpg OUT.jpg            # blue tint (brand colour)
  python3 scripts/tint_photo.py IN.jpg OUT.jpg --mode bw  # black and white
Requires: pip install pillow

The tint maps the photo's luminance from black (shadows) to brand blue
#00A2CD (highlights), which matches the toned examples in the PDF. Use
tinted and B/W photos as highlights only, and only for calm images with
few details.
"""
import argparse
from PIL import Image, ImageOps, ImageEnhance

BLUE = "#00A2CD"

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("dst")
ap.add_argument("--mode", choices=["blue", "bw"], default="blue")
args = ap.parse_args()

img = Image.open(args.src).convert("RGB")
gray = ImageOps.autocontrast(ImageOps.grayscale(img), cutoff=1)
if args.mode == "bw":
    out = ImageEnhance.Contrast(gray).enhance(1.1).convert("RGB")
else:
    out = ImageOps.colorize(gray, black="#000000", white="#7FD6EE", mid=BLUE)
out.save(args.dst, quality=85, optimize=True)
print("wrote", args.dst)
