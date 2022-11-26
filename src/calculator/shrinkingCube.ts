import { CalculatorFn } from "../cube";
import { EDGE_LENGTH, LedBrightness, MessageHeader, SCREEN_SIZE } from "../framework";

const TIME_DIVIDER = 4;

export const shrinkingCube: CalculatorFn = counter => {
	const message = new Uint8Array(193)
	message[0] = MessageHeader.DRAW;
	const mainCounter = Math.floor(counter / TIME_DIVIDER);
	// const subCounter = counter % TIME_DIVIDER;
	const edgeCut = Math.abs(mainCounter % 7 - 3);
	const bright: LedBrightness = edgeCut * 2 + 1 as LedBrightness;
	for (let y = edgeCut; y < EDGE_LENGTH - edgeCut; ++y) {
		for (let z = edgeCut; z < EDGE_LENGTH - edgeCut; ++z) {
			if (y === edgeCut || z === edgeCut || y === 7 - edgeCut || z === 7 - edgeCut) {
				if (bright & (0x01)) {
					message[y * EDGE_LENGTH + z + 1] = (0x1 << edgeCut) | (0x80 >> edgeCut);
				}
				if (bright & (0x01 << 1)) {
					message[SCREEN_SIZE + y * EDGE_LENGTH + z + 1] = (0x1 << edgeCut) | (0x80 >> edgeCut);
				}
				if (bright & (0x01 << 2)) {
					message[2 * SCREEN_SIZE + y * EDGE_LENGTH + z + 1] = (0x1 << edgeCut) | (0x80 >> edgeCut);
				}
			}

			if ((y === edgeCut || y === 7 - edgeCut) && (z === edgeCut || z === 7 - edgeCut)) {
				if (bright & (0x01)) {
					message[y * EDGE_LENGTH + z + 1] |= (0xFF >> edgeCut * 2) << edgeCut;
				}
				if (bright & (0x01 << 1)) {
					message[SCREEN_SIZE + y * EDGE_LENGTH + z + 1] |= (0xFF >> edgeCut * 2) << edgeCut;
				}
				if (bright & (0x01 << 2)) {
					message[2 * SCREEN_SIZE + y * EDGE_LENGTH + z + 1] |= (0xFF >> edgeCut * 2) << edgeCut;
				}
			}
		}
	}
	return message;
}

export const shrinkingCubeTimer = () => 50;