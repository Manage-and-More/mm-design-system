#!/usr/bin/env node
/**
 * Rasterise an SVG with a real browser (Chrome via playwright-core), so CSS <style> blocks,
 * classes and currentColor render as on the web:  node scripts/render_svg.mjs in.svg out.png WIDTH
 * Used by scripts/build_v2_assets.py. Finds playwright-core in $PLAYWRIGHT_CORE_DIR, the repo's
 * playground/node_modules, or the hairline-create skill's cache; otherwise says how to install it.
 */
import { createRequire } from "node:module";
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [svg, png, width] = process.argv.slice(2);
if (!svg || !png || !width) { console.error("usage: node scripts/render_svg.mjs in.svg out.png WIDTH"); process.exit(2); }
const here = dirname(fileURLToPath(import.meta.url));
const home = process.env.HOME || process.env.USERPROFILE || "";
const candidates = [process.env.PLAYWRIGHT_CORE_DIR, resolve(here, "../playground/node_modules"), resolve(home, "Library/Caches/hairline-look/node_modules"), resolve(home, ".cache/hairline-look/node_modules")].filter(Boolean);
const dir = candidates.find((d) => existsSync(resolve(d, "playwright-core")));
if (!dir) { console.error("playwright-core not found; run `npm i -D playwright-core` in playground/ or set PLAYWRIGHT_CORE_DIR"); process.exit(2); }
const { chromium } = createRequire(resolve(dir, "x.js"))("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: Math.max(Number(width), 10), height: 10 }, deviceScaleFactor: 1 });
// a file:// page may load a file:// image; a page made with setContent (about:blank) may not
const tmp = mkdtempSync(resolve(tmpdir(), "render-svg-"));
const wrapper = resolve(tmp, "index.html");
writeFileSync(wrapper, `<!doctype html><html><body style="margin:0;background:transparent"><img id="i" src="${pathToFileURL(resolve(svg)).href}" style="display:block;width:${Number(width)}px;height:auto"></body></html>`);
await page.goto(pathToFileURL(wrapper).href, { waitUntil: "load" });
await page.waitForFunction(() => { const i = document.getElementById("i"); return i.complete && i.naturalWidth > 0; });
await page.locator("#i").screenshot({ path: resolve(png), omitBackground: true });
await browser.close();
rmSync(tmp, { recursive: true, force: true });
