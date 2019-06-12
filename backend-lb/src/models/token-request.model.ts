import { Model, model, property } from '@loopback/repository';
import { TelegramUserLoginData } from './telegram-user-login-data.model';
import { getJsonSchemaRef } from '@loopback/openapi-v3';

@model({ settings: {} })
export class TokenRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  grant_type: 'telegram' | 'refresh_token';

  @property({
    type: 'string',
    required: false
  })
  refresh_token?: string;

  @property({
    type: TelegramUserLoginData,
    required: false,
  })
  auth_data: TelegramUserLoginData;

  constructor(data?: Partial<TokenRequest>) {
    super(data);
  }
}

export interface TokenRequestRelations {
  auth_data: TelegramUserLoginData
}

export type TokenRequestWithRelations = TokenRequest & TokenRequestRelations;
