import { BindingKey } from "@loopback/core";

export namespace TelegramBindings {
  export const TELEGRAM_TOKEN = BindingKey.create<string>(
    'telegram.token',
  );
  export const TELEGRAM_BOT = BindingKey.create<string>(
    'telegram.bot',
  );
}
