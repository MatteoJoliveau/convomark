import {Booter} from '@loopback/boot';
import {Loggable, Logger, logger} from '../logging';
import {inject} from '@loopback/context';
import {ApplicationConfig, CoreBindings} from '@loopback/core';
import {resolve} from 'path';
import {ConvoMarkApplication} from '../application';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getRepository,
} from 'typeorm';
import {User, Collection, Bookmark} from '../models';
import {TypeORMBindings} from './keys';
import {Logger as TLogger} from './logger';

@logger()
export class TypeORMBooter implements Booter, Loggable {
  logger: Logger;
  config: ConnectionOptions;
  connection: Connection;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG)
    private appConfig: ApplicationConfig,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: ConvoMarkApplication,
  ) {}

  async configure(): Promise<void> {
    const ormconfig =
      this.appConfig.orm ||
      require(resolve(this.app.projectRoot, '../ormconfig.js'));
    this.config = {
      ...ormconfig,
      logger: new TLogger(),
    };
  }

  async discover(): Promise<void> {
    this.connection = await createConnection(this.config);
  }

  async load(): Promise<void> {
    this.app.bind(TypeORMBindings.DEFAULT_CONNECTION).to(this.connection);
    this.app.bind(TypeORMBindings.USER_REPOSITORY).to(getRepository(User));
    this.app
      .bind(TypeORMBindings.COLLECTION_REPOSITORY)
      .to(getRepository(Collection));
    this.app
      .bind(TypeORMBindings.BOOKMARK_REPOSITORY)
      .to(getRepository(Bookmark));
  }
}
