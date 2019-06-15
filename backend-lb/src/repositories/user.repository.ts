import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Collection} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import { CollectionRepository } from './collection.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly collections: HasManyRepositoryFactory<Collection, typeof User.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('CollectionRepository')
    collectionRepositoryGetter: Getter<CollectionRepository>,
  ) {
    super(User, dataSource);
    this.collections = this.createHasManyRepositoryFactoryFor(
      'collections',
      collectionRepositoryGetter
    )
  }
}
