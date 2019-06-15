import {Entity, model, property, hasMany} from '@loopback/repository';
import { Collection } from './collection.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
    default: 'en',
  })
  languageCode?: string;

  @property({
    type: 'string',
  })
  photoUrl?: string;

  @hasMany(() => Collection)
  collections: Collection[] = [];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
