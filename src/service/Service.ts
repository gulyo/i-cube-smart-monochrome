import { default as express, Express, RequestHandler } from "express";
import { Cube } from "../cube";
import { Server } from "http";
import { ServiceConfiguration } from "./ServiceConfiguration";
import { calculatorNames } from "../calculator/CalculatorName";
import { json } from "body-parser";
import { StartPayload } from "./StartPayload";
import { library } from "../calculator";

export class Service {
  readonly #server: Express = express();
  #httpServer: Server;

  constructor(
    private readonly cube: Cube,
    private readonly config: ServiceConfiguration
  ) {
    this.#server.post(this.config.url.start, json(), this.#startHandler);
    this.#server.post(this.config.url.stop, this.#stopHandler);
    this.#server.post(this.config.url.list, this.#listHandler);
  }

  public Start() {
    this.#httpServer = this.#server.listen(this.config.port);
  }

  public destructor() {
    this.#httpServer.close();
  }

  readonly #listHandler: RequestHandler = (request, response) => {
    console.log("List");
    response.setHeader("status", "200");
    response.send(calculatorNames);
  };

  readonly #startHandler: RequestHandler = (request, response) => {
    console.log("Start");

    const command: StartPayload = request.body;

    this.cube.Calculator = library[command.calculator];
    this.cube.Arg = command.arg;
    this.cube.Start();

    response.setHeader("status", "200");
    response.send("OK");
  };

  readonly #stopHandler: RequestHandler = (request, response) => {
    console.log("Stop");

    this.cube.Stop().then(() => {
      response.setHeader("status", "200");
      response.send("OK");
    });
  };
}
