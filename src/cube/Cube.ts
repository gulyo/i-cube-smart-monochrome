import { SerialPort } from "serialport";
import { CalculatorFn } from "./CalculatorFn";
import { DEFAULT_FRAME_TIMER } from "./constant";
import { TimerFn } from "./TimerFn";

export class Cube {
  protected frame: Uint8Array;
  protected counter: number;
  protected isRunning = false;
  protected resolver: () => void;
  protected timer: TimerFn = DEFAULT_FRAME_TIMER;

  protected arg: unknown;

  constructor(protected readonly port: SerialPort) {}

  public set Arg(value: unknown) {
    this.arg = value;
  }

  public set Calculator(value: CalculatorFn) {
    this.calculator = value;
  }

  public set Timer(value: TimerFn) {
    this.timer = value;
  }

  public readonly Start = (): void => {
    this.counter = 0;
    this.isRunning = true;
    this.drawFrame();
  };

  public readonly Stop = async (): Promise<void> => {
    return new Promise<void>((resolve: () => void) => {
      this.resolver = resolve;
      this.isRunning = false;
    });
  };

  protected calculator: CalculatorFn = () => new Uint8Array(1);

  protected drawFrame = (): void => {
    // const clearMessage = new Uint8Array(1);
    // clearMessage[0] = MessageHeader.CLEAR;
    this.port.write(Buffer.from(this.calculator(this.counter, this.arg)));
    this.counter = ++this.counter % (Number.MAX_SAFE_INTEGER - 1);

    if (this.isRunning) {
      setTimeout(this.drawFrame, this.timer(this.counter));
    } else {
      // const clearMessage = new Uint8Array(192);
      // clearMessage[0] = MessageHeader.CLEAR;
      // this.port.write(Buffer.from(clearMessage));
      this.resolver();
    }
  };
}
