import { useState } from 'react';
import { Specimen } from '@/core/docs/Specimen';
import { Figure, LIBRARY } from '../components/Figure';
import { customFigures } from '../../../../hairline/host';

const CUSTOM: Record<string, string> = {
  bench: 'Two desks of three team stations. The pointer picks a station; its laptop lid opens and its mat lifts, desk-mates less.',
  podium: 'Seven plinths on a stage. The pointer sets a score line; plinths rise toward it, falling off with distance.',
  hours: 'Eight glass chambers, forty-eight beads falling. Hovering slows time so a bead can be followed.',
};

export default function FiguresPage() {
  const [intensity, setIntensity] = useState(0.6);
  const [play, setPlay] = useState(false);
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <label className="flex items-center gap-3">intensity <input type="range" min={0} max={1} step={0.01} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} /> <span className="tabular-nums">{intensity.toFixed(2)}</span></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={play} onChange={(e) => setPlay(e.target.checked)} /> play</label>
        <span className="v2-muted">Strokes: edge / mid / lo in ink, the lit stroke in the Brand v2 blue (<code>--hairline-hi</code>). The plate colour must match the surface the figure sits on.</span>
      </div>
      <Specimen title="Custom figures (hairline-create)" description="Built for this language with the skill in .agents/skills/hairline-create; sources in playground/hairline/figures/.">
        <div className="v2-grid v2-grid--3">
          {['bench', 'podium', 'hours'].map((n) => (
            <div key={n} className="grid gap-2">
              <Figure name={n} intensity={intensity} play={play} readout framed />
              <p className="font-extrabold">{n}{!customFigures.includes(n) && <span className="v2-muted font-medium"> · not built yet</span>}</p>
              <p className="v2-small v2-muted">{CUSTOM[n]}</p>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen title="Library figures used" description="From @lucasmarkes/hairline (MIT). Terminal for organisers; Lockers, Riffle, Elevator on feature cards; Plot, Query, Drawer as empty states.">
        <div className="v2-grid v2-grid--3">
          {(Object.keys(LIBRARY) as (keyof typeof LIBRARY)[]).map((n) => (
            <div key={n} className="grid gap-2"><Figure name={n} intensity={intensity} play={play} readout plate="raised" framed /><p className="font-extrabold">{n}</p></div>
          ))}
        </div>
      </Specimen>
      <Specimen title="On the blue band" surface="v2-band" description="On the band the lit stroke becomes white; the drawing stays monochrome and the band stays flat.">
        <div style={{ maxWidth: "24rem" }}><Figure name="terrain" intensity={intensity} /></div>
      </Specimen>
    </div>
  );
}
