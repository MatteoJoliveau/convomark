import {getLogger, Level} from '..';

export interface LoggerMetadata {
  name?: string;
  level?: Level;
}

export function logger({name, level}: LoggerMetadata = {}): ClassDecorator {
  return (targetClass: Function) => {
    const masterLogger = getLogger(name || targetClass.name, level);
    targetClass.prototype.logger = masterLogger.child({name, level});
  };
}
