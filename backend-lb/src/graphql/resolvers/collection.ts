import { Collection } from "../../models";
import { CollectionRepository } from "../../repositories";


export function collection(collectionRepo: CollectionRepository) {
  return {
    Collection: {
      bookmarks: ({ id }: Collection) => (collectionRepo.bookmarks(id)),
      bookmarkCount: async ({ id }: Collection) => ((await collectionRepo.bookmarks(id)).length),
    }
  };
}
