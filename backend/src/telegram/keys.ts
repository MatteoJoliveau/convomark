import {BindingKey} from '@loopback/context';
import {MiddlewareProvider} from './types';
import { TelegramBot } from './bot';

export namespace TelegramBindings {
  export const TELEGRAM_TOKEN = BindingKey.create<string>('telegram.token');
  export const TELEGRAM_SECRET = BindingKey.create<Buffer>('telegram.secret');
  export const TELEGRAM_BOT = BindingKey.create<TelegramBot>('telegram.bot');
  export const TELEGRAM_MAINTENANCE = BindingKey.create<boolean>(
    'telegram.maintenance',
  );
  export const TELEGRAM_SESSION = BindingKey.create<MiddlewareProvider>(
    'telegram.session',
  );
  export const TELEGRAM_I18N = BindingKey.create<MiddlewareProvider>(
    'telegram.i18n',
  );
}
