import { CalculatorName, isCalculatorName } from "./CalculatorName";
import { CalculatorFn } from "../cube";

export const LIBRARY_REGISTER = Symbol("Register");
const LIBRARY_GET_BY_NAME = Symbol("GetByName");

const calculators: Map<CalculatorName, CalculatorFn> = new Map<
  CalculatorName,
  CalculatorFn
>();

class Library {
  readonly [key: CalculatorName]: CalculatorFn;

  public readonly [LIBRARY_REGISTER] = (
    name: CalculatorName,
    calculator: CalculatorFn
  ): Map<CalculatorName, CalculatorFn> => calculators.set(name, calculator);

  public readonly [LIBRARY_GET_BY_NAME] = (
    name: CalculatorName
  ): CalculatorFn => calculators.get(name);
}

export const library = new Proxy<Library>(new Library(), {
  get(target: Library, p: string): any {
    return isCalculatorName(p) ? target[LIBRARY_GET_BY_NAME](p) : target[p];
  },
});
