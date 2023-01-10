import { CubePoint, LedPoint, randomPoint } from "../util";
import { EDGE_LENGTH, LedBrightness } from "../../framework";
import { WormIterator } from "./WormIterator";
import { MotionFunction } from "./MotionFunction";
import { motionCollection } from "./motionCollection";
import { WormStatus } from "./WormStatus";
import { CollisionFn } from "./CollisionFn";

export class Worm implements Iterable<LedPoint> {
  public Delay = 6;
  #slices: CubePoint[] = [];
  #head: number;
  #delayCounter = 0;
  #motion: MotionFunction;

  constructor(private length = 12) {
    this.#init();
  }

  public get ExternalCollision(): CollisionFn {
    return (point: CubePoint) => this.#internalCollision(point);
  }

  public set ExternalCollision(value: CollisionFn) {
    this.#externalCollision = value;
  }

  get #length(): number {
    return this.#slices.length;
  }

  public ChangeMotion(): void {
    this.#motion =
      motionCollection[Math.floor(Math.random() * motionCollection.length)];
  }

  public Tick(): WormStatus {
    ++this.#delayCounter;
    this.#delayCounter %= this.Delay;
    if (!this.#delayCounter) {
      this.#move();
      return WormStatus.MOVEMENT;
    }
    return WormStatus.PULSE;
  }

  [Symbol.iterator](): Iterator<LedPoint> {
    return new WormIterator((index: number) => {
      return {
        length: this.#slices.length,
        point: {
          ...this.#slices[this.#localIndex(index)],
          bright: this.#getBright(this.#localIndex(index)),
        },
      };
    });
  }

  #externalCollision: CollisionFn = () => false;

  #init(): void {
    this.#slices = [];
    this.ChangeMotion();
    const point: CubePoint = randomPoint();
    for (let i = 0; i < this.length; ++i) {
      this.#slices.push({ ...point });
    }
    this.#head = this.length - 1;
    this.#delayCounter = 0;
  }

  #localIndex(value: number): number {
    return (value + this.#head) % this.#length;
  }

  #getBright(index: number): LedBrightness {
    const position = (this.#head - index + this.#length) % this.#length;
    switch (position) {
      case 0:
        return 3;
      case 1:
        return 4;
      case 2:
        return 5;
      case 3:
        return 7;
      case 4:
        return 6;
      case 5:
        return 5;
      case 6:
        return 4;
      case 7:
        return 3;
      case 8:
        return 2;
      default:
        return (((position + (this.#head % 2)) % 2) * 2 + 1) as LedBrightness;
    }
  }

  #move(): void {
    const actHead = this.#slices[this.#head];
    ++this.#head;
    this.#head %= this.#length;
    let newHead: CubePoint = this.#motion(actHead);
    let index;
    for (
      index = 0;
      this.#collision(newHead) && index < motionCollection.length;
      ++index
    ) {
      newHead = motionCollection[index](actHead);
    }
    if (index === motionCollection.length) {
      this.#init();
      return;
    }
    this.#slices[this.#head] = newHead;
  }

  #internalCollision(point: CubePoint): boolean {
    return !!this.#slices.find(
      (actPoint) =>
        actPoint.x === point.x &&
        actPoint.y === point.y &&
        actPoint.z === point.z
    );
  }

  #borderCollision(point: CubePoint): boolean {
    let result = point.x < 0 || point.y < 0 || point.z < 0;
    result ||=
      point.x >= EDGE_LENGTH ||
      point.y >= EDGE_LENGTH ||
      point.z >= EDGE_LENGTH;

    return result;
  }

  #collision(point: CubePoint): boolean {
    let result = this.#borderCollision(point);
    result ||= this.#internalCollision(point);
    result ||= this.#externalCollision(point);
    return result;
  }
}
