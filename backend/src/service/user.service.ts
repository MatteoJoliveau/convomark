import { Optional } from "typescript-optional";
import { User as TelegramUser } from 'telegram-typings';
import { injectable, inject } from "inversify";
import { UserRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { User } from "../entity/User";
import { mapTelegramToUser } from "../mapper/user.mapper";
import { CollectionService } from "./collection.service";

@injectable()
export class UserService {
    private readonly repository: UserRepository;
    private readonly collectionService: CollectionService;

    constructor(@inject(TYPES.UserRepository) UserRepository: UserRepository, @inject(CollectionService) collectionService: CollectionService) {
        this.repository = UserRepository;
        this.collectionService = collectionService;
    }
    
    getUser(filters: UserParameters | { id: number }): Promise<Optional<User>> {
        return this.repository.findOne({...filters }).then(Optional.ofNullable);
    }

    getUsers(filters?: UserParameters): Promise<User[]> {
        return this.repository.find({...filters });
    }

    async getOrCreateUser(user: User | TelegramUser): Promise<User> {
        const userOpt = await this.getUser({ id: user.id });
        const found = userOpt.isPresent() ? userOpt.get() : user;
        const updatedUser = await this.save(found);
        await this.collectionService.createDefaultCollection(updatedUser);
        return updatedUser;
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
