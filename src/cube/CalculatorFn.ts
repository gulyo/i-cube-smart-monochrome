export interface CalculatorFn<T = unknown> {
  (counter: number): Uint8Array;

  (counter: number, arg: T): Uint8Array;
}
