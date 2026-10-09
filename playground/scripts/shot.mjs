#!/usr/bin/env node
/**
 * Screenshot a playground page, so a change can be looked at without a hand on the browser:
 *
 *   pnpm shot <variant> <page> [--vp 1280] [--mode dark] [--out shots/name.png] [--viewport-only] [--at x,y]
 *   pnpm shot --url http://localhost:5173/canvas.html?variant=brand-v2&page=landing
 *
 * Starts Vite itself (no dev server needed), waits for fonts and figures to settle, writes a full-page
 * PNG under playground/shots/ (gitignored) and prints every console error or warning the page raised.
 * --at holds the pointer at a viewport point before the picture (for hover states and hairline figures).
 * Needs playwright-core (a devDependency) and a browser: Chrome, or `pnpm exec playwright-core install chromium`.
 */
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const flag = (name) => args.includes(`--${name}`);
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['viewport-only'].includes(args[i - 1].slice(2))));
const [variant, page] = positional;
const vp = Number(opt('vp', 1280));
const mode = opt('mode', 'light');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

let url = opt('url');
let server = null;
if (!url) {
  if (!variant || !page) { console.error('usage: pnpm shot <variant> <page> [--vp 1280] [--mode dark] [--out file.png] [--viewport-only] [--at x,y]  |  pnpm shot --url <url>'); process.exit(2); }
  server = await createServer({ root, logLevel: 'silent', server: { port: 0 } });
  await server.listen();
  const port = server.config.server.port ?? server.httpServer.address().port;
  const params = new URLSearchParams({ variant, page });
  if (mode !== 'light') params.set('mode', mode);
  url = `http://localhost:${port}/canvas.html?${params}`;
}
const out = resolve(root, opt('out', `shots/${variant ?? 'page'}-${page ?? 'url'}-${vp}${mode === 'light' ? '' : '-' + mode}.png`));
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
const tab = await browser.newPage({ viewport: { width: vp, height: 900 }, deviceScaleFactor: 1, colorScheme: mode === 'dark' ? 'dark' : 'light' });
const issues = [];
tab.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && issues.push(`${m.type()}: ${m.text()}`));
tab.on('pageerror', (e) => issues.push(`pageerror: ${e.message}`));
await tab.goto(url, { waitUntil: 'networkidle' });
await tab.evaluate(() => document.fonts.ready);
const at = opt('at');
if (at) { const [x, y] = at.split(',').map(Number); await tab.mouse.move(x, y); }
await tab.waitForTimeout(1800); // figure tweens (700ms) and springs settle
await tab.screenshot({ path: out, fullPage: !flag('viewport-only') });
await browser.close();
await server?.close();
console.log(`shot ${out}`);
if (issues.length) { console.log(issues.join('\n')); process.exitCode = 1; } else console.log('console clean');
