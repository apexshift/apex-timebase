import DependencyManager from './utils/DependencyManager.js'
const manager = DependencyManager.getInstance()
manager.on('init:start', () => console.log('Init Started'))
manager.on('dep:loaded', ({name}) => console.log(`${name} just loaded`))
manager.on('ready', () => console.log(`Everything is ready`))
manager.on('error', ({name, error}) => console.error(`Error loading ${name}:`, error))
manager.init()