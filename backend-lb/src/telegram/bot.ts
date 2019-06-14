import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { Update } from 'telegram-typings';

@lifeCycleObserver()
export class TelegramBot implements LifeCycleObserver {
  private bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject('telegram.token') token: string,
    @inject('application.mode') mode: string,
  ) {
    this.bot = new Telegraf(token);

    this.bot.on('message', (ctx) => {
      console.log('Received message', ctx.message);
      const from = (ctx.from!);
      ctx.reply(`Hello ${from.first_name}, the bot is under maintenance.
Please try again later`);
    })

    if (mode === 'development') {
      this.bot.startPolling();
    }
  }

  handleUpdate(rawUpdate: Update): Promise<any> {
    return this.bot.handleUpdate(rawUpdate);
  }

  async start(): Promise<void> {
    this.bot.startPolling()
      .catch((e: any) => {
        console.error('Bot error', e);
        throw new Error(e);
      });
    const { username } = await this.bot.telegram.getMe()
    console.log(`Bot is running with username @${username}`);
    return Promise.resolve();
  }

  stop() {
    console.log('Stopping the bot');
    this.bot.stop();
    console.log('Stopped the bot');
  }
}
