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
  tokens/build/variants/<id>.css   one file per playground variant (playground/src/variants/<id>/tokens.json),
                                   layered over tokens.css: overrides and additions, dark values under
                                   :root[data-mode="dark"]; the same output as the playground's Vite plugin
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
        "transitionTimingFunction": {f"mm-{k.removeprefix('easing-')}": v for k, v in group("motion").items() if k.startswith("easing")},
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
        ("ease", {k.removeprefix("easing-"): v for k, v in lit("motion").items() if k.startswith("easing")}),
    ]
    for ns, entries in sections:
        for k, v in entries.items():
            v4.append(f"  --{ns}-mm{'-' + k if k else ''}: {v};")
    v4.append("}\n")
    files["tailwind.theme.css"] = "\n".join(v4)
    return files


VARIANTS = ROOT / "playground/src/variants"


def variant_css(core_flat, own):
    """CSS for one variant's tokens.json: references stay live var()s, modes go under :root[data-mode]."""
    flat = dict(flatten(own))
    merged = {**core_flat, **flat}
    name = lambda k: k.replace(".", "-")

    def to_css(v, type_=None):
        if isinstance(v, str):
            m = re.fullmatch(r"\{([^}]+)\}", v)
            if m:
                if m.group(1) not in merged:
                    raise SystemExit(f"variant token references unknown {m.group(1)}")
                return f"var(--mm-{name(m.group(1))})"
            return v
        if type_ == "shadow" and isinstance(v, (dict, list)):
            def one(sh):
                parts = ["inset" if sh.get("inset") else "", sh["offsetX"], sh["offsetY"], sh["blur"], sh.get("spread", "0px"), sh["color"]]
                return " ".join(p for p in parts if p)
            return ", ".join(one(sh) for sh in (v if isinstance(v, list) else [v]))
        return css_value(v, type_)

    def type_of(k):
        t = flat[k].get("$type")
        if t:
            return t
        node, parts = own, k.split(".")
        for part in parts:
            node = node[part]
            if "$type" in node:
                t = node["$type"]
        return t

    lines = [f"/* {HEADER.replace('tokens/tokens.json', 'playground/src/variants/<id>/tokens.json')} Layer after tokens.css. */", ":root {"]
    modes = {}
    for k, t in flat.items():
        lines.append(f"  --mm-{name(k)}: {to_css(t['$value'], type_of(k))};")
        for mode, mv in t.get("$extensions", {}).get("mm", {}).get("modes", {}).items():
            modes.setdefault(mode, []).append(f"  --mm-{name(k)}: {to_css(mv, type_of(k))};")
    lines.append("}")
    for mode, ml in modes.items():
        lines += ["", f':root[data-mode="{mode}"] {{', *ml, "}"]
    return "\n".join(lines) + "\n"


def build_variants():
    core_flat = dict(flatten(json.loads(SRC.read_text())))
    files = {}
    for tj in sorted(VARIANTS.glob("*/tokens.json")):
        vid = tj.parent.name
        if vid.startswith("_") or vid == "brand":
            continue
        own = json.loads(tj.read_text())
        if not own:
            continue
        files[OUT / "variants" / f"{vid}.css"] = variant_css(core_flat, own)
    return files


def main():
    files = build()
    files.update(build_variants())
    check = "--check" in sys.argv
    stale = []
    OUT.mkdir(parents=True, exist_ok=True)
    for fname, content in files.items():
        p = OUT / fname
        if check:
            if not p.exists() or p.read_text() != content:
                stale.append(fname)
        else:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content)
            print("wrote", p.relative_to(ROOT))
    if stale:
        sys.exit(f"Stale token builds: {', '.join(stale)}. Run python3 scripts/build_tokens.py")


if __name__ == "__main__":
    main()
