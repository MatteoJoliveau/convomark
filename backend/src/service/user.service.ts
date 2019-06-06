import { Optional } from "typescript-optional";
import { User as TelegramUser } from 'telegram-typings';
import { injectable, inject } from "inversify";
import { UserRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { User } from "../entity/User";
import { mapTelegramToUser } from "../mapper/user.mapper";

@injectable()
export class UserService {
    private readonly repository: UserRepository;

    constructor(@inject(TYPES.UserRepository) UserRepository: UserRepository) {
        this.repository = UserRepository;
    }
    
    getUser(filters: UserParameters | { id: number }): Promise<Optional<User>> {
        return this.repository.findOne({...filters, relations: ['collections'] }).then(Optional.ofNullable);
    }

    getUsers(filters?: UserParameters): Promise<User[]> {
        return this.repository.find({...filters, relations: ['collections'] });
    }

    save(user: User | TelegramUser): Promise<User> {
        if ((user as TelegramUser).first_name) {
            return this.repository.save(mapTelegramToUser((user as TelegramUser)));
        } else {
            return this.repository.save(user);
        }
    }
}

export interface UserParameters {
    firstName?: string;
    lastName?: string;
    username?: string;
}
