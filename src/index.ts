import { SerialPort, SerialPortOpenOptions } from "serialport";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
import { Cube } from "./cube";
import { shrinkingCube } from "./calculator";

SerialPort.list().then(console.log);

const port = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 115200,
  autoOpen: false,
  parity: "none",
} as SerialPortOpenOptions<AutoDetectTypes>);

port.open(function (err) {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }
  const startTime = Date.now();

  const cube = new Cube(port);
  cube.Calculator = shrinkingCube;
  cube.Start();
  setTimeout(
    () => cube.Stop().then(() => console.log(Date.now() - startTime)),
    15000
  );
});
