import { Logger } from "pino";

export { Logger };

export interface Loggable {
  logger: Logger
}
