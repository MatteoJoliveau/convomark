import {Provider} from '@loopback/context';
import {IResolvers} from 'apollo-server';
import {root, user, collection} from '../resolvers';
import {merge} from 'lodash';
import {repository} from '@loopback/repository';
import {
  UserRepository,
  CollectionRepository,
  BookmarkRepository,
  BookmarkCollectionRepository,
} from '../../repositories';

export class ResolversProvider implements Provider<IResolvers<object, object>> {
  constructor(
    @repository(UserRepository) private userRepo: UserRepository,
    @repository(CollectionRepository)
    private collectionRepo: CollectionRepository,
    @repository(BookmarkRepository) private bookmarkRepo: BookmarkRepository,
    @repository(BookmarkCollectionRepository)
    private joinRepo: BookmarkCollectionRepository,
  ) {}

  value(): IResolvers<object, object> {
    return merge(
      root(this.userRepo, this.joinRepo),
      user(this.userRepo),
      collection(this.collectionRepo),
    );
  }
}
