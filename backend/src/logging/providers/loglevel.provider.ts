import { Level } from "pino";
import { Provider, ValueOrPromise } from "@loopback/core";

export class LogLevelProvider implements Provider<Level> {
  value(): Level {
    return (process.env.LOG_LEVEL as Level) || 'info';
  }

}
