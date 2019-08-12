import {BindingKey} from '@loopback/context';
import {Connection} from 'typeorm';
import {
  BookmarkRepository,
  CollectionRepository,
  UserRepository,
} from './types';

export namespace TypeORMBindings {
  export const DEFAULT_CONNECTION = BindingKey.create<Connection>(
    'typeorm.connections.default',
  );
  export const USER_REPOSITORY = BindingKey.create<UserRepository>(
    'repository.User',
  );
  export const COLLECTION_REPOSITORY = BindingKey.create<CollectionRepository>(
    'Collection',
  );
  export const BOOKMARK_REPOSITORY = BindingKey.create<BookmarkRepository>(
    'repository.Bookmark',
  );
}
