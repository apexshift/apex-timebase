import DependencyManager from './utils/DependencyManager.js'
const manager = DependencyManager.getInstance()
manager.on('plugin:registered', ({ name }) => console.log(`${name} auto-registered!`))
manager.on('ready', () => {
  const {gsap, ScrollTrigger, SplitText, GSDevTools} = window.Apex.deps
  console.log(`GSAP core loaded?`, !!gsap)

  // Standard GSAP Test: try using plugin method
  try {
    ScrollTrigger.create({}) // Dummy creation – succeeds if registered
    console.log(`ScrollTrigger is registered and useable: `, !!ScrollTrigger)
  } catch(err) {
    console.warn(`ScrollTrigger registration test: `, err.message)
  }

  try {
    new SplitText('dummy') // Dummy instantiation – Succeeds if registered
    console.log(`SplitText is registered and usable: `, !!SplitText)
  } catch(err) {
    console.warn(`SplitText registration test: `, err.message)
  }

  try {
    GSDevTools.create() // Shows player ui on frontend if successful
  } catch(err) {
    console.warn(`GSDevTools registration test: `, err.message)
  }
})
manager.init()