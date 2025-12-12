# APEX/DEPMAN

**Config-driven, chunk-splitting dependency manager for Vite + vanilla JS projects**

Built by Aaron Smyth at Apex Shift Ltd – https://apexshift.co.uk

A lightweight, zero-hard-coding dependency manager designed for high-performance creative websites. Loads only what you need, splits everything into perfect chunks, and scales effortlessly.

## Current Status

- **Phase 1 complete** (v0.1.0) – Dynamic loading with automatic code-splitting
- **Phase 2** – Events, auto-registration, dependency graph (in progress)

## Features

- Config-driven (single JSON file)
- Automatic code-splitting (every dependency/plugin gets its own chunk)
- Per-page overrides for performance
- Auto-instantiation support
- Global exposure via `window.Apex.deps`
- Works in development and production
- No manifest files, no Vite plugins required

## Installation

```bash
npm i
```

## Configuration

Edit **src/config/dependencies.json** to add or remove libraries:

```json
{
  "core": ["gsap", "lenis"],
  "gsap_plugins": ["ScrollTrigger", "SplitText", "Flip"],
  "instantiate": ["lenis"]
}
```

## Usage
### 1. Basic – Load everything from the config (recommended for most pages)

```javascript
import DependencyManager from './src/utils/DependencyManager.js'
DependencyManager.getInstance().init()
```

### 2. Override – Load only what you need, Performance mode (recommended for per page setups)

```javascript
import DependencyManager from './src/utils/DependencyManager.js'
DependencyManager.getInstance().init({
  core: ["gsap"],
  gasp_plugins: ["ScrollTrigger"]
})
```

### 3. Access loaded dependencies

```javascript
const {gsap, lenis, ScrollTrigger, SplitText} = window.Apex.deps

// Ready to use!
gsap.to('.box', { x: 300 })
lenis.scrollTo(1000)
ScrollTrigger.create({...})
```

## Phase History

- **Phase 1** – Config-driven dynamic loading with perfect cache busting chunking
- **Phase 2** – Events, auto-registration, dependency graph (in progress)
- **Phase 3** – (planned)

## License

MIT &copy; Aaron Smyth – Apex Shift Ltd 2022-2025.
---
Made with passion in the UK by a developer who refuses to ship slow websites.