import { User as TelegramUser} from "telegram-typings";
import { Optional } from "typescript-optional";
import { mapUserToTelegram, mapTelegramToUser } from "../mapper/user.mapper";
import { injectable, inject } from "inversify";
import { UserRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";

@injectable()
export class UserService {
    private readonly repository: UserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
        this.repository = userRepository;
    }
    

    async getUser(id: number): Promise<Optional<TelegramUser>> {
         const userOpt = await this.repository.findOne({ id }).then(Optional.ofNullable);
         return userOpt.map(mapUserToTelegram);
    }

    save(user: TelegramUser): Promise<TelegramUser> {
        return this.repository.save(mapTelegramToUser(user)).then(mapUserToTelegram);
    }
}
