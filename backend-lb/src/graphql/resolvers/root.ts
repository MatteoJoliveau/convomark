import { ApplicationApolloContext } from "../types";


export function root() {
  return {
    Query: {
      currentUser: (_parent: any, _args: any, { currentUser }: ApplicationApolloContext) => (currentUser)
    }
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

