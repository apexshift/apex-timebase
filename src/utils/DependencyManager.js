import depsConfig from '../config/dependencies.json' with { type: 'json' }
import EventEmitter from '../events/EventEmitter.js'

const coreDependencies = {
  gsap: () => import('gsap'),
  lenis: () => import('lenis'),
}

const gsapPlugins = {
  CustomEase: () => import('gsap/CustomEase'),
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
    if(DependencyManager.#instance) {
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

    const config = {
      deps: override.core ?? depsConfig.core,
      plugins: override.gsap_plugins ?? depsConfig.gsap_plugins
    }

    const all = [...new Set([...config.deps, ...config.plugins])]

    await Promise.all(
      all.map(async (name) => {
        const loader = loaders[name]
        if(!loader) {
          const err = new Error(`No loader found for ${name}`)
          this.emit('error', {name, error: err})
          console.warn(`no loader found for ${name}`)
          return
        }

        try {
          const module = await loader()
          let instance = module.default ?? module[name] ?? module

          if (depsConfig.instantiate?.includes(name)) instance = new instance()

          this.#deps[name] = instance
          this.emit('dep:loaded', {name, instance})
          console.log(`%c${name} loaded`, 'color:#00ff9d')
        } catch (err) {
          this.emit('error', {name, error: err})
          console.error(`Failed to load ${name}`, err)
        }
      })
    )

    // Auto-register GSAP plugins if gsap is available
    if(this.#deps.gsap) {
      const gsapPluginNames = Object.keys(this.#deps) // Changed from gsapPlugins as I only want to load required deps surely?
      gsapPluginNames.forEach(name => {
        const plugin = this.#deps[name]
        if(typeof plugin === 'function' || (typeof plugin === 'object' && plugin !== null)) {
          try {
            this.#deps.gsap.registerPlugin(plugin)
            this.emit('plugin:registered', {name, plugin})
          } catch(err) {
            console.warn(`Failed to register ${name}: `, err)
          }
        } else {
          console.warn(`Invalid plugin type for ${name}:`, typeof plugin)
        }
      })
    }

    window.Apex = window.Apex || {}
    window.Apex.deps = this.loaded
    window.Apex.DependencyManager = this

    this.#ready = true
    this.emit('ready', this.loaded)
    console.log('%cAPEX/DEPMAN READY', 'color:#00ff9d;font-weight:bold', this.#deps)
  }
}