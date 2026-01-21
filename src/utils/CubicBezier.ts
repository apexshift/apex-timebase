import { type Vector, type Point } from '../types/VectorMath';

export default class CubicBezier {
  private readonly epsilon: number = 1e-6;
  private readonly maxIterations: number = 12;
  #vector: Vector;
  #pointA: Point;
  #pointB: Point;
  #pointC: Point;

  /**
   * Creates a new Cubic Bezier easing function.
   *
   * @param x1 - X coordinate of first control point (usually 0..1)
   * @param y1 - Y coordinate of first control point
   * @param x2 - X coordinate of second control point (usually 0..1)
   * @param y2 - Y coordinate of second control point
   */
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.#vector = { x1, y1, x2, y2 };
    this.#pointC = { a: this.#coefficientC(x1), b: this.#coefficientC(y1) };
    this.#pointB = { a: this.#coefficientB(x2, x1), b: this.#coefficientB(y2, y1) };
    this.#pointA = { a: this.#coefficientA(x2, x1), b: this.#coefficientA(y2, y1) };
  }

  sample = (t: number): number => {
    t = this.#clamp(t);
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    const x = this.#solveCurveX(t);
    return this.#sampleCurveY(x);
  };

  #clamp = (t: number): number => Math.max(0, Math.min(1, t));

  #coefficientA = (b: number, a: number): number =>
    1 - this.#coefficientC(a) - this.#coefficientB(b, a);
  #coefficientB = (b: number, a: number): number => 3 * (b - a) - this.#coefficientC(a);
  #coefficientC = (a: number): number => 3 * a;

  /**
   * Evaluates the X component of the curve at parameter t.
   * @param t - curve parameter (0 to 1)
   */
  #sampleCurveX = (t: number) => ((this.#pointA.a * t + this.#pointB.a) * t + this.#pointC.a) * t;

  /**
   * Evaluates the Y component of the curve at parameter t.
   * @param t - curve parameter (0 to 1)
   */
  #sampleCurveY = (t: number) => ((this.#pointA.b * t + this.#pointB.b) * t + this.#pointC.b) * t;

  /**
   * Derivative of the X polynomial — used in Newton's method.
   * @param t - curve parameter
   */
  #sampleDerivativeX = (t: number) =>
    (3 * this.#pointA.a * t + 2 * this.#pointB.a) * t + this.#pointC.a;

  /**
   * Finds the curve parameter t that produces the desired x value.
   * Uses Newton-Raphson iteration with binary search fallback.
   *
   * @param x - target x value (0 to 1)
   * @returns t value such that curveX(t) ≈ x
   */
  #solveCurveX = (n: number): number => {
    // Good initial guess — very often already close enough
    let t = n;

    // Newton-Raphson iteration
    for (let index: number = 0; index < this.maxIterations; index++) {
      const currentX: number = this.#sampleCurveX(t);
      const error: number = currentX - n;
      if (Math.abs(error) < this.epsilon) return t;

      // Avoid division by near-zero (very flat curve)
      const derivative = this.#sampleDerivativeX(t);
      if (Math.abs(derivative) < 1e-10) break;

      t -= error / derivative;

      // Early clamping improves convergence in many cases
      if (t < 0) t = 0;
      if (t > 1) t = 1;
    }

    // fallback: binary search (handles bad cases like flat slope)
    let range: Point = { a: 0, b: 1 };

    while (range.b - range.a > this.epsilon) {
      t = (range.a + range.b) * 0.5;
      const currentX = this.#sampleCurveX(t);

      if (Math.abs(currentX - n) < this.epsilon) return t;

      if (currentX < n) range.a = t;
      else range.b = t;
    }

    return t;
  };
}
