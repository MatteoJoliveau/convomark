import { Optional } from "typescript-optional";
import { injectable, inject } from "inversify";
import { CollectionRepository, UserRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { Collection } from "../entity/Collection";
import { User } from "../entity/User";
import { Logger } from "pino";
import { getLogger } from "../logger";

@injectable()
export class CollectionService {
    private readonly repository: CollectionRepository;
    private readonly userRepository: UserRepository;
    private readonly logger: Logger;

    constructor(@inject(TYPES.CollectionRepository) collectionRepository: CollectionRepository,
                @inject(TYPES.UserRepository) userRepository: UserRepository) {
        this.repository = collectionRepository;
        this.userRepository = userRepository;
        this.logger = getLogger('CollectionService')
    }
    
    getCollection(filters: CollectionParameters | { id: string }): Promise<Optional<Collection>> {
        return this.repository.findOne(filters).then(Optional.ofNullable);
    }

    getCollectionByTitle({ title, user }: { title: string, user: User}): Promise<Optional<Collection>> {
        return this.repository.createQueryBuilder('collection')
            .innerJoin('collection.user', 'user')
            .where({ user })
            .andWhere('LOWER(title) = LOWER(:title)', { title })
            .getOne()
            .then(Optional.ofNullable);
    }

    getCollections(filters?: CollectionParameters): Promise<Collection[]> {
        return this.repository.find(filters);
    }

    findByUser(user: User): Promise<Collection[]> {
        return this.repository.find({ user });
    }
    
    findOneByUser({ slug, user }: { slug: string, user: User}): Promise<Optional<Collection>> {
        return this.repository.findOne({ user, slug }).then(Optional.ofNullable);
    }

    save(collection: Collection): Promise<Collection> {
        return this.repository.save(collection);
    }

    delete(collection: Collection): Promise<Collection> {
        const clone = { ...collection, generateSlug: collection.generateSlug };
        return this.repository.remove(collection).then(() => clone);
    }

    async createDefaultCollection(user: User): Promise<Collection> {
        this.logger.debug('Creating default collection', { user });
        const collections = await user.collections;
        const existentCollection = collections.find((collection) => collection.title.toLowerCase() === 'default');
        if (existentCollection) {
            this.logger.debug('Default collection already exists', { collection: existentCollection.slug });
            return existentCollection;
        } else {
            const collection = Collection.defaultCollection();
            collection.user = user;
            return this.save(collection).then((c) => {
                this.logger.debug('Created default collection', { collection: c.slug });
                return c;
            });
        }

    }
}

export interface CollectionParameters {
    title?: string;
    slug?: string;
}
