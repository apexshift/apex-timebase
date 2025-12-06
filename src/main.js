import DependencyManager from './utils/DependencyManager.js'
import PROJECT_DEPENDENCY_CONFIG from './config/dependencies.config.js'
// Set global namespace
window.Apex = window.Apex || {}

DependencyManager.getInstance().init(PROJECT_DEPENDENCY_CONFIG)