import { CalculatorFn } from "../cube";
import { EDGE_LENGTH, LedBrightness, LedCoordinate, MessageHeader } from "../framework";
import { setPoint } from "./util/setPoint";

export const shrinkingCube: CalculatorFn = counter => {
	const message = new Uint8Array(193)
	message[0] = MessageHeader.DRAW;
	const edgeCut = (counter % 5);
	const bright: LedBrightness = Math.max(7 - edgeCut * (counter % 2 + 1), 1) as LedBrightness;
	const point = setPoint(message);
	for (let y = 0; y < EDGE_LENGTH; ++y) {
		for (let z = 0; z < EDGE_LENGTH; ++z) {
			for (let x = 0; x < EDGE_LENGTH; ++x) {
				if (((y === edgeCut) || (y === EDGE_LENGTH - edgeCut)) &&
					(x >= edgeCut) && (x < EDGE_LENGTH - edgeCut)) {
					point({x: x as LedCoordinate, y: y as LedCoordinate, z: z as LedCoordinate, bright});
				}
			}
		}
	}


	return message;
}