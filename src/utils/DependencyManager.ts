import siteConfig from '@/config/site.config.json' with { type: 'json' };
import EventEmitter from '@/events/EventEmitter';
import Ease, { type EasingFunction } from './Ease';

/* Types */
interface SiteConfig {
  core: string[];
  gsap_plugins: string[];
  instantiate?: string[];
  preferredScroller?: 'lenis' | 'ScrollSmoother';
  lenisConfig?: LenisConfig;
  dependencyGraph?: Record<string, string[]>;
}

type Override = Partial<{
  core: string[];
  gsap_plugins: string[];
  lenisConfig: LenisConfig;
  preferredScroller: 'lenis' | 'ScrollSmoother';
}>;

interface LenisConfig {
  duration?: number;
  easing?: EasingFunction | string;
  smooth?: boolean;
  [key: string]: unknown; // fallback for additional options
}

interface LoadedDeps {
  gsap?: typeof import('gsap');
  lenis?: Lenis;
  ScrollTrigger?: ScrollTrigger;
  ScrollSmoother?: ScrollSmoother;
  [plugin: string]: unknown;
}

interface Lenis {
  destroy?: () => void;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  raf?: (delta: number) => void;
}

interface ScrollTrigger {
  update?: () => void;
}

interface ScrollSmoother {
  destroy?: () => void;
}

interface GsapWithPlugins {
  registerPlugin: (...plugins: unknown[]) => void;
  ticker: {
    add: (cb: (time: number) => void) => void;
    lagSmoothing?: (threshold: number) => void;
  };
}

/** Core dependecy loaders */
const coreDependencies = {
  gsap: () => import('gsap'),
  lenis: () => import('lenis'),
};

/** GSAP plugin loaders */
const gsapPlugins = {
  CustomBounce: () => import('gsap/CustomBounce'),
  CustomEase: () => import('gsap/CustomEase'),
  CustomWiggle: () => import('gsap/CustomWiggle'),
  Draggable: () => import('gsap/Draggable'),
  DrawSVGPlugin: () => import('gsap/DrawSVGPlugin'),
  EaselPlugin: () => import('gsap/EaselPlugin'),
  EasePack: () => import('gsap/EasePack'),
  Flip: () => import('gsap/Flip'),
  GSDevTools: () => import('gsap/GSDevTools'),
  InertiaPlugin: () => import('gsap/InertiaPlugin'),
  MorphSVGPlugin: () => import('gsap/MorphSVGPlugin'),
  MotionPathHelper: () => import('gsap/MotionPathHelper'),
  MotionPathPlugin: () => import('gsap/MotionPathPlugin'),
  Observer: () => import('gsap/Observer'),
  Physics2DPlugin: () => import('gsap/Physics2DPlugin'),
  PhysicsPropsPlugin: () => import('gsap/PhysicsPropsPlugin'),
  PixiPlugin: () => import('gsap/PixiPlugin'),
  ScrambleTextPlugin: () => import('gsap/ScrambleTextPlugin'),
  ScrollSmoother: () => import('gsap/ScrollSmoother'),
  ScrollToPlugin: () => import('gsap/ScrollToPlugin'),
  ScrollTrigger: () => import('gsap/ScrollTrigger'),
  SplitText: () => import('gsap/SplitText'),
  TextPlugin: () => import('gsap/TextPlugin'),
};

/** Shallow merged loaders */
const loaders: Record<string, () => Promise<unknown>> = {
  ...coreDependencies,
  ...gsapPlugins,
};

/** GSAP plugin dependency graph */
const GSAP_DEPENDENCY_GRAPH = {
  CustomBounce: ['CustomEase'],
  CustomWiggle: ['CustomEase'],
  MotionPathHelper: ['MotionPathPlugin'],
  ScrollSmoother: ['ScrollTrigger'],
};

