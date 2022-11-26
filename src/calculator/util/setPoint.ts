import { EDGE_LENGTH, LedBrightness, LedCoordinate, SCREEN_SIZE } from "../../framework";

export const setPoint = (message: Uint8Array) =>
	({x, y, z, bright = 1}: { x: LedCoordinate, y: LedCoordinate, z: LedCoordinate, bright: LedBrightness }) => {
		let counter = 0;
		for (let brightBits = bright; bright; bright >>= 1) {
			if (brightBits & 0x01) {
				message[counter * SCREEN_SIZE + y * EDGE_LENGTH + z] |= (0x01 << x);
			}
			++counter;
		}
	};