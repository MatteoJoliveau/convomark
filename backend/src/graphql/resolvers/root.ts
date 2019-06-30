import {ApplicationApolloContext} from '../types';
import {BookmarkRepository, UserRepository} from '../../typeorm';
import {EntityNotFoundError} from '@loopback/repository';
import {getLogger} from '../../logging';

export function root(
  userRepo: UserRepository,
  bookmarkRepo: BookmarkRepository,
) {
  const logger = getLogger('RootResolver');
  return {
    Query: {
      currentUser: (
        _parent: object,
        _args: object,
        {currentUser}: ApplicationApolloContext,
      ) => currentUser,
    },
    Mutation: {
      bookmarkDelete: async (
        _parent: object,
        {id}: {id: string},
        {currentUser}: ApplicationApolloContext,
      ) => {
        logger.info({id, currentUser}, 'Deleting bookmark');
        if (!currentUser) throw new EntityNotFoundError('Bookmark', id);
        const bookmark = await bookmarkRepo.findOne({
          where: {id, user: currentUser},
        });
        if (!bookmark) throw new EntityNotFoundError('Bookmark', id);
        const {affected} = await bookmarkRepo.delete(bookmark);
        logger.debug('Deleted %d bookmark/s', affected);
        return bookmark;
      },
    },
  };
}
