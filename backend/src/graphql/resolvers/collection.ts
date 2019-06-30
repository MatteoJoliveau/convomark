import {Collection} from '../../models';
import {BookmarkRepository} from '../../typeorm';

export function collection(bookmarkRepo: BookmarkRepository) {
  return {
    Collection: {
      bookmarks: ({bookmarks}: Collection) => bookmarks,
      bookmarkCount: async ({id}: Collection) =>
        bookmarkRepo.count({where: {collection: id}}),
    },
  };
}
