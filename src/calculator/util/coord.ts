import { BRIGHT_BITS, EDGE_LENGTH } from "../../framework";

export const coord = (y: number, z: number): number =>
  (y * EDGE_LENGTH + z) * BRIGHT_BITS;
