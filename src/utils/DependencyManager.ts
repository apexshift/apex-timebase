// src/utils/DependencyManager.js
import depsConfig from '../config/dependencies.json' with { type: 'json' }
import EventEmitter from '../events/EventEmitter.ts'

const coreDependencies = {
  gsap: () => import('gsap'),
  lenis: () => import('lenis'),
}

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
}

const GSAP_DEPENDENCY_GRAPH = {
  CustomBounce: ['CustomEase'],
  CustomWiggle: ['CustomEase'],
  MotionPathHelper: ['MotionPathPlugin'],
  ScrollSmoother: ['ScrollTrigger'],
}

const loaders = {
  ...coreDependencies,
  ...gsapPlugins
}

export default class DependencyManager extends EventEmitter {
  static #instance = null
  #deps = {}
  #ready = false

  constructor() {
    super()
    if (DependencyManager.#instance) {
      throw new Error(`Use DependencyManager.getInstance()`)
    }
  }

  static getInstance() {
    if (!this.#instance) this.#instance = new DependencyManager()
    return this.#instance
  }

  get isReady() { return this.#ready }
  get loaded() { return Object.freeze({ ...this.#deps }) }

  async init(override = {}) {
    this.emit('init:start')

    await this.#loadDependencies(override)
    this.#registerGsapPlugins()
    this.#resolveScrollConflict(override)
    this.#syncLenisWithGsap()

    this.#finalize()
  }

  // 1. Load dependencies with config override
  async #loadDependencies(override) {
    const config = {
      deps: override.core ?? depsConfig.core,
      plugins: override.gsap_plugins ?? depsConfig.gsap_plugins
    }

    const all = [...new Set([...config.deps, ...config.plugins])]

    const loadOrder = this.#resolveGsapDependencyGraph(all)

    await Promise.all(
      loadOrder.map(async (name) => {
        const loader = loaders[name]
        if (!loader) {
          const err = new Error(`No loader found for ${name}`)
          this.emit('error', { name, error: err })
          console.warn(`no loader found for ${name}`)
          return
        }

        try {
          const module = await loader()
          let instance = module.default ?? module[name] ?? module

          if(name === "lenis" && depsConfig.instantiate?.includes(name)) {
            const lenisConfig = override.lenisConfig ?? depsConfig.lenisConfig ?? {}
            instance = new instance(lenisConfig)
          } else if(depsConfig.instantiate?.includes(name)) {
            instance = new instance()
          }

          this.#deps[name] = instance
          this.emit('dep:loaded', { name, instance })
          console.log(`%c${name} loaded`, 'color:#00ff9d')
        } catch (err) {
          this.emit('error', { name, error: err })
          console.error(`Failed to load ${name}`, err)
        }
      })
    )
  }

  // 2. Auto-register GSAP plugins
  #registerGsapPlugins() {
    if (!this.#deps.gsap) return

    Object.keys(this.#deps).forEach(name => {
      const plugin = this.#deps[name]
      if (typeof plugin === 'function' || (typeof plugin === 'object' && plugin !== null)) {
        try {
          this.#deps.gsap.registerPlugin(plugin)
          this.emit('plugin:registered', { name, plugin })
        } catch (err) {
          console.warn(`Failed to register ${name}:`, err)
        }
      }
    })
  }

  // 3. Resolve scroll conflict
  #resolveScrollConflict(override) {
    if (!this.#deps.lenis || !this.#deps.ScrollSmoother) return

    const preferred = override.preferredScroller ?? depsConfig.preferredScroller ?? 'lenis'

    let disabled = null
    let enabled = null

    if (preferred === 'ScrollSmoother') {
      disabled = 'Lenis'
      enabled = 'ScrollSmoother'
      if (this.#deps.lenis.destroy) this.#deps.lenis.destroy()
      delete this.#deps.lenis
    } else {
      disabled = 'ScrollSmoother'
      enabled = 'Lenis'
      if (this.#deps.ScrollSmoother.destroy) this.#deps.ScrollSmoother.destroy()
      delete this.#deps.ScrollSmoother
    }

    const message = `[APEX/DEPMAN] Scroll conflict resolved: ${enabled} enabled, ${disabled} disabled.`
    console.warn('%c' + message, 'color:#ff9800;font-weight:bold')
    this.emit('scroll-conflict-resolved', { enabled, disabled, preferred })
  }

  // 4. Smart Lenis sync
  #syncLenisWithGsap() {
    if (!this.#deps.lenis || !this.#deps.gsap) return

    try {
      if (this.#deps.ScrollTrigger) {
        this.#deps.lenis.on('scroll', this.#deps.ScrollTrigger.update)
      }

      this.#deps.gsap.ticker.add((time) => {
        this.#deps.lenis.raf(time * 1000)
      })

      if (this.#deps.ScrollTrigger) {
        this.#deps.gsap.ticker.lagSmoothing(0)
      }

      console.log('%cSmart Lenis: fully synced with GSAP/ScrollTrigger', 'color:#00d1b2;font-weight:bold')
      this.emit('smart-lenis-synced', { mode: 'full' })
    } catch (err) {
      console.warn('Failed to sync Lenis with GSAP/ScrollTrigger:', err)
      this.emit('smart-lenis-sync-failed', { error: err })
    }
  }

  // 5. Resolve dependency graph – auto-include and correct load order (gsap phase)
  #resolveGsapDependencyGraph(requestedNames) {
    const GSAP_PLUGIN_NAMES = new Set(Object.keys(gsapPlugins))
    const userGraph = depsConfig.dependencyGraph || {}
    const graph = {...GSAP_DEPENDENCY_GRAPH, ...userGraph}

    const toLoad = new Set(requestedNames)
    const visited = new Set()
    const order = []

    const visit = name => {
      if(visited.has(name)) return
      visited.add(name)

      const deps = graph[name] || []
      deps.forEach(dep => {
        if(!toLoad.has(dep)) {
          console.info(`%c[APEX/DEPMAN] Auto-including dependency: ${dep} ← required by ${name}`, 'color:#00bcd4')
          toLoad.add(dep)
        }
        visit(dep)
      })

      // Auto-infer gsap for any GSAP plugin
      if(GSAP_PLUGIN_NAMES.has(name) && !toLoad.has('gsap')) {
        console.info(`%c[APEX/DEPMAN] Auto-including gsap ← required by GSAP plugin ${name}`, 'color:#00bcd4')
        toLoad.add('gsap')
        visit('gsap')
      }

      order.push(name)
    }

    requestedNames.forEach(visit)

    const loadOrder = order.reverse()
    console.log('%cDependency load order:', 'color:#ff9d', loadOrder)
    return loadOrder
  }

  // 6. Finalize initialization
  #finalize() {
    window.Apex = window.Apex || {}
    window.Apex.deps = this.loaded
    window.Apex.DependencyManager = this

    this.#ready = true
    this.emit('ready', this.loaded)
  }
}