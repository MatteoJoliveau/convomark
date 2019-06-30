import {Level, Logger, LoggerProvider, LogLevelProvider} from './';
import {ApplicationModeProvider} from '../providers';

export function getLogger(name: string, level?: Level): Logger {
  const logLevel = new LogLevelProvider().value();
  level = level || logLevel;
  const mode = new ApplicationModeProvider().value();
  const masterLogger = new LoggerProvider(logLevel, mode).value();
  return masterLogger.child({name, level});
}
