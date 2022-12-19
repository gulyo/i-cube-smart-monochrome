import { ServiceConfiguration } from "../service";

export interface Configuration {
  serialPort: string;
  listPorts: boolean;
  service: ServiceConfiguration;
}
