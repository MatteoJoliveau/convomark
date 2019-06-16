import {Provider, inject} from '@loopback/core';
import pino, {Logger, Level} from 'pino';
import {LoggingBindings} from '../keys';
import {ConvoMarkBindings, ApplicationMode} from '../../providers';

export class LoggerProvider implements Provider<Logger> {
  constructor(
    @inject(LoggingBindings.LOG_LEVEL) private logLevel: Level,
    @inject(ConvoMarkBindings.APPLICATION_MODE) private mode: ApplicationMode,
  ) {}

  value(): Logger {
    const logger = pino({
      level: this.logLevel,
      enabled: true,
      prettyPrint: this.mode !== 'production' || false,
    });

    return logger;
  }
}
