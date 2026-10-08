/** WCAG 2.x contrast. Any CSS colour is normalised through a 1×1 canvas, so hex, rgb() and oklch() all work. */
let ctx: CanvasRenderingContext2D | null = null;

export function toRgb(color: string): [number, number, number, number] | null {
  ctx ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  // An invalid colour leaves fillStyle unchanged: two different sentinels expose that.
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  const first = ctx.fillStyle;
  ctx.fillStyle = '#fff';
  ctx.fillStyle = color;
  if (ctx.fillStyle !== first) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function luminance(color: string) {
  const rgb = toRgb(color);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const rating = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail');

/** Black or white, whichever reads better on `bg`. */
export const readableOn = (bg: string) => ((contrast(bg, '#000') ?? 21) >= (contrast(bg, '#fff') ?? 0) ? '#000' : '#fff');
