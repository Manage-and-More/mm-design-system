import { useTokens } from '../TokensContext';
import { DocSection } from '../DocFrame';
import { byPrefix, shortName } from '../../tokens';
import { cols, live, TokenMeta, TokenRow, TokenValue } from '../blocks';

export default function ShapePage() {
  const { tokens } = useTokens();
  const radii = byPrefix(tokens, 'radius');
  const strokes = byPrefix(tokens, 'stroke');
  const sizes = byPrefix(tokens, 'size');
  const aspects = byPrefix(tokens, 'aspect');
  const opacities = byPrefix(tokens, 'opacity');
  const shadows = tokens.filter((t) => t.type === 'shadow');
  return (
    <>
      {radii.length > 0 && (
        <DocSection title="Radius">
          <div className="pg-doc-grid" style={cols('160px')}>
            {radii.map((t) => (
              <div key={t.path} className="pg-doc-tile">
                <div className="pg-doc-shape" style={{ borderRadius: live(t), aspectRatio: '1', background: 'currentColor', border: 0 }} />
                <TokenMeta token={t} name={shortName(t.path, 'radius')} />
                <TokenValue token={t} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {shadows.length > 0 && (
        <DocSection title="Elevation">
          <div className="pg-doc-grid" style={cols('200px')}>
            {shadows.map((t) => (
              <div key={t.path} className="pg-doc-tile">
                <div className="pg-doc-shape" style={{ boxShadow: live(t), border: 0, borderRadius: 14, background: 'Canvas' }} />
                <TokenMeta token={t} />
                <TokenValue token={t} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {strokes.length > 0 && (
        <DocSection title="Stroke">
          <div className="pg-doc-rows">
            {strokes.map((t) => (
              <TokenRow key={t.path} token={t} name={shortName(t.path, 'stroke')}>
                <div style={{ height: live(t), background: 'currentColor' }} />
              </TokenRow>
            ))}
          </div>
        </DocSection>
      )}
      {sizes.length > 0 && (
        <DocSection title="Sizes" description="Control and sticker sizes. em-based sizes are shown at 16px.">
          <div className="pg-doc-rows">
            {sizes.map((t) => (
              <TokenRow key={t.path} token={t} name={shortName(t.path, 'size')}>
                <div style={{ width: live(t), height: live(t), borderRadius: 8, background: 'currentColor', fontSize: 16 }} />
              </TokenRow>
            ))}
          </div>
        </DocSection>
      )}
      {aspects.length > 0 && (
        <DocSection title="Aspect ratios">
          <div className="pg-doc-grid" style={cols('180px')}>
            {aspects.map((t) => (
              <div key={t.path} className="pg-doc-tile">
                <div className="pg-doc-shape" style={{ aspectRatio: live(t), borderRadius: 10 }}>
                  <span className="pg-doc-mono">{t.value}</span>
                </div>
                <TokenMeta token={t} name={shortName(t.path, 'aspect')} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {opacities.length > 0 && (
        <DocSection title="Opacity" description="Applied to currentColor for secondary text, rules and shades.">
          <div className="pg-doc-grid" style={cols('150px')}>
            {opacities.map((t) => (
              <div key={t.path} className="pg-doc-tile">
                <div className="pg-doc-shape" style={{ aspectRatio: '3 / 2', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'currentColor', opacity: live(t) }} />
                </div>
                <TokenMeta token={t} name={`${shortName(t.path, 'opacity')} · ${t.value}`} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
    </>
  );
}
