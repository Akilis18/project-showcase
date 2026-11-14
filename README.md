# Project Showcase

A static developer portfolio built with Astro and TypeScript. Four real projects are loaded from validated JSON content and rendered through shared cards and a single detail route. Navigation is in English; project descriptions are in Traditional Chinese. The site uses a responsive dark theme with accessible search, category and technology filters.

Repository: https://github.com/Akilis18/project-showcase

Run commands from this repository's root:

```powershell
npm.cmd ci
npm.cmd run dev -- --background
npm.cmd run build
npm.cmd run check
npm.cmd test
npm.cmd run check:publish
npm.cmd run test:browser
npm.cmd run preview
```

Use a Node.js version satisfying `package.json`'s `engines` requirement. Stop a background development server with `npm.cmd run astro -- dev stop`.

Open `http://localhost:4321/project-showcase/` when using the default development port. Use the actual port printed by Astro if it differs. Preview normally uses port 4321 as printed by the command. Bare `astro` commands are not on PowerShell's PATH; use `npm.cmd run astro -- <command>`.

`check` runs Astro diagnostics; `test` runs filter logic tests. `check:publish` checks the minimum project count and working public links and requires network access. `test:browser` checks the built output with an installed Microsoft Edge browser on Windows (set `EDGE_PATH` for another Chromium executable). It verifies filters, direct detail routes, image loading, gallery presence/absence, keyboard skip navigation, reduced motion, no-JavaScript fallback, and overflow at 320–1440px, and writes screenshots to `docs/evidence/`. Build first. Browser automation is a smoke check, not a full accessibility audit.

Source pages live in `src/pages/`, reusable UI in `src/components/`, project JSON in `src/content/projects/`, profile configuration in `src/data/site.ts`, and public assets in `public/`. Build output is in `dist/`. Follow [AGENTS.md](AGENTS.md), [the project schema](docs/project-schema.md), and [the adding-projects guide](docs/adding-projects.md).

To add a project, verify its facts and public links, add `src/content/projects/<id>.json` plus legitimate assets under `public/images/projects/<id>/`, then run the checks. No new page or homepage markup is needed. The schema rejects invalid dates, duplicate tags, mismatched filenames, missing links and missing or escaping image paths. The loader supports JSON only. Projects sort by date descending, then ID ascending. Technology filters use OR within selected tags and AND with search/category.

The optional `ProjectGallery` component displays supplied project images; omitting `gallery` renders no gallery. Cover assets currently use labeled, source-based SVG implementation diagrams. These are not fabricated UI screenshots. Coin Drop also includes its genuine repository trajectory figure. See [content evidence](docs/content-evidence.md) for sources, dates, and limitations.

Extensibility demonstrations: after building with three projects, Dungeon was added with only its JSON and image asset; the homepage, card, listing and detail layout hashes stayed unchanged and a new static detail route was generated. The shared optional gallery was verified on Coin Drop and absent on the other projects. See [validation evidence](docs/validation.md) and [desktop](docs/evidence/home-desktop.png) / [mobile](docs/evidence/home-mobile.png) screenshots.

The generated starter's [README](docs/astro-starter-readme.md) and [agent instructions](docs/astro-starter-instructions.md) are retained for reference. The root `AGENTS.md` remains the repository's governing instructions.

GitHub Pages configuration uses `site: https://Akilis18.github.io` and `base: /project-showcase`, derived from the actual repository remote. The workflow uses the official Astro action, diagnostics, filter tests and a publication link check. In GitHub repository **Settings → Pages**, select **GitHub Actions**. After committing and pushing to `main`, inspect the workflow's deployment URL. No commit, push or remote deployment was performed in this task. The expected URL is `https://Akilis18.github.io/project-showcase/`; it is not a verified live deployment.

Open items: provide your public name, Traditional Chinese About text, confirmed skills and contact/social links in `src/data/site.ts`. Missing profile facts are explicitly marked pending. Project statuses remain `in-progress` until you confirm them. Project source was reviewed; the original games, backend, hardware and model training were not executed as part of this portfolio task.
