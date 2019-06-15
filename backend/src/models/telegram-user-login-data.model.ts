import {Model, model, property} from '@loopback/repository';

@model({settings: {}})
export class TelegramUserLoginData extends Model {
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
  first_name: string;
  @property({
    type: 'string',
    required: false,
  })
  last_name?: string;
  @property({
    type: 'string',
    required: false,
  })
  username?: string;
  @property({
    type: 'string',
    required: false,
  })
  photo_url?: string;
  @property({
    type: 'number',
    required: true,
  })
  auth_date: number;
  @property({
    type: 'string',
    required: true,
  })
  hash: string;

  constructor(data?: Partial<TelegramUserLoginData>) {
    super(data);
  }
}

export interface TelegramUserLoginDataRelations {
  // describe navigational properties here
}

export type TelegramUserLoginDataWithRelations = TelegramUserLoginData &
  TelegramUserLoginDataRelations;
