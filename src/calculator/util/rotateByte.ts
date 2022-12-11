export const rotateByte = (byte: number, shift: number): number =>
	(byte >> shift) | ((byte & 0b11111111 >> (8 - shift)) << (8 - shift));