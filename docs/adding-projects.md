# Project Showcase — Adding and Updating Projects

> Version: 1.0 · Status: implemented content and component workflow  
> Read first: [`AGENTS.md`](../AGENTS.md) and [`project-schema.md`](./project-schema.md)

## Goal

An AI coding agent should add a project to the website without manually editing the home page, duplicating a detail page, changing the Astro router, or modifying the overall visual system. **One project data file + real image assets** should normally suffice.

## Preconditions

1. Work in the project repository and inspect its current files before making any changes.
2. Read `AGENTS.md`, `src/content.config.ts`, this guide, and a previously validated project entry.
3. Confirm that the user supplied enough authentic source information. Ask for missing facts when essential, or report a blocker rather than inventing public content.
4. Confirm at least one real, reachable HTTPS GitHub or Demo URL. If neither exists, do not publish an entry under the v1 contract.
5. Ensure all images are the user's own, properly licensed, or otherwise authorized for display.

## Step-by-step workflow

### Step 1 — Collect project facts

Gather:

- Real title and 30–100-character Traditional Chinese summary (approximate length).
- One allowed category; 1–8 canonical tech tags.
- Verified project creation/publication date and truthful status.
- Project background (`overview`), actual features, implementation, and results/limitations.
- Cover image and meaningful alt text; optional screenshot gallery.
- GitHub and/or live demo HTTPS URLs; at least one confirmed working.
- Whether the project should be eligible for the homepage's Featured Projects (`featured`).

Select featured eligibility from confirmed relevance and evidence rather than automatically featuring the newest project. Eligible entries still use the existing date/ID order, capped at three; custom ranking is not implemented or approved. Do not change dates to influence placement.

Do not claim work is completed because the user discussed a plan or prototype. For unfinished work use `in-progress` and separate implemented features from goals.

### Step 2 — Choose a canonical ID

Use a unique lowercase kebab-case ID, for example `coin-drop`. Check existing file names and IDs. Never reuse or silently rename an existing ID; this would affect its public URL.

### Step 3 — Prepare project images

Create `public/images/projects/<id>/` and add a genuine 16:9 cover (suggested name `cover.webp`) and any optional gallery images.

In JSON, store the public-root-relative path `/images/projects/<id>/cover.webp`. **Do not** include `public/`, the repository name, or the site's GitHub Pages base path. Renderers will use the centralized URL helper to resolve the actual deployed URL.

### Step 4 — Create one data file

Create `src/content/projects/<id>.json` using the schema in [`project-schema.md`](./project-schema.md). The current loader supports JSON only. The `id` field must equal the file stem. Use the GitHub repository's verified UTC creation date, following the established date convention.

Reuse known tag spellings and allowed category names. Enter `null` for an unavailable `links.github` or `links.demo`; never use a dummy URL or `#` as a replacement. Ensure at least one link is verified and non-null.

### Step 5 — Let Astro generate presentation

The implementation must load all validated projects through the `projects` Content Collection. The established homepage list and single dynamic route should handle the new project automatically:

- The project appears in All Projects.
- Search by title/summary/tag and category/tag filters include it.
- If `featured` is true, it is eligible for the three most recent Featured Projects.
- A new detail URL `/projects/<id>/` is generated under the configured base path.

AGENTS.md version 1.1 is implemented: detailed Featured Projects, a compact All Projects listing, and About before Skills. `ProjectCard` renders featured work and its first verified key feature; `ProjectRow` renders all entries, including featured ones, with at most three visible technology names and a remaining-tag count. All tags remain searchable and selectable. Technology choices are collapsed initially; selected names and their count stay visible outside the disclosure. New content automatically participates in both presentations without special homepage markup.

**Do not** edit `src/pages/index.astro` to hardcode a card or create `src/pages/projects/<id>.astro` for the new project.

### Step 6 — Verify locally

After dependencies and scripts exist, run from the repository root:

```bash
npm install          # required only on first setup or dependency changes
npm run check
npm test
npm run build
npm run check:publish # checks public link reachability; requires network
npm run dev -- --background
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution policy blocks npm. Open the printed localhost URL under `/project-showcase/`. Stop the background server with `npm.cmd run astro -- dev stop`. `check` and `test` are configured; no lint script is configured. After building, `npm run test:browser` uses locally installed Edge (or `EDGE_PATH`) to check the built site and save screenshots. Check actual outcomes; do not state commands succeeded unless they were executed.

Manual verification:

- New project card is visible, with correct cover, title, summary, tags and category.
- Clicking its details opens the correct project page; direct URL load/refresh works.
- GitHub/Demo buttons only appear for real links and lead to intended destinations.
- Search matches title, summary and tags (case-insensitive).
- Category is a single choice, selected technology tags use OR, and groups combine with AND.
- Empty state and Reset work.
- Existing projects remain visible, searchable, and correctly routed.
- Images and local paths load with GitHub Pages `base` configured.
- Keyboard navigation, meaningful alt text, mobile layout and reduced-motion behavior remain functional.

### Step 7 — Report the change

Use the `AGENTS.md` completion report format:

1. **Summary** — what the project adds.
2. **Files changed** — include paths for JSON and assets.
3. **Validation** — commands run and observed results; state any manual checks not performed.
4. **Compatibility** — existing projects and pages preserved.
5. **Open items** — factual gaps, missing links, screenshots, or failed checks.

## When a new component is necessary

Only extend components when the existing card/detail sections cannot adequately present a real project need (for example, an optional screenshot gallery).

1. Inspect existing `src/components/` first; reuse is preferred.
2. Write a small, typed component with one reusable responsibility, in the correct component folder.
3. Use shared design tokens, semantic HTML, keyboard-friendly interaction, responsive layout, and `prefers-reduced-motion`.
4. Keep project-specific facts in JSON/YAML rather than hardcoded inside a component.
5. Render optional content conditionally so projects lacking the field remain valid.
6. **Do not modify `src/content.config.ts` or core layouts without explicit user approval.** If a proposed component needs a new data field, request approval for that protected schema change first.
7. Build and inspect both the new display and at least one existing project without that optional feature.

## Updating an existing project

- Keep the existing `id` stable unless the user explicitly requests a URL migration.
- Modify only verified content that changed; do not overwrite unrelated details.
- If the status changes, update the description and results to remain honest.
- For new imagery, use the existing project image folder and update alt text.
- Retest the modified detail page and listing/filters.

## Testing AGENTS.md extensibility for the assignment

**Test A — Content extension:** Ask an AI agent to add a fourth *real* project from confirmed source material. It should edit only the new data and image assets in the ordinary case, and the existing templates should produce the new card and detail page automatically.

**Test B — Component extension:** Ask the AI to add a genuinely reusable, optional gallery component for projects that have verified screenshots. This is allowed within the existing schema's optional `gallery` field. Projects without a gallery must remain unchanged.

Document in `README.md` or the submission notes: the instruction given to AI, files actually modified, successful/failed checks, and a screenshot or URL showing the result. Do not claim these tests passed before running them.

## Never do these

- Do not fabricate project facts, dates, screenshots, technology lists, results or URLs.
- Do not store secrets or personal/private content in public files.
- Do not copy an entire HTML/Astro page for each project.
- Do not bypass validation or loosen the schema to accept incorrect content.
- Do not add a major dependency, new routing system, backend, CMS, or global redesign without explicit permission.
- Do not publish with broken internal links or missing project images.

## Definition of done

A project addition is complete only after the data passes validation, a static build succeeds, its card and detail route appear correctly, links/assets have been checked, filters work, and unchanged projects still function. Publishing and external GitHub Pages verification are separate final checks.
