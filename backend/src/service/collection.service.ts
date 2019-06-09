import { Optional } from "typescript-optional";
import { injectable, inject } from "inversify";
import { CollectionRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { Collection } from "../entity/Collection";
import { User } from "../entity/User";

@injectable()
export class CollectionService {
    private readonly repository: CollectionRepository;

    constructor(@inject(TYPES.CollectionRepository) CollectionRepository: CollectionRepository) {
        this.repository = CollectionRepository;
    }
    
    getCollection(filters: CollectionParameters | { id: string }): Promise<Optional<Collection>> {
        return this.repository.findOne(filters).then(Optional.ofNullable);
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

    async createDefaultCollection(user: User): Promise<Collection> {
        const collections = await user.collections;
        const existentCollection = collections.find((collection) => collection.title.toLowerCase() === 'default');
        if (existentCollection) {
            return existentCollection;
        } else {
            const collection = Collection.defaultCollection();
            collection.user = user;
            return this.save(collection);
        }

    }
}

export interface CollectionParameters {
    title?: string;
    slug?: string;
}
