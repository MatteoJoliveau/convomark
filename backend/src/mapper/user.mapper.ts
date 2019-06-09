import { User as TelegramUser} from "telegram-typings";
import { User } from "../entity/User";

export function mapTelegramToUser(user: TelegramUser): User {
    const entity = new User();
    entity.id = user.id;
    entity.firstName = user.first_name;
    entity.lastName = user.last_name;
    entity.languageCode = user.language_code || "en";
    entity.username = user.username;
    entity.photoUrl = (<any> user).photo_url;
    return entity;
}

export function mapUserToTelegram(user: User): TelegramUser {
    const { id, firstName, lastName, languageCode, username } = user;
    const telegram: TelegramUser = {
        id,
        first_name: firstName,
        last_name: lastName,
        language_code: languageCode,
        username,
        is_bot: false,
    };
    return telegram;
}