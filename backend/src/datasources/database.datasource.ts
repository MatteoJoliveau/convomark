import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as defaultConfig from './database.datasource.json';

function processEnvConfig(config: object): object {
  return {
    ...config,
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || "convomark",
    password: process.env.POSTGRES_PASSWORD || "convomark",
    database: process.env.POSTGRES_DB || "convomark_development"
  };
}

export class DatabaseDataSource extends juggler.DataSource {
  static dataSourceName = 'database';

  constructor(
    @inject('datasources.config.database', {optional: true})
    dsConfig: object = processEnvConfig(defaultConfig),
  ) {
    super(dsConfig);
  }
}
