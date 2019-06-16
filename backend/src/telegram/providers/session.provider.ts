import { Provider } from '@loopback/context';
import RedisSession from 'telegraf-session-redis';
import { Middleware, ContextMessageUpdate } from 'telegraf';
import { logger, Loggable, Logger } from '../../logging';

@logger()
export class SessionProvider implements Provider<Middleware<ContextMessageUpdate>>, Loggable {
    logger: Logger

    value(): Promise<Middleware<ContextMessageUpdate>> {
        return new Promise((resolve, reject) => {
            const session = new RedisSession({
                store: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: +(process.env.REDIS_PORT || 6379),
                },
            });
            session.client.on('connect', () => {
                this.logger.debug('Redis connected');
                this.logger.debug('Initialized Redis based session');
                resolve(session.middleware());
            }).on('error', (e) => {
                this.logger.error(e);
                reject(e);
            })
        });
    }
}
