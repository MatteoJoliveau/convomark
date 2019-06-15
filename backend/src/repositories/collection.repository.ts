import { DefaultCrudRepository, repository, HasManyRepositoryFactory, DataObject, AnyObject } from '@loopback/repository';
import { Collection, CollectionRelations, BookmarkCollection, Bookmark } from '../models';
import { DatabaseDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { BookmarkCollectionRepository } from './bookmark-collection.repository';
import { v4 as uuid } from 'uuid';
import { BookmarkRepository } from '.';

export class CollectionRepository extends DefaultCrudRepository<
  Collection,
  typeof Collection.prototype.id,
  CollectionRelations
  > {
  public readonly bookmarkCollections: HasManyRepositoryFactory<BookmarkCollection, typeof Collection.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('BookmarkCollectionRepository')
    private relationRepositoryGetter: Getter<BookmarkCollectionRepository>,
  ) {
    super(Collection, dataSource);
    this.bookmarkCollections = this.createHasManyRepositoryFactoryFor(
      'bookmarkCollections',
      relationRepositoryGetter
    )
  }

  create(entity: DataObject<Collection>, opts?: AnyObject | undefined): Promise<Collection> {
    entity.id = entity.id || uuid()
    return super.create(entity, opts);
  }

  async bookmarks(collectionId: typeof Collection.prototype.id): Promise<Bookmark[]> {
    const relationRepo = await this.relationRepositoryGetter();
    const joins = await this.bookmarkCollections(collectionId).find();
    return await Promise.all(joins.map(({ id }) => relationRepo.bookmark(id)));
  }
}
