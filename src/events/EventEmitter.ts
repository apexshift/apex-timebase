/**
 * Tiny, zero-dependency, performant EventEmitter for browser use.
 *
 * Supports subscription (`on`, `once`, `off`), emission with optional payload,
 * and error handling for callbacks. No Node.js-specific features.
 *
 * Designed for internal use in APEX/DEPMAN – lightweight and reliable.
 */
export default class EventEmitter<Payload = unknown> {
  private listeners = new Map<string, Set<(payload: Payload) => void>>();

  /**
   * Subscribe to an event.
   *
   * @param event - The event name to listen for
   * @param callback - Function called when event is emitted
   * @returns Unsubscribe function
   */
  on(event: string, callback: (payload: Payload) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event that fires only once.
   *
   * @param event - The event name
   * @param callback - Function called on first emission
   * @returns Unsubscribe function
   */
  once(event: string, callback: (payload: Payload) => void): () => void {
    const unsub = this.on(event, (payload: Payload) => {
      unsub();
      callback(payload);
    });
    return unsub;
  }

  /**
   * Unsubscribe from an event.
   *
   * @param event - The event name
   * @param callback - The callback to remove
   */
  off(event: string, callback: (payload: Payload) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event to all listeners.
   *
   * @param event - The event name
   * @param payload - Optional data passed to callbacks
   */
  emit(event: string, payload: Payload): void {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(payload);
      } catch (error) {
        console.error(`Event handler error for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for all events.
   *
   * Useful for cleaning up during testing or reset.
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }
}
