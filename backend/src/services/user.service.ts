// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/context';
import { UserService as AuthUserService, UserProfile } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { differenceInMinutes } from 'date-fns';
import { sortBy } from "lodash";
import { createHash, createHmac } from "crypto";
import { TelegramUserLoginData, User, Collection } from '../models';
import { TelegramBindings } from '../telegram';
import { UserRepository, CollectionRepository } from '../repositories';

type Reason = string;

/**
 * Adapted from
 * https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/user-service.ts
 */
export class UserService implements AuthUserService<User, TelegramUserLoginData> {
  private readonly telegramSecret: Buffer;
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(CollectionRepository) private collectionRepository: CollectionRepository,
    @inject(TelegramBindings.TELEGRAM_TOKEN) botToken: string
  ) {
    const hash = createHash("sha256");
    hash.update(botToken);
    this.telegramSecret = hash.digest();
  }

  async verifyCredentials(credentials: TelegramUserLoginData): Promise<User> {
    try {
      await this.validateTelegramHash(credentials);
      const user = new User({
        id: credentials.id,
        firstName: credentials.first_name,
        lastName: credentials.last_name,
        username: credentials.username,
        photoUrl: credentials.photo_url,
      })
      if (await this.userRepository.exists(user.id)) {
        await this.userRepository.update(user);
        return user;
      } else {
        const created = await this.userRepository.create(user);
        const collection = new Collection({
          title: 'Default',
          userId: created.id,
        });
        await this.collectionRepository.create(collection);
        return created;
      }
    } catch (e) {
      throw new HttpErrors.Unauthorized(e);
    }
  }

  convertToUserProfile(user: User): UserProfile {
    let name = `${user.firstName}`;
    if (user.username) {
      name = `${user.username}`
    }
    else if (user.lastName) {
      name = `${user.firstName} ${user.lastName}`
    }

    return {
      id: `${user.id}`,
      name
    };
  }

  private validateTelegramHash(credentials: TelegramUserLoginData): Promise<void> {
    if (differenceInMinutes(new Date(), new Date(credentials.auth_date * 1000)) > 1) {
      return Promise.reject('Authentication date is more than a minute old');
    }
    const { hash, ...properties } = credentials;
    const authString = sortBy(Object.keys(properties)).map((key) => `${key}=${(<any>credentials)[key]}`).join("\n");

    const hmac = createHmac("sha256", this.telegramSecret);
    hmac.update(authString);
    const check = hmac.digest("hex");
    if (check === credentials.hash) {
      return Promise.resolve();
    } else {
      return Promise.reject('Hash not matching');
    }
  }
}
