import { DefaultCrudRepository, repository, HasManyRepositoryFactory, DataObject, AnyObject, EntityNotFoundError } from '@loopback/repository';
import { Collection, CollectionRelations, BookmarkCollection, Bookmark, User } from '../models';
import { DatabaseDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { BookmarkCollectionRepository } from './bookmark-collection.repository';
import { v4 as uuid } from 'uuid';
import slug from 'slug';
import { UserRepository } from '.';

export class CollectionRepository extends DefaultCrudRepository<
  Collection,
  typeof Collection.prototype.id,
  CollectionRelations
  > {
  public readonly bookmarkCollections: HasManyRepositoryFactory<BookmarkCollection, typeof Collection.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('UserRepository')
    private userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('BookmarkCollectionRepository')
    private relationRepositoryGetter: Getter<BookmarkCollectionRepository>,
  ) {
    super(Collection, dataSource);
    this.bookmarkCollections = this.createHasManyRepositoryFactoryFor(
      'bookmarkCollections',
      relationRepositoryGetter
    )
  }

  async create(entity: DataObject<Collection>, opts?: AnyObject | undefined): Promise<Collection> {
    const user = await this.getCollectionUser(entity.userId);
    entity.id = entity.id || uuid()
    const username = user.username || user.id;
    entity.slug = slug(`${username} ${entity.title}`, { lower: true });
    
    return super.create(entity, opts);
  }

  async update(entity: Collection, opts?: AnyObject | undefined): Promise<void> {
    const user = await this.getCollectionUser(entity.userId);
    const username = user.username || user.id;
    entity.slug = slug(`${username} ${entity.title}`, { lower: true });
    
    return super.update(entity, opts);
  }
  

  async bookmarks(collectionId: typeof Collection.prototype.id): Promise<Bookmark[]> {
    const relationRepo = await this.relationRepositoryGetter();
    const joins = await this.bookmarkCollections(collectionId).find();
    return await Promise.all(joins.map(({ id }) => relationRepo.bookmark(id)));
  }

  private async getCollectionUser(id?: typeof User.prototype.id): Promise<User> {
    const userRepo = await this.userRepositoryGetter();
    const user = await userRepo.findOne({ where: { id }});
    if (!user) throw new EntityNotFoundError(User, id);

    return user;
  }
}
