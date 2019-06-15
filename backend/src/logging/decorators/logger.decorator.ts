import {Level} from 'pino';
import {LoggerProvider} from '../providers/logger.provider';
import {LogLevelProvider} from '..';
import {ApplicationModeProvider} from '../../providers';

export interface LoggerMetadata {
  name?: string;
  level?: Level;
}

export function logger(
  {name, level}: LoggerMetadata = {},
): ClassDecorator {
  return (targetClass: Function) => {
    name = name || targetClass.name;
    const logLevel = new LogLevelProvider().value();
    level = level || logLevel;
    const mode = new ApplicationModeProvider().value();
    const masterLogger = new LoggerProvider(logLevel, mode).value();
    targetClass.prototype.logger = masterLogger.child({name, level});
  };
}
