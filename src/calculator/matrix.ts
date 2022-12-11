import { CalculatorFn } from "../cube";
import { EDGE_LENGTH, LedBrightness, LedCoordinate } from "../framework";
import { setCoordinate } from "./util";

const COUNT = 32;

interface Point {
  x: LedCoordinate;
  y: LedCoordinate;
  z: LedCoordinate;
}

const container: Set<Point> = new Set<Point>();

const checkPoint = (p: Point): boolean => {
  if (p.x >= EDGE_LENGTH || p.z >= EDGE_LENGTH || p.y >= EDGE_LENGTH) {
    return false;
  }
  let isInContainer = false;
  for (let value of container.values()) {
    isInContainer ||= value.x === p.x && value.z === p.z;
  }
  return !isInContainer;
};

const addPoint = (): void => {
  const point = {
    x: Math.floor(Math.random() * EDGE_LENGTH) as LedCoordinate,
    z: Math.floor(Math.random() * EDGE_LENGTH) as LedCoordinate,
    y: 7 as LedCoordinate,
  };
  while (!checkPoint(point)) {
    point.x = Math.floor(Math.random() * EDGE_LENGTH) as LedCoordinate;
    point.z = Math.floor(Math.random() * EDGE_LENGTH) as LedCoordinate;
  }
  container.add(point);
};

export const matrix: CalculatorFn = (counter) => {
  const message = new Uint8Array(192);
  const movement = counter % 8;

  for (let i = 0; i < 192; i += 3) {
    message[i] = 0xff;
  }

  // for (
  //   ;
  //   container.size < COUNT - Math.floor(Math.random() * COUNT);
  //   addPoint()
  // );
  if (container.size < COUNT && Math.random() > 0.85) {
    addPoint();
  }

  for (let point of container) {
    setCoordinate({ message, x: point.x, y: point.y, z: point.z, bright: 7 });
    for (
      let y = Math.max(0, point.y + 1);
      y < EDGE_LENGTH && y < point.y + EDGE_LENGTH;
      ++y
    ) {
      setCoordinate({
        message,
        x: point.x,
        y: y as LedCoordinate,
        z: point.z,
        bright: (7 - (y - point.y)) as LedBrightness,
      });
    }

    if (!movement) {
      --point.y;
      if (point.y < -1 * EDGE_LENGTH) {
        container.delete(point);
      }
    }
  }

  return message;
};
