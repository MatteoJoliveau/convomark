import {User as TelegramUser} from 'telegram-typings';
import {TelegramUserLoginData} from '../models';
import {User} from '../entities';

export function mapTelegramToUser(
  data: TelegramUserLoginData | TelegramUser,
): User {
  return new User({
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    username: data.username,
    photoUrl: (data as TelegramUserLoginData).photo_url,
    languageCode: (data as TelegramUser).language_code,
  });
}
