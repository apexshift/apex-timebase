import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventEmitter from '@/events/EventEmitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it('on and emit work correctly', () => {
    const spy = vi.fn();
    emitter.on('test', spy);
    emitter.emit('test', 'payload');
    expect(spy).toHaveBeenCalledWith('payload');
  });

  it('once fires only once', () => {
    const spy = vi.fn();
    emitter.once('test', spy);
    emitter.emit('test', 'first');
    emitter.emit('test', 'second');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('first');
  });

  it('off removes listener', () => {
    const spy = vi.fn();
    const unsub = emitter.on('test', spy);
    unsub();
    emitter.emit('test');
    expect(spy).not.toHaveBeenCalled();
  });

  it('multiple listeners work independently', () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on('test', spy1);
    emitter.on('test', spy2);
    emitter.emit('test', 'data');
    expect(spy1).toHaveBeenCalledWith('data');
    expect(spy2).toHaveBeenCalledWith('data');
  });

  it('emit catches handler errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    emitter.on('test', () => {
      throw new Error('fail');
    });
    emitter.emit('test');
    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(consoleSpy).toHaveBeenCalledWith('Event handler error for \"test\":', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('removeAllListeners clears all', () => {
    const spy = vi.fn();
    emitter.on('test1', spy);
    emitter.on('test2', spy);
    emitter.removeAllListeners();
    emitter.emit('test1');
    emitter.emit('test2');
    expect(spy).not.toHaveBeenCalled();
  });
});
