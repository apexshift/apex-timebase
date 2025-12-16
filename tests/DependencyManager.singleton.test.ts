import { describe, it, expect, vi, beforeEach } from "vitest"
import DependencyManager from '@/utils/DependencyManager'

describe('DependencyManager', () => {
  let manager: DependencyManager

  beforeEach(() => {
    manager = DependencyManager.getInstance()
    manager.removeAllListeners()
    vi.restoreAllMocks()
  })

  it('enforces singleton pattern', () => {
    const instance2 = DependencyManager.getInstance()
    expect(manager).toBe(instance2)
  })

  it('emits init:start and ready events', async () => {
    const initSpy = vi.fn()
    const readySpy = vi.fn()

    manager.on('init:start', initSpy)
    manager.on('ready', readySpy)

    await manager.init()

    expect(initSpy).toHaveBeenCalledOnce()
    expect(readySpy).toHaveBeenCalledOnce()
  })

  it('loads dependencies and emits dep:loaded', async () => {
    const spy = vi.fn()
    manager.on('dep:loaded', spy)

    vi.mock('gsap', () => ({ default: {registerPlugin: vi.fn() } }))
    vi.mock('lenis', () => ({ default: class { on() {} raf() {} } }))

    await manager.init({ core: ['gsap', 'lenis'], gsap_plugins: [] })

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'gsap' }))
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'lenis' }))
  })

  it('respects dependency graph order', async () => {
    const order: string[] = []
    manager.on('dep:loaded', ({ name }) => order.push(name))

    vi.mock('gsap', () => ({
      default: {
        registerPlugin: vi.fn(),
        ticker: { add: vi.fn(), lagSmoothing: vi.fn() }
      }
    }))
    vi.mock('gsap/ScrollTrigger', () => ({ default: {} }))

    await manager.init({ core: ['gsap'], gsap_plugins: ['ScrollTrigger'] })

    expect(order).toEqual(['ScrollTrigger', 'gsap'])  // Correct order: plugin first, then gsap (graph auto-includes gsap after plugin)
  })
})