# APEX/DEPMAN

**The zero-config, chunk-splitting, smart dependency manager for high-performance creative websites**

Built by Aaron Smyth at [Apex Shift Ltd](https://apexshift.co.uk)

→ Loads only what you need  
→ Perfect code-splitting  
→ GSAP plugins auto-register
→ Lenis or ScrollSmoother out of the box 
→ Lenis auto-synced with GSAP ticker  
→ Smart conflict resolution  
→ Events, overrides, config-driven  
→ Works in dev and production

## Current Status

- **Phase 1 complete** (v0.1.0) – Dynamic loading with automatic code-splitting
- **Phase 2 complete** (v0.2.0) – Events, auto-registration, dependency graph


## Features
- v0.2.1-dev, full TypeScript report with strict types and absolute imports
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

```html
<script type="module" src="/src/main.ts"></script>
```

## Configuration

Edit **src/config/dependencies.json** to add or remove libraries:

```json
{
  "core": ["gsap", "lenis"],
  "gsap_plugins": ["ScrollTrigger", "SplitText", "Flip"],
  "instantiate": ["lenis"],
  "preferredScroller": "lenis",
  "lenisConfig": {
    "duration": 1.2,
    "easing": "easeOutExpo",
    "smoothWheel": true,
    "smoothTouch": false
  },
  "depsConfig": {}
}
```

## Usage
### 1. Basic – Load everything from the config (recommended for most pages)

```javascript
import DependencyManager from '@/utils/DependencyManager'
DependencyManager.getInstance().init()
```

### Load only what you need (performance mode)

```javascript
import DependencyManager from '@/utils/DependencyManager'
DependencyManager.getInstance().init({
  core: ["gsap"],
  gasp_plugins: ["ScrollTrigger"]
})
```

### 3. Access loaded dependencies

```javascript
const {gsap, lenis, ScrollTrigger} = window.Apex.deps

// Everything just works – no registerPlugin() needed
gsap.to('.box', { 
  x: 500,
  scrollTrigger: {
    trigger: '.box',
    start: "top 80%",
    scrub: true
  }
})
lenis.scrollTo(1000)
```

## Events (reactive)

```javascript
const manager = DependencyManager.getInstance()
manager.on('ready', () => console.log('All dependencies ready'))
manager.on('dep:loaded', ({name}) => console.debug(name, 'loaded'))
manager.on('scroll-conflict-resolved', ({enabled, disabled}) => console.debug(`Using ${enabled}, ${disabled} disabled.`))
```

## Override Lenis config per-page

```javascript
manager.init({
  lenisConfig: {
    duration: 2,
    smoothWheel: false
  }
})
```

## Phase History

- **Phase 1** – Config-driven dynamic loading with perfect cache busting chunking
- **Phase 2** – Events, auto-registration, dependency graph
- **Phase 2.1** - Typescript migration (completed)
- **Phase 3** – Testing, docs, release (in progress)

## License

MIT &copy; Aaron Smyth – Apex Shift Ltd 2022-2025.
---
Made with passion in the UK by a developer who refuses to ship slow websites.