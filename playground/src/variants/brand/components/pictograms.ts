/** Web pictograms (assets/icons/web) as URLs, keyed by file name, for CSS masks. */
const files = import.meta.glob<string>('@ds/assets/icons/web/*.svg', { query: '?url', import: 'default', eager: true });

export const pictograms = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').at(-1)!.replace('.svg', ''), url]));
