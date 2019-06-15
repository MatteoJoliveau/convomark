import {requestBody, param, post, HttpErrors} from '@loopback/rest';
import {Update} from 'telegram-typings';
import {inject} from '@loopback/core';
import {TelegramBot} from '../bot';
import {TelegramBindings} from '../keys';

export class UpdateController {
  constructor(
    @inject(TelegramBindings.TELEGRAM_TOKEN) private botToken: string,
    @inject(TelegramBindings.TELEGRAM_BOT) private bot: TelegramBot,
  ) {}

  @post('/bot/updates/{token}', {
    responses: {
      // '200': {
      // description: 'webhook response',
      // content:
      // }
    },
  })
  async handleUpdate(
    @param.path.string('token') token: string,
    @requestBody() update: Update,
  ) {
    if (this.botToken !== token) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    await this.bot.handleUpdate(update);
  }
}
