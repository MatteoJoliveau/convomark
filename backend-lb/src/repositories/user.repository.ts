import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Collection, Bookmark} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import { CollectionRepository } from './collection.repository';
import { BookmarkRepository } from '.';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly collections: HasManyRepositoryFactory<Collection, typeof User.prototype.id>;
  public readonly bookmarks: HasManyRepositoryFactory<Bookmark, typeof User.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('CollectionRepository')
    collectionRepositoryGetter: Getter<CollectionRepository>,
    @repository.getter('BookmarkRepository')
    bookmarkRepositoryGetter: Getter<BookmarkRepository>,
  ) {
    super(User, dataSource);
    this.collections = this.createHasManyRepositoryFactoryFor(
      'collections',
      collectionRepositoryGetter
    );
    this.bookmarks = this.createHasManyRepositoryFactoryFor(
      'bookmarks',
      bookmarkRepositoryGetter
    );
  }
}
