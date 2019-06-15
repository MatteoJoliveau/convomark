import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { Update } from 'telegram-typings';
import { TelegramBindings } from './keys';
import { ConvoMarkBindings, ApplicationMode } from '../providers';
import { logger } from '../decorators';
import { Loggable, Logger } from '../logging';

@logger()
@lifeCycleObserver()
export class TelegramBot implements LifeCycleObserver, Loggable {
  logger: Logger;
  private bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject(TelegramBindings.TELEGRAM_TOKEN) token: string,
    @inject(ConvoMarkBindings.APPLICATION_MODE) mode: ApplicationMode,
  ) {
    this.bot = new Telegraf(token);

    this.bot.on('message', ({ message, from, reply }) => {
      this.logger.info('Received message', message);
      reply(`Hello ${from!.first_name}, the bot is under maintenance.
Please try again later`);
    })
  }

  handleUpdate(rawUpdate: Update): Promise<any> {
    return this.bot.handleUpdate(rawUpdate);
  }

  async start(): Promise<void> {
    this.bot.launch()
      .catch((e: any) => {
        console.error('Bot error', e);
        throw new Error(e);
      });
    const { username } = await this.bot.telegram.getMe()
    this.logger.info('Bot is running with', username);
    // console.log(` username @${username}`);
    return Promise.resolve();
  }

  stop() {
    console.log('Stopping the bot');
    this.bot.stop();
    console.log('Stopped the bot');
  }
}
