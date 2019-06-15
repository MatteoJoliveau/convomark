import {Provider} from '@loopback/core';

export class TokenProvider implements Provider<string> {
  value(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  }
}
