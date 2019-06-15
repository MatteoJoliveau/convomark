import Telegraf, {ContextMessageUpdate} from 'telegraf';
import {inject, lifeCycleObserver, LifeCycleObserver, CoreBindings, ApplicationConfig} from '@loopback/core';
import {Update} from 'telegram-typings';
import {TelegramBindings} from './keys';
import {ConvoMarkBindings, ApplicationMode} from '../providers';
import {Loggable, Logger, logger} from '../logging';
import { raw } from 'body-parser';

@logger()
@lifeCycleObserver()
export class TelegramBot implements LifeCycleObserver, Loggable {
  logger: Logger;
  private bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject(TelegramBindings.TELEGRAM_TOKEN) token: string,
    @inject(TelegramBindings.TELEGRAM_SECRET) secret: Buffer,
    @inject(ConvoMarkBindings.APPLICATION_MODE) mode: ApplicationMode,
    @inject(CoreBindings.APPLICATION_CONFIG) appConfig: ApplicationConfig
  ) {
    this.bot = new Telegraf(token);

    if (mode === 'production') {
      const { domain } = appConfig;
      const webhook = `${domain}/bot/updates/${secret.toString('hex')}`;
      this.logger.info('Registered bot webook', {webhook});
      this.bot.telegram.setWebhook(webhook);
    }

    this.bot.on('message', ({from, reply}) => {
      reply(`Hello ${from!.first_name}, the bot is under maintenance.
Please try again later`);
    });
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
    const {username} = await this.bot.telegram.getMe();
    this.logger.info('Bot is running with', username);
    return Promise.resolve();
  }

  stop() {
    this.logger.info('Stopping the bot');
    this.bot.stop();
    this.logger.info('Stopped the bot');
  }
}