/** Dependency Manager */
export default class DependencyManager extends EventEmitter {
  static #instance: DependencyManager | null = null;
  private deps: LoadedDeps = {};
  private ready: boolean = false;

  constructor() {
    super();
    if (DependencyManager.#instance) {
      throw new Error(`Use DependencyManager.getInstance()`);
    }
  }

  /* Singleton */
  static getInstance(): DependencyManager {
    if (!this.#instance) this.#instance = new DependencyManager();
    return this.#instance as DependencyManager;
  }

  get isReady(): boolean {
    return this.ready;
  }

  get loaded(): Readonly<LoadedDeps> {
    return Object.freeze({ ...this.deps });
  }

  async init(override: Override = {}): Promise<void> {
    this.emit('init:start', undefined);

    await this.#loadDependencies(override);
    this.#registerGsapPlugins();
    this.#resolveScrollConflict(override);
    this.#syncLenisWithGsap();

    this.#finalize();
  }

  // 1. Load dependencies with config override
  async #loadDependencies(override: Override = {}): Promise<void> {
    const config = {
      deps: override.core ?? siteConfig.core,
      plugins: override.gsap_plugins ?? siteConfig.gsap_plugins,
    };

    const all = [...new Set([...config.deps, ...config.plugins])];
    const loadOrder = this.#resolveGsapDependencyGraph(all);

    await Promise.all(
      loadOrder.map(async (name: string) => {
        const loader = loaders[name];
        if (!loader) {
          const err = new Error(`No loader found for ${name}`);
          this.emit('error', { name, error: err });
          if (import.meta.env.DEV) console.warn(`no loader found for ${name}`);
          return;
        }

        try {
          const moduleResult = await loader();
          let instance: unknown;

          if (typeof moduleResult === 'object' && moduleResult !== null) {
            instance = 'default' in moduleResult ? moduleResult.default : moduleResult;
          } else {
            instance = moduleResult;
          }

          // --- TS strict: cast instance to constructor
          if (name === 'lenis' && siteConfig.instantiate?.includes(name)) {
            const rawConfig = override.lenisConfig ?? siteConfig.lenisConfig ?? {};

            // Resolve easing string -> function
            let easingFn: EasingFunction;

            if (typeof rawConfig.easing === 'string') {
              easingFn = Ease.resolve(rawConfig.easing);
            } else if (typeof rawConfig.easing === 'function') {
              easingFn = rawConfig.easing;
            } else {
              easingFn = (t: number) => t;
            }

            const lenisConfig: LenisConfig = {
              ...rawConfig,
              easing: easingFn,
            };
            instance = new (instance as new (config: LenisConfig) => Lenis)(lenisConfig); // <-- Lenis typed
          } else if (siteConfig.instantiate?.includes(name)) {
            instance = new (instance as new () => unknown)(); // generic constructor
          }

          this.deps[name] = instance as LoadedDeps[string]; // cast to LoadedDeps
          this.emit('dep:loaded', { name, instance });
          if (import.meta.env.DEV) console.log(`%c${name} loaded`, 'color:#00ff9d');
        } catch (err) {
          this.emit('error', { name, error: err });
          if (import.meta.env.DEV) console.error(`Failed to load ${name}`, err);
        }
      }),
    );
  }

  // 2. Auto-register GSAP plugins
  #registerGsapPlugins() {
    if (!this.deps.gsap) return;

