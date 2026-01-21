# Changelog

All notable changes to `@apexshift/timebase` will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Phase 0 — Sprint Preparation

**Added**

- ESLint v9 flat-config (`eslint.config.js`) with TypeScript support
- Prettier integration and formatting enforcement
- Husky git hooks:
  - `commit-msg` → commitlint (Conventional Commits)
  - `pre-push` → preflight test gate (can be temporarily disabled)
- lint-staged configuration for staged file linting/formatting
- TypeScript strict mode enabled (`strict`, `noImplicitAny`, `strictNullChecks`)
- Vitest baseline setup with `happy-dom` environment
- Initial unit tests for `DependencyManager` singleton and `EventEmitter`

**Changed**

- All source files converted to `.ts` and updated for strict typing compliance
- Absolute imports configured with `@/` alias in Vite + TS
- Code style standardization across `src/`

**Fixed**

- TypeScript errors blocking compilation under strict mode

**Known Limitations / Technical Debt**

- Some ESM-dependent config-driven tests skipped (Vitest limitations)
- `@typescript-eslint/no-explicit-any` warnings remain in some internal modules

**Guarantees**

- All commits validated against Conventional Commits
- Pre-push test gate ensures baseline functionality
- Linting and formatting enforced consistently

---

## [v1.0.0] - 2025-12-17

**Added**

- Production-ready release: optimized bundle <4kB gzipped
- All console logs/warnings silenced in production
- Tree-shaking verified; only loaded dependencies bundled
- Full code review and JSDoc documentation

**Changed**

- Project ready for release

**Release**

- v1.0.0 – Professional, agency-ready dependency manager

---

## [v0.3.2-dev] - 2025-12-17

**Added**

- Comprehensive Vitest suite for Phase 3 (singleton, events, dependency loading, graph order, overrides, scroll conflict resolution, error handling)
- Separate `EventEmitter.test.ts` for improved organization

**Changed**

- Pragmatic test coverage (~69% statements, 100% on critical paths)

**Notes**

- Skipped tests for ESM config-driven instantiation and sync failures
- Phase 3 (Testing) partially complete; core behaviors verified

---

## [v0.2.1-dev] - 2025-12-16

**Added**

- TypeScript migration completed: all files `.ts`, strict types enforced
- Global types for `window.Apex` (`src/types/global.d.ts`)
- Typed `EventEmitter` with explicit payload handling
- Absolute imports configured (`@/` alias)
- Initial Vitest tests for singleton and event system

**Changed**

- Renamed files: `DependencyManager.js → .ts`, `EventEmitter.js → .ts`, `main.js → .ts`
- README examples updated to reflect `.ts` usage

**Fixed**

- All TypeScript errors resolved for production-ready type safety

---

## [v0.2.0] - 2025-12-13

**Added**

- Full event system (`init:start`, `dep:loaded`, `ready`, `error`, `plugin:registered`, `scroll-conflict-resolved`, `smart-lenis-synced`)
- Dependency graph with topological load order and auto-inferred GSAP dependencies
- Auto-registration of loaded GSAP plugins
- Smart Lenis integration with GSAP ticker
- Configurable scroll conflict resolution (`preferredScroller`)
- Lenis custom configuration support via `lenisConfig`
- Clean private method structure for maintainability

**Changed**

- Refactored `init()` into private methods for separation of concerns
- Loader organization and config structure improved

---

## [v0.1.0] - 2025-12-12

**Added**

- Fully config-driven dependency loading
- Automatic code-splitting for all dependencies/plugins
- Clean separation of core dependencies and GSAP plugins
- Per-page override support
- Auto-instantiation via configuration
- Global Apex object exposure
- Compatible with dev, build, and preview environments

---

## [v0.0.4] - 2025-12-01

**Added**

- Professional README with branding
- Author credit: Aaron Smyth, Apex Shift Ltd
- Gitignore, docs, and identity finalized

---

## [v0.0.3] - 2025-12-01

**Added**

- Phase 0 foundation: ESLint, Prettier, Husky setup
- Bulletproof singleton pattern with test bypass
- Vitest + Happy DOM baseline setup
- Professional `.gitignore`, README.md, CHANGELOG.md

---

## [v0.0.2] - 2025-12-01

**Fixed**

- Constructor error messages consistent
- Test environment detection refined

---

## [v0.0.0] - 2025-12-01

- Project initialized
