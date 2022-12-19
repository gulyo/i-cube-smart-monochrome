import { CalculatorFn } from "../cube";
import { BRIGHT_BITS, EDGE_LENGTH } from "../framework";
import { rotateByte } from "./util";
import { library, LIBRARY_REGISTER } from "./library";
// 02467531
const brightContainer = [0b00001111, 0b01011010, 0b00111100];

const pulseWaves: CalculatorFn = (counter) => {
  const message = new Uint8Array(192);
  const movement = Math.floor(counter / 8);

  const shift = movement % EDGE_LENGTH;

  for (let y = 0; y < EDGE_LENGTH; ++y) {
    for (let z = 0; z < EDGE_LENGTH; ++z) {
      message[y * EDGE_LENGTH * BRIGHT_BITS + z * BRIGHT_BITS] = rotateByte(
        brightContainer[0],
        (shift + y + z) % EDGE_LENGTH
      );
      message[y * EDGE_LENGTH * BRIGHT_BITS + z * BRIGHT_BITS + 1] = rotateByte(
        brightContainer[1],
        (shift + y) % EDGE_LENGTH
      );
      message[y * EDGE_LENGTH * BRIGHT_BITS + z * BRIGHT_BITS + 2] = rotateByte(
        brightContainer[2],
        (shift + y) % EDGE_LENGTH
      );
    }
  }

  return message;
};

library[LIBRARY_REGISTER]("PulseWaves", pulseWaves);
