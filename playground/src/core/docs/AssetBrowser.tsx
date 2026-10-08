import { useDeferredValue, useState } from 'react';
import catalog from '@ds/assets/catalog.json';
import { CopyText } from './CopyText';
import { CardFooter } from './CardFooter';

interface Asset {
  path: string;
  kind: string;
  description: string;
  source: string;
  use_on: string[];
  tags: string[];
  rights?: string;
}

const urls = import.meta.glob<string>('@ds/assets/**/*.{svg,png,webp,jpg}', { query: '?url', import: 'default', eager: true });
const urlOf = (path: string) => urls[`@ds/${path}`] ?? urls[`/${path}`] ?? Object.entries(urls).find(([k]) => k.endsWith(path))?.[1];

const BACKGROUNDS: Record<string, string> = {
  white: '#FFFFFF', black: '#000000', blue: '#00A2CD', yellow: '#FFED00', grey: '#E3E3E3', 'light-grey': '#E3E3E3',
};
/** Glyph-like assets use currentColor; show them as masks so they take the tile colour. */
const MASKED = new Set(['icon', 'ui-glyph']);

function Tile({ asset }: { asset: Asset }) {
  const url = urlOf(asset.path);
  const bgKey = asset.use_on.find((b) => b in BACKGROUNDS) ?? 'white';
  const bg = BACKGROUNDS[bgKey];
  const fg = bgKey === 'black' ? '#FFFFFF' : bgKey === 'blue' ? '#000000' : asset.path.includes('-blue') ? '#00A2CD' : '#000000';
  const photo = asset.kind === 'photo';
  return (
    <figure className="pg-doc-swatch" style={{ margin: 0 }}>
      {/* Fixed 4:3 frame; the preview is positioned inside it so no file can change the card size. */}
      <div className="pg-doc-asset-preview" style={{ background: photo ? 'transparent' : bg, color: fg }} title={`Shown on ${bgKey}`}>
        <div className="pg-doc-asset-media" style={{ padding: photo ? 0 : 20 }}>
          {url && MASKED.has(asset.kind) && asset.path.endsWith('.svg') ? (
            <span style={{ width: 56, height: 56, background: 'currentColor', mask: `url("${url}") center / contain no-repeat` }} />
          ) : url ? (
            <img src={url} alt={asset.description} loading="lazy" style={{ objectFit: photo ? 'cover' : 'contain' }} />
          ) : (
            <span className="pg-doc-mono">no preview</span>
          )}
        </div>
      </div>
      <figcaption className="pg-doc-swatch-body">
        <span className="pg-doc-swatch-name">
          <span title={asset.path}>{asset.path.split('/').at(-1)}</span>
        </span>
        <CopyText text={asset.path} label={asset.path.replace(/^assets\//, '')} block />
      </figcaption>
      <CardFooter
        meta={asset.rights ? <span className="pg-doc-card-meta--warn">⚠ Check rights</span> : asset.source}
        title={asset.path.split('/').at(-1)!}
        notes={
          <>
            {asset.rights && <p style={{ color: '#b35c00' }}>{asset.rights}</p>}
            <p>{asset.description}</p>
            {asset.use_on.length > 0 && <p className="pg-doc-mono">Approved on: {asset.use_on.join(', ')}</p>}
            <p className="pg-doc-mono">Source: {asset.source}</p>
          </>
        }
      />
    </figure>
  );
}

/** Browses assets/catalog.json, the design system's machine-readable asset index. */
export function AssetBrowser({ kinds }: { kinds: string[] }) {
  const all = (catalog.assets as Asset[]).filter((a) => kinds.includes(a.kind));
  const [kind, setKind] = useState<string | 'all'>('all');
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<'svg' | 'png' | 'all'>(all.some((a) => a.path.endsWith('.svg')) ? 'svg' : 'all');
  const q = useDeferredValue(query.trim().toLowerCase());
  const rows = all.filter(
    (a) =>
      (kind === 'all' || a.kind === kind) &&
      (format === 'all' || a.path.endsWith(`.${format}`) || !/\.(svg|png)$/.test(a.path)) &&
      (!q || a.path.includes(q) || a.description.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q))),
  );
  const presentKinds = [...new Set(all.map((a) => a.kind))];
  return (
    <>
      <div className="pg-doc-toolbar">
        <input className="pg-doc-input" type="search" placeholder="Filter by name, tag or description" value={query} onChange={(e) => setQuery(e.target.value)} />
        {presentKinds.length > 1 &&
          ['all', ...presentKinds].map((k) => (
            <button key={k} type="button" className="pg-doc-chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
              <span>{k}</span>
            </button>
          ))}
        {(['svg', 'png', 'all'] as const).map((f) => (
          <button key={f} type="button" className="pg-doc-chip" aria-pressed={format === f} onClick={() => setFormat(f)}>
            <span>{f === 'all' ? 'all formats' : f}</span>
          </button>
        ))}
        <span className="pg-doc-muted pg-doc-mono">{rows.length} files</span>
      </div>
      <div className="pg-doc-grid pg-doc-grid--cards" style={{ ['--pg-col' as string]: '200px' }}>
        {rows.map((a) => (
          <Tile key={a.path} asset={a} />
        ))}
      </div>
    </>
  );
}
