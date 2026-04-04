# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

C4DT (Center for Digital Trust) Showcase — a Nuxt 3 web app displaying research projects from EPFL laboratories. Built with Vue 3, Tailwind CSS 4, and Bun as the package manager/runtime.

## Commands

| Task                          | Command                                  |
| ----------------------------- | ---------------------------------------- |
| Install dependencies          | `bun install`                            |
| Dev server (localhost:3000)   | `bun dev`                                |
| Build for production          | `bun run build`                          |
| Unit tests (vitest)           | `bun vitest`                             |
| Unit tests (single file)      | `bun vitest test/filterHash.spec.ts`     |
| E2E tests (playwright)        | `bun playwright:test`                    |
| E2E tests (single file)       | `bun playwright:test e2e/navbar.spec.ts` |
| E2E tests (GUI mode)          | `bun playwright:test-ui`                 |
| Lint                          | `bun lint`                               |
| Lint + fix                    | `bun lint:fix`                           |
| Format check                  | `bun format`                             |
| Format fix                    | `bun format:fix`                         |
| Typecheck                     | `bun run typecheck`                      |
| Validate YAML data            | `bun utils/validate-data.ts`             |
| Regenerate types from schemas | `bunx json2ts utils/schemas -o ./types`  |
| Install Playwright browsers   | `bun playwright install`                 |

Devbox is also available: `devbox run dev`, `devbox run validate-data`, etc.

## Architecture

### Data Layer

Project data lives in `data/` as YAML files, one subdirectory per lab (e.g., `data/DEDIS/projects.yaml`). Lab metadata is in `data/labs.yaml`. Both are validated at build time against JSON schemas in `utils/schemas/`. The `data/template.yaml` shows the full project field spec.

`utils/loadData.ts` is the core data loader — it reads YAML, validates against schemas, enriches each project into an `ExtendedProject` (adding computed fields: `id`, `lab` reference, `status`, `sortKey`, `descriptionDisplay`), and returns them sorted by status priority.

When `PLAYWRIGHT_TEST=1`, data is loaded from `e2e/data/` instead of `data/` for deterministic E2E tests.

### Types

TypeScript types in `types/` are auto-generated from the JSON schemas via `json2ts`. If you modify a schema in `utils/schemas/`, regenerate types with `bunx json2ts utils/schemas -o ./types`.

### Pages & Routing

- `pages/index.vue` — Homepage with project listing, filtering (lab, status, category, application, tags), and search. Filter state is serialized to the URL hash via `composables/useFilterHash.ts`.
- `pages/projects/[id].vue` — Individual project detail page with tabbed content.

### Project Tabs (Dynamic Content)

`data/projectTabs/` contains per-project Vue components organized by tab type (`presentation/`, `details/`, `hands-on/`, `app/`, `demo/`, `pilot/`). These are dynamically loaded by `loadProjectTabs()` in `utils/loadData.ts`.

### Testing

- **Unit tests** (`test/`): Vitest with two projects — `unit` (plain Node env, `test/*.spec.ts`) and `nuxt` (Nuxt env via `@nuxt/test-utils`, `test/nuxt/*.spec.ts`).
- **E2E tests** (`e2e/`): Playwright against a local dev server, using fixture data in `e2e/data/`.

### Key Conventions

- Pre-commit hook runs `lint-staged` (ESLint + Prettier on staged `.js/.ts/.vue` files).
- After modifying YAML data files, always run `bun utils/validate-data.ts`.
- New projects should use `data/template.yaml` as a starting point and go in `data/LABNAME/projects.yaml`.
- `EVALUATE_MODE=1 bun dev` enables an evaluator overlay for scoring projects.
