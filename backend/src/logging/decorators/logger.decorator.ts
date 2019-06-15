import { Level, Logger } from 'pino';
import { Constructor, MetadataInspector } from '@loopback/core';
import { LoggerProvider } from '../providers/logger.provider';
import { LogLevelProvider } from '..';
import { ApplicationModeProvider } from '../../providers';

export interface LoggerMetadata {
  name?: string
  level?: Level
}

export function logger({ name, level }: LoggerMetadata = { level: 'info' }): ClassDecorator {
  return (targetClass: Function) => {
    name = name || targetClass.name;
    const logLevel = new LogLevelProvider().value();
    const mode = new ApplicationModeProvider().value();
    const logger = new LoggerProvider(logLevel, mode).value();
    targetClass.prototype.logger = logger.child({ name, level });
  }
}
