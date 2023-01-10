import { MotionFunction } from "./MotionFunction";
import { CubePoint } from "../util";

export const motionCollection: readonly MotionFunction[] = [
  (point: CubePoint) => ({ ...point, x: point.x + 1 } as CubePoint),
  (point: CubePoint) => ({ ...point, x: point.x - 1 } as CubePoint),
  (point: CubePoint) => ({ ...point, y: point.y + 1 } as CubePoint),
  (point: CubePoint) => ({ ...point, y: point.y - 1 } as CubePoint),
  (point: CubePoint) => ({ ...point, z: point.z + 1 } as CubePoint),
  (point: CubePoint) => ({ ...point, z: point.z - 1 } as CubePoint),
] as const;
