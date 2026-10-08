import { useDeferredValue, useState } from 'react';
import { useTokens } from '../TokensContext';
import { CopyText } from '../CopyText';
import { OriginBadge } from '../OriginBadge';
import { Notes } from '../Notes';
import type { TokenOrigin } from '../../../../plugins/dtcg';

const ORIGINS: (TokenOrigin | 'all')[] = ['all', 'override', 'added', 'core'];

export default function AllTokensPage() {
  const { tokens } = useTokens();
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<TokenOrigin | 'all'>('all');
  const q = useDeferredValue(query.trim().toLowerCase());
  const rows = tokens.filter(
    (t) =>
      (origin === 'all' || t.origin === origin) &&
      (!q || t.path.includes(q) || t.value.toLowerCase().includes(q) || t.cssVar.includes(q)),
  );
  return (
    <>
      <div className="pg-doc-toolbar">
        <input className="pg-doc-input" type="search" placeholder="Filter by path, value or variable" value={query} onChange={(e) => setQuery(e.target.value)} />
        {ORIGINS.map((o) => (
          <button key={o} type="button" className="pg-doc-chip" aria-pressed={origin === o} onClick={() => setOrigin(o)}>
            <span>
              {o} ({o === 'all' ? tokens.length : tokens.filter((t) => t.origin === o).length})
            </span>
          </button>
        ))}
      </div>
      <table className="pg-doc-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>CSS variable</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.path}>
              <td>
                <span className="pg-doc-label">{t.path}</span> <OriginBadge origin={t.origin} />
                {t.description && (
                  <Notes inline label="Notes">
                    <span style={{ maxWidth: 360 }}>{t.description}</span>
                  </Notes>
                )}
              </td>
              <td className="pg-doc-mono">
                {t.type === 'color' && (
                  <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: t.value, verticalAlign: -2, marginRight: 6, border: '1px solid var(--pg-line)' }} />
                )}
                {t.ref ? `{${t.ref}} → ` : ''}
                {t.value}
                {Object.entries(t.modes).map(([m, v]) => (
                  <div key={m} className="pg-doc-muted">
                    {m}: {v.value}
                  </div>
                ))}
              </td>
              <td>{t.css ? <CopyText text={`var(${t.cssVar})`} label={t.cssVar} /> : <span className="pg-doc-muted">not in CSS</span>}</td>
              <td className="pg-doc-muted" style={{ fontSize: '0.75rem' }}>{t.source ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
