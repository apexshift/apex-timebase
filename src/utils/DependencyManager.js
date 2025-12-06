// src/utils/DependencyManager.js
import DEPENDENCY_CONFIG from '../config/dependencies.config.js'

const loaders = {
  gsap: () => import('gsap'),
  // Gsap Easing
  CustomEase: () => import('gsap/CustomEase'),
  CustomBounce: () => import('gsap/CustomBounce'), // Requires CustomEase
  CustomWiggle: () => import('gsap/CustomWiggle'), // Requires CustomEase
  EasePack: () => import('gsap/EasePack'),
  // Gsap Plugins
  Draggable: () => import('gsap/Draggable'),
  DrawSVGPlugin: () => import('gsap/DrawSVGPlugin'),
  EaselPlugin: () => import('gsap/EaselPlugin'),
  Flip: () => import('gsap/Flip'),
  GSDevTools: () => import('gsap/GSDevTools'),
  InertiaPlugin: () => import('gsap/InertiaPlugin'),
  MotionPathHelper: () => import('gsap/MotionPathHelper'),
  MotionPathPlugin: () => import('gsap/MotionPathPlugin'),
  MorphSVGPlugin: () => import('gsap/MorphSVGPlugin'),
  Observer: () => import('gsap/Observer'),
  Physics2DPlugin: () => import('gsap/Physics2DPlugin'),
  PhysicsPropsPlugin: () => import('gsap/PhysicsPropsPlugin'),
  PixiPlugin: () => import('gsap/PixiPlugin'),
  ScrambleTextPlugin: () => import('gsap/ScrambleTextPlugin'),
  ScrollTrigger: () => import('gsap/ScrollTrigger'),
  ScrollSmoother: () => import( 'gsap/ScrollSmoother'), // Requires ScrollTrigger
  ScrollToPlugin: () => import('gsap/ScrollToPlugin'),
  SplitText: () => import('gsap/SplitText'),
  TextPlugin: () => import('gsap/TextPlugin'),
  // Other Libraries/Dependencies
  lenis: () => import('lenis')
}

export default class DependencyManager {
  static #instance = null

  #deps = {}
  #ready = false

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DependencyManager()
    }
    return this.#instance
  }

  get isReady() { return this.#ready }
  get loaded() { return Object.freeze({ ...this.#deps }) }
  get(name) { return this.#deps[name] ?? null }

  async init({ deps = DEPENDENCY_CONFIG.deps, plugins = DEPENDENCY_CONFIG.gsapPlugins } = {}) {
    const all = [...new Set([...deps, ...plugins])]

    await Promise.all(
      all.map(async (name) => {
        const loader = loaders[name]
        if (!loader) {
          console.warn(`No loader for ${name}`)
          return
        }

        try {
          const mod = await loader()
          let lib = mod.default ?? mod[name] ?? mod

          if (DEPENDENCY_CONFIG.instantiate?.includes(name)) {
            lib = new lib()
          }

          this.#deps[name] = lib
          console.log(`%c${name} loaded`, 'color:#00ff9d;font-weight:bold')
        } catch (e) {
          console.error(`Failed to load ${name} –`, e)
        }
      })
    )

    window.Apex.deps = this.loaded
    window.Apex.DependencyManager = this

    this.#ready = true
    console.log('%cAPEX/DEPMAN READY', 'color:#00ff9d;font-weight:bold', this.#deps)
  }
}