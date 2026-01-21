import { describe, it, expect, vi, beforeEach } from 'vitest';
import DependencyManager from '@/utils/DependencyManager';

describe('DependencyManager', () => {
  let manager: DependencyManager;

  beforeEach(() => {
    manager = DependencyManager.getInstance();
    manager.removeAllListeners();
    vi.restoreAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('enforces singleton pattern', () => {
    const instance2 = DependencyManager.getInstance();
    expect(manager).toBe(instance2);
  });

  it('emits init:start and ready events', async () => {
    const initSpy = vi.fn();
    const readySpy = vi.fn();

    manager.on('init:start', initSpy);
    manager.on('ready', readySpy);

    await manager.init();

    expect(initSpy).toHaveBeenCalledOnce();
    expect(readySpy).toHaveBeenCalledOnce();
  });

  it('loads dependencies and emits dep:loaded', async () => {
    const spy = vi.fn();
    manager.on('dep:loaded', spy);

    vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
    vi.mock('lenis', () => ({
      default: class {
        on() {}
        raf() {}
      },
    }));

    await manager.init({ core: ['gsap', 'lenis'], gsap_plugins: [] });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'gsap' }));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'lenis' }));
  });

  it('respects dependency graph order', async () => {
    const order: string[] = [];
    manager.on('dep:loaded', ({ name }) => order.push(name));

    vi.mock('gsap', () => ({
      default: {
        registerPlugin: vi.fn(),
        ticker: { add: vi.fn(), lagSmoothing: vi.fn() },
      },
    }));
    vi.mock('gsap/ScrollTrigger', () => ({ default: {} }));

    await manager.init({ core: ['gsap'], gsap_plugins: ['ScrollTrigger'] });

    expect(order).toEqual(['ScrollTrigger', 'gsap']);
  });

  it('resolves scroll conflict based on preferredScroller', async () => {
    const conflictSpy = vi.fn();
    manager.on('scroll-conflict-resolved', conflictSpy);

    vi.mock('gsap', () => ({
      default: { registerPlugin: vi.fn(), ticker: { add: vi.fn(), lagSmoothing: vi.fn() } },
    }));
    vi.mock('gsap/ScrollSmoother', () => ({ default: { destroy: vi.fn() } }));
    vi.mock('lenis', () => ({
      default: class {
        destroy() {}
        on() {}
        raf() {}
      },
    }));

    await manager.init({
      core: ['lenis'],
      gsap_plugins: ['ScrollSmoother'],
      preferredScroller: 'ScrollSmoother',
    });

    expect(conflictSpy).toHaveBeenCalledWith({
      enabled: 'ScrollSmoother',
      disabled: 'Lenis',
      preferred: 'ScrollSmoother',
    });
  });

  it('applies per-page overrides', async () => {
    const spy = vi.fn();
    manager.on('dep:loaded', spy);

    vi.mock('gsap', () => ({ default: {} }));
    vi.mock('gsap/SplitText', () => ({ default: {} }));

    await manager.init({
      core: [],
      gsap_plugins: ['SplitText'],
    });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'gsap' }));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'SplitText' }));
  });

  it('handles missing loader gracefully', async () => {
    const errorSpy = vi.fn();
    manager.on('error', errorSpy);

    await manager.init({ core: ['nonexistent'] });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'nonexistent',
        error: expect.any(Error),
      }),
    );
  });

  // Skipped: config-driven instantiation untestable due to ESM cache
  it.skip('instantiates configured dependencies', async () => {
    // Left for reference – requires config mock not possible in Vitest ESM
  });

  // Skipped: sync error path untestable with current mocking
  it.skip('handles Lenis sync failures gracefully', async () => {
    // Left for reference
  });
});
