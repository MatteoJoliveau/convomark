import {inject, Provider} from '@loopback/core';
import pino, {Level, Logger} from 'pino';
import {LoggingBindings} from '../keys';
import {ApplicationMode, ConvoMarkBindings} from '../../providers';

export class LoggerProvider implements Provider<Logger> {
  constructor(
    @inject(LoggingBindings.LOG_LEVEL) private logLevel: Level,
    @inject(ConvoMarkBindings.APPLICATION_MODE) private mode: ApplicationMode,
  ) {}

  value(): Logger {
      return pino({
        level: this.logLevel,
        enabled: true,
        prettyPrint: this.mode !== 'production' || false,
    });
  }
}
