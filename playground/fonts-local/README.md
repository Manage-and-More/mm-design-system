# Local fonts (not committed)

Drop licensed font files here to preview them in the playground. Everything except this README is gitignored, so licensed files such as Sharp Sans never reach the repository ([AGENTS.md](../../AGENTS.md)).

Name files `<Family>-<Weight>[Italic].woff2`. The family is split at capital letters and the weight comes from its name:

| File | Registered as |
|---|---|
| `SharpSans-Medium.woff2` | "Sharp Sans" 500 |
| `SharpSans-Extrabold.woff2` | "Sharp Sans" 800 |
| `SharpSans-BoldItalic.woff2` | "Sharp Sans" 700 italic |

The canvas registers them with the FontFace API (`src/core/fonts.ts`) before a page renders, so the token stacks (`"Sharp Sans", "Work Sans", …`) pick them up. With the folder empty, pages fall back to Work Sans, exactly like `examples/landing-page.html`.
