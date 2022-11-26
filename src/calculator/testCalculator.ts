import { MessageHeader } from "../framework";
import { CalculatorFn } from "../cube";

export const testCalculator: CalculatorFn = (counter) => {
	const offset = counter % 8;
	const testMessage = new Uint8Array(193)
	testMessage[0] = MessageHeader.DRAW;
	for (let i = 0; i < 8; ++i) {
		for (let j = 0; j < 8; ++j) {
			testMessage[i * 8 + j + 1] = (i === j) ?
				0x87 : 0x80;
			testMessage[i * 8 + j + 65] = (i === j) && (i === offset) ?
				// ((0x01 << offset) | 0x01) : 0;
				0x84 : 0x80;
			testMessage[i * 8 + j + 129] = (i === j) && ((7 - i) === offset) ?
				// ((0x01 << offset) | 0x01) : 0;
				0x81 : 0x80;
		}
	}
	return testMessage;
}