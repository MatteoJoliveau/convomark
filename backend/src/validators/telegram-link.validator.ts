import {URL} from 'url';

export function validateTelegramLink(link: string) {
  const valid = ['t.me', 'telegram.me'].includes(new URL(link).hostname);
  if (!valid) throw new Error(`${link} is not a Telegram link!`);
}
