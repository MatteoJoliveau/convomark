import {Provider, ValueOrPromise} from '@loopback/core';
import {User} from '../../models';

export class CurrentUserProvider implements Provider<User | undefined> {
  value(): ValueOrPromise<User | undefined> {
    throw new Error('Method not implemented.');
  }
}
