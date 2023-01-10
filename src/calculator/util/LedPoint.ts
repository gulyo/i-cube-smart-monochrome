import { LedBrightness } from "../../framework";
import { CubePoint } from "./CubePoint";

export interface LedPoint extends CubePoint {
  bright: LedBrightness;
}
