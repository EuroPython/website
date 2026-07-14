# EuroPython 2026 Website — Agent Context

> **Ask if unsure. Suggest improvements. Never introduce random colors or
> fonts.**

The official **EuroPython 2026** conference website (`ep2026.europython.eu`),
built with **Astro 6** + **pnpm** + **Tailwind CSS v4** + **Svelte 5**.

**Worktree**: `/home/user/workspace/EuroPython/ep2026-ai` — branch `ep2026-ai`,
forked from the main repo at `/home/user/workspace/EuroPython/website/`.

---

## Quick Start

```bash
make install              # install deps (pnpm 9.3)
make dev                  # dev server → http://localhost:4321
make build                # full build + type-check + pagefind
pnpm format               # Prettier (prettier-plugin-astro)
pnpm astro check          # TypeScript validation only
```

---

## 🚨 DO / DON'T

### DO ✅

**Content & pages**

- **DO** create new pages as `.md` files — MDX is deprecated, migrate existing
  `.mdx` when touched
- **DO** create pages as either `src/content/pages/page-name.md` or
  `src/content/pages/page-name/index.md`
- **DO** prefix hidden/internal pages with underscore: `_draft.md`,
  `_private-section/`

**Architecture**

- **DO** split Astro pages into **page → sections → components** (see "Page
  Architecture" below)
- **DO** keep pages thin — they should only set layout, fetch data, and compose
  sections
- **DO** create page-block components in `src/components/sections/`
- **DO** create reusable UI primitives in `src/components/ui/`

**Styling**

- **DO** use Tailwind utility classes from the existing `@theme` tokens in
  `src/styles/tailwind.css`
- **DO** use `<style>` blocks in `.astro` components for scoped component CSS
- **DO** import `global.css` for base resets and reduced-motion

**Process**

- **DO** add **nikoshell** as reviewer when modifying files outside
  `src/content/`
- **DO** run `make dev` or ` build` before claiming something works
- **DO** ask questions when requirements are ambiguous or you're unsure which
  token/component to use
- **DO** suggest improvements when you spot gaps, duplication, dead code, or
  inconsistencies

### DON'T ❌

- **DON'T** introduce new fonts — use only `--font-heading`, `--font-body`,
  `--font-sans` from `tailwind.css`
- **DON'T** introduce new colors — use only `--color-*` tokens from the `@theme`
  block in `tailwind.css`
- **DON'T** inline hex, rgb, or oklch values in components
- **DON'T** create new `.mdx` files
- **DON'T** put everything in one monolithic page file — a page orchestrates
  sections
- **DON'T** create a new section component if it can be composed from existing
  `ui/` primitives
- **DON'T** add `<style>` blocks without checking if a global or utility class
  already covers it
- **DON'T** create new layout files unless `Layout.astro`,
  `MarkdownLayout.astro`, `ScheduleLayout.astro`, or `SectionLayout.astro` don't
  fit
- **DON'T** remove or rename undocumented files without checking all import
  references

---

## Tech Stack

| Layer           | Technology                                                      |
| --------------- | --------------------------------------------------------------- |
| Framework       | **Astro 6** (static site generation)                            |
| Components      | **Svelte 5** for interactive islands                            |
| Styling         | **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`) |
| Package Manager | **pnpm 9.3**                                                    |
| Icons           | Font Awesome Free 6 (`@fortawesome/fontawesome-free`)           |
| State           | Nano Stores (`nanostores`)                                      |
| Search          | Pagefind (via `astro-pagefind`)                                 |
| Language        | TypeScript 5.x (strict)                                         |
| Formatting      | Prettier + `prettier-plugin-astro`                              |

---

## Design System: Colors & Fonts

**Single source of truth**: `src/styles/tailwind.css` → `@theme` block.
Everything is in oklch with hex/rgba in comments for reference.

### How to use in markup

```astro
<!-- ✅ Correct: existing tokens via Tailwind classes -->
<div class="bg-surface-subtle text-accent border-border">
  <h2 class="text-accent font-heading">Title</h2>
</div>

<!-- ❌ Wrong: ad-hoc values -->
<div style="background: #123; color: rgb(200,200,200);"></div>
```

### Key surface & text tokens

| Tailwind class         | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `bg-bg`                | Base page background (very dark navy)             |
| `bg-section-bg`        | Section background                                |
| `bg-card`              | Elevated card background                          |
| `bg-surface-subtle`    | Subtle surface overlay                            |
| `bg-surface-medium`    | Medium surface overlay                            |
| `text-text`            | Primary text (near-white in dark mode)            |
| `text-text-secondary`  | Secondary text                                    |
| `text-text-muted`      | Muted / faint text                                |
| `text-accent`          | Brand accent (amber)                              |
| `text-accent-themed`   | Theme-aware accent (amber on dark, blue on light) |
| `border-border`        | Default border                                    |
| `border-border-strong` | Stronger border                                   |
| `bg-footer-bg`         | Footer background                                 |

### Brand accent colors

| Token                           | Use for                        |
| ------------------------------- | ------------------------------ |
| `text-accent` / `bg-accent`     | Primary brand accent (amber)   |
| `text-accent-hover`             | Hover state on accent elements |
| `text-red` / `text-red-on-dark` | EuroPython red                 |
| `text-hero-secondary`           | Hero highlight (gold)          |
| `bg-cta-red` → `bg-cta-end`     | CTA button gradient (red)      |
| `text-blue`                     | Secondary brand blue           |

### Sponsor tier colors

`sponsor-keystone`, `sponsor-diamond`, `sponsor-platinum`, `sponsor-gold`,
`sponsor-silver`, `sponsor-bronze`, `sponsor-startup`, `sponsor-patron`

### Session level colors

`session-beginner` (green), `session-intermediate` (yellow), `session-advanced`
(red), `session-neutral`

### Fonts

| Tailwind class | Font stack                        |
| -------------- | --------------------------------- |
| `font-heading` | `"Roboto", sans-serif`            |
| `font-body`    | `"Roboto", system-ui, sans-serif` |
| `font-sans`    | System UI stack                   |

> **Never add new font families or new color tokens.** If you think you need
> one, ask first — the existing system probably covers it.

---

## Page Architecture: page → sections → components

Every Astro page follows a three-layer composition:

```
src/pages/index.astro           ← THIN page: layout + sections in order
src/components/sections/*       ← Sections: page blocks composing primitives
src/components/ui/*             ← Primitives: atomic reusable components
```

### Layer 1: Page (`src/pages/`)

A page should be **thin**. It only:

- Imports and applies a layout
- Fetches/loads data in the frontmatter
- Composes sections in visual order

```astro
---
// src/pages/index.astro — thin orchestrator
import Layout from "@layouts/Layout.astro";
import Hero from "@sections/hero/hero.astro";
import Programme from "@sections/programme.astro";
import Sponsors from "@sections/sponsors/sponsors.astro";
import Connect from "@sections/connect.astro";
---

<Layout title="EuroPython 2026">
  <Hero />
  <Programme />
  <Sponsors />
  <Connect />
</Layout>
```

### Layer 2: Sections (`src/components/sections/`)

Sections are **page blocks** — visually and semantically distinct regions. Each:

- Has one clear responsibility (hero, sponsors, keynoters, updates, etc.)
- Composes UI primitives (`ui/`) and domain components
- Gets its own file in `src/components/sections/`

```astro
---
// src/components/sections/programme.astro
import Section from "@ui/Section.astro";
import CardContent from "@components/CardContent.astro";
import Button from "@ui/Button.astro";
---

<Section>
  <CardContent title="Programme" />
  <Button variant="primary">View Schedule</Button>
</Section>
```

### Layer 3: UI Primitives (`src/components/ui/`)

Atomic, reusable components with **zero business logic**:

- Button, Icon, Section, Accordion, Tag, Label, Select, Note, Card, etc.
- Accept props for variation (variant, size, style)
- Don't import domain components or sections
- Usable anywhere across the site

### Live example: the homepage

Looking at `src/pages/index.astro`:

| File                                              | Role                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `src/pages/index.astro`                           | **Page**: layout + 11 section components in order                    |
| `src/components/sections/hero/hero.astro`         | **Section**: full-viewport hero with headline, CTA, animated flowers |
| `src/components/sections/updates/updates.astro`   | **Section**: deadline cards + week cards                             |
| `src/components/sections/programme.astro`         | **Section**: programme overview                                      |
| `src/components/sections/sponsors/sponsors.astro` | **Section**: sponsor tiers with logos                                |
| `src/components/ui/Button.astro`                  | **Primitive**: button variants                                       |
| `src/components/ui/Section.astro`                 | **Primitive**: reusable wrapper with heading + content area          |
| `src/components/ui/Icon.astro`                    | **Primitive**: Font Awesome wrapper                                  |

---

## Project Structure

```
src/
├── components/              # Astro + Svelte components
│   ├── ui/                  # Primitives (Button, Section, Icon, Accordion, …)
│   ├── sections/            # Page blocks (hero, sponsors, updates, …)
│   ├── schedule/            # Schedule-specific components
│   ├── sessions/            # Session listing & filtering
│   ├── island/              # Svelte islands (BingoCard.svelte, CodeHeart.svelte)
│   ├── markdown/            # Components for rendering MDX content
│   ├── profile/             # Speaker/profile cards
│   ├── sponsor-tiers/       # Sponsor tier displays
│   ├── ticket-tiers/        # Ticket tier displays
│   ├── header/              # Header sub-components
│   └── *.astro              # Header, Footer, Search, Breadcrumbs, …
├── content/                 # Content Collections
│   ├── pages/               # .md pages (prefer .md, MDX deprecated)
│   ├── deadlines/           # Homepage deadline cards
│   ├── keynoters/           # Keynote speaker bios
│   ├── sponsors/            # Sponsor profiles + job listings
│   ├── sprints/             # Sprint descriptions
│   └── week/                # Week overview cards (talks, tutorials, sprints)
├── data/                    # Data modules (nav.ts — single source of truth)
├── layouts/                 # Layout.astro, MarkdownLayout, ScheduleLayout, SectionLayout
├── pages/                   # Routes
│   ├── api/media/           # Social media API endpoints
│   ├── schedule/            # Schedule day routes
│   ├── session/             # /session/[slug]
│   ├── speaker/             # /speaker/[slug]
│   └── sponsor/             # /sponsor/[sponsor]/ and /sponsor/[sponsor]/[job]
├── stores/                  # Nano Stores (favorites.js)
├── styles/                  # CSS
│   ├── tailwind.css         # ← DESIGN SYSTEM: all tokens, theme, light mode
│   ├── global.css           # Base resets, reduced-motion, animation delays
│   ├── ep2026-theme.css     # Legacy theme (schedule, sessions, decorative)
│   ├── light-theme.css      # Light mode overrides
│   ├── markdown.css         # Prose content styling
│   └── search.css           # Pagefind search widget
└── utils/                   # dataLoader.ts, content.ts, markdown.ts, nav.ts
```

---

## Content Pages

### Creating a new page

```bash
# Option A — simple (just content)
src/content/pages/my-page.md

# Option B — with images alongside
src/content/pages/my-page/index.md
```

### Frontmatter

```yaml
---
title: "Page Title"
subtitle: "Optional subtitle"
toc: true # show table of contents? default: true
full: false # full-width layout? default: false
---
```

### Hidden pages

Prefix with `_`:

```bash
src/content/pages/_draft.md          # not publicly listed
src/content/pages/_internal/index.md # not publicly listed
```

### MDX → MD migration

- **No new `.mdx` files** — use `.md` instead
- Existing `.mdx` files still work but should be migrated when touched
- For Markdown components, use `@ui/Markdown.astro` or `@components/markdown/`
  wrappers

---

## Content Collections

| Collection    | Source                               | Schema (key fields)                                          |
| ------------- | ------------------------------------ | ------------------------------------------------------------ |
| **pages**     | `src/content/pages/**/*.{md,mdx}`    | `title, subtitle, toc?, full?`                               |
| **speakers**  | Remote API via custom loader         | `code, name, slug, biography, submissions[]`                 |
| **sessions**  | Remote API via custom loader         | `code, title, slug, abstract, session_type, level, delivery` |
| **days**      | Remote schedule API                  | `id (date), rooms[], events[]`                               |
| **sponsors**  | `src/content/sponsors/*/index.md`    | `name, url, tier, socials?, jobs[]`                          |
| **jobs**      | `src/content/sponsors/*/!(index).md` | `title, location, type, level, tags`                         |
| **deadlines** | `src/content/deadlines/*.md`         | `title, subtitle, url, image`                                |
| **keynoters** | `src/content/keynoters/*.md`         | `name, tagline?, bio?, image?, order`                        |
| **sprints**   | `src/content/sprints/*.md`           | `title, numberOfPeople, pythonLevel, contactPerson`          |
| **week**      | `src/content/week/*.md`              | `title, date, weekdays, button, url, image`                  |
| **tracks**    | Derived from sessions API            | `name, order`                                                |

Speaker/session data is fetched from `programme.europython.eu` at build time via
`src/utils/dataLoader.ts` (retry + in-flight dedup + cache).

---

## Key Files

| File                        | What it does                                                                      |
| --------------------------- | --------------------------------------------------------------------------------- |
| `astro.config.mjs`          | Build config, Vite aliases, integrations, redirects, build modes                  |
| `src/content.config.ts`     | All 11 collections: schemas, loaders, API ↔ local data merging                   |
| `src/styles/tailwind.css`   | **Design system** — all colors, fonts, tokens (DO NOT add to this without asking) |
| `src/utils/dataLoader.ts`   | Remote JSON fetcher with 3 retries + in-flight dedup                              |
| `src/data/nav.ts`           | Single registry: all nav menus, footer columns, social links, legal links         |
| `src/pages/[...slug].astro` | Catch-all dynamic route for content collection pages                              |
| `src/layouts/Layout.astro`  | Base HTML shell: `<head>`, Header, Footer, Offline, Breadcrumbs, global CSS       |

---

## Conventions

| Convention        | Rule                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Astro components  | `PascalCase.astro`                                                                                                                       |
| Svelte components | `PascalCase.svelte`                                                                                                                      |
| Page routes       | `kebab-case.astro`                                                                                                                       |
| Dynamic routes    | `[param].astro` or `[param]/index.astro`                                                                                                 |
| Utility files     | `camelCase.ts`                                                                                                                           |
| Sponsor dirs      | `src/content/sponsors/{name}/`                                                                                                           |
| Deadline files    | Numbered prefix: `{order}_{name}.md`                                                                                                     |
| Vite aliases      | `@components/*`, `@ui/*`, `@utils/*`, `@data/*`, `@styles/*`, `@layouts/*`, `@src/*`, `@sections/*`, `@stores/*`, `@assets/*`, `@i18n/*` |
| Navigation        | Edit `src/data/nav.ts` — single source of truth                                                                                          |
| CSS scoping       | `<style>` in `.astro` files for component-specific styles; `global.css` for site-wide resets                                             |
| Hidden pages      | Prefix with `_` in filename or directory name                                                                                            |

---

## API Endpoints

| Endpoint                                | Purpose                                          |
| --------------------------------------- | ------------------------------------------------ |
| `GET /api/media/combined_socials_queue` | Combined Buffer post queue (speakers + sponsors) |
| `GET /api/media/speakers/posts`         | Speaker social posts                             |
| `GET /api/media/sponsors/posts`         | Sponsor social posts                             |

---

## Deployment

| Aspect         | Details                                                          |
| -------------- | ---------------------------------------------------------------- |
| **Production** | `https://ep2026.europython.eu`                                   |
| **Preview**    | `https://{branch}.ep-preview.click`                              |
| **CI/CD**      | GitHub Actions on push to `ep2026` → `pnpm build` → rsync to VPS |
| **Host**       | VPS at `static.europython.eu`                                    |
| **Releases**   | Timestamped directories with `current` symlink (keeps latest 4)  |
| **Build**      | `make deploy FORCE_DEPLOY=true` (build + rsync)                  |

---

## Code Review

- **Changes outside `src/content/`** → add **nikoshell** as reviewer
- **Content changes** (`src/content/pages/`, `src/content/sponsors/`,
  `src/content/deadlines/`, etc.) → safe to merge directly
- When in doubt, ask for a review

---

## Social Media Pipeline

Scripts in `scripts/`:

1. `download_social_speakers.cjs` / `download_social_sponsors.cjs` → generate
   card images via Puppeteer
2. Astro API endpoints → produce `queue.json`
3. `buffer-scheduling.py` → schedule posts to Buffer

See `docs/social-media-scheduling.md` for full details.

---

## Task Management

```bash
todo list                  # open tasks
todo get <id>              # task details
todo claim <id>            # claim before working
todo update <id> --status closed  # mark done
```

---

## 💡 Suggestions & Questions

Feel free to **suggest improvements** when you find:

- Duplicate or dead code
- Inconsistent naming or structure
- Missing error handling or edge cases
- Opportunities to simplify or refactor
- Accessibility improvements

**Ask questions** when:

- A requirement is ambiguous
- You're unsure which existing token/component/layout to use
- You want to change something outside established patterns
- You think something could be done better
