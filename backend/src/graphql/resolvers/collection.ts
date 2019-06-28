import {Collection} from '../../models';
import {CollectionRepository} from '../../repositories';

export function collection(collectionRepo: CollectionRepository) {
    return {
        Collection: {
            bookmarks: ({id}: Collection) => collectionRepo.bookmarks({where: {id}})(),
            bookmarkCount: async ({id}: Collection) =>
                (await collectionRepo.bookmarks({where: {id}})()).length,
        },
    };
}
