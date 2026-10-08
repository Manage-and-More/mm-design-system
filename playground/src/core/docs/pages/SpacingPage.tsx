import { useTokens } from '../TokensContext';
import { DocSection } from '../DocFrame';
import { byPrefix, shortName } from '../../tokens';
import { live, TokenRow, toPx, title } from '../blocks';
import type { ResolvedToken } from '../../tokens';

function Bars({ tokens, prefix, max }: { tokens: ResolvedToken[]; prefix: string; max?: number }) {
  return (
    <div className="pg-doc-rows">
      {tokens.map((t) => {
        const px = toPx(t.value);
        const width = max && px !== null ? `${(px / max) * 100}%` : live(t);
        return (
          <TokenRow key={t.path} token={t} name={shortName(t.path, prefix)}>
            <div className="pg-doc-bar" style={{ width, maxWidth: '100%' }} />
          </TokenRow>
        );
      })}
    </div>
  );
}

function Breakpoints({ tokens }: { tokens: ResolvedToken[] }) {
  const points = tokens.map((t) => ({ t, px: toPx(t.value) ?? 0 })).sort((a, b) => a.px - b.px);
  const max = (points.at(-1)?.px ?? 1) * 1.12;
  return (
    <div className="pg-doc-ruler">
      {points.map(({ t, px }) => (
        <div key={t.path} className="pg-doc-ruler-mark" style={{ left: `${(px / max) * 100}%` }}>
          <span className="pg-doc-label">{title(t.path)}</span>
          <span className="pg-doc-mono pg-doc-muted">{px}</span>
        </div>
      ))}
    </div>
  );
}

export default function SpacingPage() {
  const { tokens } = useTokens();
  const space = byPrefix(tokens, 'space').filter((t) => !t.path.startsWith('space.section'));
  const sections = byPrefix(tokens, 'space.section');
  const content = [...byPrefix(tokens, 'layout.content'), ...tokens.filter((t) => t.path === 'layout.container-max')];
  const gutters = byPrefix(tokens, 'layout.gutter');
  const header = byPrefix(tokens, 'layout.header');
  const breakpoints = byPrefix(tokens, 'breakpoint');
  const contentMax = Math.max(...content.map((t) => toPx(t.value) ?? 0), 1);
  return (
    <>
      {space.length > 0 && (
        <DocSection title="Space scale" description="Padding, gaps and margins inside components.">
          <Bars tokens={space} prefix="space" />
        </DocSection>
      )}
      {sections.length > 0 && (
        <DocSection title="Section rhythm" description="Vertical padding of page sections per breakpoint.">
          <Bars tokens={sections} prefix="space.section" />
        </DocSection>
      )}
      {content.length > 0 && (
        <DocSection title="Content widths" description="Bars are relative to the widest container.">
          <Bars tokens={content} prefix="layout" max={contentMax} />
        </DocSection>
      )}
      {gutters.length > 0 && (
        <DocSection title="Gutters">
          <Bars tokens={gutters} prefix="layout.gutter" />
        </DocSection>
      )}
      {breakpoints.length > 0 && (
        <DocSection title="Breakpoints" description="Min-widths. Try them with the viewport presets in the toolbar.">
          <Breakpoints tokens={breakpoints} />
        </DocSection>
      )}
      {header.length > 0 && (
        <DocSection title="Header">
          <Bars tokens={header} prefix="layout.header" />
        </DocSection>
      )}
    </>
  );
}
