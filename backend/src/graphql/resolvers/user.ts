import {first} from 'lodash';
import {User} from '../../models';
import {UserRepository} from '../../repositories';

export function user(userRepo: UserRepository) {
  return {
    User: {
      collections: ({id}: User) => userRepo.collections(id).find(),
      collection: async ({id}: User, {slug}: {slug: string}) =>
        userRepo
          .collections(id)
          .find({where: {slug}, limit: 1})
          .then(first),
    },
  };
}
