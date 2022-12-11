import { TimerFn } from "./TimerFn";

export interface CalculatorFn {
  Timer?: TimerFn;
  LevelDelay?: number;
  RefreshTimer?: number;

  (counter: number): Uint8Array;
}
