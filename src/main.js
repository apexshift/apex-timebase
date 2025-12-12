import DependencyManager from './utils/DependencyManager.js'
const manager = DependencyManager.getInstance()
manager.on('plugin:registered', ({ name }) => console.log(`${name} auto-registered!`))
manager.on('ready', () => {
  const gsap = window.Apex.deps
  console.debug(`GSAP core loaded?`, !!gsap)
})
manager.init()