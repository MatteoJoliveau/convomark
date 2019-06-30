import {User} from '../../models';
import {CollectionRepository} from '../../typeorm';

export function user(collectionRepo: CollectionRepository) {
  return {
    User: {
      collections: ({collections}: User) => collections,
      collection: async (u: User, {slug}: {slug: string}) =>
        collectionRepo.findOne({where: {user: u, slug}}),
    },
  };
}
