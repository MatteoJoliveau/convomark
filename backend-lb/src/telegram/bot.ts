import Telegraf, { TelegrafOptions, ContextMessageUpdate, TelegrafConstructor, TelegramOptions } from 'telegraf';
import { inject, DefaultConfigurationResolver, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { Update } from 'telegram-typings';

@lifeCycleObserver()
export class ConvoMarkBot implements LifeCycleObserver {
  private bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject('telegram.token') token: string,
    @inject('application.mode') mode: string,
  ) {
    this.bot = new Telegraf(token);

    this.bot.on('message', (ctx) => {
      console.log('Received message', ctx.message);
      const from = (ctx.from!);
      ctx.reply(`Hello ${from.first_name}`);
    })

    if (mode === 'development') {
      this.bot.startPolling();
    }
  }

  handleUpdate(rawUpdate: Update): Promise<any> {
    return this.bot.handleUpdate(rawUpdate);
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Starting the bot');
      this.bot.startPolling()
        .catch((e: any) => {
          console.error('Bot error', e);
          reject(e);
        });
      console.log('Started the bot');
      resolve();
    });
  }

  stop() {
    console.log('Stopping the bot');
    this.bot.stop();
    console.log('Stopped the bot');
  }
}
