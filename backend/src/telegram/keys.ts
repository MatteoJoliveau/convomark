import { BindingKey } from '@loopback/context';
import { Middleware, ContextMessageUpdate } from 'telegraf';

export namespace TelegramBindings {
  export const TELEGRAM_TOKEN = BindingKey.create<string>('telegram.token');
  export const TELEGRAM_SECRET = BindingKey.create<Buffer>('telegram.secret');
  export const TELEGRAM_BOT = BindingKey.create<string>('telegram.bot');
  export const TELEGRAM_MAINTENANCE = BindingKey.create<boolean>('telegram.maintenance');
  export const TELEGRAM_SESSION = BindingKey.create<
    Middleware<ContextMessageUpdate>
  >('telegram.session');
  export const TELEGRAM_I18N = BindingKey.create<
    Middleware<ContextMessageUpdate>
  >('telegram.i18n');
}