    Object.keys(this.deps).forEach((name) => {
      const plugin = this.deps[name];
      if (typeof plugin === 'function' || (typeof plugin === 'object' && plugin !== null)) {
        try {
          (this.deps.gsap as unknown as GsapWithPlugins).registerPlugin(plugin);
          this.emit('plugin:registered', { name, plugin });
        } catch (err) {
          this.emit('error', { name, error: err });
          if (import.meta.env.DEV) console.warn(`Failed to register ${name}:`, err);
        }
      }
    });
  }

  // 3. Resolve scroll conflict
  #resolveScrollConflict(override: Override = {}) {
    if (!this.deps.lenis || !this.deps.ScrollSmoother) return;

    const preferred = override.preferredScroller ?? siteConfig.preferredScroller ?? 'lenis';
    let disabled = null;
    let enabled = null;

    if (preferred === 'ScrollSmoother') {
      disabled = 'Lenis';
      enabled = 'ScrollSmoother';
      (this.deps.lenis as Lenis).destroy?.(); // optional chaining
      delete this.deps.lenis;
    } else {
      disabled = 'ScrollSmoother';
      enabled = 'Lenis';
      (this.deps.ScrollSmoother as ScrollSmoother).destroy?.();
      delete this.deps.ScrollSmoother;
    }

    const message = `[APEX/DEPMAN] Scroll conflict resolved: ${enabled} enabled, ${disabled} disabled.`;
    if (import.meta.env.DEV) console.warn('%c' + message, 'color:#ff9800;font-weight:bold');
    this.emit('scroll-conflict-resolved', { enabled, disabled, preferred });
  }

  // 4. Smart Lenis sync
  #syncLenisWithGsap() {
    if (!this.deps.lenis || !this.deps.gsap) return;

    try {
      const lenis = this.deps.lenis as Lenis;
      const scrollTrigger = this.deps.ScrollTrigger as ScrollTrigger;

      if (lenis.on && scrollTrigger?.update) {
        lenis.on('scroll', () => scrollTrigger.update?.()); // <-- fix TS: don't invoke immediately
      }

      const gsap = this.deps.gsap as unknown as GsapWithPlugins;
      gsap.ticker.add((time: number) => {
        lenis.raf?.(time * 1000); // optional chaining
      });

      gsap.ticker.lagSmoothing?.(0);

      if (import.meta.env.DEV)
        console.log(
          '%cSmart Lenis: fully synced with GSAP/ScrollTrigger',
          'color:#00d1b2;font-weight:bold',
        );

      this.emit('smart-lenis-synced', { mode: 'full' });
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Failed to sync Lenis with GSAP/ScrollTrigger:', err);
      this.emit('smart-lenis-sync-failed', { error: err });
    }
  }

  // 5. Resolve dependency graph – auto-include and correct load order
  #resolveGsapDependencyGraph(requestedNames: string[]) {
    const GSAP_PLUGIN_NAMES = new Set(Object.keys(gsapPlugins));
    const userGraph = siteConfig.dependencyGraph || {};
    const graph = { ...GSAP_DEPENDENCY_GRAPH, ...userGraph };

    const toLoad = new Set(requestedNames);
    const visited = new Set();
    const order: string[] = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      visited.add(name);

      const deps = (graph as Record<string, string[]>)[name] || [];
      deps.forEach((dep: string) => {
        if (!toLoad.has(dep)) {
          if (import.meta.env.DEV)
            console.info(
              `%c[APEX/DEPMAN] Auto-including dependency: ${dep} ← required by ${name}`,
              'color:#00bcd4',
            );
          toLoad.add(dep);
        }
        visit(dep);
      });

      if (GSAP_PLUGIN_NAMES.has(name) && !toLoad.has('gsap')) {
        if (import.meta.env.DEV)
          console.info(
            `%c[APEX/DEPMAN] Auto-including gsap ← required by GSAP plugin ${name}`,
            'color:#00bcd4',
          );
        toLoad.add('gsap');
        visit('gsap');
      }

      order.push(name);
    };

    requestedNames.forEach(visit);

    const loadOrder = order.reverse();
    if (import.meta.env.DEV) console.log('%cDependency load order:', 'color:#ff9d', loadOrder);
    return loadOrder;
  }

  // 6. Finalize initialization
  #finalize() {
    window.Apex ??= {};
    window.Apex.deps = this.loaded;
    window.Apex.DependencyManager = this;

    this.ready = true;
    this.emit('ready', this.loaded);
  }
}
