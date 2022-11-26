import { SerialPort, SerialPortOpenOptions } from "serialport";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
import { Cube } from "./cube";
import { testCalculator } from "./calculator";

SerialPort.list().then(console.log);

const port = new SerialPort({
	path: "/dev/ttyUSB0",
	baudRate: 38400,
	autoOpen: false,
	parity: "none",
} as SerialPortOpenOptions<AutoDetectTypes>);


port.open(function (err) {
	if (err) {
		return console.log("Error opening port: ", err.message);
	}
	const cube = new Cube(port);
	cube.Calculator = testCalculator;

	cube.Start();
	setTimeout(cube.Stop, 5000);
});
