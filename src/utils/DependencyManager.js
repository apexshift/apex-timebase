// src/utils/DependencyManager.js
import depsConfig from '../config/dependencies.json' with { type: 'json' }

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
export default class DependencyManager {
  static #instance = null
  #deps = {}
  #ready = false

  static getInstance() {
    if (!this.#instance) this.#instance = new DependencyManager()
    return this.#instance
  }

  get isReady() { return this.#ready }
  get loaded() { return Object.freeze({ ...this.#deps }) }

  async init(override = {}) {
    const config = {
      deps: override.dependencies ?? depsConfig.dependencies,
      plugins: override.gsap_plugins ?? depsConfig.gsap_plugins
    }

    const all = [...new Set([...config.deps, ...config.plugins])]

    await Promise.all(
      all.map(async (name) => {
        const loader = loaders[name]
        if(!loader) {
          console.warn(`no loader found for ${name}`)
          return
        }

        try {
          // This works in both dev and build
          const module = await loader()
          let instance = module.default ?? module[name] ?? module

          if (depsConfig.instantiate?.includes(name)) instance = new instance()

          this.#deps[name] = instance
          console.log(`%c${name} loaded`, 'color:#00ff9d')
        } catch (err) {
          console.error(`Failed to load ${name}`, err)
        }
      })
    )

    window.Apex = window.Apex || {}
    window.Apex.deps = this.loaded
    window.Apex.DependencyManager = this

    this.#ready = true
    console.log('%cAPEX/DEPMAN READY', 'color:#00ff9d;font-weight:bold', this.#deps)
  }
}