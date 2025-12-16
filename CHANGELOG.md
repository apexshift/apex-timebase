# Changelog
All notable changes to @apex/depman will be documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [0.3.1-dev] - 2025-12-16

### Added
- Comprehensive Vitest suite covering singleton, events, dependency loading, graph order, scroll conflict resolution, per-page overrides, error handling
- Full mocking for GSAP, Lenis, plugins in tests
- All core behaviors tested and passing

### Phase 3 Complete
Testing suite complete with high coverage.

## [0.3.0-dev] - 2025-12-16

### Added
- Comprehensive Vitest test suite (singleton, events, dependency loading, graph order)
- Full mocking for GSAP/Lenis in tests
- 95%+ coverage target

### Changed
- Test file renamed to DependencyManager.test.ts
- Improved test isolation and mocking

Phase 3 (Testing) in progress

## [0.2.1-dev] - 2025-12-16

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

## [0.2.0] - 2025-12-13

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

## [0.1.0] - 2025-12-12
### Added
- Fully config-driven dependency loading
- Automatic code-splitting of all deps/plugins
- Clean separation of core deps and GSAP plugins
- Per-page override support
- Auto-instantiation via config
- Global Apex exposure
- Works in dev, build, and preview

## [0.0.4] - 2025-12-01
### Added
- Professional README with correct branding[](https://apexshift.co.uk)
- Author credit: Aaron Smyth, Apex Shift Ltd
- Final polish: .gitignore, docs, and identity locked

## [0.0.3] - 2025-12-01
### Added
- Complete Phase 0 foundation
- Bulletproof singleton pattern with test bypass
- Vitest + Happy DOM + 100% coverage
- Professional .gitignore, README.md, CHANGELOG.md

## [0.0.2] - 2025-12-01
### Fixed
- Constructor error message consistency
- Test environment detection

## [0.0.0] - 2025-12-01
- Project initialized