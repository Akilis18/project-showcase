# AGENTS.md — Project Showcase

> Version: 1.1  
> Project: Project Showcase — A Scalable Developer Portfolio  
> Purpose: Give AI coding agents consistent, repeatable instructions for maintaining and extending this repository.

## 1. Mission and priorities

Build a public, responsive developer portfolio that showcases real projects and can grow through structured content and reusable components.

When instructions compete, use this priority order:
1. The user's explicit request and the actual repository state.
2. Data integrity, security, accessibility, and working builds.
3. The architecture, content schema, and design rules in this file.
4. Reuse and minimal changes over new abstractions.

**Do not fabricate** project achievements, dates, links, screenshots, technologies, or status. Ask for missing factual details when necessary; when proceeding without them, clearly flag the missing information rather than inserting fictional public content.

## 2. Technology and scope

- Framework: **Astro** with **TypeScript**, using static site generation (SSG).
- Content source: one **JSON** file per project by default; YAML is permitted if supported by the same collection schema.
- Content loading: **Astro Content Collections** and a schema validated with **Zod**.
- Styling: CSS and shared CSS custom properties; no UI framework required.
- Interactivity: small, accessible, client-side TypeScript/JavaScript for search and filters.
- Deployment: **GitHub Pages** through **GitHub Actions**.
- Site language: English navigation, controls, and section headings; **Traditional Chinese (`zh-TW`)** project descriptions and About text. Technical terms and proper nouns may remain in English.
- Theme: **dark only**. Do not add a light-theme toggle without explicit authorization.
- AI extensibility level: **Content + Components**. New project content and reusable components are allowed; architectural changes require explicit user approval.

Do not introduce a database, authentication, backend API, React, Tailwind, CMS, or major dependency without a clear need and user approval.

## 3. Planned repository structure

Use the existing repository as the source of truth. When initializing the project, follow this target layout; do not create empty files merely to satisfy the tree.

```text
project-showcase/
├── AGENTS.md
├── README.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   └── images/projects/<project-id>/
├── src/
│   ├── content.config.ts
│   ├── content/projects/<project-id>.json
│   ├── data/site.ts
│   ├── layouts/BaseLayout.astro
│   ├── layouts/ProjectLayout.astro
│   ├── components/layout/
│   ├── components/home/
│   ├── components/projects/
│   ├── components/shared/
│   ├── pages/index.astro
│   ├── pages/404.astro
│   ├── pages/projects/[id].astro
│   ├── scripts/project-filter.ts
│   ├── styles/tokens.css
│   ├── styles/global.css
│   └── utils/{projects,urls}.ts
└── docs/
    ├── project-schema.md
    └── adding-projects.md
```

Responsibilities:
- `src/content/projects/`: project facts only; no presentation logic.
- `src/content.config.ts`: authoritative collection schema and loader.
- `src/data/site.ts`: site-wide profile, social links, and skills; never embed secrets.
- `src/pages/`: routes, including one dynamic project route, not hand-written pages per project.
- `src/layouts/`: page-wide structure and metadata.
- `src/components/`: reusable presentation pieces.
- `src/scripts/`: browser interactions; keep JavaScript lightweight.
- `src/styles/tokens.css`: authoritative design tokens.
- `src/utils/urls.ts`: base-path-aware local routes and asset URLs.
- `public/images/projects/<project-id>/`: public project imagery.
- `docs/`: human-readable content and contribution guidance; keep aligned with the code.

## 4. Pages and navigation

### Home (`/`)

Render sections in this order:
1. Hero (concise personal introduction)
2. Featured Projects (up to three, presented with more detail)
3. All Projects (compact listing with search, category, and technology filters)
4. About Me
5. Skills / Tech Stack
6. Contact / Social

Include a responsive navigation bar and footer. Projects, About, and Contact link to home-page sections; do not introduce redundant pages.

### Home presentation responsibilities

