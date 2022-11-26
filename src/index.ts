import { SerialPort, SerialPortOpenOptions } from "serialport";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
import { Cube } from "./cube";
import { shrinkingCube, shrinkingCubeTimer } from "./calculator";

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
	cube.Calculator = shrinkingCube;
	cube.Timer = shrinkingCubeTimer;
	cube.Start();
	setTimeout(cube.Stop, 25000);
});
