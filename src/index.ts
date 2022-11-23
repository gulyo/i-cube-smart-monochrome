import { SerialPort, SerialPortOpenOptions } from "serialport";

console.log("Hello World");

SerialPort.list().then(console.log);

const port = new SerialPort({
	path: "/dev/ttyUSB0",
	baudRate: 19200,
	autoOpen: false,
	parity: "none"
} as SerialPortOpenOptions<any>);


let testMessage: Uint8Array;
let offset = 0x00;

const testFn = (): void => {
	testMessage = new Uint8Array(65);
	testMessage[0] = 0xF2;
	for (let i = 0; i < 8; ++i) {
		for (let j = 0; j < 8; ++j) {
			testMessage[i * 8 + j + 1] = ((i === j) && (i === offset)) ?
				(0x01 << offset) : 0;
		}
	}
	offset = ++offset % 8;
	port.write(Buffer.from(testMessage));
	// testMessage.forEach(byte => port.write([byte]));

	setTimeout(testFn, 50);
};


port.open(function (err) {
	if (err) {
		return console.log("Error opening port: ", err.message);
	}

	// Because there's no callback to write, write errors will be emitted on the port:
	// port.write(testMessage);
	setTimeout(testFn, 1000);
	// setTimeout(() => port.write(Buffer.from([0xF5])), 1920);
	// setTimeout(() => {
	// 	//port.write(Buffer.from([0xF5]));
	// 	testFn();
	// }, 2000);
	//
	// setTimeout(() => {
	// 	//port.write(Buffer.from([0xF5]));
	// 	testFn();
	// }, 4000);

	// setTimeout(() => port.write(Buffer.from([0xF5])), 6000);
});
