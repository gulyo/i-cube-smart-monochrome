import { CalculatorFn } from "../cube";
import { library, LIBRARY_REGISTER } from "./library";
import { setCoordinateCreator } from "./util";
import { EDGE_LENGTH, LedBrightness, LedCoordinate } from "../framework";

const cyclic: CalculatorFn = (counter) => {
  const message = new Uint8Array(192);

  const movement = Math.floor(counter / 12);

  const setCoordinate = setCoordinateCreator(message);

  for (let x = 0; x < EDGE_LENGTH; ++x) {
    for (let y = 0; y < EDGE_LENGTH; ++y) {
      for (let z = 0; z < EDGE_LENGTH; ++z) {
        setCoordinate({
          x: x as LedCoordinate,
          y: y as LedCoordinate,
          z: z as LedCoordinate,
          bright: Math.abs(3 - ((movement + y) % 7)) as LedBrightness,
        });
      }
    }
  }

  return message;
};

library[LIBRARY_REGISTER]("Cyclic", cyclic);
