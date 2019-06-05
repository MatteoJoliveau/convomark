import pino, { Level, SerializerFn, Logger } from 'pino';
import isProduction from './utils/isProduction';

const { LOG_LEVEL } = process.env;

const logger = pino({
    level: LOG_LEVEL || 'info',
    enabled: true,
    prettyPrint: !isProduction|| false
});

export function getLogger(name: string, bindings: {
    level?: Level | string;
    serializers?: { [key: string]: SerializerFn };
    [key: string]: any;
} = {}): Logger {
    return logger.child({ name, ...bindings });
}