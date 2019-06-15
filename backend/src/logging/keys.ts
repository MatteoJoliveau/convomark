import { BindingKey } from "@loopback/core";
import { Level, Logger } from "pino";

export namespace LoggingBindings {
  export const LOG_LEVEL = BindingKey.create<Level>('logging.level');
  export const LOGGER = BindingKey.create<Logger>('logging.logger');
}
