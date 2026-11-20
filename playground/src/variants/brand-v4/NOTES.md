# Brand v4: notes

Experimental. The `studio-landing` skill ("quiet page, loud weather") applied to **Brand v1**, the programme site (examples/landing-page.html, manageandmore.de). Brand v3 is the same skill over Brand v2; this one keeps v1's content, photography and colours.

## Decisions

- **Cluster: Architectural.** Sharp Sans is a geometric grotesk, which is the Architectural display face. Soft and Editorial both rest on a serif, and the brand has no serif (Sharp Sans or Work Sans only). Brand v1 is also already built like Architectural: hard black and white blocks plus one blue block. The warmth that Soft would get from a serif comes from candid MM photography instead (the cohort, Startup Tour dinner, coaching).
- **Serif question:** no serif anywhere. One weight (500) for headlines, body, numerals and labels. The one giant caps moment (800) is the outline wordmark in the footer.
- **Accent: blue `#00A2CD` is the one hue, both accent and low light.** Kuro uses its orange the same way, as the button and the glow. Yellow is left out because two saturated hues break the skill's one-accent rule, and guideline 04 already keeps yellow off the website.
- **Paper:** white, framed by the black photo hero and the black ending. Dark band is pure black with grain, which is on palette.
- **Radius:** pill for every control (the website's chips and stickers), 0 for every plate, photo, tile and block, and `radius.card` only inside the redrawn deadlines card. The cluster table suggests 0 or 4 to 8px. That conflicts with the binary non-negotiable, so the non-negotiable wins.
- **Labels:** 11px caps in Sharp Sans or Work Sans, not mono, because the brand has no mono.
- **Hero H1:** 64px bottom-left, not kuro's 198px caps. This follows the skill's H1 range of 52 to 70px, and the H1 has to be a sentence.
- **Copy:** facts from examples/landing-page.html and guidelines/12-voice-and-tone.md. H1: "Entrepreneurial leaders of tomorrow. / Students in Munich today." The closing keeps the same meter: "… / Applicants in Munich today." v1's triplets (Connect. Grow. Belong. / Learn. Lead. Launch. / Build. Scale. Succeed.) already follow the skill's beat rule, so they stay.
- **Wordmark:** the typeset name "MANAGE AND MORE" in outline caps, using the website's own two-tone outline material. It is not the logo. The logo, the BY UNTERNEHMERTUM label, the descriptor lockup and the symbol all come from asset files.
- **Automation:** `?static` or `navigator.webdriver` (`pnpm shot`) renders the pinned stage in its final state and skips the arrive animation. Fade-ups are an enhancement: content renders visible, and JS adds `data-v4-motion` before anything is hidden.

## Deliberate deviations from AGENTS.md

| Rule | Deviation | Reason |
|---|---|---|
| No gradients, shadows or glows | Black scrims on photos (bottom-weighted), a brand-blue low light at the hero and closing horizon and under the pinned stage, a fade mask on the deadlines card and on the photo edges | The skill's backdrop is weather with the light low, and every gradient carries grain. No card shadows: the only depth is the glass rim on the teaser and secondary pills. |
| Only palette colours | Ink at alpha (muted 70%, quiet 45% at display size only, hairlines 14%), tone tiles at ink 4.5%, white at alpha on black | The skill's muted text is ink at alpha. This matches the website's own opacity tokens. |
| Motion short and reactive only (no scroll-triggered entrances) | Hero arrive (1.25s, opacity, 22px, blur), block fade-ups on enter (18px), one pinned scroll stage on desktop (Learn. Lead. Launch., 4 photo plates) | The skill's "medium" profile. Everything moves opacity, light or at most 24px, on one curve `cubic-bezier(.22,1,.36,1)`. All of it stops under `prefers-reduced-motion`, and the stage is unpinned below 900px. |
| No marquees | Not used | Nothing to run in it: there are no partner logos in the repo. |
| Rounded corners only with radius tokens | Pill and card radius only, via `radius.chrome` and `radius.mockup` | Not a deviation, recorded for completeness. |
| Photos are references | Uses the website photos plus one PDF photo (principles-01) | Playground only. Rights and consent must be checked before anything is published. |

## Files

`tokens.json` (the skill's token table), `styles.css` (the language), `components/index.tsx` (button, header, backdrop, wordmark, page behaviour), `pages/LandingPage.tsx`.
