export interface ServiceConfiguration {
  port: number;
  url: {
    start: string;
    stop: string;
    list: string;
  };
}
