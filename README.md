# APEX/DEPMAN

The low-config, chunk-splitting, smart dependency manager for high-performance creative websites
Built by Aaron Smyth at [Apex Shift](https://apexshift.co.uk).

- Loads only what you need
- Perfect code-splitting
- GSAP plugins auto-register
- Lenis or ScrollSmoother out of the box
- Lenis auto-synced with GSAP ticker
- Smart conflict resolution
- Events, overrides, config-driven
- Works in dev and production

## Current Status

**v1.0.0 ready** – All phases completed

- Phase 4 complete (Dec 17, 2025) – Bundle size < 4kb gzipped, production console silence, tree-shaking verfied

## Features

- Config-driven (single JSON file)
- Automatic code-splitting (every dependency/plugin gets its own chunk)
- Per-page overrides for performance
- Auto-instantiation support
- Global exposure via window.Apex.deps
- Works in development and production
- No manifest files, no Vite plugins required
- Full test coverage of core behaviors (singleton, events, loading, graph, overrides, conflict resolution, errors)
- Production-optimised (no console logs/warns)

## Installation

install the package and build the final outputs

```bash
npm i
```

then in any development html pages add thisto to the `<head>` section of the page.

```html
<script type="module" src="/src/main.ts"></script>
```

Finally, run the build process command to produce the final outputs in the `/dist` directory.

```bash
npm run build
```

## Configuration

Edit `src/config/site.config.json` to add or remove dependencies and configure out of the box behaviour.

| name              | type   | default                                              | description                                                                                          |
| ----------------- | ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| core              | array  | ["lenis", "gsap"]                                    | Core plugins available                                                                               |
| gsap_plugins      | array  | ["ScrollTrigger", "SplitText", "Flip", "GSDevTools"] | Ready to go out of the box registered gsap plugins.                                                  |
| instantiate       | array  | ["lenis"]                                            | Which dependencies need to be instantiated?                                                          |
| preferredScroller | string | "lenis"                                              | determine which Smooth Scrolling library will take precedence if more than one is loaded.            |
| lenisConfig       | object | {}                                                   | Pass a custom setup object to the lenis instance to customise the scroll experience.                 |
| dependencyGraph   | object | {}                                                   | Advanced use for deciding which order to load the dependencies and plugin in, taken care by default. |

### Configuration Example

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
  "dependencyGraph": {}
}
```

## Usage

1. Basic – Load from config (`src/config/site.config.json`)

```javascript
import DependencyManager from '@/utils/DependencyManager';
const manager = DependencyManager.getInstance();
manager.init();
```

2. Load specific dependencies (**override**)

```javascript
import DependencyManager from '@/utils/DependencyManager';
const manager = DependencyManager.getInstance();
manager.init({
  core: ['gsap'],
  gsap_plugins: ['ScrollTrigger'],
});
```

## Access loaded dependencies

```javascript
const { lenis, gsap, ScrollTrigger } = window.Apex.deps;

// Basic test animation
gsap.to('.box', {
  x: 500,
  scrollTrigger: {
    trigger: '.box',
    start: 'top 80%',
    scrub: true,
  },
});
lenis.scrollTo(1000);
```

## Events (reactive)

Available event methods, **return types omitted**

```typescript
on(event: string, callback: (payload: any) => void)
once(event: string, callback: (payload: any) => void)
off(event: string, callback: (payload: any) => void)
emit(event: string, payload?: any)
```

Events Emitted by `src/utils/DependencyManager.ts`
| name | payload | description |
| --- | --- | --- |
| `init:start` | undefined | Respond as soon as the DependencyManager starts working |
| `error` | { name, error } | Respond to error events |
| `dep:loaded` | | Respond when a dependency has successfully loaded |
| `plugin:registered` | | Respond when a plugin has successfully been loaded |
| `scroll-conflict-resolved` | | Respond when the Smooth Scrolling experience has resolved a conflict. Lenis v SmoothScroller conflicts |
| `smart-lenis-synced` | | Respond when Lenis has been setup automatically with ScrollTrigger successfully |
| `smart-lenis-sync-failed` | | Respond when Lenis has failed to setup correctly with ScrollTrigger automatically |
| `ready` | | Respond when the DependencyManager has completed all automated tasks and is ready to use. |

```javascript
// Create an instance of the DependencyManager
const manager = DependencyManager.getInstance();
// Respond to custom events
manager.on('ready', () => console.log('All dependencies ready'));
manager.on('dep:loaded', ({ name }) => console.debug(name, 'loaded'));
manager.on('scroll-conflict-resolved', ({ enabled, disabled }) =>
  console.debug(`Using ${enabled}, ${disabled} disabled.`),
);
```

## Override Lenis config per-page

```javascript
manager.init({
  lenisConfig: {
    duration: 2,
    smoothWheel: false,
  },
});
```

## Phase History

**Phase 1** – Config-driven dynamic loading with perfect cache busting chunking (complete)

**Phase 2** – Events, auto-registration, dependency graph (complete)

**Phase 2.1** – TypeScript migration (complete)

**Phase 3** – Comprehensive testing + documentation (complete)

**Phase 3.1** – Advanced Testing (complete)

**Phase 3.2** – Test Coverage (complete)

**Phase 4** – Code review & optimizations (complete)

## License

MIT © Aaron Smyth – Apex Shift Ltd 2022-2025.
Made with passion in the UK by a developer who refuses to ship slow websites.
