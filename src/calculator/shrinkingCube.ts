import { CalculatorFn } from "../cube";
import { BRIGHT_BITS, EDGE_LENGTH, LedBrightness } from "../framework";
import { library, LIBRARY_REGISTER } from "./library";

const TIME_DIVIDER = 8;

const shrinkingCube: CalculatorFn = (counter) => {
  const message = new Uint8Array(192);
  const mainCounter = Math.floor(counter / TIME_DIVIDER);
  const edgeCut = Math.abs((mainCounter % 7) - 3);
  const bright: LedBrightness = (edgeCut * 2 + 1) as LedBrightness;
  for (let y = edgeCut; y < EDGE_LENGTH - edgeCut; ++y) {
    for (let z = edgeCut; z < EDGE_LENGTH - edgeCut; ++z) {
      if (
        y === edgeCut ||
        z === edgeCut ||
        y === 7 - edgeCut ||
        z === 7 - edgeCut
      ) {
        if (bright & 0x01) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS] =
            (0x1 << edgeCut) | (0x80 >> edgeCut);
        }
        if (bright & 0x02) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 1] =
            (0x1 << edgeCut) | (0x80 >> edgeCut);
        }
        if (bright & 0x04) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 2] =
            (0x1 << edgeCut) | (0x80 >> edgeCut);
        }
      }

      if (
        (y === edgeCut || y === 7 - edgeCut) &&
        (z === edgeCut || z === 7 - edgeCut)
      ) {
        if (bright & 0x01) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS] |=
            (0xff >> (edgeCut * 2)) << edgeCut;
        }
        if (bright & 0x02) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 1] |=
            (0xff >> (edgeCut * 2)) << edgeCut;
        }
        if (bright & 0x04) {
          message[(y * EDGE_LENGTH + z) * BRIGHT_BITS + 2] |=
            (0xff >> (edgeCut * 2)) << edgeCut;
        }
      }
    }
  }
  return message;
};

library[LIBRARY_REGISTER]("ShrinkingCube", shrinkingCube);
