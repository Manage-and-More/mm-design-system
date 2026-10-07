# Assets

Every file here is listed with a description, approved backgrounds and its source in [`catalog.json`](catalog.json). Query it instead of guessing file names:

```bash
jq -r '.assets[] | select(.kind=="icon" and (.path|endswith(".svg"))) | .path' assets/catalog.json
```

| Folder | Contents | Rules |
|---|---|---|
| [`logo/`](logo/svg/) | 4 logo versions + symbol in 3 colours; SVG and PNG | [02-logo](../guidelines/02-logo.md) |
| [`labels/`](labels/svg/) | BY UNTERNEHMERTUM label and descriptor lock-ups | [03-endorsement-labels](../guidelines/03-endorsement-labels.md) |
| [`icons/`](icons/svg/) | 16 monoline icons from the PDF; SVG (currentColor), PNG blue/black. [`icons/web/`](icons/web/): 36 pictograms from the live website | [06-iconography](../guidelines/06-iconography.md) |
| [`ui/`](ui/svg/) | UI glyphs from the website: arrows, check, plus, quote, LinkedIn (currentColor) | [06-iconography](../guidelines/06-iconography.md#ui-glyphs-adopted-from-the-website), [13-web-components](../guidelines/13-web-components.md) |
| [`illustrations/`](illustrations/png/) | 4 line-art illustrations | [07-illustration](../guidelines/07-illustration.md) |
| [`infographics/`](infographics/png/) | chart style examples | [08-infographics](../guidelines/08-infographics.md) |
| [`photography/`](photography/) | reference photos by topic, tint examples; `website/` = Manage and More's own photos from manageandmore.de | [09-photography](../guidelines/09-photography.md) |
| [`fonts/work-sans/`](fonts/work-sans/) | Work Sans WOFF2 + TTF, `work-sans.css`, OFL licence (fallback; Sharp Sans is licensed but kept in the website repo) | [05-typography](../guidelines/05-typography.md) |

Vector files were extracted from the guideline PDF with [`scripts/extract/extract_pdf.py`](../scripts/extract/extract_pdf.py) and are exact. Files whose catalogue `source` starts with "derived" were colour-swapped or generated here; files whose `source` starts with "manage-and-more-website" were copied from the website repo.
