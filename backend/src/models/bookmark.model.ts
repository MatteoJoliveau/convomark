import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {User} from './user.model';
import {BookmarkCollection} from '.';

@model()
export class Bookmark extends Entity {
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
  messageLink: string;

  @property({
    type: 'string'
  })
  name?: string;

  @belongsTo(() => User)
  userId?: number;

  @hasMany(() => BookmarkCollection)
  bookmarkCollections: BookmarkCollection[];

  constructor(data?: Partial<Bookmark>) {
    super(data);
  }
}

export interface BookmarkRelations {
  user?: User;
}

export type BookmarkWithRelations = Bookmark & BookmarkRelations;
