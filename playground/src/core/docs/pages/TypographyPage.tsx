import { useTokens } from '../TokensContext';
import { DocSection } from '../DocFrame';
import { byPrefix, shortName } from '../../tokens';
import { CopyText } from '../CopyText';
import { cols, live, TokenMeta, TokenRow, TokenValue, toPx } from '../blocks';

const SAMPLE = 'Build and scale.';
const PARAGRAPH =
  'Manage and More is the entrepreneurship program for top talent in Munich. Students move beyond theory and build, test and launch their own ventures.';

export default function TypographyPage() {
  const { tokens } = useTokens();
  const families = byPrefix(tokens, 'font.family');
  const weights = byPrefix(tokens, 'font.weight');
  const sizes = byPrefix(tokens, 'font.size');
  const leadings = byPrefix(tokens, 'font.line-height');
  const trackings = byPrefix(tokens, 'font.letter-spacing');
  const headline = weights.find((t) => t.path.endsWith('headline'));
  return (
    <>
      {families.length > 0 && (
        <DocSection title="Families" description="The first available font in each stack renders. Licensed fonts load from playground/fonts-local/.">
          <div className="pg-doc-grid pg-doc-grid--cards" style={cols('260px')}>
            {families.map((t) => (
              <div key={t.path} className="pg-doc-family" style={{ fontFamily: live(t) }}>
                <span className="pg-doc-family-aa">Aa</span>
                <span className="pg-doc-label">{shortName(t.path, 'font.family')}</span>
                <span className="pg-doc-mono pg-doc-muted">{t.value}</span>
                <CopyText text={`var(${t.cssVar})`} label={t.cssVar} block />
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {weights.length > 0 && (
        <DocSection title="Weights">
          <div className="pg-doc-rows">
            {weights.map((t) => (
              <TokenRow key={t.path} token={t} name={shortName(t.path, 'font.weight')}>
                <span style={{ fontWeight: live(t), fontSize: '1.5rem' }}>{SAMPLE}</span>
              </TokenRow>
            ))}
          </div>
        </DocSection>
      )}
      {sizes.length > 0 && (
        <DocSection title="Sizes" description="Responsive steps are separate tokens (mobile, tablet, desktop…). Samples above 24px use the headline weight.">
          {[...sizes]
            .sort((a, b) => (toPx(b.value) ?? 0) - (toPx(a.value) ?? 0))
            .map((t) => (
              <div key={t.path} className="pg-doc-type-row">
                <div className="pg-doc-row-meta">
                  <TokenMeta token={t} name={shortName(t.path, 'font.size')} />
                  <TokenValue token={t} align="start" />
                </div>
                <span
                  className="pg-doc-type-sample"
                  style={{ fontSize: live(t), fontWeight: (toPx(t.value) ?? 0) > 24 && headline ? live(headline) : undefined }}
                >
                  {SAMPLE}
                </span>
              </div>
            ))}
        </DocSection>
      )}
      {leadings.length > 0 && (
        <DocSection title="Line height">
          <div className="pg-doc-grid" style={cols('280px')}>
            {leadings.map((t) => (
              <div key={t.path} className="pg-doc-tile">
                <TokenMeta token={t} name={`${shortName(t.path, 'font.line-height')} · ${t.value}`} />
                <p style={{ lineHeight: live(t), fontSize: '1.0625rem', margin: 0, paddingTop: 8 }}>{PARAGRAPH}</p>
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {trackings.length > 0 && (
        <DocSection title="Letter spacing">
          <div className="pg-doc-rows">
            {trackings.map((t) => (
              <TokenRow key={t.path} token={t} name={shortName(t.path, 'font.letter-spacing')}>
                <span style={{ letterSpacing: live(t), textTransform: 'uppercase', fontWeight: 800, fontSize: '0.875rem' }}>
                  Entrepreneurial education
                </span>
              </TokenRow>
            ))}
          </div>
        </DocSection>
      )}
    </>
  );
}
