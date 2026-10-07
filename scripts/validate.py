#!/usr/bin/env python3
"""Check that the design system is internally consistent. Run before every commit.

  python3 scripts/validate.py

Checks:
  1. every file under assets/ is listed in assets/catalog.json and every entry exists
  2. tokens/build/* is up to date with tokens/tokens.json
  3. every relative link and image in *.md files resolves
  4. every guidelines/*.md page has front matter with title, summary, status
  5. every SVG under assets/ is well-formed XML
"""
import json, re, subprocess, sys
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
errors = []

# 1. catalog coverage
catalog = json.loads((ROOT / "assets/catalog.json").read_text())
listed = {e["path"] for e in catalog["assets"]}
on_disk = {str(p.relative_to(ROOT)) for p in (ROOT / "assets").rglob("*")
           if p.is_file() and p.name not in ("catalog.json", "README.md") and not p.name.startswith(".")}
for p in sorted(on_disk - listed):
    errors.append(f"assets/catalog.json: missing entry for {p}")
for p in sorted(listed - on_disk):
    errors.append(f"assets/catalog.json: entry points to missing file {p}")
for e in catalog["assets"]:
    for key in ("path", "kind", "description", "source"):
        if not e.get(key):
            errors.append(f"assets/catalog.json: {e.get('path')} lacks '{key}'")

# 2. tokens
r = subprocess.run([sys.executable, str(ROOT / "scripts/build_tokens.py"), "--check"], capture_output=True, text=True)
if r.returncode:
    errors.append(r.stderr.strip() or r.stdout.strip())

# 3. markdown links
link_re = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)\)")
for md in ROOT.rglob("*.md"):
    if ".git" in md.parts or "node_modules" in md.parts:
        continue
    text = re.sub(r"```.*?```", "", md.read_text(), flags=re.S)
    for target in link_re.findall(text):
        if re.match(r"^(https?:|mailto:|#)", target):
            continue
        path = target.split("#")[0]
        if path and not (md.parent / path).resolve().exists():
            errors.append(f"{md.relative_to(ROOT)}: broken link {target}")

# 4. front matter
for md in sorted((ROOT / "guidelines").glob("[0-9s]*.md")):
    head = md.read_text().split("---")
    if len(head) < 3 or not md.read_text().startswith("---"):
        errors.append(f"{md.relative_to(ROOT)}: missing front matter")
        continue
    for key in ("title:", "summary:", "status:"):
        if key not in head[1]:
            errors.append(f"{md.relative_to(ROOT)}: front matter lacks {key[:-1]}")

# 5. SVGs
for svg in (ROOT / "assets").rglob("*.svg"):
    try:
        ElementTree.parse(svg)
    except ElementTree.ParseError as ex:
        errors.append(f"{svg.relative_to(ROOT)}: invalid SVG ({ex})")

if errors:
    print("\n".join(errors))
    sys.exit(f"\n{len(errors)} problem(s) found")
print(f"OK: {len(listed)} assets catalogued, tokens up to date, links and SVGs valid")
