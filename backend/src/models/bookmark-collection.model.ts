import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Bookmark, Collection} from '.';
import {v4 as uuid} from 'uuid';
import {BookmarkWithRelations, CollectionWithRelations} from './';

@model({
  name: 'bookmarks_collections',
})
export class BookmarkCollection extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    default: uuid,
  })
  id: string;

  @belongsTo(() => Bookmark)
  bookmarkId: string;

  @belongsTo(() => Collection)
  collectionId?: string;

  constructor(data?: Partial<BookmarkCollection>) {
    super(data);
  }
}

export interface BookmarkCollectionRelations {
  bookmark?: BookmarkWithRelations;
  collection?: CollectionWithRelations;
}

export type BookmarkCollectionWithRelations = BookmarkCollection &
  BookmarkCollectionRelations;
