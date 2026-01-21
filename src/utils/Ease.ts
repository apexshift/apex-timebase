import CubicBezier from './CubicBezier';

export type EasingFunction = (t: number) => number;

export default class Ease {
  // Constants
  private static readonly c1 = 1.70158;
  private static readonly c2 = Ease.c1 * 1.525;
  private static readonly c3 = Ease.c1 + 1;
  private static readonly c4 = (2 * Math.PI) / 3;
  private static readonly c5 = (2 * Math.PI) / 4.5;
  private static readonly n1 = 7.5625;
  private static readonly d1 = 2.75;
  // Helpers
  private static midpoint = (t: number): boolean => t < 0.5;
  private static powerIn = (t: number, n: number): number => Math.pow(t, n);
  private static powerOut = (t: number, n: number): number => 1 - Math.pow(-2 * t + 2, n) / 2;
  private static powerCurve = (t: number, n: number): number => 1 - Math.pow(1 - t, n);
  protected static clamp = (t: number): number => Math.max(0, Math.min(1, t));
  // Linear
  static Linear = (t: number): number => {
    t = Ease.clamp(t);
    return t;
  };
  // Sine
  static inSine = (t: number): number => 1 - Math.cos((Ease.clamp(t) * Math.PI) / 2);
  static outSine = (t: number): number => Math.sin((Ease.clamp(t) * Math.PI) / 2);
  static inOutSine = (t: number): number => -(Math.cos(Math.PI * Ease.clamp(t)) - 1) / 2;
  // Quad
  static inQuad = (t: number): number => Ease.powerIn(Ease.clamp(t), 2);
  static outQuad = (t: number): number => Ease.powerCurve(Ease.clamp(t), 2);
  static inOutQuad = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t) ? 2 * Ease.powerIn(t, 2) : Ease.powerOut(t, 2);
  };
  // Cubic
  static inCubic = (t: number): number => Ease.powerIn(Ease.clamp(t), 3);
  static outCubic = (t: number): number => Ease.powerCurve(Ease.clamp(t), 3);
  static inOutCubic = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t) ? 4 * Ease.powerIn(t, 3) : Ease.powerOut(t, 3);
  };
  // Quart
  static inQuart = (t: number): number => Ease.powerIn(Ease.clamp(t), 4);
  static outQuart = (t: number): number => Ease.powerCurve(Ease.clamp(t), 4);
  static inOutQuart = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t) ? 8 * Ease.powerIn(t, 4) : Ease.powerOut(t, 4);
  };
  // Quint
  static inQuint = (t: number): number => Ease.powerIn(Ease.clamp(t), 5);
  static outQuint = (t: number): number => Ease.powerCurve(Ease.clamp(t), 5);
  static inOutQuint = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t) ? 16 * Ease.powerIn(t, 5) : Ease.powerOut(t, 5);
  };
  // Expo
  static inExpo = (t: number): number => {
    t = Ease.clamp(t);
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
  };
  static outExpo = (t: number): number => {
    t = Ease.clamp(t);
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };
  static inOutExpo = (t: number): number => {
    t = Ease.clamp(t);
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Ease.midpoint(t)
          ? Math.pow(2, 20 * t - 10) / 2
          : 2 - Math.pow(2, -20 * t + 10) / 2;
  };
  // Circ
  static inCirc = (t: number): number => 1 - Math.sqrt(1 - Math.pow(Ease.clamp(t), 2));
  static outCirc = (t: number): number => Math.sqrt(1 - Math.pow(Ease.clamp(t) - 1, 2));
  static inOutCirc = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t)
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
  };
  // Back
  static inBack = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.c3 * Ease.powerIn(t, 3) - Ease.c1 * Ease.powerIn(t, 2);
  };
  static outBack = (t: number): number => {
    t = Ease.clamp(t);
    return 1 + Ease.c3 * Ease.powerCurve(t, 3) + Ease.c1 * Ease.powerCurve(t, 2);
  };
  static inOutBack = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t)
      ? (Math.pow(2 * t, 2) * ((Ease.c2 + 1) * 2 * t - Ease.c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((Ease.c2 + 1) * (t * 2 - 2) + Ease.c2) + 2) / 2;
  };
  // Elastic
  static inElastic = (t: number): number => {
    t = Ease.clamp(t);
    return t === 0
      ? 0
      : t === 1
        ? 1
        : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * Ease.c4);
  };
  static outElastic = (t: number): number => {
    t = Ease.clamp(t);
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * Ease.c4) + 1;
  };
  static inOutElastic = (t: number): number => {
    t = Ease.clamp(t);
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Ease.midpoint(t)
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * Ease.c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * Ease.c5)) / 2 + 1;
  };
  // Bounce
  static inBounce = (t: number): number => 1 - Ease.outBounce(1 - Ease.clamp(t));
  static outBounce = (t: number): number => {
    t = Ease.clamp(t);
    if (t < 1 / Ease.d1) {
      return Ease.n1 * Ease.powerIn(t, 2);
    } else if (t < 2 / Ease.d1) {
      return Ease.n1 * (t -= 1.5 / Ease.d1) * t + 0.75;
    } else if (t < 2.5 / Ease.d1) {
      return Ease.n1 * (t -= 2.25 / Ease.d1) * t + 0.9375;
    }

    return Ease.n1 * (t -= 2.625 / Ease.d1) * t * 0.984375;
  };
  static inOutBounce = (t: number): number => {
    t = Ease.clamp(t);
    return Ease.midpoint(t)
      ? (1 - Ease.outBounce(1 - 2 * t)) / 2
      : (1 + Ease.outBounce(2 * t - 1)) / 2;
  };

  /**
   * Parse and create CubicBezier from common string formats:
   * - "cubic-bezier(0.42, 0, 0.58, 1)"
   * - "0.42,0,0.58,1"
   * - "customSpring" → looks up in a custom map if you want presets
   */
  static getBezierEasing(value: string): EasingFunction | null {
    // Simple regex for cubic-bezier(x1,y1,x2,y2)
    const match = value.match(
      /cubic-bezier\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i,
    );
    value.match(/^([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)$/);

    if (match) {
      const [, x1, y1, x2, y2] = match.map(Number);
      if ([x1, y1, x2, y2].some(isNaN)) return null;

      const bezier = new CubicBezier(x1, y1, x2, y2);
      return (t: number) => bezier.sample(t);
    }

    return null;
  }

  /**
   * Main resolver: name or bezier string → easing function
   * Used by Lenis / GSAP / custom code
   */
  static resolve(nameOrBezier: string): EasingFunction {
    // First try as bezier string
    const bezierFn = Ease.getBezierEasing(nameOrBezier);
    if (bezierFn) return bezierFn;

    // Then try named easing
    return Ease.getEasing(nameOrBezier);
  }

  // ────────────────────────────────────────────────
  // Easing registry – maps string names → functions
  // ────────────────────────────────────────────────
  private static readonly easingRegistry: Record<string, EasingFunction> = {
    // Power family
    inQuad: Ease.inQuad,
    outQuad: Ease.outQuad,
    inOutQuad: Ease.inOutQuad,
    inCubic: Ease.inCubic,
    outCubic: Ease.outCubic,
    inOutCubic: Ease.inOutCubic,
    inQuart: Ease.inQuart,
    outQuart: Ease.outQuart,
    inOutQuart: Ease.inOutQuart,
    inQuint: Ease.inQuint,
    outQuint: Ease.outQuint,
    inOutQuint: Ease.inOutQuint,

    // Other classics
    inSine: Ease.inSine,
    outSine: Ease.outSine,
    inOutSine: Ease.inOutSine,
    inExpo: Ease.inExpo,
    outExpo: Ease.outExpo,
    inOutExpo: Ease.inOutExpo,
    inCirc: Ease.inCirc,
    outCirc: Ease.outCirc,
    inOutCirc: Ease.inOutCirc,
    inBack: Ease.inBack,
    outBack: Ease.outBack,
    inOutBack: Ease.inOutBack,
    inElastic: Ease.inElastic,
    outElastic: Ease.outElastic,
    inOutElastic: Ease.inOutElastic,
    inBounce: Ease.inBounce,
    outBounce: Ease.outBounce,
    inOutBounce: Ease.inOutBounce,
  };

  /**
   * Get easing function by name.
   * Falls back to linear (t => t) if name not found.
   */
  static getEasing(name: string): EasingFunction {
    if (!name) return (t: number) => t; // linear fallback

    const fn = Ease.easingRegistry[name];
    if (fn) return fn;

    // Optional: log in dev
    if (import.meta.env.DEV) {
      console.warn(`[Ease] Unknown easing name "${name}" – falling back to linear`);
    }

    return (t: number) => t;
  }

  /**
   * Optional: register a custom easing at runtime (useful for user-defined curves)
   */
  static registerCustom(name: string, fn: EasingFunction): void {
    if (Ease.easingRegistry[name]) {
      console.warn(`[Ease] Overwriting existing easing "${name}"`);
    }
    Ease.easingRegistry[name] = fn;
  }
}