- **Hero:** Lead with the confirmed public name, development focus, and a short introduction. Provide a primary Projects link and a secondary Contact link. Keep the introduction short enough to reach project evidence quickly on mobile; decorative artwork must not dominate the first screen. When profile facts are missing, show an explicit pending state instead of inventing a name, role, availability, or expertise.
- **Featured Projects:** Explain selected work using verified summaries and, where available, the owner's contribution, a technical decision, and genuine project imagery. Use the existing content fields; do not introduce mandatory fields or hardcode project facts in components. Keep detailed implementation and limitations on the shared detail page. Source-based diagrams must be labeled as diagrams, not screenshots.
- **All Projects:** Include every valid entry, including featured entries, in compact rows or compact cards. Prioritize title, category, a short summary, a small selection of technology tags, and a clear detail link. Avoid repeating the full-size featured presentation or requiring visitors to scroll past the same large images twice. Compact presentation must preserve readable text and touch-friendly targets.
- **Filters:** Keep search and category selection easy to find. Technology choices should have less visual prominence than the projects; an accessible disclosure may keep a long tag list compact, especially on mobile. Preserve all filter behavior in section 7 and make active technology selections discoverable even when choices are collapsed.
- **About and Skills:** Place About before Skills. About explains the person's background and interests using confirmed Traditional Chinese text. Skills support that context; project technology tags alone do not establish personal proficiency. Do not invent ratings, years of experience, or skill percentages.
- **Contact:** Keep the full Contact / Social section at the end and make it reachable from the hero and navigation. Render only confirmed public contact destinations. A section link may lead to an explicit pending state when destinations have not been supplied.

**Implementation status:** Version 1.1 presentation is implemented: a concise hero, detailed featured cards, compact listing entries, collapsible technology choices with visible selections, and About before Skills. The profile remains explicitly pending until confirmed facts are supplied. Current screenshots and checks are recorded in `docs/validation.md`; the original implementation evidence there is historical.

### Project details (`/projects/<id>/`)
Generate every project detail page from the collection using one reusable Astro route and one shared layout. Display the following in order:
1. Header: title, category, summary, date, status
2. Cover image
3. Overview
4. Key Features
5. Tech Stack
6. Development / Implementation
7. Results / Limitations
8. Available GitHub / Live Demo links
9. Back to Projects

Optional image galleries or special components may supplement these sections but may not replace the required information. Project pages must work when loaded directly or refreshed.

## 5. Visual design system

Use a modern, restrained, dark developer aesthetic. Start with these token values and define them centrally in `src/styles/tokens.css`:

| Token | Value | Purpose |
| --- | --- | --- |
| `--color-bg` | `#0B1020` | Page background |
| `--color-surface` | `#151C30` | Cards and surfaces |
| `--color-primary` | `#3B82F6` | Primary controls |
| `--color-accent` | `#8B5CF6` | Decorative accents |
| `--color-text` | `#E5E7EB` | Primary text |

Additional tokens for muted text, borders, spacing, radius, focus, and breakpoints should be named consistently and reused. Never hardcode arbitrary colors throughout individual components.

- Use clean sans-serif typography with appropriate Traditional Chinese fallbacks; monospaced fonts only for technical labels or code.
- Use a consistent spacing scale, clear section hierarchy, restrained rounded cards and subtle borders.
- Cover-image presentation is **16:9**; use responsive images without distorting subjects.
- Motion is **moderate**: primarily 150–300 ms hover, fade, and small translation effects. Avoid distracting continuous effects.
- Honor `prefers-reduced-motion`; make interactions fully usable without animation.
- Ensure keyboard focus indicators, readable contrast, descriptive alt text, semantic markup, and touch-friendly targets.
- Layout must remain usable at viewport widths of **320px and above**, without horizontal overflow.
- Reuse existing components and styles before introducing a new pattern.

## 6. Project content contract

The content schema in `src/content.config.ts` is the **machine-enforced source of truth**. Keep it consistent with the following specification and `docs/project-schema.md` when that document exists.

One file corresponds to one project. Filename and `id` must match and use unique lowercase kebab-case, e.g. `coin-drop.json` with `id: "coin-drop"`. All dates must be valid `YYYY-MM-DD` calendar dates.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique lowercase kebab-case; equals file stem |
| `title` | string | Yes | Real project name |
| `summary` | string | Yes | Traditional Chinese, approximately 30–100 characters when practical |
| `category` | enum | Yes | `AI / ML`, `Web Development`, `Game`, `Research`, `Other` |
| `tags` | string[] | Yes | 1–8 distinct canonical technology names |
| `date` | string | Yes | Verified project creation/publication date, `YYYY-MM-DD` |
| `status` | enum | Yes | `completed`, `in-progress`, `archived` |
| `featured` | boolean | Yes | Eligibility for Featured Projects |
| `coverImage` | string | Yes | Existing image path under the project's public image directory |
| `coverAlt` | string | Yes | Meaningful image description |
| `overview` | string | Yes | Project background and objective, in Traditional Chinese |
| `features` | string[] | Yes | At least one real key feature |
| `implementation` | string | Yes | Actual implementation approach, in Traditional Chinese |
| `results` | string | Yes | Verified outcomes and limitations, in Traditional Chinese |
| `links` | object | Yes | Optional `github` and `demo` URLs; **at least one must be a verified working URL** |
| `gallery` | object[] | No | Optional `{ image, alt, caption }` objects with existing images |

