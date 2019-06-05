import 'reflect-metadata';
import { config as dotenv } from 'dotenv';
import { getLogger } from './logger';
import { createDatabaseConnection } from './persistence/connection';
import { getContainer } from './inversify/config';
import { FastifyProvider } from './inversify/interfaces';
import TYPES from './inversify/types';
import { FastifyInstance } from 'fastify';
dotenv();


const port = parseInt(process.env.PORT || '3000');
const logger = getLogger('convomarkbot');

async function main() {
    await createDatabaseConnection();
    const container = await getContainer();
    const app = await container.get<FastifyProvider>(TYPES.FastifyProvider)();
    app.listen(port, () => {
        logger.info(`Application started on port ${port}`);
    });
}

main().catch(logger.error.bind(logger));
