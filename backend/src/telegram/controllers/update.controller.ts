/* eslint-disable @typescript-eslint/camelcase */
import {requestBody, post, HttpErrors} from '@loopback/rest';
import {Update} from 'telegram-typings';
import {inject} from '@loopback/core';
import {TelegramBot} from '../bot';
import {TelegramBindings} from '../keys';

export class UpdateController {
  constructor(
    @inject(TelegramBindings.TELEGRAM_SECRET) private secret: Buffer,
    @inject(TelegramBindings.TELEGRAM_BOT) private bot: TelegramBot,
  ) {}

  @post('/bot/updates/{tokenHash}', {
    parameters: [
      {
        name: 'tokenHash',
        description:
          'Hexadecimal representation of the SHA-256 hash of the Bot token issued by BotFather',
        required: true,
        schema: {type: 'string'},
        in: 'path',
      },
    ],
    responses: {
      '204': {},
    },
  })
  async handleUpdate(
    tokenHash: string,
    @requestBody({
      description:
        'Telegram Update object (https://core.telegram.org/bots/api#update)',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            title: 'Telegram Update',
            properties: {
              update_id: {
                type: 'integer',
              },
            },
          },
          example: {
            update_id: 123456789,
            message: {
              message_id: 1,
              from: {
                id: 123456789,
                is_bot: false,
                first_name: 'Matteo',
                last_name: 'Joliveau',
                username: 'GamesCodex',
                language_code: 'en',
              },
              chat: {
                id: 123456789,
                first_name: 'Matteo',
                last_name: 'Joliveau',
                username: 'GamesCodex',
                type: 'private',
              },
              date: 1560631001,
              text: 'hello',
            },
          },
        },
      },
    })
    update: Update,
  ) {
    if (this.secret.toString('hex') !== tokenHash) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    return this.bot.handleUpdate(update);
  }
}
