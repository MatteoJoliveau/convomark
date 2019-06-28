import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {User} from './';
import {BookmarkCollection} from './bookmark-collection.model';
import {v4 as uuid} from 'uuid';

@model()
export class Collection extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    default: uuid,
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
    index: {
      unique: true,
    },
  })
  slug: string;

  @property({
    type: 'string',
    index: {
      unique: true,
    },
  })
  shortId: string;

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => BookmarkCollection)
  bookmarkCollections: BookmarkCollection[];

  constructor(data?: Partial<Collection>) {
    super(data);
  }
}

export interface CollectionRelations {
  user?: User;
}

export type CollectionWithRelations = Collection & CollectionRelations;
