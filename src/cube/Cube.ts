import { SerialPort } from "serialport";
import { CalculatorFn } from "./CalculatorFn";
import { DEFAULT_FRAME_TIMER } from "./constant";
import { TimerFn } from "./TimerFn";
import { MessageHeader } from "../framework";

export class Cube {
	protected frame: Uint8Array;
	protected counter: number;
	protected isRunning = false;
	protected resolver: () => void;
	protected timer: TimerFn = DEFAULT_FRAME_TIMER;

	constructor(protected readonly port: SerialPort) {
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
	}

	public readonly Stop = async (): Promise<void> => {
		return new Promise<void>((resolve: () => void) => {
			this.resolver = resolve;
			this.isRunning = false;
		});
	}

	protected calculator: CalculatorFn = () => new Uint8Array(1);

	protected drawFrame = (): void => {
		this.port.write(Buffer.from(this.calculator(this.counter)));
		this.counter = ++this.counter % (Number.MAX_SAFE_INTEGER - 1);

		if (this.isRunning) {
			setTimeout(this.drawFrame, this.timer(this.counter));
		} else {
			this.port.write(Buffer.from([MessageHeader.CLEAR]));
			this.resolver();
		}
	}
}