import { CubePoint } from "./CubePoint";
import { EDGE_LENGTH } from "../../framework";

export const randomPoint = (): CubePoint =>
  ({
    x: Math.floor(Math.random() * EDGE_LENGTH),
    y: Math.floor(Math.random() * EDGE_LENGTH),
    z: Math.floor(Math.random() * EDGE_LENGTH),
  } as CubePoint);
