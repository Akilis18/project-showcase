# Project Showcase — Project Content Schema

> Version: 1.0 · Status: implemented in `src/content.config.ts`  
> Companion: [`AGENTS.md`](../AGENTS.md)  
> Applies to: `src/content/projects/*.json`

## 1. Purpose and authority

Each real portfolio project is represented by **one structured data file**. Astro Content Collections loads project files, validates them with Zod, and generates both list cards and detail pages from the same data. **The implemented Zod schema in `src/content.config.ts` is the executable source of truth**; changes to this document and to the code must remain synchronized. Follow the modification boundaries in `AGENTS.md`.

The implemented loader supports JSON only. YAML is not currently loaded. Never publish invented facts, links, images, project achievements, or completion dates.

## 2. Collection and identity

- Collection name: `projects`.
- Content directory: `src/content/projects/`.
- File pattern: `*.json`, directly inside the content directory (no nested project files).
- **One file per project**: `coin-drop.json`, not `coin-drop/page.html`.
- Every file has an explicit `id` equal to its filename stem. Use `generateId` or equivalent mapping in the loader so collection entry IDs and declared IDs agree; otherwise reject mismatches during validation.
- IDs are globally unique and match `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- The public project route is generated at `projects/<id>/` under the site's configured Astro base path. Never hardcode a new route per project.

## 3. Required fields

| Field | Type | Validation / semantics |
| --- | --- | --- |
| `id` | string | Unique kebab-case; exactly matches file stem and route ID |
| `title` | nonempty string | Real, user-confirmed project title |
| `summary` | nonempty string | Traditional Chinese, approximately 30–100 characters where practical; concise card text |
| `category` | enum | One of `AI / ML`, `Web Development`, `Game`, `Research`, `Other` |
| `tags` | string[] | 1–8 unique, nonempty canonical technology tags |
| `date` | string | Real creation or publication date, `YYYY-MM-DD`; reject impossible calendar dates |
| `status` | enum | `completed`, `in-progress`, `archived` |
| `featured` | boolean | Eligible for Featured Projects; home shows only the three newest eligible entries |
| `coverImage` | string | Public-root-relative path `/images/projects/<id>/<filename>`; file must exist |
| `coverAlt` | nonempty string | Meaningful description of cover image in Traditional Chinese |
| `overview` | nonempty string | Project motivation and goals in Traditional Chinese |
| `features` | string[] | At least one concrete, factual feature; all entries nonempty |
| `implementation` | nonempty string | Actual methods, architecture, or development details in Traditional Chinese |
| `results` | nonempty string | Factual outcomes and limitations in Traditional Chinese; report pending work honestly |
| `links` | object | Keys `github` and `demo`, each HTTPS URL or `null`; at least one **verified public working link** |

### Status meanings

- `completed`: requested scope is implemented and verifiable (not necessarily perfect).
- `in-progress`: some features are unfinished; clearly distinguish implemented from planned outcomes.
- `archived`: no longer actively developed; do not imply it is currently maintained.

### Date policy

Use one consistent meaning of `date`: **the GitHub repository creation date in UTC**, verified through the repository API. This is not necessarily the start of development or a completion date. If only an approximate date is known, request a verified calendar day rather than manufacturing one. A changed `date` affects default sorting. See `docs/content-evidence.md` for the current sources.

## 4. Optional fields

| Field | Type | Validation / semantics |
| --- | --- | --- |
| `gallery` | array | Optional list of `{ image, alt, caption }` entries |

Gallery fields:

- `image`: required public-root-relative `/images/projects/<id>/<filename>` path; file must exist.
- `alt`: required meaningful Traditional Chinese image description.
- `caption`: optional Traditional Chinese text; omit if unnecessary.

Optional galleries are additive: projects without `gallery` must still render correctly. Adding other fields, including a new rich media type, requires explicit approval to change the protected schema.

## 5. Image and URL rules

- Place files under `public/images/projects/<id>/`; example `public/images/projects/coin-drop/cover.webp`.
- Store **public-root-relative** image paths in data, e.g. `/images/projects/coin-drop/cover.webp`. Do **not** store `public/`, repository names, `https://...github.io`, or the configured `base` prefix in the content field.
- At render time, a shared URL helper prefixes the current Astro base path **exactly once**. For example, with `base: '/project-showcase'`, the resulting URL is `/project-showcase/images/projects/coin-drop/cover.webp`.
- Apply the same helper to internal links, such as `/projects/coin-drop/`, so deep links work on GitHub Pages.
- Prefer consistent 16:9 covers; keep originals sharp and unwarped. Use suitable optimized web formats (WebP/AVIF/PNG/JPEG or SVG diagrams), with correct alt text and rights to use the images. Current covers are labeled diagrams derived from inspected source, not screenshots or claims of runtime verification.
- `links.github` and `links.demo` are either valid HTTPS URLs or `null`. Missing URLs must not render as buttons. At least one **confirmed working** public link is required under the v1 schema. If neither is available, omit the project from the published collection until the user confirms a real link; do not weaken the rule without approval.
- The schema checks image directory ownership, traversal, and local file existence at build time. `npm run check:publish` requires at least three entries and at least one reachable HTTPS link per entry. Factual accuracy and image authenticity require source review; link checks can fail because of network or access restrictions.

