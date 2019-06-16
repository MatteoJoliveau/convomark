import Telegraf, { Middleware, ContextMessageUpdate } from 'telegraf';
import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  CoreBindings,
  ApplicationConfig,
} from '@loopback/core';
import { Update } from 'telegram-typings';
import { TelegramBindings } from './keys';
import { ConvoMarkBindings, ApplicationMode } from '../providers';
import { Loggable, Logger, logger } from '../logging';

@logger()
@lifeCycleObserver()
export class TelegramBot implements LifeCycleObserver, Loggable {
  logger: Logger;
  private bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject(TelegramBindings.TELEGRAM_TOKEN) token: string,
    @inject(TelegramBindings.TELEGRAM_SECRET) secret: Buffer,
    @inject(TelegramBindings.TELEGRAM_MAINTENANCE) maintenance: boolean,
    @inject(TelegramBindings.TELEGRAM_SESSION)
    sessionMiddleware: Middleware<ContextMessageUpdate>,
    @inject(TelegramBindings.TELEGRAM_I18N)
    localizationMiddleware: Middleware<ContextMessageUpdate>,
    @inject(ConvoMarkBindings.APPLICATION_MODE) mode: ApplicationMode,
    @inject(CoreBindings.APPLICATION_CONFIG) { domain }: ApplicationConfig,
  ) {
    this.bot = new Telegraf(token);

    this.bot.use(sessionMiddleware);
    this.bot.use(localizationMiddleware);

    if (mode === 'production') {
      const webhook = `${domain}/bot/updates/${secret.toString('hex')}`;
      this.setUpWebhook(webhook);
    }
    if (maintenance) {
      this.setUpMaintenanceMode();
    }
  }

  handleUpdate(rawUpdate: Update): Promise<object> {
    this.logger.debug('Processing update', rawUpdate);
    return this.bot.handleUpdate(rawUpdate);
  }

  async start(): Promise<void> {
    this.bot.launch().catch((e: string) => {
      this.logger.error(e);
      throw new Error(e);
    });
    const { username } = await this.bot.telegram.getMe();
    this.logger.info('Bot is running', { username });
    return Promise.resolve();
  }

  stop() {
    this.logger.info('Stopping the bot');
    this.bot.stop();
    this.logger.info('Stopped the bot');
  }

  async setUpWebhook(webhook: string): Promise<void> {
    try {
      const webhookInfo = await this.bot.telegram.getWebhookInfo();
      if (webhookInfo.url && webhookInfo.url === webhook) {
        this.logger.info('Webhook already set', { webhook });
      } else {
        const success = await this.bot.telegram.setWebhook(webhook);
        if (success) {
          this.logger.info('Registered bot webook', { webhook });
        } else {
          this.logger.error('Something went wrong when setting the webhook');
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  setUpMaintenanceMode() {
    this.logger.warn('Activated maintenance mode');
    this.bot.use(({ from, reply }) => {
      reply(`Hello ${from!.first_name}, the bot is under maintenance.
Please try again later`);
    })
  }
}
