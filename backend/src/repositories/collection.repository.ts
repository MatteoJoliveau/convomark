import {createHash} from 'crypto';
import {
  AnyObject,
  DataObject,
  DefaultCrudRepository,
  EntityNotFoundError,
  Filter,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {
  Bookmark,
  BookmarkCollection,
  Collection,
  CollectionRelations,
  User,
} from '../models';
import {DatabaseDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {BookmarkCollectionRepository} from './bookmark-collection.repository';
import slug from 'slug';
import {UserRepository} from '.';

export class CollectionRepository extends DefaultCrudRepository<
  Collection,
  typeof Collection.prototype.id,
  CollectionRelations
> {
  public readonly bookmarkCollections: HasManyRepositoryFactory<
    BookmarkCollection,
    typeof Collection.prototype.id
  >;

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
      relationRepositoryGetter,
    );
  }

  async create(
    entity: DataObject<Collection>,
    opts?: AnyObject | undefined,
  ): Promise<Collection> {
    const user = await this.getCollectionUser(entity.userId);
    const username = user.username || user.id;
    entity.slug = slug(`${username} ${entity.title}`, {lower: true});
    const created = await super.create(entity, opts);
    const hash = createHash('SHA256');
    hash.update(created.id);
    created.shortId = hash.digest('hex').substring(0, 7);
    await super.update(created);
    return created;
  }

  async update(
    entity: Collection,
    opts?: AnyObject | undefined,
  ): Promise<void> {
    const user = await this.getCollectionUser(entity.userId);
    const username = user.username || user.id;
    entity.slug = slug(`${username} ${entity.title}`, {lower: true});
    entity.shortId =
      entity.shortId ||
      (e => {
        const hash = createHash('SHA256');
        hash.update(e.id);
        return hash.digest('hex').substring(0, 7);
      })(entity);
    return super.update(entity, opts);
  }

  bookmarks(
    filter: Filter<Collection>,
    options?: AnyObject,
  ): (joinFilter?: Filter<BookmarkCollection>) => Promise<Bookmark[]> {
    return async joinFilter => {
      const collection = await this.findOne(filter, options);
      if (!collection) {
        throw new EntityNotFoundError(Collection, filter, options);
      }
      const relationRepo = await this.relationRepositoryGetter();
      const joins = await this.bookmarkCollections(collection.id).find(
        joinFilter,
      );
      return await Promise.all(joins.map(({id}) => relationRepo.bookmark(id)));
    };
  }

  private async getCollectionUser(
    id?: typeof User.prototype.id,
  ): Promise<User> {
    const userRepo = await this.userRepositoryGetter();
    const user = await userRepo.findOne({where: {id}});
    if (!user) throw new EntityNotFoundError(User, id);

    return user;
  }
}
