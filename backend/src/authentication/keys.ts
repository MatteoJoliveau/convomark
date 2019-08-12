// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {TokenService, UserService} from '@loopback/authentication';
import {TelegramUserLoginData} from '../models';
import {User} from '../entities';

/**
 * Take from
 * https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/keys.ts
 */
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const ACCESS_TOKEN_EXPIRES_IN_VALUE = '600';
  export const REFRESH_TOKEN_EXPIRES_IN_VALUE = '172800';
  export const TOKEN_AUDIENCE_VALUE =
    process.env.WEB_DOMAIN || 'localhost:3000';
  export const TOKEN_ISSUER_VALUE = process.env.WEB_DOMAIN || 'localhost:3000';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const ACCESS_TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.access.expires.in.seconds',
  );
  export const REFRESH_TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.refresh.expires.in.seconds',
  );
  export const TOKEN_AUDIENCE = BindingKey.create<string>(
    'services.authentication.jwt.audience',
  );
  export const TOKEN_ISSUER = BindingKey.create<string>(
    'services.authentication.jwt.issuer',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<User, TelegramUserLoginData>
  >('services.user.service');
}
