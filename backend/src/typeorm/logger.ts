/* eslint-disable  @typescript-eslint/no-explicit-any */
import {Logger as TypeLogger, QueryRunner} from 'typeorm';
import {Loggable, Logger as ApplicationLogger, logger} from '../logging';

@logger({name: 'TypeORM'})
export class Logger implements TypeLogger, Loggable {
  logger: ApplicationLogger;

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): any {
    switch (level) {
      case 'log':
        this.logger.debug(message);
        break;
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      default:
        this.logger.trace(message);
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug({query, parameters}, 'SQL Query');
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.error({query, parameters}, error);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.warn({time, query, parameters}, 'Slow SQL query detected');
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.debug(message);
  }
}
