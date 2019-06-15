import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  DataObject,
  AnyObject,
} from '@loopback/repository';
import {
  BookmarkCollection,
  BookmarkCollectionRelations,
  Bookmark,
  Collection,
} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BookmarkRepository} from './bookmark.repository';
import {CollectionRepository} from './collection.repository';
import {v4 as uuid} from 'uuid';

export class BookmarkCollectionRepository extends DefaultCrudRepository<
  BookmarkCollection,
  typeof BookmarkCollection.prototype.id,
  BookmarkCollectionRelations
> {
  public readonly bookmark: BelongsToAccessor<
    Bookmark,
    typeof BookmarkCollection.prototype.id
  >;
  public readonly collection: BelongsToAccessor<
    Collection,
    typeof BookmarkCollection.prototype.id
  >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('BookmarkRepository')
    bookmarkRepositoryGetter: Getter<BookmarkRepository>,
    @repository.getter('CollectionRepository')
    collectionRepositoryGetter: Getter<CollectionRepository>,
  ) {
    super(BookmarkCollection, dataSource);

    this.bookmark = this.createBelongsToAccessorFor(
      'bookmark',
      bookmarkRepositoryGetter,
    );

    this.collection = this.createBelongsToAccessorFor(
      'collection',
      collectionRepositoryGetter,
    );
  }

  create(
    entity: DataObject<BookmarkCollection>,
    opts?: AnyObject | undefined,
  ): Promise<BookmarkCollection> {
    entity.id = entity.id || uuid();
    return super.create(entity, opts);
  }
}
