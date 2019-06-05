import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { User as TelegramUser} from "telegram-typings";
import { Optional } from "typescript-optional";
import { mapUserToTelegram, mapTelegramToUser } from "../mapper/user.mapper";

export class UserService {
    private repository = getRepository(User);

    async getUser(id: number): Promise<Optional<TelegramUser>> {
         const userOpt = await this.repository.findOne({ id }).then(Optional.ofNullable);
         return userOpt.map(mapUserToTelegram);
    }

    async save(user: TelegramUser): Promise<TelegramUser> {
        return this.repository.save(mapTelegramToUser(user)).then(mapUserToTelegram);
    }
}

const service = new UserService();

export function getUserService(): UserService {
    return service;
}