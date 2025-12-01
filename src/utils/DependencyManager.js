// src/utils/DependencyManager.js
export default class DependencyManager {
  static #instance = null
  static #allowTestInstantiation = false

  constructor() {
    if (!DependencyManager.#allowTestInstantiation) {
      throw new Error('Use DependencyManager.getInstance()')  // ← fixed!
    }
  }

  static getInstance(config = {}) {
    if (!DependencyManager.#instance) {
      this.#allowTestInstantiation = true
      DependencyManager.#instance = new DependencyManager()
      this.#allowTestInstantiation = false
    }
    return DependencyManager.#instance
  }

  static __resetForTesting() {
    this.#instance = null
  }
}