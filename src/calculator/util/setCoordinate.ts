import { coord } from "./coord";
import { LedBrightness, LedCoordinate } from "../../framework";

export const setCoordinateCreator =
  (message: Uint8Array) =>
  ({
    x,
    y,
    z,
    bright = 1,
  }: {
    x: LedCoordinate;
    y: LedCoordinate;
    z: LedCoordinate;
    bright: LedBrightness;
  }): void => {
    message[coord(y, z)] |= (0b00000001 & bright) << x;
    message[coord(y, z) + 1] |= ((0b00000010 & bright) >> 1) << x;
    message[coord(y, z) + 2] |= ((0b00000100 & bright) >> 2) << x;
  };
