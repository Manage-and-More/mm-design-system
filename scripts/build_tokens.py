#!/usr/bin/env python3
"""Build platform token files from tokens/tokens.json.

Usage:  python3 scripts/build_tokens.py          # write files
        python3 scripts/build_tokens.py --check  # fail if outputs are stale

Outputs (do not edit by hand):
  tokens/build/tokens.css          CSS custom properties  (--mm-*)
  tokens/build/tokens.scss         SCSS variables         ($mm-*)
  tokens/build/tokens.flat.json    {"color.brand.blue": "#00A2CD", ...}
  tokens/build/tailwind.preset.js  Tailwind CSS v3 preset (theme.extend)
  tokens/build/tailwind.theme.css  Tailwind CSS v4 @theme block (standalone, literal values)
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tokens/tokens.json"
OUT = ROOT / "tokens/build"
HEADER = "Generated from tokens/tokens.json by scripts/build_tokens.py. Do not edit."


def flatten(node, path=()):
    for k, v in node.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict) and "$value" in v:
            yield ".".join(path + (k,)), v
        elif isinstance(v, dict):
            yield from flatten(v, path + (k,))


def resolve(value, flat):
    if isinstance(value, str):
        m = re.fullmatch(r"\{([^}]+)\}", value)
        if m:
            return resolve(flat[m.group(1)]["$value"], flat)
    return value


def css_value(v, type_=None):
    if type_ == "cubicBezier":
        return f"cubic-bezier({', '.join(str(x) for x in v)})"
    if isinstance(v, list):
        return ", ".join(f'"{x}"' if " " in x else x for x in v)
    return str(v)


def build():
    tokens = json.loads(SRC.read_text())
    flat = dict(flatten(tokens))
    values = {k: resolve(t["$value"], flat) for k, t in flat.items()}
    # skip logo/label tokens with non-CSS units (U) from CSS outputs
    css_ok = {k: v for k, v in values.items() if not (isinstance(v, str) and "U" in v and k.startswith("logo"))}
    name = lambda k: k.replace(".", "-")
    files = {}

    lines = [f"/* {HEADER} */", ":root {"]
    for k, v in css_ok.items():
        ref = flat[k]["$value"]
        if isinstance(ref, str) and ref.startswith("{"):
            lines.append(f"  --mm-{name(k)}: var(--mm-{name(ref[1:-1])});")
        else:
            lines.append(f"  --mm-{name(k)}: {css_value(v, flat[k].get('$type'))};")
    lines.append("}\n")
    files["tokens.css"] = "\n".join(lines)

    lines = [f"// {HEADER}"]
    for k, v in css_ok.items():
        lines.append(f"$mm-{name(k)}: {css_value(v, flat[k].get('$type'))};")
    files["tokens.scss"] = "\n".join(lines) + "\n"

    files["tokens.flat.json"] = json.dumps(values, indent=2, ensure_ascii=False) + "\n"

    def group(prefix, as_var=True):
        return {name(k[len(prefix) + 1:]): (f"var(--mm-{name(k)})" if as_var else css_value(values[k], flat[k].get("$type")))
                for k in css_ok if k.startswith(prefix + ".")}
    colors = {**group("color.brand"), **group("color.neutral"), **group("color.accessible"), **group("color.semantic")}
    theme = {
        "colors": {"mm": colors},
        "fontFamily": {f"mm-{k}": values[f"font.family.{k}"] for k in group("font.family")},
        "fontSize": {f"mm-{k}": v for k, v in group("font.size").items()},
        "fontWeight": {f"mm-{k}": str(values[f"font.weight.{k}"]) for k in group("font.weight")},
        "lineHeight": {f"mm-{k}": str(values[f"font.line-height.{k}"]) for k in group("font.line-height")},
        "letterSpacing": {f"mm-{k}": v for k, v in group("font.letter-spacing").items()},
        "spacing": {f"mm-{k}": v for k, v in group("space").items()},
        "borderRadius": {f"mm-{k}": v for k, v in group("radius").items()},
        "maxWidth": {"mm-container": "var(--mm-layout-container-max)", **{f"mm-{k}": v for k, v in group("layout.content").items()}},
        "opacity": {f"mm-{k}": v for k, v in group("opacity", as_var=False).items()},
        "aspectRatio": {f"mm-{k}": v for k, v in group("aspect").items()},
        "transitionDuration": {f"mm-{k.removeprefix('duration-')}": v for k, v in group("motion").items() if k.startswith("duration")},
        "transitionTimingFunction": {"mm": "var(--mm-motion-easing)"},
    }
    files["tailwind.preset.js"] = (
        f"// {HEADER}\n// Tailwind v3. Usage: presets: [require('<path>/tokens/build/tailwind.preset.js')] and import tokens.css once.\n"
        f"module.exports = {{ theme: {{ extend: {json.dumps(theme, indent=2)} }} }};\n"
    )

    # Tailwind v4: literal values, so the file works without tokens.css. Breakpoints are
    # documented only; overriding --breakpoint-* would change Tailwind's sm/md/lg defaults.
    lit = lambda prefix: group(prefix, as_var=False)
    v4 = [f"/* {HEADER} */",
          "/* Tailwind v4. Usage: @import \"tailwindcss\"; @import \"<path>/tokens/build/tailwind.theme.css\";",
          "   Utilities: bg-mm-blue, text-mm-accent-text, font-mm-web, text-mm-heading-desktop, rounded-mm-card, max-w-mm-medium, p-mm-section-default-desktop. */",
          "@theme {"]
    sections = [
        ("color", {**lit("color.brand"), **lit("color.neutral"), **lit("color.accessible"), **lit("color.semantic")}),
        ("font", lit("font.family")),
        ("text", lit("font.size")),
        ("font-weight", lit("font.weight")),
        ("leading", lit("font.line-height")),
        ("tracking", lit("font.letter-spacing")),
        ("spacing", lit("space")),
        ("radius", lit("radius")),
        ("container", lit("layout.content")),
        ("aspect", lit("aspect")),
        ("ease", {"": css_value(values["motion.easing"], "cubicBezier")}),
    ]
    for ns, entries in sections:
        for k, v in entries.items():
            v4.append(f"  --{ns}-mm{'-' + k if k else ''}: {v};")
    v4.append("}\n")
    files["tailwind.theme.css"] = "\n".join(v4)
    return files


def main():
    files = build()
    check = "--check" in sys.argv
    stale = []
    OUT.mkdir(parents=True, exist_ok=True)
    for fname, content in files.items():
        p = OUT / fname
        if check:
            if not p.exists() or p.read_text() != content:
                stale.append(fname)
        else:
            p.write_text(content)
            print("wrote", p.relative_to(ROOT))
    if stale:
        sys.exit(f"Stale token builds: {', '.join(stale)}. Run python3 scripts/build_tokens.py")


if __name__ == "__main__":
    main()
