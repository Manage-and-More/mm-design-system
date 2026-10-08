import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildVariant, cssVarName, flatten, toCss } from './dtcg';

const ds = path.resolve(import.meta.dirname, '../..');
const core = JSON.parse(readFileSync(path.join(ds, 'tokens/tokens.json'), 'utf8'));
const coreCss = readFileSync(path.join(ds, 'tokens/build/tokens.css'), 'utf8');

/** --mm-name → value, parsed from tokens/build/tokens.css (the Python build). */
const pythonVars = new Map([...coreCss.matchAll(/^\s+(--mm-[\w-]+): (.+);$/gm)].map((m) => [m[1], m[2]]));

describe('core parity with scripts/build_tokens.py', () => {
  const { tokens, css } = buildVariant(core, {});

  it('produces the same CSS variable names', () => {
    const ours = tokens.filter((t) => t.css).map((t) => t.cssVar).sort();
    expect(ours).toEqual([...pythonVars.keys()].sort());
  });

  it('produces the same literal values', () => {
    // Python prints floats as 1.0 where JS prints 1; compare numbers by value.
    const norm = (v = '') => (v.trim() !== '' && !Number.isNaN(Number(v)) ? String(Number(v)) : v);
    for (const t of tokens.filter((t) => t.css && !t.ref)) expect(norm(t.value), t.path).toBe(norm(pythonVars.get(t.cssVar)));
  });

  it('emits no overrides for an empty variant', () => {
    expect(css).not.toMatch(/--mm-/);
    expect(tokens.every((t) => t.origin === 'core')).toBe(true);
  });
});

describe('variant layering', () => {
  const variant = {
    color: {
      semantic: { background: { $value: '#F5F5F7', $extensions: { mm: { modes: { dark: '{color.brand.black}' } } } } },
      surface: { $type: 'color', raised: { $value: '{color.semantic.background}' } },
    },
    shadow: {
      card: { $type: 'shadow', $value: { color: '#0000001f', offsetX: '0px', offsetY: '1px', blur: '3px', spread: '0px' } },
    },
  };
  const { tokens, css } = buildVariant(core, variant);
  const get = (p: string) => tokens.find((t) => t.path === p)!;

  it('marks overrides and additions', () => {
    expect(get('color.semantic.background').origin).toBe('override');
    expect(get('color.surface.raised').origin).toBe('added');
    expect(get('color.brand.blue').origin).toBe('core');
  });

  it('keeps the core type and inherits group $type', () => {
    expect(get('color.semantic.background').type).toBe('color');
    expect(get('color.surface.raised').type).toBe('color');
  });

  it('resolves references through the variant first', () => {
    expect(get('color.surface.raised').value).toBe('#F5F5F7');
    expect(get('color.surface.raised').ref).toBe('color.semantic.background');
  });

  it('writes aliases as var() so overrides cascade', () => {
    expect(css).toContain('--mm-color-surface-raised: var(--mm-color-semantic-background);');
    expect(css).toContain('--mm-color-semantic-background: #F5F5F7;');
  });

  it('emits mode blocks', () => {
    expect(css).toMatch(/:root\[data-mode="dark"\] \{\n {2}--mm-color-semantic-background: var\(--mm-color-brand-black\);/);
    expect(get('color.semantic.background').modes.dark).toEqual({ value: '#000000', ref: 'color.brand.black' });
  });

  it('serialises composite shadows', () => {
    expect(get('shadow.card').value).toBe('0px 1px 3px 0px #0000001f');
  });
});

describe('errors', () => {
  it('reports missing references', () => {
    expect(() => buildVariant(core, { a: { $type: 'color', $value: '{color.nope}' } })).toThrow(/references missing token "\{color.nope\}"/);
  });

  it('reports cycles', () => {
    const cyclic = { a: { $value: '{b}' }, b: { $value: '{a}' } };
    expect(() => buildVariant({}, cyclic)).toThrow(/cycle/);
  });
});

describe('helpers', () => {
  it('names variables like build_tokens.py', () => {
    expect(cssVarName('font.size.display.mobile')).toBe('--mm-font-size-display-mobile');
  });

  it('formats font stacks and curves', () => {
    expect(toCss(['Sharp Sans', 'Arial', 'sans-serif'])).toBe('"Sharp Sans", Arial, sans-serif');
    expect(toCss([0, 0, 0.58, 1], 'cubicBezier')).toBe('cubic-bezier(0, 0, 0.58, 1)');
    expect(toCss({ value: 16, unit: 'px' }, 'dimension')).toBe('16px');
  });

  it('ignores $-keys while flattening', () => {
    expect([...flatten({ $description: 'x', a: { $value: 1 } }).keys()]).toEqual(['a']);
  });
});