Do not use placeholder/example project data in the deployed public portfolio. If no confirmed external link is available for a real project, report the blocker; do not create fake links or silently weaken the schema. Link field values should be either valid HTTPS URLs or omitted/null as allowed by the schema. Never render an absent link as a clickable button.

For images, store repository-relative public paths consistently; define one convention in the schema and URL helper, and ensure the deployed URL respects Astro's base path. For tags, reuse canonical names (e.g. `TypeScript`, not separately `TS` and `typescript`). Do not duplicate project IDs or ambiguous classification labels.

**Initial content:** three verified real projects. Candidate projects must not be described as complete unless confirmed. Use `in-progress` honestly when appropriate.

## 7. Project listing behavior

- Render all valid collection entries in All Projects.
- Sort All Projects by `date` descending and then `id` ascending for a deterministic tie-breaker.
- Treat `featured` as editorial eligibility: select it based on confirmed relevance, contribution, and available evidence, not simply recency. Do not change a project's eligibility without user direction or verified context supporting that choice.
- Feature at most three eligible projects using the existing `date` descending / `id` ascending order. Manual featured ranking is not introduced in version 1.1; adding a ranking field or changing the ordering algorithm requires explicit approval and synchronized schema, implementation, documentation, and tests. Never alter factual dates to manipulate placement.
- Use distinct shared presentation responsibilities for detailed featured cards and compact listing entries; both must read from the same collection and link to the same detail route.
- Search title, summary, and technology tags case-insensitively.
- Category filter selects one category or All.
- Technology tag filter permits multiple tags using **OR** within the selected tags.
- Combine search query, category, and technology filters using **AND**.
- Provide a visible reset action and an empty-results message.
- Search and filter behavior must support keyboard use; visible controls must have accessible labels.
- All filtered items must link to the base-path-aware project route.

## 8. Component extensibility rules

You **may** create a new reusable component when existing components cannot reasonably represent a legitimate project need (e.g. a screenshot gallery). Follow this procedure:
1. Inspect existing components and patterns first.
2. Identify the reusable responsibility and design a small typed props interface.
3. Put the component under the appropriate `src/components/` subdirectory.
4. Use shared tokens, responsive rules, semantic markup, and accessible interaction.
5. Keep project-specific content in JSON/YAML, not hardcoded in the component.
6. Make optional content conditional so existing projects do not break.
7. Test the component in at least one real context and check unaffected pages.

Do not duplicate an entire page or introduce one-off design systems for different projects. No unapproved changes to navigation, routes, data schema, layouts, build configuration, or major dependencies.

## 9. Change boundaries

| Area | Agent permission |
| --- | --- |
| `src/content/projects/` | Add or update verified content following schema |
| `public/images/projects/` | Add or update legitimate, properly named assets |
| `src/components/` | Add/edit reusable components when needed and tested |
| `src/scripts/`, component-local styling | Change only when necessary for the requested feature |
| `src/styles/tokens.css` | Preserve shared design semantics; request approval for system-wide redesign |
| `src/layouts/`, `src/pages/` | Protected: require explicit user request for architectural change |
| `src/content.config.ts` | Protected: schema changes require explicit user approval |
| `astro.config.mjs`, GitHub workflows | Protected: deployment/build changes require explicit user approval |
| `AGENTS.md` | Protected: do not relax rules to make a task pass |

Changes to existing protected files needed during **initial project setup** are allowed to implement this approved specification. After the initial architecture exists, treat them as protected.

Always inspect current files before editing; do not overwrite unrelated user changes, reformat unrelated code, or delete content to simplify a task.

## 10. Standard AI workflow

