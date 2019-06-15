import { ApplicationApolloContext } from "../types";
import { UserRepository, BookmarkCollectionRepository } from "../../repositories";
import { first } from 'lodash';
import { EntityNotFoundError } from "@loopback/repository";
import { Bookmark } from "../../models";


export function root(userRepo: UserRepository, joinRepo: BookmarkCollectionRepository) {
  return {
    Query: {
      currentUser: (_parent: any, _args: any, { currentUser }: ApplicationApolloContext) => (currentUser)
    },
    Mutation: {
      bookmarkDelete: async (_parent: any, { id }: { id: string }, { currentUser }: ApplicationApolloContext) => {
        if (!currentUser) throw new EntityNotFoundError(Bookmark, id);
        const relationRepo = userRepo.bookmarks(currentUser.id);
        const bookmark = await relationRepo.find({ where: { id }, limit: 1 }).then(first);
        if (!bookmark) throw new EntityNotFoundError(Bookmark, id);
        const join = await joinRepo.findOne({ where: { bookmarkId: bookmark.id }});
        if (join) joinRepo.delete(join);
        await relationRepo.delete({ id: bookmark.id });
        return bookmark;
      }
  },
  }
}
  // Mutation: {
  //   bookmarkDelete: async (_parent: any, { id }: { id: string }, { currentUser: user, authenticationError }: ConvoApolloContext) => {
  //     if (!user) throw authenticationError;

  //     const optional = await bookmarkService.getBookmarkByUser({ user, id });
  //     const bookmark = optional.orElseThrow(() => new NotFoundError(`Bookmark not found`, { id }));
  //     return bookmarkService.delete(bookmark);
  //   }
  // },

