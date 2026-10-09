/** Appended to examples/hairline-figures.js by build_figures.mjs: the public mount, as in the bench page. */
const names = () => [...figures.keys()];

const valueAt = ([lo, mid, hi], i) => {
  const t = Math.min(1, Math.max(0, Number.isFinite(i) ? i : 0.5));
  return Math.round((t <= 0.5 ? lo + (t / 0.5) * (mid - lo) : mid + ((t - 0.5) / 0.5) * (hi - mid)) * 1000) / 1000;
};

/** Mounts a custom figure on `el`; options: intensity (0–1), label, onRead(text), play. Returns { update, destroy }. */
function mount(el, name, opts = {}) {
  const figure = figures.get(name);
  if (!figure) throw new Error(`hairline: no figure "${name}"; have ${names().join(", ")}`);
  HL.inject(el.getRootNode());
  el.setAttribute("data-hairline", figure.name);
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", opts.label ?? figure.means);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, el);
  let onRead = opts.onRead, text = null;
  const read = { get textContent() { return text; }, set textContent(v) { text = v == null ? "" : String(v); onRead?.(text); } };
  let intensity = opts.intensity ?? 0.5;
  const handle = figure.mount({ stage: el, svg, read }, valueAt(figure.range, intensity));
  if (text === null) read.textContent = "rest";
  let playing = null;
  const setPlay = (on) => {
    if (on && !playing) playing = HL.tour(el, figure.tour || HL.LAP, () => {});
    else if (!on && playing) { playing.stop(); playing = null; }
  };
  setPlay(opts.play);
  return {
    update(next) {
      if ("intensity" in next) { intensity = next.intensity ?? 0.5; handle.set(valueAt(figure.range, intensity)); }
      if ("onRead" in next) onRead = next.onRead;
      if ("label" in next) el.setAttribute("aria-label", next.label ?? figure.means);
      if ("play" in next) setPlay(next.play);
    },
    destroy() { setPlay(false); handle.destroy(); svg.remove(); for (const a of ["data-hairline", "role", "aria-label"]) el.removeAttribute(a); },
  };
}

window.HairlineFigures = { mount, names };
