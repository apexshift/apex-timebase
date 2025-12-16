/**
 * Tiny, zero-dependency, performant EventEmitter
 * Designed for browser use – no Node.js specifics
 */
export default class EventEmitter {
  #listeners = new Map()

  /**
   * Subscribe to an event
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  on(event: string, callback: (payload: any) => void): () => void {
    if(!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set())
    }
    this.#listeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  /**
   * Subscribe to an event once
   * @param {string} event
   * @param {Function} callback
   */
  once(event: string, callback: (payload: any) => void): () => void {
    const unsub = this.on(event, (...args) => {
      unsub()
      callback(...args)
    })
    return unsub
  }

  /**
   * Unsubscribe from an event
   * @param {string} event
   * @param {Function} callback
   */
  off(event: string, callback: (payload: any) => void): void {
    this.#listeners.get(event)?.delete(callback)
  }

  /**
   * Emit an event
   * @param {string} event
   * @param {any} payload
   */
  emit(event: string, payload?: any): void {
    this.#listeners.get(event)?.forEach((cb: (payload: any) => void) => {
      try {
        cb(payload)
      } catch(error) {
        console.error(`Event handler error for "${event}":`, error)
      }
    })
  }

  /**
   * Remove all listeners (usefulf for testing)
   */
  removeAllListeners() {
    this.#listeners.clear()
  }
}