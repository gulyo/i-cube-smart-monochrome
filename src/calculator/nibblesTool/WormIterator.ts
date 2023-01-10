import { LedPoint } from "../util";

export class WormIterator implements Iterator<LedPoint> {
  #index = 0;

  constructor(
    private getter: (index: number) => {
      length: number;
      point: LedPoint;
    }
  ) {}

  next(): IteratorResult<LedPoint> {
    const nextPoint = this.getter(this.#index);
    const result: IteratorResult<LedPoint> = {
      done: this.#index >= nextPoint?.length,
      value: nextPoint?.point,
    };
    ++this.#index;
    return result;
  }
}
