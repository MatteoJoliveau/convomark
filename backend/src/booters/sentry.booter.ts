import {Booter} from "@loopback/boot";
import * as Sentry from '@sentry/node';
import {inject} from "@loopback/context";
import {SentryBindings} from "../keys";
import {Loggable, Logger, logger} from '../logging';

@logger()
export class SentryBooter implements Booter, Loggable {
    logger: Logger;
    constructor(
        @inject(SentryBindings.SENTRY_DSN) private dsn: string,
        @inject(SentryBindings.SENTRY_ENV) private environment: string,
    ) {}
    async configure(): Promise<void> {
        const { dsn, environment } = this;
        Sentry.init({
            dsn,
            environment,
        });
        this.logger.info('Initialized Sentry');
    }


}