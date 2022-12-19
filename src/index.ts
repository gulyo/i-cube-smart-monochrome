import { SerialPort, SerialPortOpenOptions } from "serialport";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
import { Cube } from "./cube";
import { Service } from "./service";
import fs from "fs";
import { Configuration } from "./type";

const start = () => {
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

    // const startTime = Date.now();
    //
    // const cube = new Cube(port);
    // cube.Calculator = library.Matrix;
    // cube.Start();
    // setTimeout(
    //   () => cube.Stop().then(() => console.log(Date.now() - startTime)),
    //   15000
    // );
  });

  const service = new Service(new Cube(port), config.service);
  service.Start();
};

const config: Configuration = JSON.parse(
  fs.readFileSync(`${__dirname}/config.json`, "utf8")
);

if (config.listPorts) {
  SerialPort.list().then(console.log);
} else {
  start();
}
