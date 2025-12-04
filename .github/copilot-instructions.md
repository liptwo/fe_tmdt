# Copilot instructions — fe_tmdt

Purpose: provide targeted, actionable guidance for AI coding agents working on this Vite + React + TypeScript frontend.

- **Run / Build**: this project uses Vite. Prefer `pnpm` (there is a `pnpm-lock.yaml`). Typical commands:

  - `pnpm install`
  - `pnpm dev` (runs `vite`)
  - `pnpm build` (runs `tsc -b && vite build`)
  - `pnpm preview` (runs `vite preview`)
  - `pnpm run lint` (runs `eslint .`)

- **Big picture**:

  - Vite + React 19 + TypeScript application scaffolded at the repo root.
  - `src/main.tsx` composes top-level providers: `AuthProvider`, `CartProvider`, and a `ThemeProvider`, then mounts `<App />` inside `BrowserRouter`. When adding global context/providers, update `main.tsx`.
  - Routing and pages live under `src/pages/` (examples: `Home.tsx`, `ProductPage.tsx`, `Cart.tsx`, `user/*`). Edit `App.tsx` when adding routes.
  - UI primitives & design system pieces live in `src/components/ui/` (buttons, inputs, cards, dialog, theme-provider). Prefer reusing or extending these components rather than adding duplicate UI.
  - Domain components / containers are in `src/containers/` and `src/components/` (e.g., `containers/home/*`, `components/tag/`).
  - Types are centralized in `src/types/index.ts` — add shared types there when they are cross-cutting.
  - API layer: `src/lib/api.ts` contains request helpers. When changing API contracts, update `lib/api.ts` and callers in `src/pages`/`src/containers`.

- **Project-specific conventions**:

  - Path alias: `@` is aliased to `./src` in `vite.config.ts`. Use imports like `import X from '@/components/ui/button'`.
  - Component files are `.tsx` and named with PascalCase (e.g., `Button.tsx`). Hooks are in `src/hooks/` and named `useX.ts`.
  - Styling: Tailwind is used (see `tailwindcss` plugin in `vite.config.ts`). Utility classes, `clsx` and `class-variance-authority` are common.
  - State: shared state uses React Context (`src/context/auth-context.tsx`, `src/context/cart-context.tsx`). Prefer context or local component state over ad-hoc global variables.
  - UI primitives: prefer `components/ui/*` primitives (Dialog, Avatar, Dropdown, Navigation) over introducing new third-party wrappers unless necessary.

- **Files to inspect for pattern examples** (use these as references):

  - `src/main.tsx` — top-level wiring (providers + router)
  - `vite.config.ts` — alias and plugin setup
  - `package.json` — scripts and dependency list (React 19, react-router-dom v7)
  - `src/components/ui/theme-provider.tsx` — theme usage pattern
  - `src/context/*` — auth and cart context implementations
  - `src/lib/api.ts` — API wrapper and usage patterns
  - `src/pages/ProductPage.tsx` — example page component (data fetching / UI composition)

- **Editing / PR guidance for AI agents**:

  - Make minimal, localized changes. Update or extend `components/ui` primitives when repeating UI patterns.
  - When adding new imports, use the `@/` alias rather than relative `../../..` when referring to `src`.
  - For API changes, update `src/lib/api.ts` and run a quick grep to find and update call sites under `src/pages` and `src/containers`.
  - If adding TypeScript configuration changes (new path mappings or project references), ensure `tsc -b` still succeeds — the build script runs `tsc -b` before `vite build`.
  - Avoid changing `vite.config.ts` alias or Tailwind plugin without coordination — many files rely on that alias and Tailwind configuration.

- **Linting and static checks**:

  - Lint with `pnpm run lint`. The repository uses ESLint; there is no explicit test harness present.
  - The README contains guidance for enabling type-aware lint rules (see `eslint.config.js` hints in `README.md`).

- **Missing / not present**:

  - There are no test scripts in `package.json`. Do not assume unit tests exist.

- **When uncertain**:
  - Prefer small, reversible changes and open a draft PR. Mention the affected files in the PR description (e.g., `src/components/ui/button.tsx`, `src/pages/ProductPage.tsx`).
  - If a change touches authentication flows, validate by checking usage of `AuthProvider` in `src/main.tsx` and any calls to `src/lib/api.ts` that require auth headers.

If any of these sections are unclear or you want more examples (for instance, a canonical `Button` extension or a sample API call change), tell me which area to expand and I will update this file.
