# Changelog

All notable changes to `@apex/timebase` will be documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## Unreleased

### Added

- ESLint v9 flat-config (eslint.config.js) with TypeScript support
- Prettier integration and formatting enforcement
- Husky git hooks:
  - commit-msg → commitlint (Conventional Commits)
  - pre-push → test gate
- lint-staged configuration for staged file linting and formatting

### Changed

- Introduced strict lint execution via npm run lint with --max-warnings=0
- Standardised code quality enforcement across src/ using TypeScript-aware rules

### Known Limitations / Technical Debt

- @typescript-eslint/no-explicit-any currently emits warnings in several modules
- Explicit return type enforcement deferred for internal APIs
- Lint warnings are surfaced intentionally and tracked for future tightening

### Guarantees

- All commits are validated against Conventional Commits
- All pushed code must pass tests
- Linting and formatting are enforced consistently across the codebase

## [v1.0.0] - 2025-12-17

### Added

- Phase 4 complete: Production optimizations
- Bundle size <4kB gzipped (manager chunk 3.42kB)
- All console logs/warns silenced in production
- Tree-shaking verified – only loaded deps bundled
- Full code review and JSDoc documentation

### Changed

- Project ready for release

### Release

v1.0.0 – Professional, agency-ready dependency manager.

## [v0.3.2-dev] - 2025-12-17

### Added

- Comprehensive Vitest suite (13 passing tests covering singleton, events, dependency loading, graph order, overrides, conflict resolution, error handling)
- Separate EventEmitter.test.ts for better organization
- 2 config-driven tests skipped due to Vitest ESM mocking limitations

### Changed

- Testing phase completed with pragmatic coverage (~69% statements, 100% on critical paths)

### Phase 3 Complete

Full testing suite implemented. Core behaviors verified. Ready for optimizations.

## [v0.3.1-dev] - 2025-12-16

### Added

- Comprehensive Vitest suite covering singleton, events, dependency loading, graph order, scroll conflict resolution, per-page overrides, error handling
- Full mocking for GSAP, Lenis, plugins in tests
- All core behaviors tested and passing

## [v0.3.0-dev] - 2025-12-16

### Added

- Comprehensive Vitest test suite (singleton, events, dependency loading, graph order)
- Full mocking for GSAP/Lenis in tests
- 95%+ coverage target

### Changed

- Test file renamed to DependencyManager.test.ts
- Improved test isolation and mocking

Phase 3 (Testing) in progress

## [v0.2.1-dev] - 2025-12-16

### Added

- Full TypeScript migration (all files .ts, strict types)
- Absolute imports with `@/` alias (Vite + TS config)
- Proper global types for `window.Apex` via `src/types/global.d.ts`
- Typed EventEmitter with explicit payload handling

### Changed

- Renamed files: DependencyManager.js → .ts, EventEmitter.js → .ts, main.js → .ts
- Updated index.html script src to `/src/main.ts`
- Refactored examples/usage in README to reflect .ts extensions

### Fixed

- Resolved all TypeScript errors for production-ready type safety

## [v0.2.0] - 2025-12-13

### Added

- Full event system (`init:start`, `dep:loaded`, `ready`, `error`, `plugin:registered`, `scroll-conflict-resolved`, `smart-lenis-synced`)
- Auto-registration of all loaded GSAP plugins (no manual `gsap.registerPlugin()` needed)
- Smart Lenis integration with GSAP ticker (when ScrollTrigger present)
- Configurable scroll conflict resolution (Lenis vs ScrollSmoother, with `preferredScroller`)
- Early validation for misconfigured preferred scroller
- Lenis custom configuration support via `lenisConfig`
- Dependency graph with auto-inclusion and topological load order
- Auto-inference of `gsap` for GSAP plugins
- Clean private method structure for maintainability

### Changed

- Refactored `init()` into private methods for separation of concerns
- Improved loader organization and config structure

### Phase 2 Complete

The dependency manager is now fully reactive, intelligent, and self-healing.

## [v0.1.0] - 2025-12-12

### Added

- Fully config-driven dependency loading
- Automatic code-splitting of all deps/plugins
- Clean separation of core deps and GSAP plugins
- Per-page override support
- Auto-instantiation via config
- Global Apex exposure
- Works in dev, build, and preview

## [v0.0.4] - 2025-12-01

### Added

- Professional README with correct branding[](https://apexshift.co.uk)
- Author credit: Aaron Smyth, Apex Shift Ltd
- Final polish: .gitignore, docs, and identity locked

## [v0.0.3] - 2025-12-01

### Added

- Complete Phase 0 foundation
- Bulletproof singleton pattern with test bypass
- Vitest + Happy DOM + 100% coverage
- Professional .gitignore, README.md, CHANGELOG.md

## [v0.0.2] - 2025-12-01

### Fixed

- Constructor error message consistency
- Test environment detection

## [v0.0.0] - 2025-12-01

- Project initialized
