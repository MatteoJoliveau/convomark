import {DefaultCrudRepository, HasManyRepositoryFactory, repository, DataObject} from '@loopback/repository';
import {Bookmark, BookmarkRelations, BookmarkCollection} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import { BookmarkCollectionRepository } from './bookmark-collection.repository';
import { AnyObject } from 'loopback-datasource-juggler';
import { v4 as uuid } from 'uuid';

export class BookmarkRepository extends DefaultCrudRepository<
  Bookmark,
  typeof Bookmark.prototype.id,
  BookmarkRelations
> {
  public readonly bookmarkCollections: HasManyRepositoryFactory<BookmarkCollection, typeof Bookmark.prototype.id>

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('BookmarkCollectionRepository')
    relationRepositoryGetter: Getter<BookmarkCollectionRepository>,
  ) {
    super(Bookmark, dataSource);
    this.bookmarkCollections = this.createHasManyRepositoryFactoryFor(
      'bookmarkCollections',
      relationRepositoryGetter
    )
  }

  create(entity: DataObject<Bookmark>, opts?: AnyObject | undefined): Promise<Bookmark> {
    entity.id = entity.id || uuid()
    return super.create(entity, opts);
  }
}
