/**
 * Minimal DTCG (W3C Design Tokens) reader shared by the Vite plugin and tests.
 * Mirrors scripts/build_tokens.py: same flattening, same `{a.b.c}` references,
 * same `--mm-a-b-c` custom-property names, so variant tokens layer cleanly on
 * top of tokens/build/tokens.css.
 *
 * Modes: a token may carry `$extensions.mm.modes.<mode>` (e.g. `dark`) with a
 * literal or reference value. They are emitted under `:root[data-mode="<mode>"]`.
 */

export type DtcgTree = { [key: string]: unknown };

export interface FlatToken {
  path: string;
  type?: string;
  raw: unknown;
  description?: string;
  source?: string;
  modes: Record<string, unknown>;
}

export type TokenOrigin = 'core' | 'override' | 'added';

export interface ResolvedToken {
  path: string;
  cssVar: string;
  type?: string;
  /** CSS value with references fully resolved (for display, contrast, previews). */
  value: string;
  /** Referenced token path when `$value` is an alias. */
  ref?: string;
  modes: Record<string, { value: string; ref?: string }>;
  description?: string;
  source?: string;
  origin: TokenOrigin;
  /** False for tokens build_tokens.py keeps out of CSS (logo units in "U"). */
  css: boolean;
}

const REF = /^\{([^}]+)\}$/;

export const cssVarName = (path: string) => `--mm-${path.replaceAll('.', '-')}`;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function flatten(tree: DtcgTree, path: string[] = [], inheritedType?: string, out = new Map<string, FlatToken>()) {
  const groupType = typeof tree.$type === 'string' ? tree.$type : inheritedType;
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || !isObject(node)) continue;
    const next = [...path, key];
    if ('$value' in node) {
      const ext = isObject(node.$extensions) && isObject(node.$extensions.mm) ? node.$extensions.mm : {};
      out.set(next.join('.'), {
        path: next.join('.'),
        type: typeof node.$type === 'string' ? node.$type : groupType,
        raw: node.$value,
        description: typeof node.$description === 'string' ? node.$description : undefined,
        source: typeof ext.source === 'string' ? ext.source : undefined,
        modes: isObject(ext.modes) ? ext.modes : {},
      });
    } else {
      flatten(node, next, groupType, out);
    }
  }
  return out;
}

const refOf = (raw: unknown) => (typeof raw === 'string' ? REF.exec(raw)?.[1] : undefined);

/** Follow references to a literal value. Throws on missing targets and cycles. */
export function resolveRaw(raw: unknown, lookup: Map<string, FlatToken>, from: string, seen: string[] = []): unknown {
  const ref = refOf(raw);
  if (!ref) return raw;
  if (seen.includes(ref)) throw new Error(`Token reference cycle: ${[...seen, ref].join(' → ')}`);
  const target = lookup.get(ref);
  if (!target) throw new Error(`Token "${from}" references missing token "{${ref}}"`);
  return resolveRaw(target.raw, lookup, ref, [...seen, ref]);
}

const quoteFamily = (name: string) => (name.includes(' ') ? `"${name}"` : name);

const dimension = (v: Record<string, unknown>) => `${v.value}${v.unit}`;

function shadow(v: unknown): string {
  const one = (s: Record<string, unknown>) =>
    [s.inset ? 'inset' : '', toCss(s.offsetX), toCss(s.offsetY), toCss(s.blur), toCss(s.spread), toCss(s.color)]
      .filter(Boolean)
      .join(' ');
  return (Array.isArray(v) ? v : [v]).filter(isObject).map(one).join(', ');
}

/** Literal DTCG value → CSS text (matches css_value() in build_tokens.py, plus 2025 object forms). */
export function toCss(value: unknown, type?: string): string {
  if (value === undefined || value === null) return '';
  if (type === 'cubicBezier' && Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`;
  if (type === 'shadow') return shadow(value);
  if (Array.isArray(value)) return value.map((x) => quoteFamily(String(x))).join(', ');
  if (isObject(value)) {
    if ('unit' in value && 'value' in value) return dimension(value);
    if ('hex' in value && typeof value.hex === 'string') return value.hex;
    if ('colorSpace' in value && Array.isArray(value.components))
      return `color(${value.colorSpace} ${value.components.join(' ')}${value.alpha !== undefined ? ` / ${value.alpha}` : ''})`;
    return JSON.stringify(value);
  }
  return String(value);
}

/** Value written into a stylesheet: aliases stay live as var() so overrides cascade. */
function cssDeclarationValue(raw: unknown, type: string | undefined) {
  const ref = refOf(raw);
  if (ref) return `var(${cssVarName(ref)})`;
  return toCss(raw, type);
}

/** build_tokens.py drops logo tokens measured in "U" (logo units) from CSS. */
const isCssSafe = (path: string, value: string) => !(path.startsWith('logo') && value.includes('U'));

export interface VariantBuild {
  tokens: ResolvedToken[];
  css: string;
}

/**
 * Merge a variant tree over the core tree. All tokens are returned for docs;
 * the CSS only contains variant overrides/additions because core custom
 * properties already come from tokens/build/tokens.css.
 */
export function buildVariant(core: DtcgTree, variant: DtcgTree, header = ''): VariantBuild {
  const coreFlat = flatten(core);
  const variantFlat = flatten(variant);
  const merged = new Map(coreFlat);
  for (const [path, token] of variantFlat) {
    const base = coreFlat.get(path);
    merged.set(path, {
      ...token,
      type: token.type ?? base?.type,
      description: token.description ?? base?.description,
    });
  }

  const tokens: ResolvedToken[] = [];
  for (const token of merged.values()) {
    const value = toCss(resolveRaw(token.raw, merged, token.path), token.type);
    const modes: ResolvedToken['modes'] = {};
    for (const [mode, raw] of Object.entries(token.modes)) {
      modes[mode] = { value: toCss(resolveRaw(raw, merged, `${token.path}@${mode}`), token.type), ref: refOf(raw) };
    }
    tokens.push({
      path: token.path,
      cssVar: cssVarName(token.path),
      type: token.type,
      value,
      ref: refOf(token.raw),
      modes,
      description: token.description,
      source: token.source,
      origin: variantFlat.has(token.path) ? (coreFlat.has(token.path) ? 'override' : 'added') : 'core',
      css: isCssSafe(token.path, value),
    });
  }

  const own = [...variantFlat.values()].filter((t) => isCssSafe(t.path, String(t.raw)));
  const decl = (path: string, raw: unknown, type?: string) =>
    `  ${cssVarName(path)}: ${cssDeclarationValue(raw, type ?? merged.get(path)?.type)};`;

  const blocks: string[] = [];
  if (header) blocks.push(`/* ${header} */`);
  blocks.push([':root {', ...own.map((t) => decl(t.path, t.raw, t.type)), '}'].join('\n'));

  const modeNames = new Set([...merged.values()].flatMap((t) => Object.keys(t.modes)));
  for (const mode of modeNames) {
    const lines = [...merged.values()]
      .filter((t) => mode in t.modes && isCssSafe(t.path, String(t.raw)))
      .map((t) => decl(t.path, t.modes[mode], t.type));
    blocks.push([`:root[data-mode="${mode}"] {`, ...lines, '}'].join('\n'));
  }

  return { tokens, css: blocks.join('\n\n') + '\n' };
}
