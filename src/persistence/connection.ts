import { createConnection } from "typeorm";
import { getLogger } from '../logger';

const logger = getLogger('persistence/connection');

createConnection().then(async connection => {
   logger.info('Database connection started')
}).catch(logger.error);
