// tests/DependencyManager.singleton.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import DependencyManager from '../src/utils/DependencyManager.js'

describe('Phase 0 – Singleton enforcement', () => {
  beforeEach(() => {
    DependencyManager.__resetForTesting()
  })

  it('returns the same instance', () => {
    const a = DependencyManager.getInstance()
    const b = DependencyManager.getInstance()
    expect(a).toBe(b)
  })

  it('throws when instantiated with new outside of getInstance()', () => {
    expect(() => {
      // This should throw — no bypass active
      new DependencyManager()
    }).toThrow('Use DependencyManager.getInstance()')
  })
})