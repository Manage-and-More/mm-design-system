import { useTokens } from '../TokensContext';
import { DocSection } from '../DocFrame';
import { CopyText } from '../CopyText';
import { OriginBadge } from '../OriginBadge';
import { CardFooter } from '../CardFooter';
import { contrast, rating, readableOn } from '../contrast';
import { cols, groupByParent, live, title } from '../blocks';
import type { ResolvedToken } from '../../tokens';

function Swatch({ token }: { token: ResolvedToken }) {
  const dark = token.modes.dark?.value;
  return (
    <div className="pg-doc-swatch">
      {dark ? (
        <div className="pg-doc-swatch-chip pg-doc-swatch-chip--split">
          <span style={{ background: token.value, color: readableOn(token.value) }}>
            <CopyText text={token.value} label={`light ${token.value}`} variant="bare" />
          </span>
          <span style={{ background: dark, color: readableOn(dark) }}>
            <CopyText text={dark} label={`dark ${dark}`} variant="bare" />
          </span>
        </div>
      ) : (
        <div className="pg-doc-swatch-chip" style={{ background: live(token), color: readableOn(token.value) }}>
          {token.ref && <span className="pg-doc-swatch-ref" title={token.ref}>→ {token.ref.split('.').slice(1).join('.')}</span>}
          <CopyText text={token.value} variant="bare" />
        </div>
      )}
      <div className="pg-doc-swatch-body">
        <span className="pg-doc-swatch-name">
          <span title={token.path}>{title(token.path)}</span> <OriginBadge origin={token.origin} />
        </span>
        <CopyText text={`var(${token.cssVar})`} label={token.cssVar} block />
      </div>
      <CardFooter meta={token.source} title={title(token.path)} notes={token.description && <p>{token.description}</p>} />
    </div>
  );
}

function ContrastMatrix({ palette }: { palette: ResolvedToken[] }) {
  return (
    <div className="pg-doc-matrix">
      <table>
        <thead>
          <tr>
            <th>text ↓ / bg →</th>
            {palette.map((bg) => (
              <th key={bg.path}>{title(bg.path)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {palette.map((fg) => (
            <tr key={fg.path}>
              <th>{title(fg.path)}</th>
              {palette.map((bg) => {
                const ratio = contrast(fg.value, bg.value);
                const r = ratio ? rating(ratio) : '–';
                return (
                  <td key={bg.path} style={{ background: bg.value, color: fg.value }} data-fail={r === 'Fail' || fg.path === bg.path ? '' : undefined} title={`${r}`}>
                    {fg.path === bg.path ? '' : ratio?.toFixed(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ColorsPage() {
  const { tokens } = useTokens();
  const colors = tokens.filter((t) => t.type === 'color');
  const palette = colors.filter((t) => !t.ref);
  return (
    <>
      {groupByParent(colors).map(([group, items]) => (
        <DocSection key={group} title={group.split('.').slice(1).join(' / ') || group} description={<span className="pg-doc-mono">{group}.*</span>}>
          <div className="pg-doc-grid pg-doc-grid--cards" style={cols('200px')}>
            {items.map((t) => (
              <Swatch key={t.path} token={t} />
            ))}
          </div>
        </DocSection>
      ))}
      <DocSection title="Contrast" description="WCAG 2 ratio for every literal palette colour as text on every other. Faded cells fail AA Large (3:1).">
        <ContrastMatrix palette={palette} />
      </DocSection>
    </>
  );
}
