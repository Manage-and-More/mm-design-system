import { useState } from 'react';
import { useTokens } from '../TokensContext';
import { DocSection } from '../DocFrame';
import { live, TokenMeta, TokenValue } from '../blocks';
import type { ResolvedToken } from '../../tokens';

/** cubic-bezier(a, b, c, d) → SVG path in a 100×100 box (y up). */
function curvePath(value: string) {
  const n = /cubic-bezier\(([^)]+)\)/.exec(value)?.[1].split(',').map(Number);
  if (!n || n.length !== 4) return null;
  const [x1, y1, x2, y2] = n;
  return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
}

function Track({ on, duration, easing }: { on: boolean; duration: string; easing: string }) {
  return (
    <div className="pg-doc-motion-track" data-on={on ? '' : undefined}>
      <div className="pg-doc-motion-dot" style={{ transitionDuration: duration, transitionTimingFunction: easing }} />
    </div>
  );
}

function Easing({ token, on, duration }: { token: ResolvedToken; on: boolean; duration: string }) {
  const d = curvePath(token.value);
  return (
    <div className="pg-doc-tile" style={{ gridTemplateColumns: '96px 1fr', alignItems: 'center', columnGap: 24 }}>
      <svg className="pg-doc-curve" viewBox="0 0 100 100" aria-hidden="true" style={{ gridRow: 'span 2' }}>
        <line x1="0" y1="100" x2="100" y2="0" />
        {d && <path d={d} />}
      </svg>
      <TokenMeta token={token} />
      <Track on={on} duration={duration} easing={live(token)} />
    </div>
  );
}

export default function MotionPage() {
  const { tokens } = useTokens();
  const [on, setOn] = useState(false);
  const durations = tokens.filter((t) => t.type === 'duration');
  const easings = tokens.filter((t) => t.type === 'cubicBezier');
  const standard = easings.find((t) => t.path.endsWith('standard')) ?? easings[0];
  const demoDuration = durations.find((t) => t.path.endsWith('slower')) ?? durations.at(-1);
  const other = tokens.filter((t) => t.path.startsWith('motion') && t.type !== 'duration' && t.type !== 'cubicBezier');
  const play = (
    <button type="button" className="pg-doc-button" onClick={() => setOn((v) => !v)}>
      {on ? '◀ Reverse' : '▶ Play'}
    </button>
  );
  return (
    <>
      {durations.length > 0 && (
        <DocSection title="Durations" description={<>All tracks use the {standard ? <code>{standard.path}</code> : 'default'} easing. {play}</>}>
          <div className="pg-doc-rows">
            {durations.map((t) => (
              <div key={t.path} className="pg-doc-row">
                <TokenMeta token={t} />
                <Track on={on} duration={live(t)} easing={standard ? live(standard) : 'ease'} />
                <TokenValue token={t} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
      {easings.length > 0 && (
        <DocSection title="Easing" description={<>Each curve runs over {demoDuration ? <code>{demoDuration.value}</code> : '1s'}. {play}</>}>
          <div className="pg-doc-grid" style={{ ['--pg-col' as string]: '340px', rowGap: 32 }}>
            {easings.map((t) => (
              <Easing key={t.path} token={t} on={on} duration={demoDuration ? live(demoDuration) : '1s'} />
            ))}
          </div>
        </DocSection>
      )}
      {other.length > 0 && (
        <DocSection title="Other motion values">
          <div className="pg-doc-rows">
            {other.map((t) => (
              <div key={t.path} className="pg-doc-row">
                <TokenMeta token={t} />
                <span />
                <TokenValue token={t} />
              </div>
            ))}
          </div>
        </DocSection>
      )}
    </>
  );
}
