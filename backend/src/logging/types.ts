import {Logger, Level} from 'pino';

export {Logger, Level};

export interface Loggable {
  logger: Logger;
}
