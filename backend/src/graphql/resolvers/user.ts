import { first } from 'lodash';
import { User } from "../../models";
import { UserRepository } from "../../repositories";

export function user(userRepo: UserRepository) {
  return {
    User: {
      collections: (user: User) => {
        console.log('User collections', user, user.collections);
        return userRepo.collections(user.id).find();
      },
      collection: async ({ id }: User, { slug }: { slug: string }) =>  (userRepo.collections(id).find({ where: { slug }, limit: 1 }).then(first))
    },
  };
}
