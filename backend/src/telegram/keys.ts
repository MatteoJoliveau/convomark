import {BindingKey} from '@loopback/context';

export namespace TelegramBindings {
  export const TELEGRAM_TOKEN = BindingKey.create<string>('telegram.token');
  export const TELEGRAM_SECRET = BindingKey.create<Buffer>('telegram.secret');
  export const TELEGRAM_BOT = BindingKey.create<string>('telegram.bot');
}
