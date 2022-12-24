import { CalculatorFn } from "../cube";
import { library, LIBRARY_REGISTER } from "./library";
import { setCoordinateCreator } from "./util";
import { LedBrightness, LedCoordinate } from "../framework";

const BASE = 8;
const MAX = BASE - 1;

let sum = 0;

const cyclic: CalculatorFn = (counter) => {
  const message = new Uint8Array(192);

  sum = Math.floor(counter / 4) % 15;

  let x: number, z: number;

  const setCoordinate = setCoordinateCreator(message);

  // for (let sum = 0; sum <= MAX * 2; ++sum) {
  for (x = Math.min(MAX, sum), z = sum - x; x >= 0 && z < BASE; --x, ++z) {
    // console.log(sum, x, y);
    setCoordinate({
      x: x as LedCoordinate,
      y: 0 as LedCoordinate,
      z: z as LedCoordinate,
      bright: 4 as LedBrightness,
    });
  }
  // }

  return message;
};

library[LIBRARY_REGISTER]("Cyclic", cyclic);