## 6. Tags and categories

Use exactly one primary category. Reuse existing canonical tag spellings; examples: `Python`, `TypeScript`, `JavaScript`, `Astro`, `Gradio`, `PyTorch` (only if actually used). Never create separate tags `TS` and `TypeScript` or invent technologies.

Filtering must implement:

1. Case-insensitive text search over `title`, `summary`, and `tags`.
2. Single category selection or All.
3. Multi-select technology tags with **OR** across selected tags.
4. **AND** across search, category, and tag groups.
5. Clear filters and empty-results feedback.

All Projects sort: `date` descending, then `id` ascending. Featured: first three entries with `featured: true` using the same sort order.

`featured` expresses editorial eligibility, not a numeric rank. Eligibility should reflect confirmed relevance, contribution, and evidence; the existing deterministic order still chooses and orders up to three eligible entries. Manual ranking and additional schema fields are not approved by the presentation revision. Never modify factual dates to change placement.

AGENTS.md version 1.1 is implemented with detailed featured presentations and a compact All Projects listing, with About before Skills. This does not change the schema or filter semantics. Both presentations use the same content entries and detail URLs. Featured cards show the first verified `features` entry; compact rows show at most three technology names and a count of additional tags, while search and technology filters still use every tag. Additional context must use existing verified fields, not invented claims or new required fields.

## 7. Illustrative data shape (NOT publishable project facts)

The following uses synthetic values **only to explain the data format**. Do not copy it unchanged into the public portfolio. Replace every field with verified information, image assets, and actual working URLs.

```json
{
  "id": "sample-project",
  "title": "Sample Project (illustration only)",
  "summary": "這是用來說明資料結構的虛構專案摘要，並不是已完成或可公開驗證的作品內容。",
  "category": "Web Development",
  "tags": ["TypeScript", "Astro"],
  "date": "2026-01-01",
  "status": "in-progress",
  "featured": false,
  "coverImage": "/images/projects/sample-project/cover.webp",
  "coverAlt": "示範網站首頁畫面的說明文字",
  "overview": "示範用的背景與開發目的。",
  "features": ["示範功能一", "示範功能二"],
  "implementation": "示範用的實作方式。",
  "results": "示範成果，非實際驗證結果。",
  "links": {
    "github": "https://example.com/illustrative-project",
    "demo": null
  },
  "gallery": [
    {
      "image": "/images/projects/sample-project/screenshot.webp",
      "alt": "示範專案的操作畫面",
      "caption": "示範截圖"
    }
  ]
}
```

> The example is **not a valid public submission**: its files, links, results and date are illustrative and unverified. All such content must be replaced with genuine project evidence before publishing.

## 8. Validation requirements

The implementation validates the machine-checkable rules below; source review remains necessary for factual accuracy and image rights:

- Schema types, enums, nonempty strings, count limits, URL format, and valid calendar dates.
- No repeated tags within a project.
- File stem matches `id`, and no duplicate ID exists.
- All image paths belong to the corresponding project directory, without `..` traversal.
- All image files exist and are legitimate portfolio assets.
- At least one confirmed external link per public project.
- Three **verified real** projects in the initial published site.
- Successful static build and base-path-correct routes/assets.

Do not claim validation passed until scripts and manual checks have actually run. See [`adding-projects.md`](./adding-projects.md) for the repeatable procedure.
