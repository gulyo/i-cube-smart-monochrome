import { CalculatorFn } from "../cube";
import { BRIGHT_BITS, BRIGHT_LEVELS, EDGE_LENGTH } from "../framework";

export const testCalculator: CalculatorFn = (counter) => {
  const offset = Math.floor(counter / 4) % 8;
  const testMessage = new Uint8Array(192);

  for (let i = 0; i < EDGE_LENGTH; ++i) {
    for (let j = 0; j < EDGE_LENGTH; ++j) {
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS] =
        i === j ? 0xc1 : 0x00;
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS + 1] =
        i === j ? 0xc0 : 0x00;
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS + 2] =
        i === j ? 0x80 : 0x00;
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS] |=
        i === 7 - j && (j - offset) % BRIGHT_LEVELS & 0x01 ? 0x02 : 0x00;
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS + 1] |=
        i === 7 - j && (j - offset) % BRIGHT_LEVELS & 0x02 ? 0x02 : 0x00;
      testMessage[i * EDGE_LENGTH * BRIGHT_BITS + j * BRIGHT_BITS + 2] |=
        i === 7 - j && (j - offset) % BRIGHT_LEVELS & 0x04 ? 0x02 : 0x00;
    }
  }

  // switch (offset) {
  //   case 0:
  //     testMessage[0] |= 0x10;
  //     break;
  //   case 1:
  //     testMessage[8] |= 0x20;
  //     break;
  //   case 2:
  //     testMessage[16] |= 0x40;
  //     testMessage[0] |= 0x10;
  //     testMessage[8] |= 0x20;
  //     break;
  //   case 3:
  //     testMessage[24] |= 0x14;
  //     testMessage[8] |= 0x20;
  //     break;
  //   case 4:
  //     testMessage[24] |= 0x28;
  //     testMessage[8] |= 0x40;
  //     break;
  //   case 5:
  //     testMessage[25] |= 0x14;
  //     testMessage[8] |= 0x20;
  //     break;
  //   case 6:
  //     testMessage[26] |= 0x14;
  //     testMessage[8] |= 0x20;
  //     break;
  //   case 7:
  //     testMessage[27] |= 0x14;
  //     testMessage[8] |= 0x20;
  //     break;
  // }

  // for (let i = 0; i < 64; ++i) {
  //   testMessage[i] = counter % 4 ? 0xaa : 0xff;
  // }
  return testMessage;
};
