import {inject, Provider} from '@loopback/context';
import {IResolvers} from 'apollo-server';
import {root, user, collection} from '../resolvers';
import {merge} from 'lodash';
import {TypeORMBindings} from '../../typeorm';
import {
  BookmarkRepository,
  CollectionRepository,
  UserRepository,
} from '../../typeorm';

export class ResolversProvider implements Provider<IResolvers<object, object>> {
  constructor(
    @inject(TypeORMBindings.USER_REPOSITORY) private userRepo: UserRepository,
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepo: CollectionRepository,
    @inject(TypeORMBindings.BOOKMARK_REPOSITORY)
    private bookmarkRepo: BookmarkRepository,
  ) {}

  value(): IResolvers<object, object> {
    return merge(
      root(this.userRepo, this.bookmarkRepo),
      user(this.collectionRepo),
      collection(this.bookmarkRepo),
    );
  }
}
