import {Level} from 'pino';
import {LoggerProvider} from '../providers/logger.provider';
import {LogLevelProvider} from '..';
import {ApplicationModeProvider} from '../../providers';

export interface LoggerMetadata {
  name?: string;
  level?: Level;
}

export function logger(
  {name, level}: LoggerMetadata = {level: 'info'},
): ClassDecorator {
  return (targetClass: Function) => {
    name = name || targetClass.name;
    const logLevel = new LogLevelProvider().value();
    const mode = new ApplicationModeProvider().value();
    const masterLogger = new LoggerProvider(logLevel, mode).value();
    targetClass.prototype.logger = masterLogger.child({name, level});
  };
}
