import { Provider, inject } from '@loopback/context';
import TelegrafI18n from 'telegraf-i18n';
import { Middleware, ContextMessageUpdate } from 'telegraf';
import { logger, Loggable, Logger } from '../../logging';
import { CoreBindings, ApplicationConfig, ApplicationMetadata } from '@loopback/core';
import { ConvoMarkApplication } from '../..';
import path from 'path';

@logger()
export class I18nProvider implements Provider<Middleware<ContextMessageUpdate>>, Loggable {
    logger: Logger

    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE) private app: ConvoMarkApplication,
    ) { }

    async value(): Promise<Middleware<ContextMessageUpdate>> {
        const directory = path.resolve(this.app.projectRoot, '..', 'public/telegram/locales');
        const i18n = new TelegrafI18n({
            defaultLanguage: 'en',
            useSession: true,
            directory,
        })
        this.logger.debug('Loaded Telegram locales from', directory);
        
        return i18n.middleware();
    }
}
