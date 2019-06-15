import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import slug from 'slug';
import { User } from './';
import { BookmarkCollection } from './bookmark-collection.model';

@model()
export class Collection extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  slug: string;

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => BookmarkCollection)
  bookmarkCollections: BookmarkCollection[];

  constructor(data?: Partial<Collection>) {
    super(data);
  }

  static generateSlug(collection: Collection, user: User) {
    const username = user.username || user.id;
    collection.slug = slug(`${username} ${collection.title}`, { lower: true });
  }
}

export interface CollectionRelations {
  user?: User
}

export type CollectionWithRelations = Collection & CollectionRelations;
