# Changelog
All notable changes to @apex/depman will be documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

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