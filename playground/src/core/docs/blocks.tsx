import type { CSSProperties, ReactNode } from 'react';
import type { ResolvedToken } from '../tokens';
import { CopyText } from './CopyText';
import { OriginBadge } from './OriginBadge';

/** Group tokens by their parent path: color.brand.blue → color.brand. */
export function groupByParent(tokens: ResolvedToken[]) {
  const groups = new Map<string, ResolvedToken[]>();
  for (const t of tokens) {
    const parent = t.path.split('.').slice(0, -1).join('.');
    groups.set(parent, [...(groups.get(parent) ?? []), t]);
  }
  return [...groups.entries()];
}

/** "1.5rem" → 24, "75px" → 75, "2em" → 32 (16px root); null for unitless and anything else. */
export function toPx(value: string): number | null {
  const m = /^(-?[\d.]+)(px|rem|em)$/.exec(value.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === 'px' ? n : n * 16;
}

export const title = (path: string) => path.split('.').at(-1)!.replaceAll('-', ' ');

/** Name, CSS variable and value of one token, used in every row. */
export function TokenMeta({ token, name }: { token: ResolvedToken; name?: string }) {
  return (
    <div className="pg-doc-row-meta">
      <span className="pg-doc-label">
        {name ?? title(token.path)} <OriginBadge origin={token.origin} />
      </span>
      <CopyText text={`var(${token.cssVar})`} label={token.cssVar} />
    </div>
  );
}

export function TokenValue({ token, align = 'end' }: { token: ResolvedToken; align?: 'start' | 'end' }) {
  const px = toPx(token.value);
  return (
    <span className="pg-doc-row-value pg-doc-mono pg-doc-muted" style={align === 'start' ? { textAlign: 'start' } : undefined}>
      {token.ref && <>{`{${token.ref}}`} → </>}
      {token.value}
      {px !== null && !token.value.endsWith('px') && ` · ${Math.round(px * 100) / 100}px`}
      {Object.entries(token.modes).map(([mode, m]) => (
        <span key={mode}>
          <br />
          {mode}: {m.value}
        </span>
      ))}
    </span>
  );
}

export function TokenRow({ token, children, name }: { token: ResolvedToken; children?: ReactNode; name?: string }) {
  return (
    <div className="pg-doc-row">
      <TokenMeta token={token} name={name} />
      <div style={{ minWidth: 0 }}>{children}</div>
      <TokenValue token={token} />
    </div>
  );
}

/** Live preview style: always reads the CSS variable so overrides and modes show up. */
export const live = (token: ResolvedToken) => (token.css ? `var(${token.cssVar})` : token.value);

export const cols = (min: string) => ({ '--pg-col': min }) as CSSProperties;
