// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/context';
import {
  UserProfile,
  UserService as AuthUserService,
} from '@loopback/authentication';
import {differenceInMinutes} from 'date-fns';
import {sortBy} from 'lodash';
import {createHmac} from 'crypto';
import {Collection, TelegramUserLoginData, User} from '../models';
import {TelegramBindings} from '../telegram';
import {
  CollectionRepository,
  TypeORMBindings,
  UserRepository,
} from '../typeorm';
import {mapTelegramToUser} from '../mappers';

/**
 * Adapted from
 * https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/user-service.ts
 */
export class UserService
  implements AuthUserService<User, TelegramUserLoginData> {
  constructor(
    @inject(TypeORMBindings.USER_REPOSITORY)
    private userRepository: UserRepository,
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
    @inject(TelegramBindings.TELEGRAM_SECRET) private telegramSecret: Buffer,
  ) {}

  async verifyCredentials(credentials: TelegramUserLoginData): Promise<User> {
    try {
      await this.validateTelegramHash(credentials);

      const user = mapTelegramToUser(credentials);
      const created = await this.userRepository.save(user);
      if ((await created.collections).length === 0) {
        await this.collectionRepository.save(
          Collection.defaultCollection(created),
        );
      }
      return created;
    } catch (e) {
      throw new HttpErrors.Unauthorized(e);
    }
  }

  convertToUserProfile(user: User): UserProfile {
    let name = `${user.firstName}`;
    if (user.username) {
      name = `${user.username}`;
    } else if (user.lastName) {
      name = `${user.firstName} ${user.lastName}`;
    }

    return {
      id: `${user.id}`,
      name,
    };
  }

  private validateTelegramHash(
    credentials: TelegramUserLoginData,
  ): Promise<void> {
    if (
      differenceInMinutes(new Date(), new Date(credentials.auth_date * 1000)) >
      1
    ) {
      return Promise.reject('Authentication date is more than a minute old');
    }
    const {hash, ...properties} = credentials;
    const authString = sortBy(Object.keys(properties))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(key => `${key}=${(<any>credentials)[key]}`)
      .join('\n');

    const hmac = createHmac('sha256', this.telegramSecret);
    hmac.update(authString);
    const check = hmac.digest('hex');
    if (check === hash) {
      return Promise.resolve();
    } else {
      return Promise.reject('Hash not matching');
    }
  }
}
