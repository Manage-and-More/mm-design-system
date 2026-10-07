# Contributing: extending the design system

The design system grows as more of the brand is discovered (new templates, a new guideline PDF, decisions by the brand owner, the live website). The website repo `manage-and-more-website` is the adopted standard for screens: keep the two in sync. This file explains where each kind of knowledge goes, so humans and agents add it the same way.

## Where things go

| You found… | Put it in | Also |
|---|---|---|
| A new or changed rule | the matching `guidelines/NN-*.md` page, with its source in brackets | `CHANGELOG.md` |
| A new topic (e.g. motion, social media templates) | a new `guidelines/NN-topic.md` with front matter (`title`, `summary`, `source`, `status`) | add it to `guidelines/README.md` and the table in `AGENTS.md` |
| A colour, size or other value | `tokens/tokens.json` with `$description` and `$extensions.mm.source` | run `python3 scripts/build_tokens.py` |
| A logo, icon, illustration, photo, template file | the matching `assets/<category>/` folder, SVG preferred, lowercase-kebab-case names | add an entry to `assets/catalog.json` |
| A conflict between sources | `guidelines/sources-and-discrepancies.md` | log the decision once the brand owner decides |
| A change to the website theme (`src/styles/theme.css`) or a component | `tokens/tokens.json` and `guidelines/13-web-components.md` (source `website <file>`) | if it breaks a rule or WCAG AA, add it to "Website fixes" instead of adopting it |
| A UI glyph from the website | `assets/ui/svg/` | catalogue kind `ui-glyph` |
| A newer guideline PDF | replace or add under `source/`, re-run `scripts/extract/extract_pdf.py` | re-check clip coordinates in the script; diff the guidelines |
| Something the skill should know | `skills/manage-and-more-brand/SKILL.md` (keep it short; link to guidelines) | |

## Status labels

- `canonical`: from the official guideline PDF.
- `adopted`: taken from the manageandmore.de codebase and approved as the screen standard. Mark the website file as the source. Overrides `canonical` only for screens.
- `derived`: added here (e.g. accessibility shades). Mark inline as *(derived)*.
- `observed`: seen in the wild (social media, events) but not approved. Never overrides `canonical` or `adopted`.

## Catalogue entry format

```json
{
  "path": "assets/icons/svg/lightbulb.svg",
  "kind": "icon",
  "description": "Lightbulb line icon. Uses currentColor.",
  "source": "brand team, 2026-11 icon extension",
  "use_on": ["white", "black", "blue"],
  "tags": ["icon", "idea"]
}
```

`kind` is one of: logo, symbol, label, lockup, icon, ui-glyph, illustration, infographic, photo, font, license. Add new kinds if needed and document them in the catalogue's `$description`.

## Before you commit

```bash
python3 scripts/build_tokens.py
python3 scripts/validate.py
```

Then add a line to `CHANGELOG.md` under "Unreleased".

## Naming

- Files: lowercase, kebab-case, `<brand>-<thing>-<variant>.<ext>` (e.g. `mm-logo-primary-on-dark.svg`).
- Tokens: `category.group.name` (`color.brand.blue`), output as `--mm-color-brand-blue`.
- Guideline pages: two-digit prefix for reading order.
