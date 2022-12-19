import { CalculatorFn } from "../cube";
import { BRIGHT_BITS, EDGE_LENGTH } from "../framework";
import { library, LIBRARY_REGISTER } from "./library";

const LENGTH = 7;
const STEP = 1;

const nightRider: CalculatorFn = (counter) => {
  const movement = Math.floor(counter / 2);
  const message = new Uint8Array(192);

  const direction =
    Math.floor(movement / 2) % (2 * (EDGE_LENGTH + LENGTH - 1)) >=
    EDGE_LENGTH + LENGTH - 1;
  const index = direction
    ? Math.floor(movement / 2) % (EDGE_LENGTH + LENGTH - 1)
    : EDGE_LENGTH - 1 - (Math.floor(movement / 2) % (EDGE_LENGTH + LENGTH - 1));

  const brightness: number[] = new Array(EDGE_LENGTH);
  brightness.fill(0);

  if (direction) {
    for (
      let i = Math.min(index, EDGE_LENGTH - 1);
      i >= Math.max(0, index - LENGTH);
      --i
    ) {
      brightness[i] = 7 - (index - i) * STEP;
    }
  } else {
    for (
      let i = Math.max(index, 0);
      i < Math.min(EDGE_LENGTH, index + LENGTH);
      ++i
    ) {
      brightness[i] = 7 - (i - index) * STEP;
    }
  }

  let bright_l1 = 0b00000000;
  let bright_l2 = 0b00000000;
  let bright_l3 = 0b00000000;

  for (let i = 0; i < EDGE_LENGTH; ++i) {
    bright_l1 |= (0b000000001 & brightness[i]) << i;
    bright_l2 |= ((0b000000010 & brightness[i]) >> 1) << i;
    bright_l3 |= ((0b000000100 & brightness[i]) >> 2) << i;
  }

  for (let y = 2; y < EDGE_LENGTH - 2; ++y) {
    for (let z = 2; z < EDGE_LENGTH - 2; ++z) {
      message[(y * EDGE_LENGTH + z) * BRIGHT_BITS] = bright_l1;
      message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 1] = bright_l2;
      message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 2] = bright_l3;
    }
  }

  return message;
};

library[LIBRARY_REGISTER]("NightRider", nightRider);
