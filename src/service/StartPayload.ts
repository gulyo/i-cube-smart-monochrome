import { CalculatorName } from "../calculator/CalculatorName";

export interface StartPayload<T = unknown> {
  calculator: CalculatorName;
  arg?: T;
}