For **adding a project**:
1. Read `AGENTS.md`, inspect `src/content.config.ts`, and review existing project files.
2. Check that provided facts, completion status, assets, and links are authentic.
3. Select a unique slug, canonical category, and canonical technology tags.
4. Create one JSON file in `src/content/projects/` and place images in its project image directory.
5. Use the existing detail route and components; do **not** write a new page for the project.
6. Run available validation/build checks and verify that listing, filtering, and generated detail routes work.
7. Summarize added/modified files, tests performed, and any unresolved missing data.

For **adding a reusable component**:
1. Confirm existing components cannot meet the need.
2. Implement a small typed, accessible, responsive component using design tokens.
3. Integrate it without requiring every project to supply new optional fields.
4. Test the new behavior and representative existing pages.
5. Explain where the component can be reused.

For **any change**, make the minimum necessary edit, preserve established behavior, and never claim a test passed without running it.

For **implementing the version 1.1 presentation**:
1. Inspect the existing hero, listing, cards, home route, styles, and browser tests before editing.
2. Implement the approved section order and presentation responsibilities in section 4 using shared tokens and existing content fields.
3. Preserve routes, URL helpers, schema, project facts, featured eligibility, and filtering semantics unless separately authorized.
4. Update browser expectations for the new heading order; verify compact entries still expose every project and support every filter.
5. Verify desktop and mobile presentation, keyboard access, expanded/collapsed filters if used, and the no-JavaScript fallback. All projects must remain readable without JavaScript.
6. Refresh screenshots and validation notes only after running the relevant checks; identify older evidence as historical where needed.

Documentation approval establishes the version 1.1 target; it does not itself require editing application code. A subsequent request to implement this presentation authorizes the necessary home-page and component changes within this target, without authorizing unrelated architecture, schema, or deployment changes.

## 11. Quality gates and acceptance criteria

Run these checks when the necessary scripts/dependencies are present:

```bash
npm install
npm run build
```

If the project defines `check`, `lint`, or `test` scripts, run the relevant ones as well. For Astro type/diagnostic checks, prefer the repository's configured check script; do not assume `astro check` dependencies are installed. If a command cannot run, explain why rather than reporting success.

For documentation-only edits, inspect the diff and check consistency of requirements and implementation-status wording; installation, builds, and browser tests are not required when executable files and dependencies are unchanged. For presentation changes, run the configured `check`, `test`, `build`, and `test:browser` scripts when available. Run `check:publish` when changing public project links/content or preparing publication, and report network limitations honestly.

Before completing work, verify:
- No duplicate IDs or invalid project data; missing images and dead links are reported.
- The home page follows Hero → Featured Projects → compact All Projects → About → Skills → Contact.
- The hero provides confirmed identity/context where available and links to Projects and Contact; missing personal facts remain explicit.
- All Projects includes featured entries without duplicating the full-size featured presentation. Filters do not overwhelm the mobile listing.
- At least three real projects appear in the initial published version.
- Every project has a directly loadable, refresh-safe detail URL.
- Search, category, tag filters, reset, and empty state function as specified.
- Mobile layout, focus states, alt text, and reduced-motion behavior are acceptable.
- No secrets, private information, or invented project claims are committed.
- Static build succeeds and GitHub Pages assets/routes work under the configured `base` path.

**AI extensibility demonstration:** (A) Add a fourth real project by adding structured content and images, without copying a detail page or editing home-page project markup. (B) Add or reuse one optional shared display component without breaking existing projects. Document both changes in the README or submission evidence.

## 12. Deployment and documentation

- Use GitHub Pages with the official Astro-compatible GitHub Actions workflow.
- Configure the published `site` URL and `base` for the **actual** repository name. Never guess a username, live URL, or deployed status.
- Handle internal navigation and public assets through base-aware paths rather than assuming the site lives at `/`.
- Commit the package manager lockfile so CI uses reproducible dependencies.
- Keep `README.md` current: project overview, feature list, installation/build instructions, adding-project workflow, repository URL, and actual deployed URL when known.
- Keep `docs/project-schema.md` and `docs/adding-projects.md` synchronized with implemented behavior after those files exist.
- Never state that GitHub Pages is live until the published URL has been verified.

## 13. Completion report format

After an AI coding task, provide a concise report with:
1. **Summary** — what changed and why.
2. **Files changed** — paths and responsibilities.
3. **Validation** — commands run and their actual outcomes.
4. **Compatibility** — how existing pages/projects were preserved.
5. **Open items** — missing project facts, unverified links, or follow-up work.

This document governs future additions to Project Showcase. Extend the website by reusing its content schema and components, **not** by rebuilding each page from scratch.
