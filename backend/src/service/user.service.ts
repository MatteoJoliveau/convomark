import { Optional } from "typescript-optional";
import { User as TelegramUser } from 'telegram-typings';
import { injectable, inject } from "inversify";
import { UserRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { User } from "../entity/User";
import { mapTelegramToUser } from "../mapper/user.mapper";
import { CollectionService } from "./collection.service";
import { AuthenticationService } from "./auth.service";
import { getLogger } from '../logger';
import { Logger } from 'pino';

@injectable()
export class UserService {
    private readonly repository: UserRepository;
    private readonly collectionService: CollectionService;
    private readonly authService: AuthenticationService;
    private readonly logger: Logger;

    constructor(@inject(TYPES.UserRepository) UserRepository: UserRepository, 
                @inject(CollectionService) collectionService: CollectionService,
                @inject(AuthenticationService) authService: AuthenticationService) {
        this.repository = UserRepository;
        this.collectionService = collectionService;
        this.authService = authService;
        this.logger = getLogger('UserService');
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
        this.logger.debug('Saving user', { user: found });
        const updatedUser = await this.save(found);
        await this.collectionService.createDefaultCollection(updatedUser);
        return updatedUser;
    }

    async getUserFromToken(token: string) {
        const { sub } = await this.authService.decodeToken(token);
        const id = parseInt(sub);
        return this.getUser({ id });
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
