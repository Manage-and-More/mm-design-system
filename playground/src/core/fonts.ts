/**
 * Licensed fonts (Sharp Sans) live only on your machine, in playground/fonts-local/
 * (gitignored). Files named <Family>-<Weight>[Italic].woff2 are registered with the
 * FontFace API, e.g. SharpSans-Medium.woff2 → "Sharp Sans" 500. Missing files are
 * simply skipped, so the token stacks fall back to Work Sans.
 */
const files = import.meta.glob<string>('../../fonts-local/*.{woff2,woff,ttf,otf}', { query: '?url', import: 'default', eager: true });

const WEIGHTS: Record<string, number> = {
  thin: 100, hairline: 100, extralight: 200, ultralight: 200, light: 300, regular: 400, normal: 400, book: 400,
  medium: 500, semibold: 600, demibold: 600, bold: 700, extrabold: 800, ultrabold: 800, heavy: 900, black: 900,
};

export function parseFontFile(file: string) {
  const name = file.split('/').at(-1)!.replace(/\.(woff2?|ttf|otf)$/, '');
  const [rawFamily, rawStyle = 'Regular'] = name.split('-');
  const italic = /italic/i.test(rawStyle);
  const weightKey = rawStyle.replace(/italic/i, '').toLowerCase() || 'regular';
  return {
    family: rawFamily.replace(/([a-z])([A-Z])/g, '$1 $2'),
    weight: WEIGHTS[weightKey] ?? 400,
    style: italic ? 'italic' : 'normal',
  };
}

export const localFonts = Object.entries(files).map(([file, url]) => ({ ...parseFontFile(file), url }));

export async function registerLocalFonts() {
  await Promise.all(
    localFonts.map(async ({ family, weight, style, url }) => {
      const face = new FontFace(family, `url("${url}")`, { weight: String(weight), style, display: 'swap' });
      try {
        document.fonts.add(await face.load());
      } catch {
        console.warn(`[fonts-local] could not load ${url}`);
      }
    }),
  );
}
