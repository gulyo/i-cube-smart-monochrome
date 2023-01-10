import { CalculatorFn } from "../cube";
import { Worm } from "./nibblesTool";
import { setCoordinateCreator } from "./util";
import { library, LIBRARY_REGISTER } from "./library";
import { WormStatus } from "./nibblesTool/WormStatus";

const worms: Worm[] = [new Worm(), new Worm()];
worms.forEach(
  (worm) =>
    (worm.ExternalCollision = (point) =>
      worms
        .map((w) => w.ExternalCollision)
        .reduce((res, cur) => res || cur(point), false))
);

const nibbles: CalculatorFn = () => {
  const message = new Uint8Array(192);
  const setCoordinate = setCoordinateCreator(message);

  worms.forEach((worm) => {
    for (const point of worm) {
      setCoordinate(point);
    }
    const status = worm.Tick();
    if (status === WormStatus.MOVEMENT && Math.random() < 0.4) {
      worm.ChangeMotion();
    }
  });

  return message;
};

library[LIBRARY_REGISTER]("Nibbles", nibbles);
