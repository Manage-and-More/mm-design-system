/**
 * Host for figures built with the hairline-create skill. The skill hands a figure over
 * as `<name>.js`, a script that reads the engine from a global `HL` and ends with
 * `hairline({ name, means, rules, range, tour, mount })`. The bench page mounts it; this
 * module does the same for the playground and the example page, so the figure file is
 * shared unchanged between the bench, its look checks and the product.
 *
 * kernel.js is the package's src/core, copied verbatim from the skill (sha256 in its
 * first line). It is never edited here.
 */
import kernelSource from './kernel.js?raw';

export interface FigureDeclaration {
  name: string;
  means: string;
  rules: number[];
  /** The slider's number at intensity 0, 0.5 and 1. */
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string | null } }, value: number) => { set: (v: number) => void; destroy: () => void };
}

export interface MountOptions {
  intensity?: number;
  label?: string;
  onRead?: (text: string) => void;
  play?: boolean;
}

export interface FigureHandle {
  update: (opts: Partial<MountOptions>) => void;
  destroy: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Kernel = any;
let kernel: Kernel | null = null;

/** The engine, evaluated once. kernel.js declares `var HL = …` at its top level. */
export function HL(): Kernel {
  if (!kernel) kernel = new Function(`${kernelSource}\n;return HL;`)();
  return kernel;
}

const sources = import.meta.glob<string>('./figures/*.js', { query: '?raw', import: 'default' });

/** The names of the custom figures, from the files in ./figures. */
export const customFigures = Object.keys(sources).map((p) => p.split('/').at(-1)!.replace(/\.js$/, ''));

const declarations = new Map<string, Promise<FigureDeclaration>>();

/** Loads a figure file and returns its declaration instead of mounting it. */
export function loadFigure(name: string): Promise<FigureDeclaration> {
  let p = declarations.get(name);
  if (!p) {
    const key = `./figures/${name}.js`;
    const loader = sources[key];
    if (!loader) return Promise.reject(new Error(`hairline: no figure "${name}" in playground/hairline/figures/`));
    p = loader().then((src) => {
      let decl: FigureDeclaration | null = null;
      new Function('HL', 'hairline', src)(HL(), (d: FigureDeclaration) => { decl = d; });
      if (!decl) throw new Error(`hairline: ${name}.js never called hairline({ … })`);
      return decl;
    });
    declarations.set(name, p);
  }
  return p;
}

/** Intensity (0–1) to the figure's own number: two straight lines meeting at 0.5, as in the package. */
export const valueAt = ([lo, mid, hi]: [number, number, number], i: number) => {
  const t = Math.min(1, Math.max(0, Number.isFinite(i) ? i : 0.5));
  return Math.round((t <= 0.5 ? lo + (t / 0.5) * (mid - lo) : mid + ((t - 0.5) / 0.5) * (hi - mid)) * 1000) / 1000;
};

/** Mounts a declaration on an element, the way bench.html's `hairline()` does. */
export function mountFigure(el: HTMLElement, figure: FigureDeclaration, opts: MountOptions = {}): FigureHandle {
  const hl = HL();
  hl.inject(el.getRootNode());
  el.setAttribute('data-hairline', figure.name);
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', opts.label ?? figure.means);
  const svg = hl.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, el) as SVGSVGElement;

  let onRead = opts.onRead;
  let text: string | null = null;
  const read = {
    get textContent() { return text; },
    set textContent(value: string | null) { text = value == null ? '' : String(value); onRead?.(text); },
  };

  let intensity = opts.intensity ?? 0.5;
  const handle = figure.mount({ stage: el, svg, read }, valueAt(figure.range, intensity));
  if (text === null) read.textContent = 'rest';

  let playing: { stop: () => void } | null = null;
  const setPlay = (on: boolean | undefined) => {
    if (on && !playing) playing = hl.tour(el, figure.tour || hl.LAP, () => {});
    else if (!on && playing) { playing.stop(); playing = null; }
  };
  setPlay(opts.play);

  return {
    update(next) {
      if ('intensity' in next) { intensity = next.intensity ?? 0.5; handle.set(valueAt(figure.range, intensity)); }
      if ('onRead' in next) onRead = next.onRead;
      if ('label' in next) el.setAttribute('aria-label', next.label ?? figure.means);
      if ('play' in next) setPlay(next.play);
    },
    destroy() {
      setPlay(false);
      handle.destroy();
      svg.remove();
      el.removeAttribute('data-hairline');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    },
  };
}
