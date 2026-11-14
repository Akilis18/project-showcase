# Validation and extensibility evidence

Validated locally on 2026-11-14 with Node.js 26.13.1 and npm 11.20.0. Production workflow uses Node.js 24. No remote deployment was performed or verified.

| Check | Actual result |
| --- | --- |
| `npm.cmd install --no-audit --no-fund` | Passed for the existing app dependencies. Diagnostic dependencies were then installed and the lockfile updated. |
| `npm.cmd run check` | Passed: 22 files, zero errors, warnings or hints. |
| `npm.cmd test` | Passed: three tests covering title/Chinese summary/tag search, tag OR, cross-filter AND and cleared filters. |
| `npm.cmd run build` | Passed: home, 404 and four project detail pages, six static pages total. |
| `npm.cmd run check:publish` | Passed: four project entries each have a reachable public repository link. |
| `npm.cmd run test:browser` | Passed using installed Edge and a temporary local static server serving the build under `/project-showcase/`. |

The initial checker installation timed out; retrying with IPv4 succeeded. Missing Node type definitions were then installed and diagnostics passed. Astro telemetry was disabled for build/diagnostic commands in the restricted environment because its user configuration directory was outside the writable workspace. These are environment-specific details, not changes to application behavior.

## Browser verification

The dependency-free `scripts/browser-smoke.mjs` script checks the generated build using Chromium's debugging protocol. It launches a hidden headless browser with a temporary profile, serves only `dist/` under the configured base, and tears down its own server/browser afterward.

Verified:

- All required homepage headings, every collection entry, and at most three featured cards.
- Case-insensitive technology search, category selection, multiple tags using OR, AND across groups, empty results and reset. Node tests separately cover title and Traditional Chinese summary matching.
- Direct navigation to every generated project URL and all required detail sections.
- Image loading and nonempty alt text; correct base-path asset requests; no failed HTTP requests or runtime exceptions.
- Gallery on Coin Drop; no gallery markup on entries without gallery data; no buttons for absent links.
- No horizontal overflow at home widths 320, 375, 768 and 1440px and detail widths 320 and 1440px.
- Keyboard Tab reaches the visible skip link, reduced motion disables smooth scrolling, and all cards remain available with scripts disabled while filter controls remain hidden.

Screenshots: [desktop homepage](evidence/home-desktop.png), [mobile homepage](evidence/home-mobile.png). These show the actual portfolio, including explicitly pending profile details. Browser automation is not a full accessibility audit or validation of the showcased applications. Screen-reader experience and physical-device touch use were not manually tested.

## A. Fourth real project through content

User instruction: “Read AGENTS.md and complete the project,” followed by the four real repository URLs. Dungeon became publicly readable after the first three projects had already built and passed browser checks.

After source review, adding Dungeon required only:

- `src/content/projects/dungeon.json`
- `public/images/projects/dungeon/cover.svg`

The subsequent build generated `dist/projects/dungeon/index.html`, included its card in All Projects, and retained the original three featured projects. No new detail page or home-page project markup was created. The browser test was generalized to derive expected category/tag/gallery results from content, so future entries require no changes to test expectations.

SHA-256 values below matched before and after the content addition:

| Shared file | SHA-256 |
| --- | --- |
| `src/pages/index.astro` | `5A7F1BD0BFFC6F97D169330BCBFA29BE1405F3A3147863C21B199596F0415549` |
| `src/layouts/ProjectLayout.astro` | `B12F0537C22D5CF230EB6BBCA1F26B032B41801411ABBAD6CF5340963939F649` |
| `src/components/projects/ProjectCard.astro` | `B5418A17E9284ADCED803535530521553466485FC36E7D3165D62ADF7AFED5EC` |
| `src/components/projects/ProjectListing.astro` | `FF2874415C1A942D10410E4F38C1C3BED317A91FF8004559D418DF98A4E7EC5F` |

## B. Optional shared display component

The specification requests a reusable optional component demonstration. `src/components/projects/ProjectGallery.astro` takes a typed optional array of image/alt/caption entries already allowed by the schema. The shared project layout passes `gallery`; project facts remain in JSON. Each image links to its full-resolution asset without a modal or additional JavaScript.

Coin Drop uses its genuine repository trajectory figure. Auto Car, Draw & Guess and Dungeon omit gallery content. The final four-project browser run verified both presence and absence, image loading and the unaffected required detail sections. No schema extension was necessary.

## Remaining owner input and deployment

- Confirm public name, About text, skills and contact/social links in `src/data/site.ts`.
- Confirm project completion statuses; all four remain `in-progress` and disclose verification limits.
- Review source-based SVG cover diagrams; genuine screenshots may replace or supplement them when available.
- Enable GitHub Actions as the Pages source, commit and push the reviewed files, then verify the successful workflow's published URL. Expected address: `https://Akilis18.github.io/project-showcase/` (not verified live).

The implementation follows [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) and the [official GitHub Pages deployment guidance](https://docs.astro.build/en/guides/deploy/github/).
